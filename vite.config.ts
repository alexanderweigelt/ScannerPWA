import { defineConfig } from 'vitest/config';

// Basis und Build-Regeln: ARCHITECTURE.md 10.3 und 10.5, FR-014.
export default defineConfig({
  base: '/ScannerPWA/',
  build: {
    modulePreload: { polyfill: false },
    sourcemap: false,
    // Keine data:-URLs; die CSP aus ADR-0005 erlaubt sie nicht.
    assetsInlineLimit: 0,
  },
  preview: { port: 4173, strictPort: true },
  test: {
    include: ['tests/unit/**/*.test.ts'],
  },
});
