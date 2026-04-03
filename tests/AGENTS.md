# E2E instructions

This directory contains the **browser-level end-to-end tests** for the Scanner PWA.

Its responsibility is to validate the **real user workflow in the browser**, including:
- camera UI flow
- scan preview flow
- multi-page workflows
- PDF export flow
- PWA offline shell behavior
- service worker integration
- mobile viewport behavior
- regression safety for critical product paths

This file provides rules for coding agents working on Playwright and browser-level tests.

---

## Purpose of `tests/e2e/`
The E2E test suite is responsible for validating:

- scanner happy path
- retry and scan-again behavior
- page array workflows
- page deletion
- PDF export trigger
- service worker registration
- offline shell after first visit
- mobile portrait layout
- desktop fallback UX
- regression of critical browser workflows

This layer validates **browser behavior**, not low-level OpenCV correctness.

---

## Core E2E Workflow
Always preserve compatibility with this user flow:

**Start Camera → Preview → Capture → Scan Preview → Add Page → Export PDF**

The current minimum supported browser flow is:

**Start Camera → Preview → Capture → Preview → Stop → Start Screen**

Future compatibility must remain possible for:
- repeated capture loops
- Add Page flows
- page deletion
- multi-page export
- offline shell recovery
- retry after scan failure

Do not introduce test architecture that blocks these flows.

---

## Playwright Scope Rule
Use Playwright for validating:

- browser-level UI behavior
- routing and page rendering
- visible state transitions
- button workflows
- download trigger flows
- service worker browser behavior
- offline shell loading
- viewport-specific layout regressions
- mobile browser emulation
- desktop fallback UI flows

Do not use Playwright as the primary proof for:
- OpenCV scan correctness
- contour quality
- threshold quality
- warp correctness
- real rear-camera hardware behavior

Those belong to lower-level tests or manual validation.

---

## Camera Boundary Rule
Playwright can validate:
- camera permission UI flows
- mocked `getUserMedia`
- capture button flows
- retry behavior
- stop camera behavior
- mobile viewport layout
- desktop webcam fallback UI assumptions

Playwright must **not** be treated as proof of:

- real rear-camera usage on smartphones
- autofocus correctness
- exposure correctness
- device-specific camera sensor behavior
- iOS Safari camera quirks
- Android Chrome camera quirks

Rear-camera correctness always requires **manual real-device validation**.

---

## PWA / Service Worker Rules
This directory is the primary place for validating PWA browser behavior.

Mandatory E2E coverage should include:
- service worker registration
- app shell loads after first visit
- offline shell works after first successful load
- static routes remain accessible offline
- scanner entry route remains reachable
- no critical service worker console errors
- cached shell remains stable after navigation

Do not over-mock service worker behavior in E2E.

Prefer realistic browser offline mode.

---

## Mobile Viewport Rule
The product is **mobile-first**.

E2E coverage must preserve:
- portrait viewport rendering
- scanner layout in narrow widths
- camera preview responsiveness
- scan preview usability
- Add Page workflow usability
- export action accessibility
- retry usability after failures

Prefer mobile browser projects such as:
- Pixel devices
- iPhone devices
- tablet portrait viewports if introduced later

---

## Multi-page Workflow Rules
Future browser workflows must remain compatible with:

**Capture → Add Page → Continue → Add More → Delete → Export**

E2E tests should preserve:
- page order
- page deletion
- repeated capture loops
- export after multiple pages
- no regression in single-page export

Do not write tests that assume exactly one page forever.

---

## PDF Export Browser Rules
Playwright should validate:
- export button visibility
- export trigger flow
- download starts
- multi-page export does not regress
- page order remains stable through UI flow

Do not deeply inspect PDF binary structure in E2E unless explicitly required.

The goal is **browser workflow confidence**.

---

## Retry / Failure Rules
The browser flow must remain retry-friendly.

Important E2E scenarios:
- capture fails gracefully
- scan preview remains visible after failure
- Scan Again returns to preview
- Stop Camera returns to start screen
- retry remains possible after processing error
- offline shell still loads after previous failure

Failure UX regressions are considered high priority.

---

## Mocking Rules
In E2E tests, mock only where browser realism would otherwise be impossible.

Allowed:
- `getUserMedia`
- fake camera permissions
- fake download flows where needed
- deterministic fixture image injection
- offline network mode

Avoid:
- mocking entire UI state transitions
- mocking service worker registration unless isolating browser failures
- mocking every scan step

The user flow should stay as realistic as possible.

---

## Test File Strategy
Prefer test files such as:

- `scanner-flow.spec.ts`
- `offline-shell.spec.ts`
- `multi-page-export.spec.ts`
- `camera-fallback.spec.ts`

Keep:
- camera flows
- offline flows
- export flows
- viewport regressions

separated into review-friendly files.

Do not create one huge browser-flow spec file.

---

## Required E2E Coverage
Every critical browser workflow change should include:

- one happy-path flow
- one retry/failure flow
- one mobile viewport regression check
- one offline shell check if routing or PWA behavior changed
- one export regression if PDF behavior changed

---

## Real Device Validation Boundary
The following must still be validated manually outside Playwright:

- rear camera selected on physical smartphones
- autofocus stability
- document framing ergonomics
- real lighting quality
- iOS Safari rear-camera behavior
- Android Chrome rear-camera behavior
- laptop webcam ergonomics

This is mandatory whenever:
- camera constraints change
- preview dimensions change
- capture resolution changes
- mobile layout changes

---

## What Must Be Avoided
Do not:
- treat Playwright as proof of physical camera correctness
- over-mock browser flows
- deeply test OpenCV internals here
- break mobile viewport coverage
- skip offline shell tests after service worker changes
- assume single-page forever
- use brittle timing-only assertions
- depend on unstable sleeps
- create huge all-in-one spec files

---

## Validation After E2E Changes
After changing E2E tests or browser workflows, run:

npx tsc --noEmit
npm run build
npm run test:coverage
npm run test:e2e

If any command cannot be run:
- explicitly say which one
- explain why
- mention remaining manual browser or device checks

For E2E-specific changes, also report:
- viewport projects covered
- offline mode covered
- manual real-device checks still required

---

## Agent Response Expectations
Before implementation, briefly state:
- affected E2E files
- whether mobile viewport coverage changes
- whether offline behavior changes
- whether export flow changes
- whether manual device validation is required

After implementation, briefly state:
- changed E2E files
- browser workflows verified
- viewport coverage verified
- offline coverage verified
- tests added or updated
- validation commands executed
- commands not executed
- remaining manual real-device checks