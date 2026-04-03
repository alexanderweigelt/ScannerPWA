# Scan pipeline instructions

This directory contains the **document scan pipeline** for the Scanner PWA.

Its responsibility is to transform a **captured raw camera frame** into a **readable A4 portrait document scan** using **OpenCV.js**.

This file provides rules for coding agents working on scan-related logic.

---

## Purpose of `src/scan/`
The scan module is responsible for:

- reading the captured image from canvas
- detecting the document contour
- extracting corner points
- warping the document into a flat page
- normalizing portrait orientation
- applying scan-style thresholding
- rendering the final processed output
- returning typed success or failure results
- exposing debuggable intermediate stages

This module must remain independent from:
- camera device lifecycle logic
- UI rendering concerns
- PDF generation concerns
- service worker concerns

---

## Core Rule
The scan pipeline must remain:

**Capture → Detect → Warp → Threshold → Render → Cleanup**

Do not replace this pipeline unless explicitly required.

Preferred detailed order:

1. read captured canvas
2. grayscale conversion
3. gaussian blur
4. edge detection
5. contour detection
6. contour candidate filtering
7. quadrilateral selection
8. corner extraction
9. corner ordering
10. warp target size calculation
11. perspective warp
12. portrait normalization
13. thresholding
14. output rendering
15. cleanup

---

## OpenCV Rules

### OpenCV source
Use only the self-hosted OpenCV.js source:

`public/vendor/opencv.js`

Do not:
- load OpenCV from a CDN
- introduce jscanify or other scan libraries
- move image processing outside OpenCV unless explicitly requested

---

### Memory safety
Every created OpenCV object must be explicitly cleaned up.

Mandatory cleanup applies to:
- `cv.Mat`
- `cv.MatVector`
- contour temporaries
- transform matrices
- threshold intermediates
- warp intermediates

Always use cleanup in:
- success paths
- failure paths
- exception paths

Prefer `try/finally`.

Memory leaks in scan code are critical defects.

---

### Runtime readiness
Never assume OpenCV is ready.

Before using scan functionality, explicitly guard against:
- `cv` missing
- `cv.Mat` unavailable
- runtime initialization not completed

Return typed failures instead of throwing opaque runtime errors when possible.

---

## Input / Output Rules

### Input
The scan pipeline must accept a **captured canvas** or typed scan input derived from a canvas.

Do not use `<img>` as the primary processing input.

### Output
The scan pipeline should return a typed result that can be rendered into:
- an output canvas
- optional debug canvases
- preview state for the UI

The scan module must not directly own page navigation or high-level UI view switching.

---

## A4 Portrait Rule
This project is optimized for **A4 portrait document scanning**.

The scan module must:
- prefer portrait output
- normalize landscape warp results when necessary
- preserve readable page proportions
- avoid producing rotated final scans unless explicitly intended

Target mindset:
- document page first
- camera frame second

Always preserve compatibility with future:
- single-page scan preview
- multi-page page arrays
- A4 portrait PDF export

---

## Typed Result Model
All scan logic must use typed results.

Use explicit result models such as:
- success
- recoverable failure
- fatal failure

Every failure must include a typed reason.

Typical failure reasons include:
- `opencv_not_ready`
- `input_canvas_missing`
- `image_read_failed`
- `document_not_found`
- `invalid_contour`
- `corner_extraction_failed`
- `invalid_point_order`
- `invalid_warp_size`
- `warp_failed`
- `threshold_failed`
- `render_failed`
- `unexpected_runtime_error`

Do not silently return `null`.
Do not use exception-only control flow.

---

## Pipeline Structure
Prefer splitting scan logic into small functions.

Recommended structure:

- `readCapturedCanvas`
- `convertToGrayscale`
- `blurImage`
- `detectEdges`
- `findDocumentContour`
- `filterContourCandidates`
- `extractCornerPoints`
- `orderCornerPoints`
- `computeWarpTargetSize`
- `warpPerspectiveToDocument`
- `normalizePortraitOrientation`
- `applyScanThreshold`
- `renderScanOutput`

Do not keep the full scan flow in one large function when smaller stages improve readability and testability.

---

## Debug Pipeline Rules
The scan module must support a **debug mode**.

Debug mode should make it easy to identify where the pipeline fails.

