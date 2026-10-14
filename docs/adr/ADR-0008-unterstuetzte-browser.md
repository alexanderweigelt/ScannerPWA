---
status: proposed
date: 2026-10-14
decision-makers: Alex (Annahme ausstehend)
consulted: –
informed: –
---

# ADR-0008 – Unterstützte Browser und Laufzeiten

## Context and Problem Statement

Primär nutzen Personen Smartphones mit Android oder iOS, sekundär Laptops mit
Webcam (Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt
„Zielgruppe und Nutzungsszenario“). Für welche Browser und für welche
Node-Version der Entwicklung gilt die App als unterstützt?

## Decision Drivers

* Benötigte APIs: `getUserMedia`, Module-Worker, Service Worker, Web App Manifest, `createImageBitmap`, `Blob`/Download.
* iOS erlaubt nur WebKit; Safari bestimmt die Untergrenze.
* Entwicklungs-Laufzeit mit Langzeitunterstützung und passend zu Vite/Vitest.

## Considered Options

* Aktuelle und vorige Hauptversion der Browser; Safari/iOS ab 17; Node 24 LTS
* Nur aktuelle Browser-Hauptversion; Node 26 (Current)
* Breite Unterstützung älterer Browser mit Polyfills

## Decision Outcome

Chosen option: "Aktuelle und vorige Hauptversion; Safari/iOS ab 17; Node 24 LTS",
because das die Zielgeräte abdeckt, ohne Polyfills für Worker-Module oder
Kamerazugriff, und Node 24 die aktive LTS-Linie ist (nodejs.org/dist,
14.10.2026: v24.22.0 „Krypton“, LTS; v26 ist noch Current). `engines` in
`package.json` und `.nvmrc` nennen `24`.

| Plattform | Browser | Prüfung |
| --- | --- | --- |
| Android | Chrome (aktuell, vorig) | Playwright Chromium mit Smartphone-Profil; echtes Gerät manuell |
| iOS/iPadOS ≥ 17 | Safari | Playwright WebKit mit iPhone-Profil (ohne Kamera); echtes Gerät manuell |
| Desktop | Chrome, Edge, Firefox, Safari (aktuell, vorig) | Playwright Chromium, Firefox, WebKit; Webcam manuell |

### Consequences

* Good, because keine Polyfills, kleineres Bundle.
* Bad, because ältere iPhones ohne iOS 17 sind ausgeschlossen.

### Confirmation

Playwright-Projekte für die drei Engines in CI; manuelle Geräteprüfung vor
Release (Verantwortung Maintainer).
