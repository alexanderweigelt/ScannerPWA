// Spezifikationsprüfung (ENG-4): FR-Datensätze, IDs, Verweise, Links,
// Arbeitspakete. Ohne Abhängigkeiten, nur Node-Standardbibliothek.
// Aufruf: node scripts/check-spec.mjs [--release] [--root <verzeichnis>]
// Exit-Code 0 = keine Fehler, 1 = mindestens ein Fehler.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const args = process.argv.slice(2);
const release = args.includes('--release');
const rootIndex = args.indexOf('--root');
const root = resolve(rootIndex >= 0 ? (args[rootIndex + 1] ?? '.') : '.');

/** @type {string[]} */
const errors = [];
/** @type {string[]} */
const notes = [];

/**
 * @param {string} file
 * @param {string} message
 */
function fail(file, message) {
  errors.push(`${file}: ${message}`);
}

const IGNORED_DIRS = new Set([
  '.git',
  'node_modules',
  'dist',
  'dist-diagnose',
  'coverage',
  'test-results',
  'playwright-report',
  '.idea',
]);

/**
 * @param {string} dir
 * @returns {string[]} Pfade relativ zu root
 */
function walk(dir) {
  /** @type {string[]} */
  const result = [];
  for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const rel = dir === '' ? entry.name : `${dir}/${entry.name}`;
    if (entry.isDirectory()) result.push(...walk(rel));
    else if (entry.isFile()) result.push(rel);
  }
  return result;
}

/** @param {string} rel */
function read(rel) {
  return readFileSync(join(root, rel), 'utf8');
}

/**
 * Entfernt Codeblöcke (```), damit Links und Überschriften darin nicht zählen.
 * @param {string} text
 */
