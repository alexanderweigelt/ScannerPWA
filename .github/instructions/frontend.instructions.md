---
applyTo: "app/**/*,src/**/*.ts,src/**/*.tsx"
---
# Frontend architecture instructions

Follow these project-specific architecture rules:

- The app uses Next.js App Router and React Client Components for scan-related workflows.
- Use `'use client'` for browser-only scan features that depend on camera, canvas, or OpenCV.js.
- Do not implement server-side image processing.
- Do not add API routes for the scan pipeline.
- Keep the document scan pipeline canvas-based:
  - input canvas for captured frame
  - optional debug canvases
  - output canvas for final scan
- Do not introduce `<img>` into the processing pipeline unless strictly needed for export.
- Use this scan pipeline unless the task explicitly says otherwise:
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
- Always optimize for A4 portrait.
- Preserve camera priority:
  1. rear camera on mobile
  2. front camera fallback
  3. laptop webcam fallback
- Keep all result and error models typed.
- Never use `any`.
- Never silently ignore null, empty matrices, or runtime failures.
- Avoid direct DOM querying when refs can be used.
- Do not load OpenCV from a CDN.
- Keep `public/vendor/opencv.js` as the self-hosted source.
- Reuse Tailwind v4 semantic tokens. Avoid hardcoded hex values in components unless extending the central theme.