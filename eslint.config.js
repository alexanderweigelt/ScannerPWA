// Lint-Regeln laut ARCHITECTURE.md 10.2 (SEC-04, SEC-05).
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

const networkApis = ['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'importScripts'].map(
  (name) => ({ name, message: 'Keine Netz-APIs in der Bildverarbeitung (SEC-05).' }),
);

export default defineConfig(
  {
    ignores: [
      'dist/',
      'dist-diagnose/',
      'coverage/',
      'test-results/',
      'playwright-report/',
      'node_modules/',
    ],
  },
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    linterOptions: { reportUnusedDisableDirectives: 'error' },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-ignore': true, 'ts-nocheck': true, 'ts-expect-error': 'allow-with-description' },
      ],
      'no-eval': 'error',
      'no-new-func': 'error',
      '@typescript-eslint/no-implied-eval': 'error',
      'no-restricted-properties': [
        'error',
        { property: 'innerHTML', message: 'Nur textContent/createElement (SEC-04).' },
        { property: 'outerHTML', message: 'Nur textContent/createElement (SEC-04).' },
        { property: 'insertAdjacentHTML', message: 'Nur textContent/createElement (SEC-04).' },
        { property: 'setHTMLUnsafe', message: 'Nur textContent/createElement (SEC-04).' },
        {
          property: 'createContextualFragment',
          message: 'Nur textContent/createElement (SEC-04).',
        },
        { property: 'srcdoc', message: 'Kein srcdoc (SEC-04).' },
        { object: 'document', property: 'write', message: 'Kein document.write (SEC-04).' },
        { object: 'document', property: 'writeln', message: 'Kein document.writeln (SEC-04).' },
      ],
    },
  },
  {
    files: ['src/processing/**'],
    rules: { 'no-restricted-globals': ['error', ...networkApis] },
  },
  {
    // Service Worker: fetch nur für den eigenen Ursprung, im Ablauftest geprüft.
    files: ['src/sw/**'],
    rules: {
      'no-restricted-globals': ['error', ...networkApis.filter((api) => api.name !== 'fetch')],
    },
  },
);