function withoutFences(text) {
  let inFence = false;
  return text
    .split('\n')
    .map((line) => {
      if (/^\s*```/.test(line)) {
        inFence = !inFence;
        return '';
      }
      return inFence ? '' : line;
    })
    .join('\n');
}

/**
 * Anker nach GitHub-Regel: Kleinbuchstaben, Satzzeichen entfernen,
 * Leerzeichen zu Bindestrich, Dubletten mit -1, -2 …
 * @param {string} markdown
 */
function anchorsOf(markdown) {
  /** @type {Set<string>} */
  const anchors = new Set();
  /** @type {Map<string, number>} */
  const seen = new Map();
  for (const line of withoutFences(markdown).split('\n')) {
    const match = /^#{1,6}\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match?.[1]) continue;
    const text = match[1].replace(/`([^`]*)`/g, '$1').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
    const base = text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\p{M}_\- ]/gu, '')
      .replace(/ /g, '-');
    const count = seen.get(base) ?? 0;
    anchors.add(count === 0 ? base : `${base}-${String(count)}`);
    seen.set(base, count + 1);
  }
  return anchors;
}

const files = walk('');
const markdownFiles = files.filter((f) => f.endsWith('.md'));

// --- Keine Links auf Agenten-Sitzungen im Repository (Arbeitsregel) -------
const forbiddenHost = ['claude', 'ai'].join('.');
const forbiddenLink = new RegExp(`//(?:[\\w-]+\\.)*${forbiddenHost.replace('.', '\\.')}\\b`);
for (const file of files) {
  const path = join(root, file);
  if (statSync(path).size > 2_000_000) continue;
  const buffer = readFileSync(path);
  if (buffer.includes(0)) continue;
  if (forbiddenLink.test(buffer.toString('utf8'))) {
    fail(file, `enthält einen Link auf ${forbiddenHost}`);
  }
}

// --- Journal: offene und beantwortete Fragen ----------------------------
const journalPath = 'docs/clarifications.md';
/** @type {Set<string>} */
const openQuestions = new Set();
/** @type {Set<string>} */
const definedQuestions = new Set();
if (existsSync(join(root, journalPath))) {
  let section = '';
  for (const line of read(journalPath).split('\n')) {
    if (line.startsWith('## ')) section = line.slice(3).trim();
    const row = /^\|\s*(OQ-\d{3})\b/.exec(line);
    if (!row?.[1]) continue;
    if (section === 'Offene Fragen') openQuestions.add(row[1]);
    if (section === 'Offene Fragen' || section === 'Antworten') definedQuestions.add(row[1]);
  }
} else {
  fail(journalPath, 'Journal fehlt');
}

// --- FR-Datensätze -------------------------------------------------------
const REQUIRED = [
  'id',
  'title',
  'status',
  'statement',
  'basis',
  'source_refs',
  'acceptance_criteria',
  'open_question_ids',
];
const STATUS = new Set(['draft', 'ready']);
const BASIS = new Set(['supplied', 'observed', 'proposed', 'delegated']);

/** @typedef {{ id: string, fr: string, testRefs: string[] }} Criterion */
/** @type {Map<string, { title: string, status: string, file: string, criteria: Criterion[] }>} */
const requirements = new Map();
/** @type {Map<string, Criterion>} */
const criteria = new Map();

/** @param {unknown} value */
function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/** @param {unknown} value */
function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

const frFiles = files.filter((f) => /^docs\/requirements\/FR-\d{3}-[a-z0-9-]+\.md$/.test(f)).sort();
for (const file of files.filter(
  (f) => f.startsWith('docs/requirements/FR-') && !frFiles.includes(f),
)) {
  fail(file, 'Dateiname entspricht nicht FR-<nnn>-<slug>.md');
}

for (const file of frFiles) {
  const text = read(file);
  const blocks = [...text.matchAll(/```json\n([\s\S]*?)\n```/g)];
  if (blocks.length !== 1) {
    fail(file, `erwartet genau einen JSON-Block, gefunden ${String(blocks.length)}`);
    continue;
  }
  /** @type {unknown} */
  let parsed;
  try {
    parsed = JSON.parse(blocks[0]?.[1] ?? '');
  } catch (error) {
    fail(file, `JSON ungültig: ${error instanceof Error ? error.message : String(error)}`);
    continue;
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    fail(file, 'JSON ist kein Objekt');
    continue;
  }
  const record = /** @type {Record<string, unknown>} */ (parsed);
  for (const field of REQUIRED) {
    if (!(field in record)) fail(file, `Pflichtfeld fehlt: ${field}`);
  }
  const { id, title, status, statement, basis } = record;
  if (typeof id !== 'string' || !/^FR-\d{3}$/.test(id)) {
    fail(file, 'id fehlt oder hat nicht die Form FR-<nnn>');
    continue;
  }
  if (!file.startsWith(`docs/requirements/${id}-`)) fail(file, `Dateiname passt nicht zu ${id}`);
  if (requirements.has(id)) fail(file, `doppelte FR-ID ${id}`);
  if (!isNonEmptyString(title)) fail(file, 'title leer');
  if (typeof status !== 'string' || !STATUS.has(status)) fail(file, 'status ungültig');
  if (!isNonEmptyString(statement)) fail(file, 'statement leer');
  if (typeof basis !== 'string' || !BASIS.has(basis)) fail(file, 'basis ungültig');
  if (
    !isStringArray(record.source_refs) ||
    /** @type {string[]} */ (record.source_refs).length === 0
  ) {
    fail(file, 'source_refs muss eine nicht leere Liste von Texten sein');
  }
  const firstLine = text.split('\n')[0] ?? '';
  if (firstLine !== `# ${id} – ${String(title)}`) {
    fail(file, `Überschrift „${firstLine}“ passt nicht zu id und title`);
  }
  if ((withoutFences(text).match(/^# /gm) ?? []).length !== 1) {
    fail(file, 'erwartet genau eine Titelüberschrift');
  }

  const questions = record.open_question_ids;
  if (!isStringArray(questions)) {
    fail(file, 'open_question_ids muss eine Liste sein');
  } else {
    for (const q of /** @type {string[]} */ (questions)) {
      if (!openQuestions.has(q)) fail(file, `${q} ist keine offene Frage im Journal`);
    }
  }

  /** @type {Criterion[]} */
  const list = [];
  const acs = record.acceptance_criteria;
  if (!Array.isArray(acs)) {
    fail(file, 'acceptance_criteria muss eine Liste sein');
  } else {
    acs.forEach((/** @type {unknown} */ ac, index) => {
      if (typeof ac !== 'object' || ac === null) {
        fail(file, `Kriterium ${String(index + 1)} ist kein Objekt`);
        return;
      }
      const c = /** @type {Record<string, unknown>} */ (ac);
      const expected = `${id}-AC-${String(index + 1)}`;
      if (c.id !== expected) {
        fail(file, `Kriterium ${String(index + 1)} hat id ${String(c.id)}, erwartet ${expected}`);
      }
      for (const key of ['given', 'when', 'then']) {
        if (!isNonEmptyString(c[key])) fail(file, `${expected}: ${key} leer`);
      }
      const testRefs = c.test_refs;
      if (!isStringArray(testRefs)) {
        fail(file, `${expected}: test_refs muss eine Liste sein`);
        return;
      }
      for (const ref of /** @type {string[]} */ (testRefs)) {
        const target = join(root, ref);
        if (!existsSync(target) || !statSync(target).isFile()) {
          fail(file, `${expected}: Testdatei ${ref} fehlt`);
        } else if (!readFileSync(target, 'utf8').includes(expected)) {
          fail(file, `${expected}: Testdatei ${ref} nennt die Kriteriums-ID nicht`);
        }
      }
      const criterion = { id: expected, fr: id, testRefs: /** @type {string[]} */ (testRefs) };
      if (criteria.has(expected)) fail(file, `doppelte AC-ID ${expected}`);
      criteria.set(expected, criterion);
      list.push(criterion);
    });
  }
  if (status === 'ready' && list.length === 0) fail(file, 'ready ohne Akzeptanzkriterium');
  requirements.set(id, {
    title: String(title),
    status: String(status),
    file,
    criteria: list,
  });
}

// --- REQUIREMENTS.md: jede FR genau einmal, Titel und Status gleich -------
if (existsSync(join(root, 'REQUIREMENTS.md'))) {
  /** @type {Map<string, number>} */
  const listed = new Map();
  for (const line of read('REQUIREMENTS.md').split('\n')) {
    const row = /^\|\s*\[(FR-\d{3})\]\(([^)]+)\)\s*\|\s*(.*?)\s*\|\s*(\w+)\s*\|\s*$/.exec(line);
    if (!row) continue;
    const [, id = '', link = '', title, status] = row;
    listed.set(id, (listed.get(id) ?? 0) + 1);
    const fr = requirements.get(id);
    if (!fr) {
      fail('REQUIREMENTS.md', `${id} ohne Datensatz`);
      continue;
    }
    if (link !== fr.file) fail('REQUIREMENTS.md', `${id} verlinkt ${link} statt ${fr.file}`);
    if (title !== fr.title) fail('REQUIREMENTS.md', `${id}: Titel weicht ab`);
    if (status !== fr.status)
      fail('REQUIREMENTS.md', `${id}: Status ${String(status)} statt ${fr.status}`);
  }
  for (const id of requirements.keys()) {
    const count = listed.get(id) ?? 0;
    if (count !== 1) fail('REQUIREMENTS.md', `${id} ist ${String(count)}-mal gelistet`);
  }
} else {
  fail('REQUIREMENTS.md', 'Übersicht fehlt');
}

// --- Links, Anker und ID-Verweise in allen Markdown-Dateien ---------------
/** @type {Map<string, Set<string>>} */
const anchorCache = new Map();
/** @param {string} rel */
function anchorsFor(rel) {
  let anchors = anchorCache.get(rel);
  if (!anchors) {
    anchors = anchorsOf(read(rel));
    anchorCache.set(rel, anchors);
  }
  return anchors;
}

const adrIds = new Set(
  files.map((f) => /^docs\/adr\/(ADR-\d{4})-/.exec(f)?.[1]).filter((id) => id !== undefined),
);
let linkCount = 0;

for (const file of markdownFiles) {
  const text = read(file);
  const prose = withoutFences(text).replace(/`[^`\n]*`/g, '');
  for (const match of prose.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    const target = match[1] ?? '';
    if (/^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
    linkCount += 1;
    const [pathPart = '', anchor] = target.split('#');
    const resolved =
      pathPart === '' ? file : relative(root, resolve(root, dirname(file), decodeURI(pathPart)));
    if (!existsSync(join(root, resolved))) {
      fail(file, `toter Link ${target}`);
      continue;
    }
    if (anchor !== undefined && anchor !== '') {
      if (!resolved.endsWith('.md')) continue;
      if (!anchorsFor(resolved).has(decodeURIComponent(anchor))) {
        fail(file, `Anker #${anchor} fehlt in ${resolved}`);
      }
    }
  }
  for (const match of text.matchAll(/\b(FR-\d{3})(-AC-\d+)?\b/g)) {
    const id = match[0];
    if (match[2] ? !criteria.has(id) : !requirements.has(id)) fail(file, `unbekannte ID ${id}`);
  }
  for (const match of text.matchAll(/\bOQ-\d{3}\b/g)) {
    if (!definedQuestions.has(match[0])) fail(file, `unbekannte Frage ${match[0]}`);
  }
  for (const match of text.matchAll(/\bADR-\d{4}\b/g)) {
    if (!adrIds.has(match[0])) fail(file, `unbekannte Entscheidung ${match[0]}`);
  }
}

