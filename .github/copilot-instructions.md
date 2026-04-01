# AI Coding Agent Evaluation Instructions

## Project Goal
This repository is a **Next.js + React Progressive Web App (PWA)** for document scanning.

The application provides:
- camera preview with rear-camera preference on mobile
- fallback to front camera and laptop webcams
- document detection using **OpenCV.js**
- perspective correction
- black-and-white scan optimization
- PDF generation using **jsPDF**
- offline support via Service Worker
- future multi-page PDF workflows

The codebase is intentionally designed to evaluate how an AI coding agent handles:
- browser-only image processing
- client-side React architecture
- strict TypeScript
- testable modular image pipelines
- PWA-specific constraints
- controlled multi-file changes
- maintainable technical workflows

The main purpose is to observe how the agent:
- analyzes existing structures
- recognizes recurring patterns
- applies minimal and consistent changes
- adds appropriate tests
- coordinates changes across multiple files
- performs controlled refactorings
- handles ambiguity and incomplete requirements

---

## Core Technical Principles
The agent must preserve the following project principles:

- **browser-only processing**
  - no server-side image processing
  - no API routes for scan logic
  - OpenCV processing must stay inside client components, hooks, or dedicated browser services

- **strict TypeScript**
  - `any` is forbidden
  - explicit return types required
  - all nullable values must be handled explicitly
  - all error objects must use typed models

- **React-first architecture**
  - UI state must remain in React hooks/components
  - OpenCV logic must be isolated in dedicated services or hooks
  - DOM manipulation outside React refs must be avoided

- **PWA-first architecture**
  - all critical assets must support offline usage
  - self-hosted static assets belong in `public/`
  - Service Worker changes must remain minimal and cache-safe
  - changes must not break installability

- **memory-safe OpenCV usage**
  - every created `cv.Mat`, `cv.MatVector`, or temporary object must be deleted
  - cleanup must happen in success and failure paths

---

## Expected Project Structure
The agent must prefer the existing modular structure.

Typical folders include:

- `app/`
- `src/camera/`
- `src/scan/`
- `src/pdf/`
- `src/storage/`
- `src/hooks/`
- `src/types/`
- `public/vendor/`
- `public/icons/`

Do not flatten architecture.

New files are allowed only when they improve separation of concerns.

Preferred file types:

- hooks → reusable browser logic
- services → OpenCV and PDF pipelines
- types → shared typed result/error contracts
- components → pure UI composition

---

## Agent Workflow
Before implementing any change, the agent must:
1. identify relevant files
2. analyze existing code patterns
3. choose the minimal required scope of change
4. protect new logic with tests
5. avoid unrelated modifications
6. verify client-side compatibility
7. verify offline compatibility for static assets

For scan-related features, the workflow must always follow:

**Capture → Detect → Warp → Threshold → Render → Cleanup**

---

## Implementation Expectations
- all changes must stay small and review-friendly
- existing public APIs must only change when necessary
- create new files only if they provide clear value
- strictly respect the existing project structure
- reuse established naming conventions
- prefer existing architectural patterns over introducing new ones
- optimize for portrait A4 scan workflows
- preserve rear-camera preference logic
- maintain fallback support for front camera and laptop webcams
- keep preview and final scan in portrait orientation
- prefer deterministic image processing over heuristic-heavy solutions

---

## OpenCV-Specific Rules
For all scan logic, the agent must prefer this pipeline:

1. capture current canvas frame
2. grayscale conversion
3. gaussian blur
4. canny edge detection
5. contour detection
6. quadrilateral selection
7. perspective transform
8. portrait normalization
9. adaptive threshold
10. render to output canvas
11. explicit memory cleanup

Failure paths must always be implemented for:

- OpenCV not initialized
- canvas unavailable
- null frame capture
- no contour found
- invalid contour points
- warp failure
- threshold failure
- output canvas unavailable
- unexpected runtime exception

Never assume OpenCV processing succeeds.

---

## Camera Rules
The agent must preserve the camera priority logic:

1. prefer rear camera on mobile
2. fallback to front camera
3. fallback must also work on laptops
4. preview must remain portrait-oriented
5. A4 portrait scanning is the primary use case

Camera constraints must remain explicit and typed.

---

## PDF Rules
PDF generation must:
- use **jsPDF**
- preserve page order
- default to **A4 portrait**
- avoid lossy quality reductions unless configurable
- support future multi-page extension

Do not mix PDF generation logic into UI components.

---

## Tailwind & UI Rules
The UI uses **Tailwind CSS v4 theme tokens**.

The agent must:
- reuse semantic color tokens
- preserve scanner brand colors
- use existing `brand`, `accent`, and `error` tokens
- keep accessible contrast ratios
- avoid inline styles unless technically required for canvas sizing
- preserve mobile-first portrait layouts

---

## Testing Strategy
For every new business or technical logic:
- add unit tests
- include edge cases
- explicitly test failure scenarios
- modify existing tests only where behavior changes
- avoid unnecessary snapshot tests

For scan logic specifically, test:
- successful contour detection
- no-document fallback
- invalid corner ordering
- null processing results
- typed runtime errors
- camera fallback behavior
- PDF page ordering

Mock OpenCV behavior where browser execution is not available.

---

## Evaluation Focus
For every task, optimize for:
- readability
- low complexity
- stability
- reusability
- maintainability
- good review granularity
- browser performance
- memory safety
- offline reliability

---

## What Must Be Avoided
- large refactorings outside the actual task
- introducing new libraries without explicit need
- changing public APIs without reason
- unnecessary comments
- magic numbers
- implicit side effects
- logic that is hard to test
- overly clever but unreadable solutions
- leaking OpenCV matrices
- hidden null assumptions
- direct DOM querying instead of refs
- server-side scan processing
- breaking PWA caching behavior

---

## Behavior Under Uncertainty
If requirements are ambiguous:
- prefer conservative changes
- prioritize existing patterns over new ideas
- keep the implementation extensible
- avoid breaking changes
- preserve the existing scan pipeline
- preserve offline compatibility

If OpenCV behavior is uncertain:
- prefer explicit typed failure results
- fail gracefully
- preserve the original captured frame

---

## Learning Objective
The purpose is not only correct code, but a traceable agentic workflow:

**Analyze → Plan → Minimal Change → Test → Review**

For this project additionally optimize for:

**Capture → Scan → PDF → Offline → Maintainability**