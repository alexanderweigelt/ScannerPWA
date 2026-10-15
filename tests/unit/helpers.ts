import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

export interface RunResult {
  status: number | null;
  output: string;
}

/** Legt ein Wegwerf-Verzeichnis mit den angegebenen Dateien an. */
export function fixture(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), 'scanner-fixture-'));
  for (const [path, content] of Object.entries(files)) {
    const target = join(root, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
  }
  return root;
}

/** Führt ein Prüfskript aus dem Repository gegen ein Fixture aus. */
export function runScript(script: string, args: string[]): RunResult {
  const result = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
  return { status: result.status, output: `${result.stdout}${result.stderr}` };
}
