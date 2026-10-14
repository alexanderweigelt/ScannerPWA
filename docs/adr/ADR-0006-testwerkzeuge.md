---
status: accepted
date: 2026-10-14
decision-makers: Alex (Auswahl am 14.10.2026 17:22:11Z)
consulted: –
informed: –
---

# ADR-0006 – Vitest, Playwright und axe-core als Testwerkzeuge

## Context and Problem Statement

Das Zielbild verlangt automatisierte Referenzbild-Prüfungen, Ablauftests im
Desktop- und Smartphone-Format, Prüfung auf echten Geräten für die Kamera und
stabilen Speicher (Zielbild Scanner PWA (angenommen von Alex, 14.10.2026),
Abschnitt „Qualitätsziele“). DESIGN.md verlangt automatische
Zugänglichkeitsscans aller Ansichten und Teilzustände mit simulierter Kamera.
Welche Werkzeuge prüfen Unit-, Browser- und Zugänglichkeitsebene?

## Decision Drivers

* Reine Funktionen (Bildverarbeitung, PDF, Zustandsmaschine) schnell in Node testen.
* Echte Browser mit simulierter Kamera, Offline-Modus und Netzmitschnitt.
* Smartphone-Viewport und mehrere Engines.
* Ein Werkzeug je Ebene, alle per npm, Versionen im Lockfile.

## Considered Options

* Vitest (Unit) + Playwright Test (Browser) + `@axe-core/playwright` (Zugänglichkeit)
* Vitest im Browser-Modus für alles
* Jest + Cypress + cypress-axe

## Decision Outcome

Chosen option: "Vitest + Playwright Test + `@axe-core/playwright`", because
Vitest die Vite-Konfiguration teilt, Playwright Chromium, Firefox und WebKit
mit Geräteprofilen, Offline-Kontext und Netzmitschnitt steuert und Chromium
eine Kamera aus einer Videodatei simulieren kann
(`--use-fake-device-for-media-stream`, `--use-file-for-fake-video-capture`).

Versionen (npm-Registry, 14.10.2026): `vitest` 5.0.x, `@playwright/test`
1.64.x, `@axe-core/playwright` 4.13.x.

### Consequences

* Good, because Referenzbilder laufen als Unit-Test ohne Browser.
* Good, because FR-011-AC-1 (Netzmitschnitt) und FR-013-AC-1 (offline) sind im Browser-Test direkt prüfbar.
* Bad, because WebKit in Playwright hat keine simulierte Kamera; Kamera auf iOS bleibt manuelle Prüfung auf echtem Gerät.
* Bad, because ein Scan belegt keine volle WCAG-Konformität; manuelle Prüfungen bleiben (DESIGN.md).

### Confirmation

P10 richtet `npm run test:unit`, `npm run test:e2e` und den Scan ein und zeigt
an einem absichtlichen Fehler eine zurückweisende Prüfung.

## Pros and Cons of the Options

### Vitest im Browser-Modus für alles

* Good, because ein Werkzeug.
* Bad, because Offline-Kontext, Installierbarkeit und Ablauf über Ansichten hinweg sind Seiten-Tests, keine Komponenten-Tests.

### Jest + Cypress + cypress-axe

* Bad, because Jest braucht eigene Transformation neben Vite; Cypress ohne WebKit-Smartphone-Profil wie Playwright.

## More Information

Playwright, „Emulation“ und „BrowserType“, <https://playwright.dev/docs/emulation>
(aus dieser Umgebung nicht abrufbar). Simulierte Kamera in Chromium mit
Playwright: Beispiel <https://strich.io/blog/posts/automated-testing-of-barcode-scanning-apps-with-playwright/>
(Suchergebnis 14.10.2026, Sekundärquelle).
