import { describe, expect, it } from 'vitest';
import { fixture, runScript } from './helpers.ts';

// Negativproben für npm run check:spec (ENG-4); jede Probe muss zurückgewiesen werden.
function record(overrides: Record<string, unknown> = {}, testRefs: string[] = []): string {
  const json = {
    id: 'FR-001',
    title: 'Beispiel',
    status: 'ready',
    statement: 'Die App soll etwas tun.',
    basis: 'supplied',
    source_refs: ['Quelle'],
    acceptance_criteria: [
      { id: 'FR-001-AC-1', given: 'G', when: 'W', then: 'T', test_refs: testRefs },
    ],
    open_question_ids: [],
    ...overrides,
  };
  return `# FR-001 – Beispiel\n\n\`\`\`json\n${JSON.stringify(json, null, 2)}\n\`\`\`\n`;
}

const journal = [
  '# Journal',
  '',
  '## Offene Fragen',
  '',
  '| ID | Frage |',
  '| --- | --- |',
  '| OQ-002 | offen |',
  '',
  '## Antworten',
  '',
  '| Frage | Antwort |',
  '| --- | --- |',
  '| OQ-001: Sprache? | Deutsch |',
  '',
].join('\n');

function plan(status = 'geplant', deps = '–', second = ''): string {
  return [
    '# Plan',
    '',
    '## Übersicht',
    '',
    '| WP | Titel | Status | Abhängig von | Kriterien |',
    '| --- | --- | --- | --- | --- |',
    `| WP-001 | Erstes | ${status} | ${deps} | FR-001 |`,
    second,
    '',
  ].join('\n');
}

function valid(overrides: Record<string, string> = {}): Record<string, string> {
  return {
    'REQUIREMENTS.md':
      '# Anforderungen\n\n| ID | Titel | Status |\n| --- | --- | --- |\n| [FR-001](docs/requirements/FR-001-example.md) | Beispiel | ready |\n',
    'docs/clarifications.md': journal,
    'docs/requirements/FR-001-example.md': record(),
    'docs/work-plan.md': plan(),
    'README.md': '# Projekt\n\nSiehe [Journal](docs/clarifications.md#offene-fragen) und OQ-001.\n',
    ...overrides,
  };
}

function check(files: Record<string, string>, ...extra: string[]) {
  return runScript('scripts/check-spec.mjs', ['--root', fixture(files), ...extra]);
}

describe('check:spec', () => {
  it('akzeptiert einen gültigen Bestand und meldet ausstehende Tests', () => {
    const result = check(valid());
    expect(result.output).toContain('1 von 1 ready-AC ohne test_refs');
    expect(result.status).toBe(0);
  });

  it.each([
    ['toter Link', { 'README.md': '# P\n\n[weg](docs/fehlt.md)\n' }, 'toter Link'],
    [
      'falscher Anker',
      { 'README.md': '# P\n\n[x](docs/clarifications.md#gibt-es-nicht)\n' },
      'Anker',
    ],
    [
      'kaputtes JSON',
      { 'docs/requirements/FR-001-example.md': '# FR-001 – Beispiel\n\n```json\n{ x\n```\n' },
      'JSON ungültig',
    ],
    [
      'falsche AC-ID',
      {
        'docs/requirements/FR-001-example.md': record({
          acceptance_criteria: [
            { id: 'FR-001-AC-2', given: 'G', when: 'W', then: 'T', test_refs: [] },
          ],
        }),
      },
      'erwartet FR-001-AC-1',
    ],
    [
      'fehlende Testdatei',
      { 'docs/requirements/FR-001-example.md': record({}, ['tests/fehlt.test.ts']) },
      'Testdatei tests/fehlt.test.ts fehlt',
    ],
    [
      'Testdatei ohne Kriteriums-ID',
      { 'docs/requirements/FR-001-example.md': record({}, ['t.test.ts']), 't.test.ts': 'leer' },
      'nennt die Kriteriums-ID nicht',
    ],
    [
      'unbekannte offene Frage',
      { 'docs/requirements/FR-001-example.md': record({ open_question_ids: ['OQ-001'] }) },
      'keine offene Frage',
    ],
    ['unbekannte FR-ID', { 'README.md': '# P\n\nVerweis auf FR-009.\n' }, 'unbekannte ID FR-009'],
    [
      'abweichender Status',
      {
        'REQUIREMENTS.md':
          '# A\n\n| ID | Titel | Status |\n| --- | --- | --- |\n| [FR-001](docs/requirements/FR-001-example.md) | Beispiel | draft |\n',
      },
      'Status draft',
    ],
    [
      'geliefert ohne Tests',
      { 'docs/work-plan.md': plan('geliefert') },
      'geliefert, aber FR-001-AC-1',
    ],
    [
      'Abhängigkeitszyklus',
      {
        'docs/work-plan.md': plan(
          'geplant',
          'WP-002',
          '| WP-002 | Zweites | geplant | WP-001 | – |',
        ),
      },
      'Abhängigkeitszyklus',
    ],
    [
      'Sitzungslink',
      { 'README.md': `# P\n\nhttps://${['claude', 'ai'].join('.')}/x\n` },
      'enthält einen Link',
    ],
  ])('weist %s zurück', (_name, overrides, message) => {
    const result = check(valid(overrides));
    expect(result.status).toBe(1);
    expect(result.output).toContain(message);
  });

  it('sperrt mit --release ready-Kriterien ohne test_refs', () => {
    const result = check(valid(), '--release');
    expect(result.status).toBe(1);
    expect(result.output).toContain('ohne test_refs (Release-Prüfung)');
  });

  it('akzeptiert verknüpfte Testdateien', () => {
    const result = check(
      valid({
        'docs/requirements/FR-001-example.md': record({}, ['tests/a.test.ts']),
        'tests/a.test.ts': "it('FR-001-AC-1', () => {});\n",
        'docs/work-plan.md': plan('geliefert'),
      }),
      '--release',
    );
    expect(result.output).toContain('keine Fehler');
    expect(result.status).toBe(0);
  });
});
