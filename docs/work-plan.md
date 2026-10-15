# Arbeitsplan – Scanner PWA

Arbeitspakete aus der Spezifikationsbaseline `827177c`
([Baseline-Bericht](baseline-review.md)), erstellt in P10 der AI Prompt
Library (PL-WEB-4.0). Maßstab ist das Zielbild Scanner PWA (angenommen von
Alex, 14.10.2026), Abschnitte „Kern“, „Ausbaustufen“ und „Rahmenbedingungen“.

Akzeptanzkriterien stehen nur in den FR-Datensätzen; dieser Plan verweist auf
sie und wiederholt sie nicht. Kommandos und Sperrbedingungen stehen in
[AGENTS.md](../AGENTS.md#kommandos-und-gates), Ansichten und Texte in
[DESIGN.md](../DESIGN.md), Bausteine in [ARCHITECTURE.md](../ARCHITECTURE.md),
Kontrollen in [SECURITY.md](../SECURITY.md).

## Regeln

* Je Paket ein oder mehrere kleine PRs; ein Paket ist erst `geliefert`, wenn
  jedes zugeordnete Kriterium in seinem FR echte `test_refs` hat, die Testdatei
  die Kriteriums-ID nennt und die Gates des Pakets in CI grün sind.
  `npm run check:spec` prüft die Zuordnung, die `test_refs` gelieferter Pakete
  und Zyklen in den Abhängigkeiten.
* Status: `geplant`, `in Arbeit`, `geliefert`. Ein `ready`-FR belegt nur die
  Spezifikation, nicht die Umsetzung.
* Stufe-3-Anforderungen (FR-022 bis FR-026) sind `draft` und hier nicht
  eingeplant; sie brauchen zuerst geklärte Fragen (OQ-003, OQ-004).
* Jeder PR enthält den Reviewpunkt aus [AGENTS.md](../AGENTS.md#arbeitsweise):
  - [ ] Geprüft: betroffene FR/AC, Tests, DESIGN.md, ARCHITECTURE.md/ADR, SECURITY.md sowie Phasenhinweis und Dokumententabelle der README.md – angepasst oder unverändert korrekt.

## Übersicht

| WP | Titel | Status | Abhängig von | Kriterien |
| --- | --- | --- | --- | --- |
| WP-001 | Werkzeuge und Prüfgrundlage | in Arbeit | – | – (keine Produktkriterien) |
| WP-002 | App-Schale, Zustände und Schutz vor Einbettung | geplant | WP-001 | FR-015-AC-1, FR-027 |
| WP-003 | Kamera starten, auswählen, Vorschau, Aufnahme | geplant | WP-002 | FR-001, FR-002, FR-003, FR-004, FR-005 |
| WP-004 | Bildverarbeitung im Worker mit Referenzbildern | geplant | WP-001 | FR-006, FR-007-AC-1, FR-008-AC-1 |
| WP-005 | Verarbeiten, Ergebnis-Vorschau und Abbruch | geplant | WP-003, WP-004 | FR-008-AC-2, FR-009, FR-015-AC-2, FR-015-AC-3 |
| WP-006 | PDF-Writer und Export einer Seite | geplant | WP-005 | FR-010, FR-007-AC-2 |
| WP-007 | Diagnosemodus im Entwicklungs-Build | geplant | WP-005 | FR-016 |
| WP-008 | Installierbar, offline, Unterpfad | geplant | WP-006 | FR-012, FR-013, FR-014 |
| WP-009 | Nachweis Datenabfluss und Speicher | geplant | WP-006 | FR-011, FR-017 |
| WP-010 | Deployment und Abnahme Stufe 1 | geplant | WP-007, WP-008, WP-009 | – (Release-Gates) |
| WP-011 | Seitenliste: hinzufügen, löschen, umsortieren | geplant | WP-006 | FR-018, FR-019, FR-020 |
| WP-012 | Mehrseitiges PDF | geplant | WP-011 | FR-021 |

**Erster vertikaler Schnitt:** WP-002 bis WP-006 ergeben den Leitablauf der
Stufe 1 (Kamera starten → Aufnehmen → Verarbeiten → Vorschau → einseitiges
PDF). Erstes umsetzbares Produktpaket nach WP-001 ist WP-002; WP-004 kann
parallel beginnen, weil es nur WP-001 braucht. Folgeinkremente: WP-007 bis
WP-009 vervollständigen Stufe 1, WP-010 veröffentlicht sie, WP-011 und WP-012
bilden Stufe 2.

## Pakete

### WP-001 Werkzeuge und Prüfgrundlage

* **Zweck:** Laufzeit, Abhängigkeiten und alle Gates aus AGENTS.md tatsächlich
  einrichten und ausführen, bevor Produktcode entsteht (ENG-1 bis ENG-5).
* **Umfang:** Node 24 (`.nvmrc`, `engines`), `package.json` mit leeren
  `dependencies` und exakten Build-Werkzeugen laut ARCHITECTURE.md 10.5,
  `package-lock.json`; `tsconfig` nach 10.1, ESLint und Prettier nach 10.2;
  Vitest, Playwright, axe; `check:spec`, `check:build`, `test:memory`,
  `test:deployed`; Secret-Scan, `npm audit`; `simple-git-hooks`; CI-Workflow
  ohne Deployment; Dependabot-Konfiguration; minimale Startseite mit CSP- und
  Referrer-Meta als Prüfgegenstand (kein Produktverhalten).
* **Gates:** alle Kommandos aus AGENTS.md außer `test:deployed` (nichts
  veröffentlicht); je Gate eine absichtliche Fehlerprobe.
* **Nachweis:** Ergebnisse im [Journal](clarifications.md#schrittstatus) und im
  [Baseline-Bericht](baseline-review.md); CI-Lauf im PR.
* **Offen nach dem Paket:** Pflichtprüfungen vor dem Merge (Ruleset, MG-2) setzt
  Alex; bis dahin ist die Sperre beim Merge ausstehend.

### WP-002 App-Schale, Zustände und Schutz vor Einbettung

* **Zweck:** fünf Ansichten aus DESIGN.md mit genau einem sichtbaren Zustand
  und Erkennung der Einbettung im Frame (CMP-01, CMP-02, SEC-08).
* **Umfang:** Zustandsmaschine nach ARCHITECTURE.md 6 „Zustände“, Startbildschirm,
  Live-Region und Fokusführung, Hinweis bei Einbettung.
* **Gates:** `typecheck`, `lint`, `test:unit`, `check:build`, `test:e2e`,
  `test:a11y`, `check:spec`.

### WP-003 Kamera starten, auswählen, Vorschau, Aufnahme

* **Zweck:** Kamera nur nach Aktion, Auswahl Rück → Front → andere, Vorschau
  im Hochformat, Fehlermeldungen, Foto in voller Auflösung (CMP-03, FLOW-02,
  SEC-20).
* **Gates:** wie WP-002, `test:e2e` mit simulierter Kamera in Chromium;
  manuelles Gate Kamera auf echten Geräten (Alex) vor dem Release.

### WP-004 Bildverarbeitung im Worker mit Referenzbildern

* **Zweck:** eigene Pipeline laut ADR-0002 im Worker (CMP-04, TB-3, SEC-10):
  Erkennung, Ecken, Entzerrung, Scan-Look.
* **Umfang:** Referenzbilder aus `backup/opencv-stand-2026-10-14` übernehmen,
  Soll-Ecken markieren, Zahlenwerte des Lesbarkeitsmaßes an den Bildern prüfen
  (Antwort auf OQ-002); Prüfung der Worker-Nachrichten.
* **Gates:** `typecheck`, `lint`, `test:unit` (Referenzbilder), `check:spec`.
* **Risiko:** R-01; Plan B OpenCV.js nur nach ADR-0002 und Auswahl durch Alex.

### WP-005 Verarbeiten, Ergebnis-Vorschau und Abbruch

* **Zweck:** Ablauf Aufnahme → Verarbeitung → Vorschau mit „Übernehmen“ und
  „Neu aufnehmen“, Abbruch und Zeitgrenze (FLOW-03, FLOW-04).
* **Offen:** OQ-010 (Wert der Zeitgrenze) blockiert nur den Test von
  FR-015-AC-3.
* **Gates:** wie WP-002.

### WP-006 PDF-Writer und Export einer Seite

* **Zweck:** eigener PDF-Writer laut ADR-0003, Download einer A4-Seite
  (CMP-05, FLOW-05).
* **Gates:** wie WP-002; PDF-Struktur in `test:unit`.

### WP-007 Diagnosemodus im Entwicklungs-Build

* **Zweck:** Zwischenschritte sichtbar im Diagnose-Build, nicht im
  Produktions-Build (ADR-0007, SEC-14).
* **Offen:** Weg des Diagnose-Builds per HTTPS auf ein echtes Smartphone
  (Frage an Alex bei Umsetzung).
* **Gates:** `test:e2e` gegen beide Builds, `check:build` (keine Diagnose in
  `dist/`).

### WP-008 Installierbar, offline, Unterpfad

* **Zweck:** Manifest, eigenes SVG-Icon (Antwort auf OQ-006, Freigabe durch
  Alex im PR), eigener Service Worker mit Precache-Liste (ADR-0004),
  Betrieb unter `/ScannerPWA/` (CMP-07, CMP-08, FLOW-01, FLOW-06).
* **Gates:** wie WP-002, `check:build` mit Precache-Prüfung; manuelles Gate
  Installation auf echten Geräten (FR-012-AC-2/3, Alex).

### WP-009 Nachweis Datenabfluss und Speicher

* **Zweck:** Netzmitschnitt im gesamten Ablauf (SEC-05, SEC-07) und
  Messverfahren aus ARCHITECTURE.md 8.2.
* **Gates:** `test:e2e`, `test:memory`.

### WP-010 Deployment und Abnahme Stufe 1

* **Zweck:** Deploy-Job laut ADR-0005 und SECURITY.md SEC-17, `test:deployed`
  gegen die Page, manuelle Gates und Freigabekriterien laut SECURITY.md 7.
* **Offen:** Auf welcher Stage ein Release abgenommen wird, bevor die
  GitHub Page (Produktion) es zeigt ([Journal](clarifications.md#unbearbeitete-themen-für-spätere-schritte));
  Pages-Quelle „GitHub Actions“ (MG-1, Alex).
* **Gates:** alle CI-Gates, `check:spec -- --release`, `test:deployed`,
  manuelle Gates aus AGENTS.md.

### WP-011 Seitenliste: hinzufügen, löschen, umsortieren

* **Zweck:** Stufe 2, Seitenliste mit Bedienung ohne Ziehen (DESIGN.md).
* **Offen:** OQ-011 (Höchstzahl an Seiten) vor FR-018.
* **Gates:** wie WP-002.

### WP-012 Mehrseitiges PDF

* **Zweck:** PDF in angezeigter Reihenfolge.
* **Gates:** wie WP-002; PDF-Struktur in `test:unit`.
