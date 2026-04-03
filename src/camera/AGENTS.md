# Camera Instructions

This directory contains the **camera lifecycle, preview, capture, and device fallback logic** for the Scanner PWA.

Its responsibility is to provide a **stable, typed, mobile-first camera experience** that delivers high-quality frames into the scan pipeline.

This file provides rules for coding agents working on camera-related logic.

---

## Purpose of `src/camera/`
The camera module is responsible for:

- requesting camera access
- selecting the preferred device
- rendering the live preview stream
- handling camera permission failures
- capturing the current video frame
- stopping media streams safely
- preserving portrait-oriented preview behavior
- supporting mobile and desktop browsers
- exposing typed capture results to the scan pipeline

This module must remain independent from:
- OpenCV scan logic
- PDF generation
- page array / multi-page state
- Service Worker caching logic
- high-level view navigation

---

## Core Camera Workflow
Always preserve compatibility with this workflow:

**Start Camera → Live Preview → Capture Frame → Retry / Stop → Return Result**

Future compatibility must remain possible for:

**Start Camera → Capture → Add Page → Continue Camera → Multi-page Export**

Do not introduce architectural decisions that block multi-page capture loops.

---

## Browser API Rule
Use only the browser camera APIs:

- `navigator.mediaDevices.getUserMedia`
- `navigator.mediaDevices.enumerateDevices`

Do not:
- use third-party camera libraries
- move capture logic server-side
- introduce unnecessary wrappers around media streams unless they improve testability
- bypass browser permission flows

The camera must start **only after explicit user interaction**.

---

## Device Priority Rule
Always preserve this order:

1. rear camera on mobile
2. front camera fallback
3. laptop / desktop webcam fallback

Preferred camera constraints:

{ facingMode: { ideal: 'environment' } }

Fallback should gracefully retry with:

{ facingMode: 'user' }

Do not break fallback behavior.

---

## Portrait UX Rule
This product is optimized for **A4 portrait document scanning**.

The camera module must preserve:
- portrait preview
- portrait capture dimensions
- readable document framing
- mobile-first layout behavior
- usability on laptops when portrait framing is simulated in UI

Prefer captured frames that remain suitable for:
- portrait warp
- portrait scan normalization
- portrait PDF export

---

## Preview Rules
The camera preview should use a `<video>` element.

Responsibilities:
- render the active stream
- preserve aspect ratio
- avoid distortion
- support responsive mobile sizing
- remain compatible with future overlay guides

Future-compatible overlays may include:
- A4 framing guide
- edge hint guides
- page alignment hints

Do not make preview implementation choices that block future overlays.

---

## Capture Rules
The capture module must:
- capture the current video frame
- draw the frame into a canvas
- preserve the correct aspect ratio
- preserve useful resolution for scan quality
- expose typed capture output

The capture result should be compatible with:
- single-page preview
- multi-page page arrays
- future local persistence
- PDF page generation
- debug scan fixtures if reused in tests

Avoid lossy resizing unless explicitly configurable.

---

## Stream Lifecycle Rules
Media streams must be cleaned up safely.

Mandatory:
- stop all active tracks
- release references on cleanup
- stop stream on component unmount
- stop stream on explicit "Stop Camera"
- stop stream on permission fallback failure
- prevent orphaned tracks after retries

Leaking camera streams is considered a critical defect.

---

## Error Handling Rules
Never silently fail camera operations.

Explicit typed failures must exist for:
- permission denied
- no camera available
- rear camera unavailable
- fallback camera unavailable
- capture failed
- video element missing
- canvas missing
- invalid 2D context
- stream stopped unexpectedly
- browser API unavailable

If the rear camera fails:
- retry fallback
- report typed fallback behavior
- keep UI retry-friendly

---

## Typed Result Model
All camera logic must use typed results.

Use explicit result models such as:
- success
- recoverable failure
- fatal failure

Do not:
- use `any`
- silently return `null`
- swallow permission errors
- mix UI strings into low-level services

Preferred typed reasons:
- `permission_denied`
- `camera_not_found`
- `rear_camera_unavailable`
- `fallback_camera_failed`
- `capture_failed`
- `stream_unavailable`
- `unexpected_runtime_error`

---

## Project Structure Rules
Prefer modular files such as:

- `useCamera.ts`
- `selectPreferredCamera.ts`
- `captureFrame.ts`
- `camera.types.ts`
- `camera.constants.ts`

Keep:
- device selection
- stream lifecycle
- frame capture
- typed error mapping
- React hook orchestration

cleanly separated.

Do not move camera logic into scan services.

---

## Testing Rules

### Unit tests
Prefer unit tests for:
- camera constraint selection
- rear-camera preference logic
- fallback selection
- typed failure mapping
- capture dimension helpers
- aspect ratio helpers

### Integration tests
Prefer integration tests for:
- hook state transitions
- permission denied flow
- fallback retry flow
- capture success
- stop camera cleanup
- unmount cleanup
- preview lifecycle

### E2E tests
Use Playwright for:
- browser preview flow
- capture button flow
- retry flow
- stop camera flow
- mobile viewport behavior
- laptop fallback behavior

Do not use Playwright as proof of **real physical rear-camera correctness**.

---

## Real Device Boundary
The following must be validated manually on real devices:

- rear camera selected on smartphones
- autofocus quality
- exposure quality
- document framing ergonomics
- Android camera quirks
- iPhone camera quirks
- laptop webcam fallback ergonomics

This applies especially when:
- camera constraints change
- fallback behavior changes
- capture resolution changes
- preview layout changes

---

## Multi-page Future Compatibility
Every camera change must preserve future support for:

- repeated capture loops
- Add Page workflows
- return to live preview after capture
- multiple capture cycles without stream leaks
- page arrays in parent state

Do not assume the camera is always stopped after one capture.

The future target workflow is:

**Capture → Add Page → Continue Camera → Capture Next Page**

---

## What Must Be Avoided
Do not:
- introduce third-party camera libraries
- break fallback retry behavior
- auto-start camera without user interaction
- distort preview aspect ratio
- downscale captures aggressively
- mix camera logic into UI-only components
- mix OpenCV into camera hooks
- forget stream cleanup
- use `any`
- rely only on Playwright for rear-camera validation
- break future multi-page capture loops

---

## Validation After Camera Changes
After changing camera-related code, run:

npx tsc --noEmit
npm run build
npm run test:coverage
npm run test:e2e

If any command cannot be run:
- explicitly say which one
- explain why
- mention required manual device validation

For camera-specific changes, also report:
- fallback behavior tested
- manual rear-camera validation required
- laptop fallback behavior status

---

## Agent Response Expectations
Before implementation, briefly state:
- affected camera files
- whether fallback behavior changes
- tests to add or update
- whether real-device validation is required

After implementation, briefly state:
- changed camera files
- fallback behavior verified
- tests added or updated
- validation commands executed
- commands not executed
- required manual smartphone checks