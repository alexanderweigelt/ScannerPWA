# AGENTS.md — `src/pdf/` Guide

This directory contains the **PDF generation and export workflow** for the Scanner PWA.

Its responsibility is to transform one or multiple processed document scans into a **downloadable A4 portrait PDF** using **jsPDF**, while preserving page order, image quality, and future extensibility.

This file provides rules for coding agents working on PDF-related logic.

---

## Purpose of `src/pdf/`
The PDF module is responsible for:

- generating single-page PDFs
- generating multi-page PDFs
- preserving page order
- converting processed scans into PDF-compatible image data
- exporting PDFs as Blob or downloadable file
- supporting future PDF metadata enhancements
- preserving client-side only export behavior

This module must remain independent from:
- camera device lifecycle logic
- OpenCV scan logic
- Service Worker caching logic
- high-level UI view navigation
- camera permission workflows

---

## Core PDF Workflow
Always preserve compatibility with this workflow:

**Processed Scan → Normalize Page → Add PDF Page → Export Blob → Trigger Download**

Future compatibility must remain possible for:

**Processed Scan → Add Page → Reorder → Delete → Export Multi-page PDF**

Do not introduce architectural decisions that block future multi-page workflows.

---

## Library Rule
Use only:

- `jsPDF`

Do not:
- replace jsPDF without explicit requirement
- introduce server-side PDF generation
- move PDF creation into API routes
- mix PDF generation into React UI components

PDF generation must remain **100% client-side**.

---

## A4 Portrait Rule
The default PDF output must always be:

- A4
- portrait
- readable
- print-friendly

Preserve the standard A4 aspect ratio:

**210 × 297**

Always ensure:
- height > width
- no accidental landscape output
- scan content remains upright
- portrait orientation is preserved from scan output

This rule must remain compatible with:
- single-page export
- multi-page export
- future print workflows

---

## Input Rules
The PDF module must accept typed processed scan input from:

- canvas output
- image data URL
- Blob
- typed page arrays
- future persisted page state

Do not tightly couple PDF generation to:
- camera preview components
- scan pipeline internals
- view-state logic

The module should accept **clean typed page input**.

---

## Multi-page Future Compatibility
Every PDF change must preserve support for:

- page arrays
- page insertion
- page deletion
- page reordering
- repeated exports
- future draft persistence
- future page thumbnail workflows

The future target workflow is:

**Capture → Process → Add Page → Repeat → Export PDF**

Do not assume there is only one page.

---

## Page Ordering Rule
Page order is a core product behavior.

The PDF module must:
- preserve array order exactly
- never reorder pages implicitly
- keep deletions deterministic
- support future drag-and-drop ordering logic

Generated PDF order must always reflect UI page state order.

Breaking page order is considered a critical defect.

---

## Image Quality Rules
PDF export should preserve:
- readable text
- sharp contours
- document borders when useful
- high contrast scan quality

Avoid:
- aggressive compression
- accidental scaling artifacts
- low-resolution exports
- clipping document edges

Downscaling must only happen when:
- explicitly configurable
- needed for performance
- does not visibly reduce readability

---

## Blob & Download Rules
The PDF module should expose:
- Blob generation
- file download trigger helpers
- typed file naming support

Future compatibility should remain possible for:
- local storage
- IndexedDB persistence
- share sheet APIs
- direct upload integrations
- filesystem save APIs

Do not hardcode UI-only download logic into low-level PDF services.

---

## Typed Result Model
All PDF logic must use typed results.

Use explicit result models such as:
- success
- recoverable failure
- fatal failure

Preferred typed reasons:
- `pdf_creation_failed`
- `invalid_page_input`
- `empty_page_array`
- `blob_generation_failed`
- `download_trigger_failed`
- `unexpected_runtime_error`

Do not:
- use `any`
- silently return `null`
- swallow Blob creation failures
- hide invalid page states

---

## Suggested File Structure
Prefer modular files such as:

- `createPdf.ts`
- `createMultiPagePdf.ts`
- `pdfDownload.ts`
- `pdf.types.ts`
- `pdf.constants.ts`

Keep:
- page normalization
- page sizing
- page ordering
- Blob creation
- download helpers
- typed result mapping

cleanly separated.

Do not move PDF logic into scan services or UI components.

---

## Testing Rules

### Unit tests
Prefer unit tests for:
- A4 page sizing
- page order preservation
- multi-page sequencing
- typed failure mapping
- file naming helpers
- page normalization helpers

### Integration tests
Prefer integration tests for:
- single-page PDF export
- multi-page export
- page deletion preserving order
- repeated export behavior
- Blob creation
- download trigger flow

### E2E tests
Use Playwright for:
- export button flow
- download trigger verification
- multi-page happy path
- regression of single-page export
- offline shell compatibility with export UI

Do not parse full PDF internals in E2E unless explicitly needed.

---

## Future PWA Compatibility
PDF export must remain compatible with:

- offline shell usage
- service worker cached app shell
- export after reconnect
- export from restored page arrays
- future persisted drafts

Do not introduce export dependencies that require online connectivity.

---

## What Must Be Avoided
Do not:
- introduce another PDF library
- generate PDFs server-side
- break multi-page compatibility
- reorder pages implicitly
- downscale scans aggressively
- mix PDF logic into React UI
- mix camera logic into PDF services
- use `any`
- silently ignore empty page arrays
- break offline compatibility

---

## Validation After PDF Changes
After changing PDF-related code, run:

npx tsc --noEmit
npm run build
npm run test:coverage
npm run test:e2e

If any command cannot be run:
- explicitly say which one
- explain why
- mention remaining manual PDF validation

For PDF-specific changes, also report:
- page order verified
- multi-page compatibility verified
- offline export assumptions preserved

---

## Agent Response Expectations
Before implementation, briefly state:
- affected PDF files
- whether page order logic changes
- whether multi-page behavior changes
- tests to add or update

After implementation, briefly state:
- changed PDF files
- page order behavior verified
- tests added or updated
- validation commands executed
- commands not executed
- remaining manual export checks