import { expect, test, type Page } from '@playwright/test';

// Messverfahren aus ARCHITECTURE.md 8.2 (FR-017). Der Zyklus Aufnehmen –
// Verarbeiten – Verwerfen existiert erst mit WP-005; bis dahin ist die
// Messung von FR-017-AC-1 ausstehend und nur das Messwerkzeug geprüft.
async function heapAfterGc(page: Page): Promise<number> {
  const session = await page.context().newCDPSession(page);
  await session.send('HeapProfiler.collectGarbage');
  const { usedSize } = await session.send('Runtime.getHeapUsage');
  await session.detach();
  return usedSize;
}

test('Messwerkzeug liefert den JS-Heap nach Garbage Collection', async ({ page }) => {
  await page.goto('./');
  const first = await heapAfterGc(page);
  const second = await heapAfterGc(page);
  expect(first).toBeGreaterThan(0);
  expect(second).toBeGreaterThan(0);
});

test.fixme('FR-017-AC-1: Heap nach 20 Zyklen höchstens 10 % über Ausgangswert (WP-009)', () => {
  // Wird mit WP-009 umgesetzt, sobald der Scan-Zyklus existiert.
});
