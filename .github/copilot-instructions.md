# Repository-wide Copilot Instructions

## General
- Analyze existing code before changing anything.
- Prefer minimal, review-friendly changes.
- Reuse existing naming, structure, and architectural patterns.
- Do not introduce new libraries unless clearly necessary.
- Do not change public APIs unless required by the task.
- Avoid unrelated refactorings.

## Coding Rules
- Documentation: Use JSDoc (https://jsdoc.app/) for all functions, methods, and classes.
- Notations: Use `// some note` for inline notations.
- For future updates, provide minimal JSDoc for new/modified functions and methods.

## TypeScript and React
- Use strict TypeScript.
- Do not use `any`.
- Add explicit return types for public functions.
- Handle nullable values explicitly.
- Prefer React refs over direct DOM querying.

## Project architecture
- This project is a Next.js App Router + React PWA for document scanning.
- Keep scan logic browser-only.
- Do not move scan processing to server-side code or API routes.
- Keep OpenCV logic in client components, hooks, or browser services.
- Keep PDF generation separate from UI components.

## Validation after changes
After every non-trivial change, validate the repository with:
1. `npx tsc --noEmit`
2. `npm run build`
3. `npm run test:coverage`
4. `npm run test:e2e`

Only consider the task complete if these checks pass, or clearly report which command failed.