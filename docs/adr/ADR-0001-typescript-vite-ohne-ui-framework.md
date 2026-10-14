---
status: accepted
date: 2026-10-14
decision-makers: Alex (Auswahl am 14.10.2026 17:19:46Z)
consulted: –
informed: –
---

# ADR-0001 – TypeScript und Vite ohne UI-Framework

## Context and Problem Statement

Die App ist eine einzelne statische Seite mit fünf Ansichten
([FR-015](../requirements/FR-015-clear-states.md)), einem Web Worker und einem
Service Worker. Sie muss unter `/ScannerPWA/` laufen
([FR-014](../requirements/FR-014-subpath-hosting.md)) und darf zur Laufzeit
nichts von Fremdservern laden ([FR-011](../requirements/FR-011-on-device-only.md)).
Welche Sprache, welches Build-Werkzeug und welche UI-Schicht reichen aus?

## Decision Drivers

* Einfachster ausreichender Stack (P04, COMMON CONTRACT).
* Alex programmiert hauptsächlich TypeScript.
* Kleine, selbst ausgelieferte Bundles für schnellen Offline-Cache.
* Strenge Typprüfung als Gate; Worker-Bündelung und Basispfad ohne Eigenbau.
* Möglichst wenige Laufzeitabhängigkeiten (Lieferkette, P05).

## Considered Options

* TypeScript strict + Vite, DOM-APIs direkt, kein UI-Framework
* TypeScript strict + Vite + kleines UI-Framework (z. B. Preact oder Lit)
* JavaScript ohne Build mit JSDoc und `checkJs`

## Decision Outcome

Chosen option: "TypeScript strict + Vite, DOM-APIs direkt, kein UI-Framework",
because fünf Ansichten mit einer expliziten Zustandsmaschine kein
Komponenten-Framework rechtfertigen, Vite Basispfad (`base: '/ScannerPWA/'`),
Module-Worker und gehashte Dateinamen ohne Zusatzwerkzeug liefert und
TypeScript die bevorzugte Sprache ist.

Festgelegte Versionen (npm-Registry, abgefragt 14.10.2026): `vite` 8.3.x,
`typescript` 6.0.x. TypeScript 7.0 ist erschienen, wird aber von
`typescript-eslint` 8.71 noch nicht unterstützt (Peer-Bereich `>=4.8.4 <6.1.0`);
Wechsel auf 7.x erst, wenn das Lint-Werkzeug ihn unterstützt.

### Consequences

* Good, because keine Laufzeitabhängigkeit für die Oberfläche; das Bundle enthält nur eigenen Code.
* Good, because `tsc --noEmit` mit `strict` prüft UI, Worker und Service Worker gleichermaßen.
* Bad, because Ansichtswechsel, Fokusführung und Ereignisbindung werden selbst geschrieben; Regeln dafür stehen in ARCHITECTURE.md, Abschnitt 10.
* Bad, because TypeScript bleibt bis zur Unterstützung durch `typescript-eslint` auf 6.0 festgelegt.

### Confirmation

`package.json` enthält keine UI-Framework-Abhängigkeit unter `dependencies`;
`npm run typecheck` und `npm run build` laufen in CI (Einrichtung P10).

## Pros and Cons of the Options

### TypeScript strict + Vite + kleines UI-Framework

* Good, because deklarative Ansichten und bekannte Muster.
* Neutral, because Preact/Lit sind klein (wenige kB).
* Bad, because zusätzliche Laufzeitabhängigkeit und Framework-Regeln für fünf Ansichten.

### JavaScript ohne Build mit JSDoc und `checkJs`

* Good, because kein Build-Schritt, Dateien direkt auslieferbar.
* Bad, because Precache-Liste, Cache-Busting und Worker-Module müssten selbst gebaut werden.
* Bad, because JSDoc-Typen sind für die Bildverarbeitung (Typed Arrays, Matrizen) umständlicher als TypeScript.

## More Information

Vite: Basispfad und statische Auslieferung, <https://vite.dev/guide/static-deploy>;
TypeScript-Optionen, <https://www.typescriptlang.org/tsconfig/> (beide nicht
abgerufen, da aus dieser Umgebung gesperrt; Versionen per npm-Registry geprüft).
