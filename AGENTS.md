# AGENTS.md – Scanner PWA

Arbeitsregeln und Prüfkommandos für Coding-Agents. Ziel: mobiler
Dokumentenscanner komplett im Browser, Foto → flache A4-Seite → PDF, Bilder
verlassen das Gerät nie. Statische GitHub Page unter `/ScannerPWA/`, PWA,
offline nach erstem Besuch, keine Serverkomponente, kein Upload, keine
Laufzeit-Ressourcen von Fremdservern (Zielbild Scanner PWA (angenommen von
Alex, 14.10.2026), Abschnitte „Kern“ und „Rahmenbedingungen“).

**Stand der Kommandos:** festgelegt, aber noch nicht eingerichtet (P10). Ein
Kommando, das nicht existiert oder nicht lief, gilt als *ausstehend*, nie als
bestanden. Ob eingerichtet, zeigt `package.json`; der Schrittstand steht im
[Klärungsjournal](docs/clarifications.md#stand).

## Was du je Aufgabe lädst

Lies nicht alles. Lade die FR der Aufgabe und nur die zuständigen Abschnitte:

| Thema | Zuständige Datei |
| --- | --- |
| Verhalten, Akzeptanzkriterien | `docs/requirements/FR-*.md` (Übersicht [REQUIREMENTS.md](REQUIREMENTS.md), Format [TEMPLATE.md](docs/requirements/TEMPLATE.md)) |
| Ansichten, Zustände, Texte, Tokens, Zugänglichkeit | [DESIGN.md](DESIGN.md) |
| Bausteine, Abläufe, Regeln, Kommandos | [ARCHITECTURE.md](ARCHITECTURE.md), Abschnitte 5–8 und [10](ARCHITECTURE.md#10-engineering-regeln-und-geplante-gates) |
| Technische Entscheidungen | [docs/adr](docs/adr/README.md) |
| Kontrollen, Bedrohungsmodell, Freigabe | [SECURITY.md](SECURITY.md) |
| Offene Fragen, Antworten, Befugnisse | [docs/clarifications.md](docs/clarifications.md) |

## Stackregeln

* TypeScript strict mit Vite, kein UI-Framework ([ADR-0001](docs/adr/ADR-0001-typescript-vite-ohne-ui-framework.md)); Compiler-Optionen und getrennte `lib` für Dokument, Worker, Service Worker laut [ARCHITECTURE.md 10.1](ARCHITECTURE.md#101-typescript). Kein `any`, kein `@ts-ignore`.
* Grenzen validieren: Worker-Nachrichten, `getSettings()` und Service-Worker-Ereignisse nur über je eine Prüffunktion mit Laufzeitprüfung; Grenzwerte in SECURITY.md SEC-10. URL-Parameter werden nicht ausgewertet ([10.3](ARCHITECTURE.md#103-eingaben-ausgabe-ursprung-transport)).
* Sichere Ausgabe: nur `textContent`/`createElement`; verbotene DOM-APIs und dynamische Codeausführung laut [10.2](ARCHITECTURE.md#102-lint-und-format). Keine Netz-APIs im Bildverarbeitungs-Worker, im Service Worker nur eigener Ursprung.
* CSP und Referrer-Policy als Meta-Element in `index.html`, Wert nur in [ADR-0005](docs/adr/ADR-0005-pages-deployment-und-csp-meta.md); kein Inline-Skript oder -Style im Build.
* Bildverarbeitung im Worker, eigener PDF-Writer, eigener Service Worker ([ADR-0002](docs/adr/ADR-0002-eigene-bildverarbeitung-im-worker.md) bis [ADR-0004](docs/adr/ADR-0004-eigener-service-worker.md)); Diagnose nur im Entwicklungs-Build ([ADR-0007](docs/adr/ADR-0007-diagnosemodus-nur-im-entwicklungs-build.md)).
* Abhängigkeiten ([10.5](ARCHITECTURE.md#105-abhängigkeiten-laufzeiten-build)): `dependencies` bleibt leer, jede Laufzeitabhängigkeit braucht eine ADR; nur genannte Build-Werkzeuge; exakte Versionen, `package-lock.json` eingecheckt, Installation nur mit `npm ci`; Node 24, Browser laut [ADR-0008](docs/adr/ADR-0008-unterstuetzte-browser.md).
* Keine Bild- oder PDF-Daten in `localStorage`, IndexedDB oder Cache Storage (SEC-12); Objekt-URLs und Canvas-Flächen nach Gebrauch freigeben (FR-017).
* Neue Technik, neue Werkzeuge oder Bibliotheken nicht selbst wählen: Alex entscheidet per Auswahl, danach ADR.

## Kommandos und Gates

Alle Kommandos aus dem Repository-Wurzelverzeichnis. Quelle der Ziele:
ENG-1 bis ENG-5 ([ARCHITECTURE.md 1](ARCHITECTURE.md#zielkette-wartbarkeit-und-reproduzierbarkeit)),
A11Y-1 bis A11Y-9 ([DESIGN.md](DESIGN.md#zielkette)), SEC-01 bis SEC-20 ([SECURITY.md 5/7](SECURITY.md#7-prüfplan-und-freigabe)).

| Ziel | Kommando | Wann | Blockiert bei | Beleg |
| --- | --- | --- | --- | --- |
| Spezifikation, IDs, Links (ENG-4) | `npm run check:spec` | jede Änderung | doppelte/unbekannte ID, toter Link, `ready`-AC ohne `test_refs` vor Release | CI-Log |
| Reproduzierbare Installation (ENG-3) | `npm ci` | CI, nach Lockfile-Änderung | Abweichung Lockfile | CI-Log |
| Typen (ENG-1) | `npm run typecheck` | Pre-Push, CI | ≥ 1 Typfehler | CI-Log |
| Lint, sichere Ausgabe (ENG-2, SEC-04) | `npm run lint` | Pre-Commit, CI | ≥ 1 Fehler oder Warnung | CI-Log |
| Format (ENG-2) | `npm run format:check` | CI | Abweichung | CI-Log |
| Unit- und Integrationstests mit FR/AC, inkl. Referenzbilder FR-006/007/008 (SEC-10–12, -15) | `npm run test:unit` | Pre-Push, CI | ≥ 1 Fehlschlag | Vitest-Bericht |
| Build und Build-Prüfung (ENG-3, FR-014, SEC-03/05/07/14/16) | `npm run build` und `npm run check:build` | CI vor Deployment | Inline-Skript, fremde URL, fehlendes CSP-/Referrer-Meta, Diagnose in `dist/` | CI-Log |
| Browser-Abläufe mit FR/AC (SEC-03/05/07/08/12/13/15/20) | `npm run test:e2e` | CI | ≥ 1 Fehlschlag | Playwright-Bericht |
| Zugänglichkeit, alle Ansichten und Teilzustände (A11Y-1/3/7/9) | `npm run test:a11y` | CI | ≥ 1 axe-Verstoß WCAG 2.2 A/AA | Playwright-Bericht |
| Speicher (FR-017) | `npm run test:memory` | CI | Kriterium FR-017-AC-1 verfehlt | CI-Log |
| Ausgelieferte Antwort (SEC-01/02/03/06) | `npm run test:deployed` | nach Deployment | `http://` ohne Umleitung, fehlendes HSTS/`nosniff`, falscher `Content-Type`, TLS ≤ 1.1, CSP-Meta fehlt | Bericht im Journal |
| Abhängigkeiten inkl. Build/Test (ENG-5, SEC-16) | `npm audit --audit-level=high` | CI | Fund ab „high“ | CI-Log |
| Geheimnisse (SEC-18) | `npx secretlint "**/*"` | Pre-Commit, CI | ≥ 1 Fund | CI-Log |

CSP und Referrer-Policy kommen als Meta-Element, weil GitHub Pages keine
eigenen Header erlaubt; HSTS und `nosniff` setzt Pages oder nicht (UNKNOWN,
R-04). Das Referrer-Meta in der ausgelieferten Seite prüft `test:deployed`
noch nicht (FIND-031, P10). Lokale Server belegen SEC-01, -02, -06 nicht. Lokale Hooks per
`simple-git-hooks` (Pre-Commit `lint` + Secret-Scan, Pre-Push `typecheck` +
`test:unit`) und blockierende CI richtet P10 ein; dieser Text selbst sperrt nichts.

## Manuelle Gates

Vor jedem Release, Ergebnis mit Datum im Journal. Lokaler Erfolg ersetzt sie nicht.

| Gate | Wer | Verfahren |
| --- | --- | --- |
| Kamera auf echten Geräten (MG-3, FR-002/003/005, FR-012-AC-2) | Alex | Android, iPhone, Laptop-Webcam laut [ARCHITECTURE.md 10.4](ARCHITECTURE.md#104-geplante-kommandos-und-gates) |
| Screenreader VoiceOver und TalkBack (A11Y-1, A11Y-8) | Alex | laut DESIGN.md „Manuelle Prüfungen“ |
| Tastatur, Zoom 200/400 %, Meldungstexte (A11Y-2/5, DESIGN.md) | Agent | Desktop-Browser, Bildschirmfotos, als Selbstprüfung gekennzeichnet |
| Repository und Pages (MG-1, MG-2, MG-4) | Alex | laut [SECURITY.md 7](SECURITY.md#manuelle-gates) |
| Review von Sicherheit und Gestaltung | Alex | im PR-Review; Agentenreview gilt als Selbstreview |

Release-Kriterien: alle CI-Gates grün, `test:deployed` bestanden, manuelle
Gates belegt, SECURITY.md „Freigabekriterien“ erfüllt. Auf welcher Stage ein
Release abgenommen wird, ist offen (Journal, „Unbearbeitete Themen“).

## Arbeitsweise

* Kleine Slices, je Slice ein PR; kein Push auf `main`; Merge nur auf Anweisung von Alex.
* Neue Wünsche kommen als GitHub-Issue in Alltagssprache. Umsetzung erst nach einer per PR freigegebenen FR; das Issue verlinkt die FR und wiederholt keine Kriterien, der Umsetzungs-PR schließt es (`Closes #…`).
* Keine Links auf Agenten-Sitzungen oder Chat-Verläufe in Dateien, Commits oder PR-Texten.
* Fragen an Alex als Auswahl mit zwei oder drei Optionen, Folgen und Empfehlung; Annahmen als Annahme kennzeichnen.
* Jede PR-Beschreibung enthält diesen Reviewpunkt:
  `- [ ] Geprüft: betroffene FR/AC, Tests, DESIGN.md, ARCHITECTURE.md/ADR, SECURITY.md sowie Phasenhinweis und Dokumententabelle der README.md – angepasst oder unverändert korrekt.`
  Ein korrektes FR muss nicht künstlich geändert werden; Syntax-, ID- und Referenzfehler bleiben blockierend.
* Bericht: tatsächlich ausgeführte Kommandos mit Ergebnis; nicht Ausgeführtes als ausstehend nennen.
