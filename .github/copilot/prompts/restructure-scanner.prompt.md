# Refactoring Task — Restructure Scanner App UI and Camera Flow

Refactor the application to improve **debuggability, separation of concerns, and maintainability**.

The current implementation mixes:
- UI rendering
- view switching
- camera handling
- scan result rendering
- future OpenCV responsibilities

This makes the app error-prone and difficult to debug.

The goal of this refactoring is **pure structural cleanup**.

---

## Main Refactoring Goal
Separate the application into **clear UI components and isolated camera logic**.

This task is **NOT about implementing document scan logic**.

The existing scan pipeline must be reduced to **typed placeholder wrapper functions only**, so future implementation can be added safely.

---

# Target Architecture

## App Component
The root App component must become a **lightweight orchestration wrapper**.

Responsibilities:
- own the global UI state
- dispatch active views
- orchestrate camera state transitions
- pass typed callbacks into child components
- no direct rendering logic for scan result internals
- no camera DOM logic
- no OpenCV imports

The App component acts as a **view dispatcher only**.

---

## UI Components

## 1. Start View
A dedicated start screen UI component.

Responsibilities:
- show app entry UI
- render button **"Start Camera"**
- no camera logic inside component
- callback-driven only

Suggested location:
`src/App.tsx`

---

## 2. CameraPreview
The `CameraPreview` component must only contain:

- the live video/canvas preview
- button **"Capture Scan"**
- button **"Stop Camera"**

Responsibilities:
- render active camera preview
- allow capture callback
- allow stop callback
- no scan result rendering
- no document image rendering
- no OpenCV logic
- no result state logic

Suggested location:
`src/camera/`

---

## 3. ScanResultPreview
The captured document image preview must be moved into its own UI component.

Suggested location:
`src/scan/`

Responsibilities:
- display captured document image only
- button **"Accept Scan"**
- button **"Scan Again"**
- no camera start/stop logic
- no OpenCV logic
- no future scan processing logic
- callback-driven only

The **"Accept Scan" button must be enabled but intentionally do nothing**.

It is a UI placeholder for future workflow expansion.

---

# Scan Logic Refactoring
The current `scanIntoCanvas` implementation must be **rolled back completely**.

Replace all active scan-processing logic with **empty typed wrapper functions**.

Example responsibilities:
- preserve function signatures if already used
- return typed placeholder result objects
- no canvas processing
- no image mutation
- no thresholding
- no contour logic

The wrappers exist only to preserve future extensibility.

Suggested location:
`src/scan/`

---

# Required Functional Flow After Refactoring

The refactored app must support exactly this user flow:

1. user clicks **"Start Camera"**
2. camera starts and live preview is shown
3. user positions the document in focus
4. user clicks **"Capture Scan"**
5. app freezes the current frame and shows **only the captured document photo**
6. button **"Accept Scan"** is visible, enabled, and intentionally has no behavior
7. user may click **"Scan Again"**
8. camera preview becomes active again
9. user may click **"Stop Camera"** at any time while camera is active
10. app returns to the start screen

Important:
- **Stop Camera must remain available whenever camera preview is active**
- no OpenCV processing may happen
- no scan enhancement may happen
- captured image is the raw camera frame only

---

# Explicit Non-Goals
The following must NOT be part of this refactoring:

- OpenCV
- image enhancement
- thresholding
- contour detection
- PDF generation
- service worker changes
- multi-page support
- UI redesign
- new libraries
- unrelated camera optimizations

This task is only about:
**structure + UI separation + stable camera flow**

---

# State Management Expectations
Introduce or preserve a **clear typed view state**.

Recommended states:
- `idle`
- `camera-active`
- `scan-preview`

The state transitions must be explicit and easy to debug.

Prefer a reducer or clearly typed state machine approach if it improves readability.

Avoid implicit boolean combinations.

---

# TypeScript Requirements
- strict TypeScript
- `any` forbidden
- explicit props types for every component
- typed callback signatures
- typed view state
- typed placeholder scan service return types
- explicit nullable handling for refs and media streams

---

# Testing Requirements
The described user flow must be fully protected by **automated tests**.

## Unit / Integration
Test:
- start screen renders correctly
- clicking Start Camera switches to camera preview
- Capture Scan switches to scan preview
- raw captured image is rendered
- Accept Scan button is enabled
- Scan Again returns to camera preview
- Stop Camera returns to start screen
- stop camera is always available in active camera state
- no OpenCV service is called
- placeholder scan wrapper functions return typed placeholders

## E2E
Cover the main happy path:
Start → Camera → Capture → Preview → Scan Again → Stop → Start screen

Use mocked `getUserMedia`.

---

# Review Constraints
- keep changes small and review-friendly
- prefer moving existing logic over rewriting everything
- preserve naming conventions where possible
- avoid unrelated cleanup
- no broad refactoring outside this scope
- preserve future scan extensibility

---

# Definition of Done
The task is done when:

- App component is only orchestration + view dispatch
- CameraPreview contains only camera preview controls
- Scan result preview is isolated into `src/scan/*`
- scan processing is reduced to typed wrappers
- no active OpenCV logic remains
- full user flow works
- automated tests cover the workflow
- code is easier to debug due to explicit state transitions