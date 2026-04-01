# Testing Strategy

This document defines the testing strategy for the Scanner PWA.

The goal is to enforce a practical test pyramid that fits:
- Next.js App Router
- React client components
- browser-only OpenCV.js processing
- canvas-based document scanning
- jsPDF export
- PWA offline behavior
- strict TypeScript
- small, reviewable changes

---

## Testing Pyramid

The project uses this pyramid:

### 1. Unit Tests (largest layer)
Unit tests cover:
- pure utility functions
- geometry helpers
- contour point ordering
- A4 portrait normalization logic
- typed result/error mapping
- camera constraint selection logic
- PDF page dimension calculations
- Service Worker helper utilities if extracted as pure functions

These tests must be:
- fast
- deterministic
- isolated
- free of real browser/device dependencies

### 2. Integration Tests (middle layer)
Integration tests cover:
- React hooks
- React client components
- camera UI state transitions
- scan pipeline orchestration
- error state rendering
- canvas wiring
- PDF export triggers
- fallback behavior between cameras
- interaction between UI and typed processing services

Integration tests may mock:
- OpenCV.js
- canvas APIs
- media devices
- download APIs
- browser permissions

### 3. End-to-End Tests (smallest layer)
E2E tests cover:
- complete user flows in the browser
- camera permission flow where realistically testable
- service worker registration
- offline shell behavior
- installability-related flows where feasible
- scan page rendering
- export actions
- mobile viewport behavior
- portrait-oriented UI behavior

E2E tests are especially important for:
- async App Router flows
- browser-only behavior
- PWA offline checks
- real canvas/browser interactions

---

## Default Tooling

### Unit + Integration
Use:
- Jest
- React Testing Library
- jsdom

### E2E
Use:
- Playwright

### Optional Supporting Tools
Use when needed:
- `@testing-library/jest-dom` for readable DOM assertions
- `@testing-library/user-event` for realistic user interaction tests
- `msw` for request mocking
- `jest-canvas-mock` when canvas mocking is needed in Jest-based tests

---

## Scope by Test Type

### Unit Test Scope
Prefer unit tests for:
- `src/scan/geometry/*`
- `src/scan/orderCornerPoints`
- `src/scan/normalizePortraitA4Orientation`
- `src/camera/selectPreferredCameraConstraints`
- `src/pdf/pageSizing`
- `src/types/*` result mappers and guards
- small pure helper functions

Do not involve React rendering when a pure function can be tested directly.

### Integration Test Scope
Prefer integration tests for:
- hooks in `src/hooks/*`
- scan orchestration services
- client-side scanner components
- loading, success, and failure UI states
- button → processing → output-canvas workflows
- typed runtime error rendering
- camera fallback behavior

### E2E Test Scope
Prefer E2E tests for:
- the scanner page main flow
- offline shell loading after first visit
- service worker behavior
- manifest and installability smoke checks
- viewport-specific portrait layouts
- real browser regressions
- critical happy-path export workflow

---

## Test Distribution Targets

The desired distribution is approximately:

- 70% unit tests
- 20% integration tests
- 10% E2E tests

This is a guideline, not a strict quota.

For this project, keep expensive browser tests small and focused.
Most image-processing logic should stay testable through pure helpers and mocked orchestration layers.

---

## Rules for OpenCV Testing

Do not attempt to fully reproduce OpenCV internals in unit tests.

Instead:
- unit test the logic around OpenCV inputs/outputs
- mock OpenCV calls in integration tests
- verify typed success/failure behavior
- verify cleanup paths
- verify null/error handling
- verify pipeline sequencing where possible

Always test these failure cases:
- OpenCV not initialized
- no contour found
- invalid contour shape
- warp failure
- threshold failure
- null output
- cleanup still runs after failure

If OpenCV-specific behavior cannot be verified reliably in Jest, cover the behavior in Playwright instead.

---

## Rules for Camera Testing

Do not depend on a real camera in unit or integration tests.

Mock:
- `navigator.mediaDevices.getUserMedia`
- permission failures
- missing cameras
- rear-camera failure
- fallback to front camera
- laptop single-camera fallback

