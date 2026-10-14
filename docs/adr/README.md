# Architekturentscheidungen (ADR)

Entscheidungen nach [MADR 4.0.0](https://github.com/adr/madr/blob/4.0.0/template/adr-template.md).
Die Überschriften folgen der Vorlage (englisch), der Inhalt ist deutsch.
Der Überblick und die Diagramme stehen in [ARCHITECTURE.md](../../ARCHITECTURE.md).

**Status:** `proposed` bedeutet vom Agenten in P04 vorgeschlagen und noch nicht
von Alex angenommen. `accepted` steht nur mit einer menschlichen Entscheidung,
die in [docs/clarifications.md](../clarifications.md) belegt ist.
Extern vorgegebene Rahmenbedingungen (statische GitHub Page, kein Server,
Bilder bleiben auf dem Gerät) sind keine ADRs; sie stehen in
[ARCHITECTURE.md, Abschnitt 2](../../ARCHITECTURE.md#2-randbedingungen).

| ADR | Titel | Status |
| --- | --- | --- |
| [ADR-0001](ADR-0001-typescript-vite-ohne-ui-framework.md) | TypeScript und Vite ohne UI-Framework | accepted |
| [ADR-0002](ADR-0002-eigene-bildverarbeitung-im-worker.md) | Eigene Bildverarbeitung im Web Worker, OpenCV.js als Plan B | accepted |
| [ADR-0003](ADR-0003-eigener-pdf-writer.md) | Eigener minimaler PDF-Writer | accepted |
| [ADR-0004](ADR-0004-eigener-service-worker.md) | Eigener Service Worker mit Precache-Liste aus dem Build | accepted |
| [ADR-0005](ADR-0005-pages-deployment-und-csp-meta.md) | Deployment per Pages-Workflow und CSP als Meta-Element | accepted |
| [ADR-0006](ADR-0006-testwerkzeuge.md) | Vitest, Playwright und axe-core als Testwerkzeuge | accepted |
| [ADR-0007](ADR-0007-diagnosemodus-per-url-parameter.md) | Diagnosemodus per URL-Parameter | proposed |
| [ADR-0008](ADR-0008-unterstuetzte-browser.md) | Unterstützte Browser und Laufzeiten | accepted |