// --- Arbeitspakete (docs/work-plan.md) -----------------------------------
const planPath = 'docs/work-plan.md';
const WP_STATUS = new Set(['geplant', 'in Arbeit', 'geliefert']);
/** @type {Map<string, { status: string, deps: string[], refs: string[] }>} */
const packages = new Map();
if (existsSync(join(root, planPath))) {
  let section = '';
  for (const line of read(planPath).split('\n')) {
    if (line.startsWith('## ')) section = line.slice(3).trim();
    if (section !== 'Übersicht') continue;
    const cells = line.split('|').map((cell) => cell.trim());
    const id = /^\[?(WP-\d{3})\]?/.exec(cells[1] ?? '')?.[1];
    if (!id) continue;
    const status = cells[3] ?? '';
    const deps = [...(cells[4] ?? '').matchAll(/WP-\d{3}/g)].map((m) => m[0]);
    const refs = [...(cells[5] ?? '').matchAll(/FR-\d{3}(?:-AC-\d+)?/g)].map((m) => m[0]);
    if (packages.has(id)) fail(planPath, `doppelte Paket-ID ${id}`);
    if (!WP_STATUS.has(status)) fail(planPath, `${id}: Status „${status}“ ungültig`);
    packages.set(id, { status, deps, refs });
  }
  if (packages.size === 0) fail(planPath, 'Abschnitt „Übersicht“ ohne Arbeitspakete');

  /** @type {Set<string>} */
  const covered = new Set();
  for (const [id, wp] of packages) {
    for (const dep of wp.deps) {
      if (!packages.has(dep)) fail(planPath, `${id}: unbekannte Abhängigkeit ${dep}`);
    }
    for (const ref of wp.refs) {
      const fr = requirements.get(ref);
      const refCriteria = fr ? fr.criteria : criteria.has(ref) ? [criteria.get(ref)] : [];
      for (const c of refCriteria) {
        if (!c) continue;
        covered.add(c.id);
        if (wp.status === 'geliefert' && c.testRefs.length === 0) {
          fail(planPath, `${id} ist geliefert, aber ${c.id} hat keine test_refs`);
        }
      }
    }
  }
  // Zyklen in den Abhängigkeiten
  /** @type {Map<string, number>} 0 = offen, 1 = in Prüfung, 2 = fertig */
  const state = new Map();
  /** @param {string} id */
  const visit = (id) => {
    if (state.get(id) === 2) return;
    if (state.get(id) === 1) {
      fail(planPath, `Abhängigkeitszyklus über ${id}`);
      return;
    }
    state.set(id, 1);
    for (const dep of packages.get(id)?.deps ?? []) visit(dep);
    state.set(id, 2);
  };
  for (const id of packages.keys()) visit(id);

  for (const fr of requirements.values()) {
    if (fr.status !== 'ready') continue;
    for (const c of fr.criteria) {
      if (!covered.has(c.id)) fail(planPath, `${c.id} (ready) ist keinem Arbeitspaket zugeordnet`);
    }
  }
}

// --- Ausstehende Tests ----------------------------------------------------
let readyCriteria = 0;
let pending = 0;
for (const fr of requirements.values()) {
  if (fr.status !== 'ready') continue;
  for (const c of fr.criteria) {
    readyCriteria += 1;
    if (c.testRefs.length > 0) continue;
    pending += 1;
    if (release) fail(fr.file, `${c.id} ist ready, aber ohne test_refs (Release-Prüfung)`);
  }
}
notes.push(
  `${String(requirements.size)} FR, ${String(criteria.size)} AC, ${String(packages.size)} Arbeitspakete, ${String(linkCount)} relative Links geprüft`,
);
notes.push(
  `${String(pending)} von ${String(readyCriteria)} ready-AC ohne test_refs (Test ausstehend${release ? '' : ', blockiert erst mit --release'})`,
);

for (const note of notes) console.log(`check:spec: ${note}`);
if (errors.length > 0) {
  for (const error of errors) console.error(`FEHLER ${error}`);
  console.error(`check:spec: ${String(errors.length)} Fehler`);
  process.exit(1);
}
console.log('check:spec: keine Fehler');
