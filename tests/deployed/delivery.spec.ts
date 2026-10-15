import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

// Ausgelieferte Antwort der GitHub Page (SECURITY.md Abschnitt 7).
const HOST = 'alexanderweigelt.github.io';
const PAGE = `https://${HOST}/ScannerPWA/`;

function expectedCsp(): string {
  const adr = readFileSync('docs/adr/ADR-0005-pages-deployment-und-csp-meta.md', 'utf8');
  const block = /```text\n([\s\S]*?)\n```/.exec(adr)?.[1] ?? '';
  return block.replace(/\s+/g, ' ').trim();
}

function tlsHandshake(version: '-tls1_1' | '-tls1_2'): boolean {
  try {
    execFileSync('openssl', ['s_client', '-connect', `${HOST}:443`, '-servername', HOST, version], {
      input: '',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 15_000,
    });
    return true;
  } catch {
    return false;
  }
}

test('SEC-02, SEC-06: HTTPS-Antwort mit HSTS, nosniff und Content-Type', async ({ request }) => {
  const response = await request.get(PAGE);
  expect(response.status()).toBe(200);
  const headers = response.headers();
  expect(headers['content-type']).toMatch(/^text\/html/);
  expect(headers['strict-transport-security']).toMatch(/max-age=\d+/);
  expect(headers['x-content-type-options']).toBe('nosniff');
});

test('SEC-02: http:// leitet auf https:// um', async ({ request }) => {
  const response = await request.get(PAGE.replace('https://', 'http://'), { maxRedirects: 0 });
  expect([301, 308]).toContain(response.status());
  expect(response.headers().location).toMatch(/^https:\/\//);
});

test('SEC-03, SEC-07: CSP- und Referrer-Meta in der ausgelieferten Seite', async ({ request }) => {
  const html = await (await request.get(PAGE)).text();
  const csp = /<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]*)"/i.exec(html)?.[1];
  expect(csp?.replace(/\s+/g, ' ').trim()).toBe(expectedCsp());
  expect(html).toMatch(/<meta\s+name="referrer"\s+content="no-referrer"\s*\/?>/i);
});

test('FR-014: Ressourcen der Seite laden aus dem Unterpfad', async ({ request }) => {
  const html = await (await request.get(PAGE)).text();
  const urls = [...html.matchAll(/\s(?:src|href)="([^"]+)"/g)].map((m) => m[1] ?? '');
  expect(urls.length).toBeGreaterThan(0);
  for (const url of urls) {
    expect(url.startsWith('/ScannerPWA/'), url).toBe(true);
    const response = await request.get(new URL(url, PAGE).toString());
    expect(response.status(), url).toBe(200);
  }
});

test('SEC-01: TLS 1.2 wird angenommen (Kontrollprobe), TLS 1.1 abgelehnt', () => {
  expect(tlsHandshake('-tls1_2')).toBe(true);
  expect(tlsHandshake('-tls1_1')).toBe(false);
});

test.fixme('FR-014-AC-1: Installation und Offline-Start unter dem Unterpfad (WP-008)', () => {
  // Folgt mit Service Worker und Manifest in WP-008.
});
