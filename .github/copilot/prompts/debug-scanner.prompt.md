# Debug Task — Fix OpenCV Document Scan Pipeline

## Context
The current scanner app is built with **Next.js + React + TypeScript** and uses a **custom OpenCV.js integration**.

The current functionality already works correctly up to this point:
- the live camera preview is shown
- clicking **"Capture Scan"** captures the current frame
- the captured frame is shown as a raw photo preview

What does **not** work:
- the captured photo is **not successfully converted into a document scan**
- the problem is likely inside the custom OpenCV pipeline:
    - contour detection
    - corner detection
    - perspective transform
    - output sizing
    - thresholding
    - runtime readiness or null handling

Use the existing custom OpenCV pipeline and debug/fix it.

---

## Main Goal
Refactor and debug the existing OpenCV scan pipeline so that the captured document photo can actually be transformed into a usable scanned document preview.

The implementation must:
- keep the existing app architecture
- keep the custom OpenCV integration
- make the OpenCV pipeline observable and debuggable
- add automated tests for success and failure cases
- use provided mock images from test data
- avoid `any`
- keep everything strictly typed

---

## Important Technical Constraints
- Use **OpenCV.js only**
- Do not introduce new scan libraries
- Use **canvas-based input and output**
- Use strict TypeScript
- `any` is forbidden
- all runtime failures must be handled explicitly
- all temporary OpenCV objects must be cleaned up
- all processing must remain browser-side

---

## Required Debugging Strategy

### 1. Instrument the pipeline
Break the current scan pipeline into explicit, separately testable stages:

1. `readCapturedCanvas`
2. `convertToGrayscale`
3. `blurImage`
4. `detectEdges`
5. `findDocumentContour`
6. `extractCornerPoints`
7. `orderCornerPoints`
8. `computeWarpTargetSize`
9. `warpPerspectiveToDocument`
10. `normalizePortraitOrientation`
11. `applyScanThreshold`
12. `renderScanOutput`

Every stage must:
- have explicit typed input/output
- return a typed result
- support structured debug logging
- fail explicitly with typed error information

Do not keep the scan as one monolithic function.

---

### 2. Add a typed pipeline result model
Create explicit result types for the pipeline, for example:

- success
- recoverable failure
- fatal runtime failure

Possible error reasons include:
- OpenCV not initialized
- input canvas missing
- captured image unreadable
- no contour found
- contour has fewer than 4 usable corner points
- invalid point order
- invalid warp target size
- warp output empty
- threshold output empty
- output canvas missing
- scan result is null
- unexpected exception

Never silently return `null` without an explicit typed error.

---

### 3. Add debug rendering for intermediate stages
Add an optional debug mode that can render intermediate stages into dedicated canvases.

At minimum support rendering of:
- raw captured image
- grayscale image
- edge image
- contour overlay
- warped document
- final thresholded scan

The purpose is to determine where the pipeline fails visually.

Do not remove the existing final output preview.

---

### 4. Verify contour detection logic
Review and fix the custom contour detection logic.

The implementation must explicitly verify:
- `cv.findContours(...)` is called on a proper edge or binary image
- external contours are preferred
- contour area is measured
- very small contours are filtered out
- candidate contours are approximated to polygons
- the best document candidate is a quadrilateral
- the chosen contour is the largest valid document-like contour

If multiple quadrilateral contours exist, prefer the largest valid one.

Make the thresholds configurable through typed constants instead of magic numbers.

---

### 5. Verify corner extraction and ordering
Review and fix the custom corner extraction logic.

The implementation must:
- derive exactly 4 usable document points
- order them consistently:
    - top-left
    - top-right
    - bottom-right
    - bottom-left
- reject invalid point sets explicitly
- log detected points in debug mode

If corner ordering is wrong, the warp will fail or produce an invalid output.

Add tests for point ordering using mock coordinates.

---

### 6. Verify perspective transform logic
Review and fix the perspective transform stage.

The implementation must:
- compute a stable target width and target height from the ordered points
- preserve portrait-oriented output for A4-like documents
- use a valid transform matrix
- reject zero or invalid dimensions
- render the warped result into a dedicated matrix

If the warped document becomes landscape unintentionally, normalize it back to portrait orientation.

---

