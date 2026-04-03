# AGENTS.md — Scanner PWA Root Guide

This repository is a **Next.js + React Progressive Web App (PWA)** for client-side document scanning.

The product roadmap includes:

1. camera preview
2. image capture
3. document processing with OpenCV
4. PDF generation with jsPDF
5. offline shell support via Service Worker
6. multi-page document workflows
7. future export and storage extensions

All code changes must preserve these long-term product goals.

---

## Core Product Direction
The app is a **mobile-first document scanner** optimized for:

- A4 portrait documents
- rear camera usage on mobile devices
- fallback to front camera and laptop webcams
- fully client-side processing
- offline-ready application shell
- future multi-page PDF export
- minimal friction from capture to download

Preserve future extensibility for:
- multi-page capture
- page reordering
- page deletion
- export enhancements
- local persistence / offline recovery

---

## Core Technical Rules
- Use **browser-only processing**
- Never move scan logic to server-side code or API routes
- Keep OpenCV.js self-hosted in `public/vendor/opencv.js`
- Use canvas-based processing
- Use strict TypeScript (`any` forbidden)
- Use JSDoc (https://jsdoc.app/) for all documentation of functions, methods, and classes
- Use `// some note` for code notations
- Provide minimal JSDoc for new or modified functions/methods in future changes
- Always preserve rear-camera fallback logic
- Keep portrait A4 workflows as the default
- Keep PDF generation isolated in `src/pdf/`
- Keep scan processing isolated in `src/scan/`
- Keep camera logic isolated in `src/camera/`
- Preserve Service Worker cache safety
- Avoid breaking offline shell behavior
- Preserve future multi-page state support

---

## Current + Future Workflow
Always preserve compatibility with this evolving workflow:

**Start Camera → Capture → Process → Preview → Add Page → Export PDF**

Current issues and future tasks must remain compatible with:

- single-page capture
- multi-page page arrays
- page deletion
- page ordering
- single-page PDF
- multi-page PDF
- offline shell
- retry after scan failure

Do not introduce architectural decisions that block these workflows.

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

## Change Policy

For every task:
1.	analyze affected modules first
2.	keep changes minimal and review-friendly
3.	preserve existing public APIs unless required
4.	add/update tests
5.	preserve future multi-page compatibility
6.	preserve offline compatibility
7.	report validation results

Preferred workflow:

**Analyze → Minimal Change → Test → Validate → Report**