# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A **mobile-first Progressive Web App** for client-side document scanning. All processing runs entirely in the browser — no backend, no server-side image handling. Built with Next.js (App Router) configured for **static export** (`output: "export"`).

Stack: Next.js 16, React 19, TypeScript, Tailwind CSS 4, OpenCV.js (self-hosted), jsPDF, Jest, Playwright.

Package manager: **pnpm**.

## Commands

```bash
pnpm dev              # Start dev server at http://localhost:3000
pnpm build            # Static export build
pnpm lint             # ESLint
pnpm test             # Jest unit/integration tests
pnpm test:watch       # Jest in watch mode
pnpm test:coverage    # Jest with coverage
pnpm test:e2e         # Playwright E2E (auto-starts dev server)
pnpm test:e2e:ui      # Playwright with UI runner
npx tsc --noEmit      # Type check only
```

Run a single Jest test file:
```bash
pnpm test -- src/__tests__/CameraPreview.test.tsx
```

Run a single Playwright test:
```bash
pnpm test:e2e -- tests/e2e/main-workflow.spec.ts
```

## Validation Order

After every code change, run in this order:
```bash
npx tsc --noEmit
pnpm run lint
pnpm run build
pnpm run test:coverage
pnpm run test:e2e
```

## Coding Rules

- **Documentation**: Use JSDoc (https://jsdoc.app/) for all functions, methods, and classes.
- **Notations**: Use `// some note` for inline notations.
- For future updates, provide minimal JSDoc for new/modified functions and methods.

## Architecture

### Source Layout

```
app/                  # Next.js App Router pages
  page.tsx            # Renders <App> component
  layout.tsx          # Registers ServiceWorker, sets metadata
src/
  App.tsx             # Loads OpenCV.js via <Script>, renders <CameraPreview>
  camera/             # Camera device lifecycle only
    useCamera.ts      # getUserMedia hook — stream, start/stop, captureFrame
    CameraPreview.tsx # Camera UI: video→canvas live loop, capture button
  scan/               # OpenCV document scan pipeline — isolated from UI
  pdf/                # jsPDF export — isolated from scan/camera
  components/         # Shared UI (ServiceWorkerRegister)
  types/
    opencv.ts         # Full TypeScript types + getOpenCV() / requireOpenCV() helpers
  __tests__/          # Jest tests
    fixtures/         # Image fixtures for scan pipeline tests
    helpers/          # Shared test utilities
tests/
  e2e/               # Playwright E2E tests
public/
  vendor/opencv.js   # Self-hosted OpenCV — do NOT load from CDN
  manifest.webmanifest
```

### Key Architectural Constraints

- **OpenCV is loaded as a `<script>` tag** in `App.tsx` from `/vendor/opencv.js`. It attaches to `window.cv`. Access it via `getOpenCV()` / `requireOpenCV()` from `src/types/opencv.ts`. Never assume it is ready — guard with `isOpenCVAvailable()`.
- **Every `cv.Mat`, `cv.MatVector`, and contour temporary must be explicitly `.delete()`-ed** — OpenCV.js uses Emscripten memory. Use `try/finally`. Memory leaks are critical defects.
- **`src/scan/` is independent**: no camera lifecycle, no UI state, no PDF logic. It receives a canvas and returns a typed result.
- **`src/pdf/` is independent**: no scan or camera logic.
- **`src/camera/` is independent**: no scan or PDF logic.
- **No `any`**: TypeScript strict mode. Use types from `src/types/opencv.ts`.
- **Static export**: no Next.js API routes, no SSR. `next.config.ts` sets `output: "export"`.
- `NEXT_PUBLIC_BASE_PATH` env var controls the base path for deployments.

### Scan Pipeline

The full pipeline order (Capture → Detect → Warp → Threshold → Render → Cleanup):

1. Read canvas → grayscale → Gaussian blur → Canny edge detection
2. Find contours → filter candidates by area → approximate polygon → select largest quadrilateral
3. Extract 4 corner points → order them (TL, TR, BR, BL)
4. Compute warp target size → `warpPerspective`
5. Normalize to portrait orientation
6. Apply adaptive threshold (scan look)
7. Render to output canvas → cleanup all `cv.Mat` objects

Scan results use **typed result models** (success / recoverable failure / fatal failure), each failure with a typed reason string. Do not silently return `null`.

### Testing Approach

- **Unit tests** (`src/__tests__/`): Jest + jsdom + `jest-canvas-mock`. Target contour filtering, corner ordering, warp size calculation, typed error mapping.
- **Integration tests**: Full scan pipeline with real image fixtures from `src/__tests__/fixtures/`. Maintain at least one valid-document fixture (should succeed) and one invalid fixture (must fail — do not weaken this assertion).
- **E2E tests** (`tests/e2e/`): Playwright on Chromium + Pixel 7 (mobile-chrome). For UI flow only — not as proof of scan correctness.

### PWA / Camera Notes

- Camera requires HTTPS (except localhost). Uses `getUserMedia({ video: { facingMode: 'environment' } })` with fallback to front camera.
- Live preview renders video → hidden `<video>` → `<canvas>` via `requestAnimationFrame` loop.
- Service Worker registered via `<ServiceWorkerRegister>` in layout.
- `basePath` must be set correctly for the Service Worker scope.