### 7. Verify final scan conversion
After perspective correction, review the final conversion to a scan-like output.

The final output must:
- remain readable
- be black-and-white or high-contrast
- preserve sharp contours

Review the thresholding stage and make the parameters configurable and debuggable.

At minimum, log:
- threshold mode used
- threshold constants used
- whether the output matrix is empty

Do not hardcode undocumented magic numbers without typed constants.

---

### 8. Add explicit runtime guards
The current bug may be caused by invalid runtime assumptions.

Add explicit guards for:
- `cv` not ready
- canvas refs being `null`
- `cv.imread(...)` failing
- empty `cv.Mat`
- empty contour results
- invalid point arrays
- failed warp output
- failed threshold output
- output canvas missing

Return typed failures instead of crashing or silently failing.

---

### 9. Preserve the existing user flow
Do not redesign the feature.

The user flow must remain:
1. camera preview is shown
2. user clicks **Capture Scan**
3. raw captured image is shown
4. OpenCV scan processing runs
5. resulting scanned document preview is shown if successful
6. explicit error state is shown if processing fails

If processing fails, keep the raw captured image visible.

---

## Test Fixtures

Use the image fixtures from this fixed path:

`src/__tests__/fixtures/`

The pipeline tests must use real image fixtures from this folder.

Assume the following two fixtures exist in that directory:

- one **valid document image** that should produce a successful scan result
- one **invalid document image** that should fail because the document contours are not clearly detectable

The invalid fixture must be treated as an expected failure case, not as a flaky test.

### Required fixture behavior
- the **valid fixture** must lead to a typed success result
- the **invalid fixture** must lead to a typed failure result with a meaningful failure reason such as:
    - `document_not_found`
    - `invalid_contour`
    - `corner_extraction_failed`

Do not treat both fixtures as successful cases.

---

## Testing Requirements

The described behavior must be protected with automated tests.

The user provides image fixtures in:

`src/__tests__/fixtures/`

Use those images in tests instead of relying only on synthetic data.

### Unit Tests
Add unit tests for:
- contour candidate filtering
- corner point ordering
- warp target size calculation
- portrait normalization
- threshold configuration mapping
- typed failure result mapping

### Fixture-Based Unit Tests
Create unit-test coverage that uses the provided fixture images from:

`src/__tests__/fixtures/`

At minimum:
- one test using the **valid fixture** must verify that the pipeline returns a typed success result
- one test using the **invalid fixture** must verify that the pipeline returns a typed failure result
- the invalid fixture test must explicitly assert that failure is expected because the document contours are not clearly recognizable

These tests must not be skipped.

### Integration Tests
Add integration tests for:
- successful processing with a valid document test image
- no-document image returns typed failure
- invalid contour returns typed failure
- invalid corner extraction returns typed failure
- pipeline keeps raw image preview visible on failure
- debug mode exposes intermediate rendering hooks
- cleanup runs even after failure

### Mocking Rules
- mock OpenCV where browser execution is not practical
- use provided test images for realistic input cases
- do not fake the entire pipeline if a stage can be tested meaningfully
- prefer realistic image fixtures over arbitrary mocks

### Required Fixture Coverage
Use or create fixture categories for:
- valid A4-like document in portrait orientation
- image where the document contours are too weak or unclear and detection should fail

The second category is mandatory and must be asserted as a failure case.

---

## Refactoring Expectations
Keep the refactoring small and reviewable.

Prefer:
- extracting pipeline stages into functions
- adding typed result objects
- adding debug rendering support
- improving logs
- improving failure handling
- adding tests

Avoid:
- rewriting the complete app
- changing unrelated UI code
- introducing new libraries
- changing public APIs without necessity

---

## Definition of Done
The task is done when:

- the OpenCV pipeline is split into explicit typed stages
- the pipeline can be debugged visually through intermediate outputs
- runtime failures are explicit and typed
- the bug location becomes diagnosable
- the valid fixture from `src/__tests__/fixtures/` can produce a scanned output
- the invalid fixture from `src/__tests__/fixtures/` fails gracefully because contour detection is not sufficiently reliable
- the raw captured photo remains visible when scanning fails
- automated tests cover success and failure scenarios
- no `any` is used
- OpenCV resources are cleaned up properly