Always test:
- rear camera preferred on mobile
- fallback is triggered when rear camera fails
- portrait UI remains stable after fallback
- typed error is returned when no camera can be opened

---

## Rules for Canvas Testing

Canvas is a core part of the scanner architecture.

Test:
- input/output canvas presence checks
- processing refusal when canvas refs are null
- correct branching on missing 2D context
- output rendering calls
- debug rendering gates

Use a canvas mock when needed.
Do not over-test browser internals that belong to the platform.

---

## Rules for PDF Testing

PDF generation must be tested at two levels:

### Unit/Integration
Test:
- page ordering
- portrait A4 defaults
- multi-page sequencing
- typed export failures
- no hidden UI-side PDF logic

### E2E
Test:
- export action can be triggered
- resulting download flow starts
- multi-page flow does not regress the single-page flow

Do not parse full PDF internals unless there is a specific business reason.

---

## Rules for PWA / Offline Testing

PWA behavior must be tested with browser-level tests.

Prefer Playwright for:
- service worker registration
- offline app shell loading
- scanner route accessibility after first load
- static asset availability
- user-visible offline state

Do not try to over-simulate service worker behavior in shallow unit tests.

If service worker logic is extracted into pure helper functions, test those helpers with unit tests.

---

## Mocking Strategy

### Mock in Unit/Integration Tests
Mock:
- OpenCV global (`cv`)
- canvas APIs where needed
- `getUserMedia`
- `URL.createObjectURL`
- file download APIs
- browser permission APIs
- network requests
- service worker registration when testing component behavior only

### Avoid Mocking
Avoid mocking:
- pure utility functions
- typed result mappers
- geometry helpers
- simple synchronous transformations

---

## Assertions Policy

Prefer assertions that reflect user-observable behavior.

Examples:
- visible loading text
- visible error message
- scan output canvas rendered
- export button enabled or disabled
- fallback message shown
- portrait layout classes or dimensions applied

Avoid overly implementation-specific assertions unless the code is pure technical logic.

---

## Snapshot Policy

Avoid snapshot-heavy testing.

Allowed:
- very small stable markup snapshots if clearly valuable

Preferred instead:
- semantic DOM assertions
- explicit state assertions
- typed result assertions

---

## Accessibility Testing

At minimum, integration and E2E tests should verify:
- buttons are accessible by role
- loading and error states are visible to assistive technologies when applicable
- keyboard interaction works for primary controls
- orientation-specific UI remains usable on small screens

---

## File Placement Conventions

Preferred structure:

- unit tests colocated with pure modules or under `src/**/__tests__`
- integration tests colocated with hooks/components or under `src/**/__tests__`
- E2E tests in `tests/e2e/`

Suggested naming:
- `*.test.ts`
- `*.test.tsx`
- Playwright: `tests/e2e/*.spec.ts`

Use one naming style consistently.

---

## Minimum Coverage Expectations

Every new feature should include:
- happy-path tests
- at least one edge case
- at least one failure-path test

Every bug fix should include:
- a regression test reproducing the issue
- a passing test proving the fix

Critical logic requires explicit tests for:
- null handling
- typed error returns
- cleanup execution
- fallback behavior

---

## Review Heuristics

A test suite change is good when it:
- increases confidence
- keeps runtime reasonable
- avoids brittle mocks
- does not over-couple tests to implementation details
- makes failures easy to diagnose

A test suite change is bad when it:
- adds broad snapshots without strong value
- introduces flaky browser timing
- duplicates the same behavior across many layers
- tests browser internals instead of project behavior

---

## Project-Specific Priority Areas

The highest-priority tests for this repository are:

1. camera fallback logic
2. scan pipeline error handling
3. contour selection helper logic
4. portrait A4 normalization
5. PDF page ordering
6. offline shell availability
7. scanner happy path in browser
8. null / runtime failure handling

---

## Change Policy

For each non-trivial feature:
1. add or update unit tests
2. add integration tests if UI behavior changes
3. add or update E2E tests if the user flow changes
4. keep the smallest useful test surface
5. prefer confidence over test volume

---

## Practical Principle

Test the project in this order:

**Pure logic first → UI wiring second → browser flow third**

For this repository specifically:

**Geometry → Scan orchestration → UI states → Export flow → Offline flow**