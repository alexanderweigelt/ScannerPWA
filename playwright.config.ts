import { defineConfig, devices } from '@playwright/test';

// Browser-Abläufe, Zugänglichkeit und Speicher gegen `vite preview` unter /ScannerPWA/
// (ARCHITECTURE.md 10.4). Lokale Läufe belegen SEC-01, -02, -06 nicht.
const baseURL = 'http://localhost:4173/ScannerPWA/';
// Optional: vorinstalliertes Chromium statt des von Playwright geladenen.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const chromium = executablePath === undefined ? {} : { launchOptions: { executablePath } };

export default defineConfig({
  forbidOnly: process.env.CI !== undefined,
  retries: 0,
  reporter: process.env.CI === undefined ? 'list' : [['list'], ['html', { open: 'never' }]],
  use: { baseURL },
  webServer: {
    command: 'npm run build && npm run preview',
    url: baseURL,
    reuseExistingServer: process.env.CI === undefined,
  },
  projects: [
    {
      name: 'e2e-desktop-chromium',
      testDir: 'tests/e2e',
      use: { ...devices['Desktop Chrome'], ...chromium },
    },
    {
      name: 'e2e-mobile-chromium',
      testDir: 'tests/e2e',
      use: { ...devices['Pixel 7'], ...chromium },
    },
    { name: 'e2e-firefox', testDir: 'tests/e2e', use: { ...devices['Desktop Firefox'] } },
    { name: 'e2e-webkit-iphone', testDir: 'tests/e2e', use: { ...devices['iPhone 15'] } },
    {
      name: 'a11y-desktop',
      testDir: 'tests/a11y',
      use: { ...devices['Desktop Chrome'], ...chromium },
    },
    { name: 'a11y-mobile', testDir: 'tests/a11y', use: { ...devices['Pixel 7'], ...chromium } },
    { name: 'memory', testDir: 'tests/memory', use: { ...devices['Desktop Chrome'], ...chromium } },
  ],
});
