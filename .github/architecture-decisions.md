# Architecture Decisions (ADR-light)

This document captures the stable architectural decisions of the **Scanner PWA**.

The goal is to help human contributors and AI coding agents preserve the intended system design.

The format is intentionally lightweight:
- **Decision**
- **Reason**
- **Implication**

---

# ADR-001 — Next.js App Router + Client-Side Processing
## Decision
The application is built with **Next.js App Router** and **React Client Components** for all scan-related workflows.

All image processing runs **entirely in the browser**.

## Reason
Document scanning depends on:
- camera access
- canvas rendering
- OpenCV.js
- browser memory cleanup
- offline PWA support

These workflows are browser-native and should not involve server-side rendering or API routes.

## Implication
- scan logic belongs in client components, hooks, or browser services
- no server-side image processing
- no API routes for OpenCV pipelines
- all camera and canvas access must use React refs

---

# ADR-002 — Self-Hosted OpenCV.js in public/vendor
## Decision
The project uses a **self-hosted OpenCV.js build** located in:

`public/vendor/opencv.js`

The file is loaded through `next/script`.

## Reason
This guarantees:
- deterministic versioning
- offline caching through the Service Worker
- no CDN dependency
- predictable PWA behavior
- compatibility with browser-only runtime loading

## Implication
- OpenCV must not be loaded from external CDNs
- Service Worker must cache `/vendor/opencv.js`
- all OpenCV usage must wait for runtime initialization
- all temporary OpenCV objects must be explicitly deleted

---

# ADR-003 — Canvas-Only Scan Pipeline
## Decision
The document scan workflow is strictly **canvas-based**.

The system uses:
- input canvas for captured camera frame
- optional debug canvases
- output canvas for final processed scan

`<img>` elements are not used for the processing pipeline.

## Reason
Canvas-based processing aligns directly with:
- OpenCV.js `cv.imread(canvas)`
- OpenCV.js `cv.imshow(canvas)`
- efficient in-browser pixel workflows
- deterministic scan rendering
- easy debug visualization

## Implication
- processing functions accept canvas refs or canvas elements
- output must remain renderable to canvas
- DOM image conversions should be avoided unless required for PDF export

---

# ADR-004 — Standard Scan Pipeline
## Decision
All document scans must follow the standard OpenCV pipeline:

1. capture frame
2. grayscale
3. gaussian blur
4. canny edges
5. contour detection
6. quadrilateral selection
7. perspective warp
8. portrait normalization
9. adaptive threshold
10. render output
11. cleanup

## Reason
This pipeline is:
- deterministic
- testable
- reviewable
- suitable for document edge detection
- extensible for future scan improvements

## Implication
- avoid introducing alternative pipelines unless clearly justified
- preserve typed intermediate result models
- each stage should remain modular and testable

---

# ADR-005 — A4 Portrait is the Default Scan Format
## Decision
The scanner is optimized for **A4 portrait documents**.

Preview, scan result, and PDF export must default to **portrait orientation**.

## Reason
The primary use case is scanning standard office documents.

This ensures:
- consistent UX
- predictable warp normalization
- clean PDF export defaults
- easier mobile handling

## Implication
- normalize warped scans to portrait
- prefer height > width outputs
- jsPDF defaults to portrait A4
- UI layouts prioritize portrait device orientation

---

# ADR-006 — Camera Priority Strategy
## Decision
Camera initialization must follow this order:

1. rear camera on mobile
2. front camera fallback
3. laptop webcam fallback

## Reason
Rear cameras provide:
- better autofocus
- higher resolution
- better document scanning ergonomics

Fallback support ensures broad compatibility.

## Implication
- use explicit facingMode constraints
- fallback logic must remain typed
- fallback failures must produce user-visible errors
- portrait rendering must survive fallback paths

---

# ADR-007 — Typed Result and Error Models
## Decision
All scan and camera workflows use **typed result models**.

Examples:
- success result
- recoverable error
- fatal processing error

`any` is forbidden.

## Reason
The scan pipeline can fail at many runtime points:
- null canvas refs
- OpenCV not initialized
- no contour
- invalid warp
- threshold failure
- camera rejection

Typed models make failures testable and safe.

## Implication
- all public processing functions require explicit return types
- null must always be handled
- UI must render typed error states
- avoid exception-only control flow

---

# ADR-008 — PWA-First Offline Strategy
## Decision
The app is designed as an **offline-capable Progressive Web App**.

Critical static assets are cached:
- app shell
- icons
- manifest
- OpenCV.js
- scanner UI assets

## Reason
Scanning must remain usable without network access after the first load.

## Implication
- Service Worker changes must remain cache-safe
- static assets belong in `public/`
- avoid dynamic runtime dependencies for scan logic
- keep installability intact

---

# ADR-009 — Modular PDF Export via jsPDF
## Decision
PDF generation is isolated in dedicated PDF services.

The default export format is:
- A4
- portrait
- future-ready for multi-page

## Reason
PDF generation is a separate concern from scanning and UI rendering.

This improves:
- maintainability
- testability
- future multi-page support

## Implication
- PDF code must not live inside UI components
- scan output should remain exportable as canvas/image data
- preserve page ordering contracts

---

# ADR-010 — Tailwind v4 Semantic Design Tokens
## Decision
The UI uses **Tailwind CSS v4 semantic theme tokens**.

Main groups:
- brand
- accent
- error
- semantic surface/text tokens

## Reason
The app uses a custom scanner-brand visual identity.

Semantic tokens improve:
- consistency
- accessibility
- easier UI scaling
- future theming

## Implication
- reuse semantic tokens
- avoid hardcoded hex values in components
- preserve portrait-first mobile layouts