Preferred intermediate debug stages:
- raw captured image
- grayscale image
- blurred image
- edge image
- contour overlay
- selected quadrilateral
- warped document
- thresholded output

Debug support may be implemented as:
- optional debug canvases
- optional structured debug snapshots
- optional typed debug stage outputs

Do not remove debug support once introduced unless replaced by a better mechanism.

---

## Contour Detection Rules
Document detection must prefer:
- external contours
- sufficiently large contours
- quadrilateral-like document candidates

The contour selection logic must:
- measure area
- reject tiny contours
- approximate polygons
- select the largest valid document-like candidate

If multiple valid candidates exist, prefer the largest plausible document contour.

Do not hardcode undocumented magic numbers inline.
Use typed constants for thresholds.

---

## Corner Point Rules
Corner point extraction is a critical step.

The scan module must:
- derive exactly 4 usable document points
- order them consistently:
  - top-left
  - top-right
  - bottom-right
  - bottom-left
- reject invalid or degenerate point sets
- fail explicitly if ordering is not trustworthy

Incorrect point ordering is considered a high-probability root cause of scan failure.

---

## Thresholding Rules
Thresholding exists to produce a **clear, readable scan**, not just any visual effect.

The final scan should be:
- high contrast
- readable
- black-and-white or close to it
- suitable for later PDF export

Threshold parameters must be:
- typed
- reviewable
- configurable through constants or typed options

Do not hide scan behavior behind unexplained magic values.

---

## Failure Handling Rules
When processing fails:
- preserve the raw captured image outside the scan module
- return a typed failure
- do not mutate unrelated UI state
- do not crash the app
- do not silently return an empty result

A failed scan must remain debuggable.

---

## Fixture-Based Testing Rules
Use realistic image fixtures for scan testing.

Fixtures live in:

`src/__tests__/fixtures/`

The scan pipeline must support tests using real fixture images from that directory.

At minimum maintain tests for:
- one valid document fixture that should succeed
- one invalid fixture that should fail because document contours are not clearly recognizable

The invalid fixture is a required failure case.
Do not weaken that assertion.

Preferred future fixture categories:
- valid A4 portrait document
- skewed document
- weak-edge document
- no-document image
- ambiguous contour image
- noisy background image

---

## Scan Test Strategy
When changing scan logic, add or update tests at the correct level.

### Unit tests
Prefer unit tests for:
- contour filtering
- corner ordering
- warp size calculation
- portrait normalization
- threshold config mapping
- typed error mapping

### Integration tests
Prefer integration tests for:
- full pipeline orchestration
- valid fixture success
- invalid fixture failure
- raw preview preserved after failure
- cleanup after failure
- debug mode stage exposure

### E2E tests
Use browser E2E only for:
- scanner UI flow
- output visibility
- error message visibility
- high-level scan integration

Do not rely on E2E as the main proof for scan correctness.

---

## Test Expectations
Every non-trivial scan change should include:
- one happy-path test
- one failure-path test
- one regression test if fixing a bug
- explicit cleanup verification when applicable

Critical scan bugs require tests for:
- null handling
- invalid contour behavior
- invalid corner ordering
- failed warp
- failed thresholding
- cleanup after failure

---

## What Must Be Avoided
Do not:
- introduce new scan libraries
- move scan logic into UI components
- mix PDF generation into scan services
- depend on server-side processing
- ignore nullability
- use `any`
- silently swallow errors
- skip cleanup
- replace fixture-based tests with only mocked success values
- remove portrait normalization without a clear replacement
- add large refactors outside the current scan task

---

## Validation After Every Change
After every code change, run these commands in this order:

```bash
npx tsc --noEmit
pnpm run lint
pnpm run build
pnpm run test:coverage
pnpm run test:e2e
```

If a command cannot be executed:
- explicitly state which command was skipped
- explain why
- mention any required manual validation

If camera behavior changed:
- include manual real-device validation notes
- explicitly mention rear-camera behavior
- explicitly mention laptop webcam fallback

---

## Agent Response Expectations

Before implementation, briefly state:
- affected scan files
- pipeline stages being changed
- tests to be added or updated
- fixtures to be used

After implementation, briefly state:
- changed scan files
- updated pipeline stages
- tests added or updated
- fixture outcomes
- validation commands executed
- commands not executed