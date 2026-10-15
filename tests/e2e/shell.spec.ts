import { expect, test } from '@playwright/test';

// Grundprüfung der Auslieferung durch `vite preview` (WP-001). Belegt kein
// Produktkriterium; FR-011-AC-1 folgt mit dem gesamten Ablauf in WP-009.
test('Startseite lädt unter /ScannerPWA/ ohne CSP-Verstoß und ohne fremde Anfragen', async ({
  page,
  baseURL,
}) => {
  const origin = new URL(baseURL ?? '').origin;
  const requests: { url: string; method: string; referer: string | undefined }[] = [];
  const consoleErrors: string[] = [];
  page.on('request', (request) => {
    requests.push({
      url: request.url(),
      method: request.method(),
      referer: request.headers().referer,
    });
  });
  const failedResponses: string[] = [];
  page.on('response', (response) => {
    // Das App-Icon folgt mit WP-008; bis dahin fragt der Browser /favicon.ico vergeblich an.
    const url = new URL(response.url());
    if (response.status() >= 400 && url.pathname !== '/favicon.ico') failedResponses.push(url.href);
  });
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource')) {
      consoleErrors.push(message.text());
    }
  });
  await page.addInitScript(() => {
    const violations: string[] = [];
    Object.defineProperty(window, '__cspViolations', { value: violations });
    document.addEventListener('securitypolicyviolation', (event) => {
      violations.push(`${event.violatedDirective} ${event.blockedURI}`);
    });
  });

  await page.goto('./');

  await expect(page.locator('html')).toHaveAttribute('data-app', 'scanner');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page.getByRole('heading', { level: 1, name: 'Scanner' })).toBeVisible();
  const violations = await page.evaluate(
    () => (window as unknown as { __cspViolations: string[] }).__cspViolations,
  );
  expect(violations).toEqual([]);
  expect(consoleErrors).toEqual([]);
  expect(failedResponses).toEqual([]);
  for (const request of requests) {
    expect(new URL(request.url).origin, request.url).toBe(origin);
    expect(request.method, request.url).toBe('GET');
    expect(request.referer ?? '', request.url).toBe('');
  }
});
