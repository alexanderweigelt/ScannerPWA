# Baseline-Bericht – Spezifikation Scanner PWA

Ergebnis von P07 (AI Prompt Library PL-WEB-4.0) vom 15.10.2026. Der Bericht
belegt den **Spezifikationsstand**, nicht Codequalität oder Produktionsreife.
Es gibt noch keinen Produktcode, keine Laufzeitumgebung und keine CI.
Maßstab ist das Zielbild Scanner PWA (angenommen von Alex, 14.10.2026);
Entscheidungen und Befunde stehen im [Journal](clarifications.md).

## Baseline-Bezug

| Feld | Wert |
| --- | --- |
| Ausgangsstand | `main` bei `9ea14d6` (P06, Squash-Merge von PR #16) |
| Baseline | `827177cb3a6947851681728dc0be3cfd676046fd` (`827177c`), Squash-Merge von PR #17 (P07) auf `main` am 15.10.2026, eingetragen in P08. Ein Tag ist nicht erteilt und wird nicht angelegt. |
| Review | Selbstreview des Agenten; menschliches Review durch Alex (PR #17 akzeptiert, 15.10.2026 07:43:26Z) |

Die Baseline ist der Commit oben; P10 prüft gegen diesen Bezug. Eine spätere
Änderung der Spezifikation braucht einen neuen, reviewten Git-Bezug.

## Umfang

Geprüft wurden alle Fachdateien auf dem Branch des P07-PR:

| Bereich | Dateien |
| --- | --- |
| Anforderungen | [REQUIREMENTS.md](../REQUIREMENTS.md), 27 Datensätze `docs/requirements/FR-001` bis `FR-027`, [TEMPLATE.md](requirements/TEMPLATE.md) |
| Gestaltung | [DESIGN.md](../DESIGN.md) mit Zielkette A11Y-1 bis A11Y-9 |
| Architektur | [ARCHITECTURE.md](../ARCHITECTURE.md) (CMP-01 bis CMP-08, FLOW-01 bis FLOW-07, 8 Diagramme, ENG-1 bis ENG-5, Gates 10.4), [ADR-0001 bis ADR-0008](adr/README.md) |
| Sicherheit | [SECURITY.md](../SECURITY.md) (T-01 bis T-17, SEC-01 bis SEC-20, MG-1 bis MG-4, SD-1 bis SD-6) |
| Journal | [clarifications.md](clarifications.md) |

## Entscheidungen in P07

Alle per Auswahl von Alex am 15.10.2026, je nach Empfehlung; Wortlaut und
Übernahme im Journal, Abschnitt „Antworten“.

| Frage | Ergebnis | Übernommen in |
| --- | --- | --- |
| OQ-002 Referenzbilder | Backup-Bilder gelten sofort, echte Smartphone-Fotos von Alex folgen | FR-006, FR-007, FR-008, ADR-0002 |
| OQ-002 Lesbarkeitsmaß | Ecken ≤ 1,5 % der Bilddiagonale, Seite 1:√2, Kontrast ≥ 7:1, im PDF ebenso | FR-006-AC-1, FR-007-AC-1/AC-2, FR-008-AC-1, ADR-0003 |
| OQ-005 Speichertoleranz | JS-Heap ≤ 10 % nach 20 Zyklen, offene Objekt-URLs und Canvas-Flächen zurück auf Ausgangswert | FR-017 (jetzt `ready`), ARCHITECTURE.md 8.2, 10.4, SECURITY.md SEC-11 |
| OQ-006 Identität | Blautöne bleiben, eigenes SVG-Icon statt Backup-Icons | DESIGN.md, ARCHITECTURE.md CMP-08 |
| FIND-023 manuelle Prüfungen | Alex: Einstellungen, echte Geräte, Screenreader; Agent: Tastatur, Zoom, Meldungstexte als Selbstprüfung | DESIGN.md, ARCHITECTURE.md 10.4 |

## Manuelle Prüfung

**Methode:** Ad-hoc-Python-Skript außerhalb des Repositorys (P07 installiert
keinen Checker), Aufruf `python3 -I speccheck.py <repo>`, dazu Durchsicht der
Ergebnisse und der geänderten Stellen. Das Skript ist nicht Teil der Baseline;
der dauerhafte Spec-Check entsteht in P10.

| Prüfung | Ergebnis vor Änderungen (`9ea14d6`) | Ergebnis nach Änderungen |
| --- | --- | --- |
| JSON-Syntax, genau ein JSON-Block und ein Titel je FR, Titelzeile = `id` + `title` | 27 von 27 fehlerfrei | 27 von 27 fehlerfrei |
| Pflichtfelder laut TEMPLATE.md, gültige `status`/`basis`, `source_refs` nicht leer | fehlerfrei | fehlerfrei |
| FR-/AC-IDs eindeutig, AC fortlaufend je FR, `given`/`when`/`then` gefüllt | 46 AC fehlerfrei | 46 AC fehlerfrei |
| `test_refs` | 46 von 46 leer = Test geplant, keine Testdateien vorhanden | unverändert |
| REQUIREMENTS.md: jede FR genau einmal, Titel und Status gleich | fehlerfrei (21 `ready`) | fehlerfrei (22 `ready`) |
| `open_question_ids` nur offene OQ; keine OQ zugleich offen und beantwortet | fehlerfrei | fehlerfrei |
| Alle Bezüge FR, AC, OQ, FIND, SD, SEC, T, A, EP, MG, CMP, TB, R, FLOW, ENG, A11Y, ADR definiert | 1540 Bezüge fehlerfrei | 1693 Bezüge fehlerfrei |
| Relative Links und Anker | 220 fehlerfrei | 241 fehlerfrei (einschließlich dieser Datei) |
| Keine claude.ai-Links | fehlerfrei | fehlerfrei |
| Jedes T hat SEC, jedes SEC hat T; 20 SEC-Zeilen | fehlerfrei | fehlerfrei |
| CMP-IDs Tabelle = Diagramme (8 Mermaid-Blöcke) | 8 von 8 gleich | unverändert |
| ADR: Status `accepted`, Entscheider Alex mit Zeitpunkt, MADR-Pflichtabschnitte | 8 von 8 | 8 von 8 |

**Fehlerprobe** (Kopie des Repos mit absichtlichen Fehlern: doppelte AC-ID,
kaputtes JSON, unbekannte OQ in `open_question_ids`, toter Link, falscher
Status in REQUIREMENTS.md): alle 5 erkannt, Exit-Code 1.

**Inhaltliche Durchsicht** (Selbstreview):

* Jede `ready`-FR hat mindestens ein beobachtbares Kriterium; „lesbar“, „ohne
  sichtbare Verzerrung“ und die Speichertoleranz sind jetzt messbar (FIND-006,
  FIND-022 erledigt).
* Jede `ready`-FR ist einem geplanten Gate zugeordnet; FR-001, FR-004, FR-009
  und FR-015 nur indirekt über „Ablauf“ bzw. „Zustandsmaschine“ (FIND-025).
* Zielketten ENG, A11Y und SEC haben Kriterium, Nachweis, Gate und Quelle;
  seit P06 nur durch die Antworten oben verändert.
* Gefundene Mängel: FIND-024 (veralteter Satz), FIND-026 (Fehlerbild),
  FIND-027 (unbelegte Begründung auf einer Karte); alle behoben.
* Nicht geprüft: Primärquellen RFC 9325, NIST SSDF, W3C CSP Level 3 (wie in
  P06 nicht erreichbar); Diagramme nicht neu gerendert (seit P06 unverändert).

## Offene Punkte und Blocker

| Punkt | Art | Blockiert |
| --- | --- | --- |
| Echte Smartphone-Fotos für Erfolg und Fehler (Antwort OQ-002) | Lieferung durch Alex | nur deren zusätzliche Prüfung; Tests mit Backup-Bildern sind möglich |
| OQ-010 Wert der Zeitgrenze | Messung auf echtem Gerät | Test FR-015-AC-3, nicht das Verhalten |
| OQ-011 Höchstzahl an Seiten | Frage vor Stufe 2 | FR-018-Umsetzung |
| OQ-003, OQ-004 | Fragen zu Stufe 3 | FR-023, FR-026 (`draft`) |
| Diagnose-Build auf echtem Smartphone per HTTPS | bei Umsetzung FR-016 zu klären | Messung R-02/OQ-010 auf dem Gerät |
| MG-1, MG-2, MG-4 Repository-Einstellungen | manuelles Gate (Alex) | Freigabe laut SECURITY.md Abschnitt 7 |
| Pages-Antwortheader (HSTS, `nosniff`) | UNKNOWN (R-04), erst nach Deployment prüfbar | SEC-02, SEC-06 |

**Produktblocker für Stufe 1:** keiner auf Spezifikationsebene. Alle Stufe-1-FR
sind `ready`; offene Werte blockieren einzelne Tests, nicht das Verhalten.

## Für P10 vorgemerkt

Nicht ausgeführt, ausdrücklich ausstehend:

* Laufzeit Node 24 installieren, danach `npm run check:spec` als
  abhängigkeitsfreien Spec-Check anlegen, ausführen und mit absichtlichem
  Fehler prüfen; Umfang mindestens wie die manuelle Prüfung oben, zusätzlich
  Meldung für `ready`-AC ohne `test_refs` vor einem Release (FIND-025).
* Referenzbilder ins Repository übernehmen, Soll-Ecken markieren, Zahlenwerte
  des Lesbarkeitsmaßes an den Bildern prüfen (Antwort OQ-002).
* Übrige Gates aus ARCHITECTURE.md 10.4 und SECURITY.md Abschnitt 7 einrichten
  und tatsächlich ausführen; Ergebnisse dieses Berichts aktualisieren, falls die
  automatische Prüfung neue Blocker findet, bevor Produktarbeit beginnt.

## P10: eingerichtete Prüfgrundlage

Ergebnis von P10 (WP-001, [Arbeitsplan](work-plan.md)) vom 15.10.2026 auf dem
Branch des P10-PR, Ausgangsstand `main` `d85c6b3`. Umgebung: Cloud-Container
Linux x64, Node 24.22.0 (von nodejs.org, Prüfsumme gegen `SHASUMS256.txt`
geprüft), npm 11.19.1; Chromium aus dem Container
(`PLAYWRIGHT_CHROMIUM_EXECUTABLE`), weil Playwright dort keine Browser lädt.
Selbstprüfung des Agenten. CI in PR #20: GitHub-Actions-Lauf 38717859357 auf `b65c2ac`, beide Jobs grün (Prüfungen; Browser-Abläufe mit Chromium, Firefox und WebKit, Zugänglichkeit, Speicher).

### Ausgeführte Kommandos

| Kommando | Ergebnis lokal | Bemerkung |
| --- | --- | --- |
| `npm ci` | bestanden | Hooks `pre-commit`, `pre-push` installiert |
| `npm run check:spec` | bestanden | 27 FR, 46 AC, 12 Arbeitspakete; 39 von 39 `ready`-AC ohne `test_refs` = ausstehend |
| `npm run check:spec -- --release` | zurückgewiesen (erwartet) | 39 Meldungen; Release erst mit Tests |
| `npm run typecheck` | bestanden | Projekte Dokument, Werkzeuge, Tests |
| `npm run lint` | bestanden | 0 Fehler, 0 Warnungen |
| `npm run format:check` | bestanden | |
| `npm run test:unit` | bestanden | 26 Tests: Negativproben für `check:spec` und `check:build`; noch keine Produkt-AC |
| `npm run build` | bestanden | |
| `npm run check:build` | bestanden | Precache-Prüfung ausstehend (kein Service Worker, WP-008) |
| `npm run test:e2e` | Chromium Desktop und Smartphone bestanden; Firefox, WebKit nicht ausführbar | Browser im Container nicht vorhanden; laufen in CI |
| `npm run test:a11y` | bestanden | nur Startseite; weitere Ansichten mit ihren Paketen |
| `npm run test:memory` | Messwerkzeug bestanden, FR-017-AC-1 übersprungen | Messung folgt mit WP-009 |
| `npm audit --audit-level=high` | bestanden | 0 Funde |
| `npx secretlint "**/*"` | bestanden | 0 Funde |
| `npm run test:deployed` | nicht ausführbar | Container löst `alexanderweigelt.github.io` nicht auf; nichts veröffentlicht; Offline-Start übersprungen (WP-008) |

Befund während der Einrichtung: Der Browser fragt `/favicon.ico` außerhalb des
Unterpfads an (404), bis WP-008 das App-Icon liefert; `test:e2e` nimmt nur
diese Anfrage aus (FIND-032).

### Fehlerproben

Je Probe eine Wegwerfkopie des Repositorys mit genau einem absichtlichen Fehler;
das Original blieb unverändert und wurde danach erneut geprüft (bestanden).

| Gate | Absichtlicher Fehler | Ergebnis |
| --- | --- | --- |
| `check:spec` | toter Link und unbekannte FR-ID in README.md | Exit 1, beide gemeldet |
| `typecheck` | `string` an `number` zugewiesen | Exit 1, TS2322 |
| `lint` | `innerHTML` in `src/main.ts` | Exit 1, Regel SEC-04 |
| `format:check` | unformatierte Datei | Exit 1 |
| `test:unit` | fehlschlagender Test | Exit 1 |
| `check:build` | Inline-Skript in `dist/index.html` | Exit 1 |
| `secretlint` | GitHub-Token-Muster | Exit 1; ein unvollständiger RSA-Schlüssel wurde nicht gemeldet |
| `npm ci` | `package.json` weicht vom Lockfile ab | Exit 1 |
| `test:e2e` | Inline-Skript in `index.html` (CSP-Verstoß) | Exit 1 |
| `test:a11y` | fehlendes `lang` | Exit 1, axe `html-has-lang` |
| `npm audit` | `lodash@4.17.20` | Exit 1, 1 Fund „high“ |
| Pre-Commit-Hook | `innerHTML` im Commit | Commit abgewiesen |
| Pre-Push-Hook | Typfehler | Push abgewiesen |

Dauerhafte Negativproben für `check:spec` (12 Fälle) und `check:build`
(10 Fälle) liegen in `tests/unit/`.

### Nicht belegt

* Sperre beim Merge: Ruleset für `main` mit Pflichtprüfungen setzt Alex (MG-2); bis dahin meldet CI nur.
* `test:deployed`, MG-1 bis MG-4, Geräte- und Screenreader-Prüfungen: erst mit Deployment bzw. vor Release.
* Produkt-AC: keine Tests, kein Produktcode; neue Blocker für die Produktarbeit wurden nicht gefunden.

## Bereitschaft

**Spezifikation: Baseline `827177c`** (eingetragen in P08). Automatische
Prüfung: eingerichtet und lokal ausgeführt (P10, siehe oben). Produktcode,
Produkttests, Deployment und Produktionsreife: nicht vorhanden bzw. nicht belegt.
