// Build-Prüfung (ENG-3, FR-014, SEC-03, SEC-05, SEC-07, SEC-14, SEC-16).
// Ohne Abhängigkeiten, nur Node-Standardbibliothek.
// Aufruf: node scripts/check-build.mjs [--root <verzeichnis>] [--dist <verzeichnis>]
// Exit-Code 0 = keine Fehler, 1 = mindestens ein Fehler.

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const BASE = '/ScannerPWA/';
const ALLOWED_EXTENSIONS = new Set([
  '.html',
  '.js',
  '.css',
  '.svg',
  '.png',
  '.webmanifest',
  '.json',
  '.woff2',
  '.ico',
  '.txt',
]);
const TEXT_EXTENSIONS = new Set(['.html', '.js', '.css', '.svg', '.webmanifest', '.json', '.txt']);
// Namensräume sind Kennungen, keine geladenen Ressourcen.
const ALLOWED_URLS = new Set(['http://www.w3.org/2000/svg', 'http://www.w3.org/1999/xhtml']);

const args = process.argv.slice(2);
/** @param {string} name */
function option(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}
const root = resolve(option('--root') ?? '.');
const dist = resolve(root, option('--dist') ?? 'dist');

/** @type {string[]} */
const errors = [];
/** @type {string[]} */
const notes = [];

/**
 * @param {string} dir
 * @returns {string[]}
 */
function walk(dir) {
  /** @type {string[]} */
  const result = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) result.push(...walk(path));
    else result.push(path);
  }
  return result;
}

/** @param {string} value */
function normalize(value) {
  return value.replace(/\s+/g, ' ').trim();
}

// --- Laufzeitabhängigkeiten (SEC-16) -----------------------------------
/** @type {unknown} */
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const deps =
  typeof pkg === 'object' && pkg !== null && 'dependencies' in pkg ? pkg.dependencies : undefined;
if (
  deps !== undefined &&
  (typeof deps !== 'object' || deps === null || Object.keys(deps).length > 0)
) {
  errors.push(
    'package.json: dependencies ist nicht leer (jede Laufzeitabhängigkeit braucht eine ADR)',
  );
}

// --- Sollwert der CSP aus ADR-0005 (einzige Quelle) ---------------------
const adrPath = join(root, 'docs/adr/ADR-0005-pages-deployment-und-csp-meta.md');
const adrBlock = /```text\n([\s\S]*?)\n```/.exec(readFileSync(adrPath, 'utf8'))?.[1];
const expectedCsp = adrBlock === undefined ? undefined : normalize(adrBlock);
if (expectedCsp === undefined) errors.push('ADR-0005: CSP-Wert (```text-Block) nicht gefunden');

const indexPath = join(dist, 'index.html');
if (!existsSync(indexPath)) {
  errors.push(`${indexPath} fehlt – zuerst npm run build`);
} else {
  const html = readFileSync(indexPath, 'utf8');

  // CSP-Meta (SEC-03)
  const cspMetas = [
    ...html.matchAll(/<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]*)"\s*\/?>/gi),
  ];
  if (cspMetas.length !== 1) {
    errors.push(`index.html: erwartet genau ein CSP-Meta, gefunden ${String(cspMetas.length)}`);
  } else {
    const actual = normalize(cspMetas[0]?.[1] ?? '');
    if (actual !== expectedCsp) errors.push('index.html: CSP-Wert weicht von ADR-0005 ab');
    if (/unsafe-(inline|eval)/.test(actual))
      errors.push('index.html: CSP erlaubt unsafe-inline/unsafe-eval');
  }

  // Referrer-Meta (SEC-07)
  const referrer = [...html.matchAll(/<meta\s+name="referrer"\s+content="([^"]*)"\s*\/?>/gi)];
  if (referrer.length !== 1 || referrer[0]?.[1] !== 'no-referrer') {
    errors.push('index.html: erwartet genau ein <meta name="referrer" content="no-referrer">');
  }

  // Kein Inline-Code (SEC-03)
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attributes = match[1] ?? '';
    if (!/\bsrc="/.test(attributes) || (match[2] ?? '').trim() !== '') {
      errors.push('index.html: Inline-Skript gefunden');
    }
  }
  if (/<style\b/i.test(html)) errors.push('index.html: <style>-Element gefunden');
  if (/\sstyle="/i.test(html)) errors.push('index.html: style-Attribut gefunden');
  if (/\son[a-z]+="/i.test(html)) errors.push('index.html: Ereignis-Attribut (on…) gefunden');

  // Ressourcen unter dem Unterpfad (FR-014)
  for (const match of html.matchAll(/\s(?:src|href)="([^"]*)"/gi)) {
    const url = match[1] ?? '';
    if (!url.startsWith(BASE))
      errors.push(`index.html: Ressource ${url} liegt nicht unter ${BASE}`);
  }
}

// --- Dateiliste, fremde URLs, Diagnose (SEC-05, SEC-14) -----------------
if (existsSync(dist)) {
  const files = walk(dist);
  for (const file of files) {
    const name = file.slice(dist.length + 1);
    const extension = extname(file);
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      errors.push(`dist/${name}: Dateityp ${extension || '(ohne)'} nicht erlaubt`);
      continue;
    }
    if (!TEXT_EXTENSIONS.has(extension)) continue;
    const text = readFileSync(file, 'utf8');
    for (const match of text.matchAll(/https?:\/\/[^\s"'`)<>\\]+/g)) {
      if (!ALLOWED_URLS.has(match[0])) errors.push(`dist/${name}: fremde URL ${match[0]}`);
    }
    if (/diagnose/i.test(text)) errors.push(`dist/${name}: Diagnose-Kennung im Produktions-Build`);
    if (text.includes('sourceMappingURL=')) errors.push(`dist/${name}: Verweis auf Quellkarte`);
  }
  notes.push(`${String(files.length)} Dateien in dist/ geprüft`);
  if (!files.some((file) => file.endsWith('sw.js'))) {
    notes.push('kein Service Worker in dist/ – Prüfung der Precache-Liste ausstehend (WP-008)');
  }
}

for (const note of notes) console.log(`check:build: ${note}`);
if (errors.length > 0) {
  for (const error of errors) console.error(`FEHLER ${error}`);
  console.error(`check:build: ${String(errors.length)} Fehler`);
  process.exit(1);
}
console.log('check:build: keine Fehler');
