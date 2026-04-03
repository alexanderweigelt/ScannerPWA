---
applyTo: "app/**/*.ts,app/**/*.tsx,src/**/*.ts,src/**/*.tsx"
---

# Architecture Instructions

- Preserve the existing modular architecture.
- Do not flatten the structure.
- Prefer hooks for reusable browser logic.
- Prefer services for OpenCV and PDF workflows.
- Prefer shared typed result and error models in `src/types/`.

## Browser-only scan processing
- All image processing must run in the browser.
- Do not introduce server-side image processing.
- Do not create API routes for OpenCV scan pipelines.

## OpenCV rules
- Use the standard scan pipeline:
  capture -> grayscale -> blur -> canny -> contour detection -> quadrilateral selection -> perspective warp -> portrait normalization -> adaptive threshold -> render -> cleanup
- Always handle failure paths explicitly.
- Always delete created OpenCV objects in success and failure paths.

## Camera rules
- Preserve rear-camera preference on mobile.
- Keep fallback support for front camera and laptop webcams.
- Keep portrait-oriented preview and scan output.
- A4 portrait is the default scanning target.

## PDF rules
- Use jsPDF.
- Keep A4 portrait as the default export format.
- Keep PDF generation outside UI components.

## PWA rules
- Keep critical static assets compatible with offline use.
- Keep service worker changes minimal and cache-safe.