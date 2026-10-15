import { describe, expect, it } from 'vitest';
import { fixture, runScript } from './helpers.ts';

// Negativproben für npm run check:build (SEC-03, -05, -07, -14, -16, FR-014).
const CSP = "default-src 'none'; script-src 'self'";
const adr = `# ADR-0005\n\n\`\`\`text\n${CSP}\n\`\`\`\n`;

function html(head = '', body = ''): string {
  return [
    '<!doctype html><html lang="de"><head>',
    `<meta http-equiv="Content-Security-Policy" content="${CSP}">`,
    '<meta name="referrer" content="no-referrer">',
    '<script type="module" crossorigin src="/ScannerPWA/assets/index-abc.js"></script>',
    head,
    `</head><body>${body}</body></html>`,
  ].join('\n');
}

function valid(overrides: Record<string, string> = {}): Record<string, string> {
  return {
    'package.json': '{ "dependencies": {} }',
    'docs/adr/ADR-0005-pages-deployment-und-csp-meta.md': adr,
    'dist/index.html': html(),
    'dist/assets/index-abc.js': 'document.title = "x";\n',
    ...overrides,
  };
}

function check(files: Record<string, string>) {
  return runScript('scripts/check-build.mjs', ['--root', fixture(files)]);
}

describe('check:build', () => {
  it('akzeptiert einen gültigen Build', () => {
    const result = check(valid());
    expect(result.output).toContain('keine Fehler');
    expect(result.status).toBe(0);
  });

  it.each([
    ['Inline-Skript', { 'dist/index.html': html('<script>alert(1)</script>') }, 'Inline-Skript'],
    ['Inline-Stil', { 'dist/index.html': html('<style>p{}</style>') }, '<style>'],
    [
      'fehlendes CSP-Meta',
      { 'dist/index.html': html().replace(/<meta http-equiv[^>]*>/, '') },
      'genau ein CSP-Meta',
    ],
    [
      'abweichende CSP',
      { 'dist/index.html': html().replace("'none'", "'self'") },
      'weicht von ADR-0005 ab',
    ],
    [
      'fehlendes Referrer-Meta',
      { 'dist/index.html': html().replace(/<meta name="referrer"[^>]*>/, '') },
      'referrer',
    ],
    [
      'fremde URL',
      { 'dist/assets/index-abc.js': 'fetch("https://example.com/x")' },
      'fremde URL https://example.com/x',
    ],
    [
      'Ressource außerhalb des Unterpfads',
      { 'dist/index.html': html('<link rel="icon" href="/icon.svg">') },
      'nicht unter /ScannerPWA/',
    ],
    [
      'Diagnose-Kennung',
      { 'dist/assets/index-abc.js': 'const diagnose = true;' },
      'Diagnose-Kennung',
    ],
    ['Quellkarte', { 'dist/assets/index-abc.js.map': '{}' }, 'Dateityp .map'],
    [
      'Laufzeitabhängigkeit',
      { 'package.json': '{ "dependencies": { "x": "1.0.0" } }' },
      'dependencies ist nicht leer',
    ],
  ])('weist %s zurück', (_name, overrides, message) => {
    const result = check(valid(overrides));
    expect(result.status).toBe(1);
    expect(result.output).toContain(message);
  });
});
