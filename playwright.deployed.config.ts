import { defineConfig } from '@playwright/test';

// Ausgelieferte Antwort der GitHub Page (SEC-01, -02, -03, -06, -07, FR-014).
// Läuft erst nach einem Deployment; lokale Server belegen diese Ziele nicht.
export default defineConfig({
  testDir: 'tests/deployed',
  retries: 0,
  reporter: 'list',
  use: { baseURL: 'https://alexanderweigelt.github.io/ScannerPWA/' },
});
