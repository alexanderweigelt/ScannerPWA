---
applyTo: "**/*.test.ts,**/*.test.tsx,tests/e2e/**/*.spec.ts,src/**/__tests__/**/*"
---
# Testing instructions

Use this testing strategy for the Scanner PWA:

- Follow a practical test pyramid:
  - unit tests first
  - integration tests second
  - browser E2E tests third
- Use Jest + React Testing Library for unit and integration tests.
- Use Playwright for E2E tests.
- Prefer pure-function tests for:
  - geometry helpers
  - contour filtering
  - corner ordering
  - A4 portrait normalization
  - typed result/error mapping
  - camera constraint selection
  - PDF sizing and ordering
- For scan logic, always test:
  - success path
  - edge cases
  - explicit failure scenarios
  - null handling
  - cleanup after failure
- Mock OpenCV where full browser execution is not practical.
- Mock `navigator.mediaDevices.getUserMedia` in unit/integration tests.
- Use fixture-based tests for the scan pipeline where available.
- Keep E2E coverage focused on user flows, offline shell behavior, and browser integration.
- Do not rely on Playwright to validate a real physical rear camera on a smartphone.
- Treat real rear-camera validation as a manual real-device scope.
- Avoid broad snapshot testing.
- Prefer semantic assertions and visible user behavior.
- Every bug fix must include a regression test.
- After changing testable behavior, run:
  - `npx tsc --noEmit`
  - `npm run build`
  - `npm run test:coverage`
  - `npm run test:e2e`