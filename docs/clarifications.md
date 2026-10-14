# Klärungsjournal – Scanner PWA

Kurzes Journal nach dem COMMON CONTRACT der AI Prompt Library (PL-WEB-4.0).
Dokumentationssprache Deutsch, Bezeichner Englisch.

## Stand

| Feld | Wert |
| --- | --- |
| Aktueller Schritt | P04 Architektur und Diagramme – Entscheidungsdialog läuft (PR #14, nach Rückweisung durch Alex) |
| Nächster Schritt | Acht Entscheidungen einzeln mit Alex klären (Reihenfolge: OQ-007/ADR-0002, ADR-0001, ADR-0008, ADR-0003, ADR-0004, ADR-0005, ADR-0006, ADR-0007); ADR-Status nach jeder Antwort anpassen; danach Review und Merge-Anweisung, dann P05 |
| Aktive Frage | ADR-0006 Testwerkzeuge (gestellt 14.10.2026 als Auswahl im Projektthread) |
| Review | P01: Selbstreview, danach menschliches Review durch Alex (PR #11 nach einer Rückweisungsrunde akzeptiert, 14.10.2026). P02: Selbstreview, danach menschliches Review durch Alex (PR #12 ohne Änderungswunsch akzeptiert, 14.10.2026). P03: Selbstreview, danach menschliches Review durch Alex (PR #13 ohne Änderungswunsch akzeptiert, 14.10.2026). P04: Selbstreview; menschliches Review ausstehend |

## Delegation und Befugnisse

| Befugnis | Umfang und Grenzen | Quelle |
| --- | --- | --- |
| Ausführung P01 | Agent führt P01 aus; Start durch Alex mit „Starte“ (14.10.2026, Projektthread). | Alex, 14.10.2026 |
| Ausführung P02 | Agent führt P02 in neuer Session aus den Dateien auf `main` aus („Nächster Schritt ist P02 in einer neuen Session direkt mit den Dateien auf main starten.“). | Alex, 14.10.2026 |
| Ausführung P03 | Agent führt P03 in neuer Session aus den Dateien auf `main` aus („Nun folgt: P03 in einer neuen Session aus main“). Gestaltungswerte entscheidet der Agent als Vorschlag; Markenidentität (OQ-006) und Sprache (OQ-001, beantwortet) bleiben Alex vorbehalten. | Alex, 14.10.2026 |
| Ausführung P04 | Agent führt P04 in neuer Session aus den Dateien auf `main` aus („Nächster Schritt ist P04 in einer neuen Session direkt mit den Dateien auf main starten.“). Technische Entscheidungen legt der Agent als ADR mit Status `proposed` vor; angenommen sind sie erst mit Alex' Entscheidung. Die Bildverarbeitung (OQ-007) wird Alex als Frage vorgelegt. | Alex, 14.10.2026 |
| Git | Arbeit auf eigenem Branch, Ergebnis als Pull Request. Keine claude.ai-Links in Dateien, PR-Beschreibungen oder Commit-Nachrichten. Kein direkter Push auf `main` (einmalige Ausnahme beim Leeren von `main`, Commit `d126d41`, ist verbraucht). | Alex, Arbeitsweise vom 14.10.2026 |
| Merge | Nur auf ausdrückliche Anweisung je PR. Für PR #11 (P01) erteilt als Squash-and-Merge nach `main`. Für PR #12 (P02) erteilt als Squash-and-Merge nach `main` („PR ist akzeptiert - merge“). Für PR #13 (P03) erteilt („PR Akzeptiert - merge freigegeben“), Squash-and-Merge nach `main`. | Alex, 14.10.2026 |
| Externe Artefakte | Keine Issues, Releases oder Veröffentlichungen erteilt. | – |
| Library-Ordner | „AI Prompt Library“ wird nur gelesen, nie beschrieben. | Alex, 14.10.2026 |

## Eingaben von P01

| Eingabe | Art | Fundstelle |
| --- | --- | --- |
| Zielbild Scanner PWA (von Alex angenommen) | geliefert | Dokument „Zielbild Scanner PWA“ bei Alex, angenommen 14.10.2026; kein Link im Repository |
| Hosting-Vorgabe statische GitHub Page unter `/ScannerPWA/` | geliefert | Zielbild, Abschnitt „Rahmenbedingungen“ |
| Früherer Projektstand (OpenCV-basiert, Ziel nicht erreicht) | beobachtet | Branch `backup/opencv-stand-2026-10-14` (`b735648`); nur als Kontext, keine Technik übernommen |
| Referenzbilder des früheren Stands | beobachtet | `backup/opencv-stand-2026-10-14:src/__tests__/fixtures/successful-scan.png`, `failed-scan.png` (siehe OQ-002) |

## Offene Fragen

OQ-001 und OQ-007 sind beantwortet (siehe Antworten). Keine offene Frage blockiert P05;
Fragen werden gestellt, wenn ihr zuständiger Schritt sie benötigt.

| ID | Frage | Zuständig | Betrifft | Blockiert | Vorschlag (keine Antwort) |
| --- | --- | --- | --- | --- | --- |
| OQ-002 | Welche Referenzfotos gelten als Erfolgs- und Fehlerfall, und woran wird „lesbar“ gemessen? | FR-006, FR-007, FR-008 | Tests | Testerstellung (P10) | Fixtures aus dem Backup-Branch nach Sichtprüfung übernehmen |
| OQ-003 | Zielbild verlangt „durchgängig A4 hoch“, Stufe 3 nennt Letter als Exportformat. Gilt A4 als Standard und Letter nur als Option? | FR-023 | Stufe 3 | nein | A4 Standard, Letter nur als bewusste Auswahl |
| OQ-004 | Zielbild sagt „Bilder bleiben im Arbeitsspeicher“, Stufe 3 sieht lokale Entwürfe vor. Wie lange und wo dürfen Seiten lokal gespeichert werden, und wie werden sie gelöscht? | FR-026, FR-011, SECURITY.md (P05) | Stufe 3, Datenschutz | nein | Nur nach Zustimmung, mit Löschaktion; Entscheidung in P05 |
| OQ-006 | Gelten Icon und Farbwelt des früheren Stands (`backup/opencv-stand-2026-10-14:public/icons/scanner.svg`, Blau `#102b5e`/`#17589f`) als Identität der App? | DESIGN.md | App-Icon (FR-012), Farb-Tokens | nein; Icon wird bei Umsetzung FR-012 gebraucht | Ja, Icon übernehmen; Tokens in `DESIGN.md` sind daraus abgeleitet |
| OQ-005 | Welche Speichertoleranz gilt bei wiederholtem Scannen, und gibt es eine Höchstzahl an Seiten? | FR-017, FR-018 | Speicher, Stufe 2 | nein | Messverfahren und Toleranz ≤ 10 % nach 20 Zyklen, siehe [ARCHITECTURE.md, 8.2](../ARCHITECTURE.md#82-speicher-fr-017); Höchstzahl offen |

## Antworten

| Frage | Antwort | Grundlage |
| --- | --- | --- |
| OQ-001: In welcher Sprache ist die Oberfläche? | Deutsch. Übernommen in `REQUIREMENTS.md` (Akteure) und `DESIGN.md` (Overview, Components, A11Y-9); deutsche Bedienbezeichnungen in den FR gelten damit (FIND-004 erledigt). | Alex, Auswahl auf Entscheidungskarte im Projektthread, 14.10.2026 16:32:43Z (Optionen Deutsch / Englisch / Gerätesprache, Empfehlung Deutsch) |
| OQ-007: Wie werden Dokumenterkennung und Entzerrung umgesetzt? | Eigene Pipeline im Web Worker, OpenCV.js als Plan B, falls die Referenzbilder nicht bestanden werden. Übernommen in [ADR-0002](adr/ADR-0002-eigene-bildverarbeitung-im-worker.md) (`accepted`) und ARCHITECTURE.md. | Alex, Auswahl auf Entscheidungskarte im Projektthread, 14.10.2026 17:17:24Z (Optionen eigene Pipeline / OpenCV.js / eigene Pipeline mit Plan B; Empfehlung war eigene Pipeline ohne Plan B) |
| ADR-0001: Welche Sprache, welches Build-Werkzeug und welche UI-Schicht? | TypeScript strict mit Vite, ohne UI-Framework. Übernommen in [ADR-0001](adr/ADR-0001-typescript-vite-ohne-ui-framework.md) (`accepted`). | Alex, Auswahl auf Entscheidungskarte im Projektthread, 14.10.2026 17:19:46Z (Optionen TS + Vite ohne Framework / TS + Vite + Preact oder Lit / JavaScript ohne Build; Empfehlung TS + Vite ohne Framework) |
| ADR-0008: Welche Browser und welche Node-Version? | Aktuelle und vorige Browser-Hauptversion, iOS/Safari ab 17, Node 24 LTS. Übernommen in [ADR-0008](adr/ADR-0008-unterstuetzte-browser.md) (`accepted`). | Alex, Auswahl auf Entscheidungskarte im Projektthread, 14.10.2026 17:20:13Z (Optionen aktuell + vorige mit iOS ab 17 / nur aktuelle Versionen mit Node 26 / breit mit Polyfills; Empfehlung aktuell + vorige) |
| ADR-0003: Womit wird das PDF auf dem Gerät erzeugt? | Eigener kleiner PDF-Writer mit JPEG-Seiten. Übernommen in [ADR-0003](adr/ADR-0003-eigener-pdf-writer.md) (`accepted`). | Alex, Auswahl auf Entscheidungskarte im Projektthread, 14.10.2026 17:20:48Z (Optionen eigener Writer / pdf-lib / jsPDF; Empfehlung eigener Writer) |
| ADR-0004: Wie funktioniert die App offline? | Eigener Service Worker mit Precache-Liste aus dem Build. Übernommen in [ADR-0004](adr/ADR-0004-eigener-service-worker.md) (`accepted`). | Alex, Auswahl auf Entscheidungskarte im Projektthread, 14.10.2026 17:21:19Z (Optionen eigener Service Worker / vite-plugin-pwa mit Workbox; Empfehlung eigener Service Worker) |
| ADR-0005: Wie kommt der Build auf die GitHub Page? | GitHub-Actions-Workflow mit deploy-pages; CSP als Meta-Element (auf Pages ohne Alternative). Übernommen in [ADR-0005](adr/ADR-0005-pages-deployment-und-csp-meta.md) (`accepted`). | Alex, Auswahl auf Entscheidungskarte im Projektthread, 14.10.2026 17:21:42Z (Optionen Actions-Workflow / Branch gh-pages; Empfehlung Actions-Workflow) |

## Unbearbeitete Themen für spätere Schritte

- Unterstützte Browser: in P04 vorgeschlagen ([ADR-0008](adr/ADR-0008-unterstuetzte-browser.md), iOS ≥ 17), Annahme durch Alex ausstehend.
- Aktivierung des Diagnosemodus (FR-016): in P04 vorgeschlagen als `?diagnose=1` ([ADR-0007](adr/ADR-0007-diagnosemodus-per-url-parameter.md)).
- PDF-Dateiname beim Download – Vorschlag `scan-JJJJ-MM-TT-hhmm.pdf` in `DESIGN.md` (P03), Präfix `scan` passt zur Antwort auf OQ-001.
- Automatischer Zugänglichkeitsscan, Ablauftests und simulierte Kamera: Werkzeuge in P04 vorgeschlagen ([ADR-0006](adr/ADR-0006-testwerkzeuge.md)), Einrichtung P10.
- Für P05: Risiken R-04 bis R-07 in [ARCHITECTURE.md, Abschnitt 11](../ARCHITECTURE.md#11-risiken-und-offene-annahmen) (Pages-Header UNKNOWN, gemeinsamer Ursprung `alexanderweigelt.github.io`, kein `frame-ancestors` per Meta-Element, Lieferkette).
- Pages-Quelle „GitHub Actions“ muss in den Repository-Einstellungen gesetzt werden (Alex, bei P10).
- Die Prüfung von `DESIGN.md` (Tokens, Referenzen, Kontraste, Abschnittsreihenfolge, FR-Abdeckung) lief per Ad-hoc-Skript außerhalb des Repos; Automatisierung in P10.

## Befunde aus P02

Formreview aller 26 Datensätze gegen die [Vorlage](requirements/TEMPLATE.md).
Inhalte, Quellen und IDs wurden nicht umgedeutet; Befunde gehen an P06/P07.

| ID | Befund | Betrifft | Behandlung |
| --- | --- | --- | --- |
| FIND-001 | Aussage enthält mehr als ein Verhalten: Live-Vorschau und Kamera beenden; keine Datenübertragung und keine Fremdressourcen; Letter-Auswahl und A4-Standard. | FR-003, FR-011, FR-023 | Nicht geteilt, da Teilen AC-IDs verschieben würde. Vorschlag: in P06 abgetrennte Verhalten als neue FR mit eigenen Kriterien anlegen, vorhandene AC-IDs bleiben. |
| FIND-002 | Aussage ohne passendes Kriterium: Vorrang Front- vor Webcam (FR-002), „ohne sichtbare Qualitätseinbuße durch Kompression“ (FR-007), Installierbarkeit getrennt nach Smartphone und Desktop (FR-012). | FR-002, FR-007, FR-012 | Offen für P06; Vorschlag: je ein zusätzliches Kriterium. |
| FIND-003 | Möglicher Widerspruch: FR-015 nennt fünf Zustände ohne Verarbeitung und ohne Fehlerzustände, FR-004 und FR-008 verlangen Fehlermeldungen, der Leitablauf nennt „Verarbeiten“. | FR-015, FR-004, FR-008 | P03: `DESIGN.md` stellt Verarbeitung und Fehler als Teilzustände der fünf FR-015-Zustände dar (Tabelle „Ansichten und Zustände“). Fachliche Klärung in FR-015 bleibt offen für P06. |
| FIND-004 | Kriterien nennen deutsche Bedienbezeichnungen („Kamera starten“, „Neu aufnehmen“, „Übernehmen“, „Teilen“), obwohl die Oberflächensprache offen ist. | FR-001, FR-004, FR-008, FR-009, FR-025, OQ-001 | Erledigt in P03: OQ-001 mit Deutsch beantwortet; die Bezeichnungen gelten unverändert. |
| FIND-005 | „die Prüfung läuft automatisiert“ steht im Ergebnis eines Kriteriums; das ist eine Prüfvorgabe aus dem Zielbild, Abschnitt „Qualitätsziele“, kein Produktergebnis. | FR-006-AC-1, FR-008-AC-1 | Belassen, um die Vorgabe nicht abzuschwächen; Abbildung als Gate in P09/P10. |
| FIND-006 | `ready`-Datensätze mit offener Frage. Die Fragen blockieren laut Tabelle oben Tests oder spätere Stufen, nicht das Verhalten; „lesbar“ und „ohne sichtbare Verzerrung“ sind erst mit OQ-002 messbar. | FR-006, FR-007, FR-008 (OQ-002), FR-011 (OQ-004), FR-018 (OQ-005) | Status `ready` beibehalten; OQ-002 vor Testerstellung klären. |

## Befunde aus P03

| ID | Befund | Betrifft | Behandlung |
| --- | --- | --- | --- |
| FIND-007 | „Hochformat“ in FR-003 und Zielbild könnte als Sperre der Geräteausrichtung gelesen werden; WCAG 2.2, SC 1.3.4 verbietet eine solche Sperre ohne zwingenden Grund. | FR-003, DESIGN.md (Layout) | `DESIGN.md` legt fest: Hochformat gilt für Vorschau- und Seitenrahmen, nicht für das Gerät. Vorschlag für P06: FR-003 entsprechend präzisieren. |
| FIND-008 | Umsortieren (FR-020) und Ecken verschieben (FR-022) werden üblicherweise per Ziehen bedient; WCAG 2.2, SC 2.5.7 verlangt eine Alternative ohne Ziehen. | FR-020, FR-022, DESIGN.md (Components) | `DESIGN.md` verlangt „Nach oben“/„Nach unten“; FR unverändert. Für FR-022 bei Übergang zu `ready` berücksichtigen. |

## Befunde aus P04

| ID | Befund | Betrifft | Behandlung |
| --- | --- | --- | --- |
| FIND-010 | Library-Befund: P04 legte sieben von acht Technikentscheidungen als `proposed`-ADR vor, ohne Alex zu fragen. Alex wies das zurück („Absolut unverständlich wer die Entscheidung zur Architektur getroffen hat. Ich hätte einen Dialog erwartet in dem ich abgefragt werde.“, 14.10.2026 17:10Z). Die Formulierung „Present meaningful alternatives with tradeoffs, or decide within existing delegation“ in P04 ließ zu, eine allgemeine Ausführungsfreigabe als Entscheidungsdelegation zu lesen. | P04, L02, L07 | Entscheidungen werden einzeln per Auswahl nachgeholt; Hinweis für die Library: Technikentscheidungen ohne ausdrückliche Entscheidungsdelegation einzeln abfragen. |
| FIND-009 | Den Vorrang Front- vor Webcam (FR-002) kann die App mit `facingMode: ideal "environment"` nicht steuern; ohne Rückkamera wählt der Browser. Verstärkt FIND-002. | FR-002, [ARCHITECTURE.md FLOW-02](../ARCHITECTURE.md#flow-02-kamera-starten) | Offen für P06: Vorrang streichen oder Kriterium mit Geräteauswahl nach Berechtigung ergänzen. |

## Schrittstatus

| Schritt | Status | Ergebnis | Prüfungen |
| --- | --- | --- | --- |
| P01 | abgeschlossen, von Alex akzeptiert | `REQUIREMENTS.md`, 26 Datensätze `docs/requirements/FR-001` bis `FR-026` (21 ready, 5 draft), dieses Journal | ID-Eindeutigkeit, JSON-Gültigkeit, Pflichtfelder und relative Links per Skript geprüft (siehe Durchlaufprotokoll) |
| P02 | abgeschlossen, von Alex akzeptiert | [`docs/requirements/TEMPLATE.md`](requirements/TEMPLATE.md); FR-004 und FR-008 sprachlich beobachtbar gemacht; Link in `REQUIREMENTS.md`; Befunde FIND-001 bis FIND-006 | Formatprüfung per Ad-hoc-Python-Skript außerhalb des Repos (P02 legt keine Werkzeuge an): 26 FR, 39 AC, JSON, Pflichtfelder, IDs, Überschriften, OQ-Bezüge, relative Links und Anker fehlerfrei; Fehlerprobe erkannt (siehe Durchlaufprotokoll) |
| P03 | abgeschlossen, von Alex akzeptiert | [`DESIGN.md`](../DESIGN.md) (21 Farb-, 6 Schrift-, 9 Abstands-, 5 Rundungs-Tokens, 18 Komponenten-Einträge; Ansichten/Zustände; Zielkette A11Y-1 bis A11Y-9); OQ-006, FIND-007, FIND-008 | Ad-hoc-Python-Skript außerhalb des Repos: YAML-Kopf, Token-Typen, 36 Referenzen, Abschnittsreihenfolge, relative Links, 22 Kontrastpaare nachgerechnet, Abdeckung aller 26 FR fehlerfrei; Fehlerprobe erkannt (siehe Durchlaufprotokoll). Nicht ausgeführt: Zugänglichkeitsscan, Tastatur-, Zoom- und Screenreader-Prüfung (keine Oberfläche vorhanden) |
| P04 | bereit zum Review (Selbstreview) | [`ARCHITECTURE.md`](../ARCHITECTURE.md) (arc42-Auswahl, 8 Mermaid-Diagramme, CMP-01 bis CMP-08, FLOW-01 bis FLOW-07, TB-1 bis TB-3, Engineering-Regeln und geplante Gates, Risiken R-01 bis R-08); [`docs/adr/`](adr/README.md) ADR-0001 bis ADR-0008 (MADR 4.0.0, alle `proposed`); OQ-007, FIND-009 | Ad-hoc-Python-Skript außerhalb des Repos: relative Links, keine claude.ai-Links, CMP-IDs Text = Diagramme, FLOW/TB definiert, FR-001 bis FR-021 abgedeckt, MADR-Pflichtabschnitte, ADR-Verweise, OQ-Bezüge – fehlerfrei; Fehlerprobe erkannt. Alle 8 Diagramme mit `@mermaid-js/mermaid-cli` 11.12.0 gerendert (fehlerfrei, Zustandsdiagramm visuell geprüft). Nicht ausgeführt: Abruf der Pages-Antwortheader (Netz gesperrt), Kommandos aus Abschnitt 10 (Einrichtung P10) |
| P05–P10 | offen | – | – |

## Durchlaufprotokoll (Funktionsprüfung der Prompt Library)

Maßstab: Prüfprotokoll in der Library (`lib/README.md`, PL-WEB-4.0, Stand 14.10.2026).
Status je Prüfung: erfüllt / nicht erfüllt / nicht geprüft. Gesamtstatus:
**bedingt bestanden** bis L01–L07 und alle Schrittergebnisse belegt sind.

### Zähler

| Schritt | Fragen an Alex | Freitexteingaben | Unterbrechungen | Dauer |
| --- | --- | --- | --- | --- |
| P01 | 0 | 2 (Startbefehl „Starte“, Review-Kommentar) | 1 (Rückweisung im Review) | 15:29:59Z bis 15:34:20Z (Commit), gemessen an Thread-Start und Systemzeit |
| P02 | 0 | 1 (Startbefehl) | 0 | 16:16:32Z bis 16:19:49Z (Commit), gemessen an Startnachricht und Systemzeit; Review-Zeit nicht enthalten |
| P03 | 1 (OQ-001, Auswahl mit drei Optionen und Empfehlung; beantwortet rund 5 min nach dem Stellen, um 16:32:43Z, ohne Freitext) | 1 (Startbefehl) | 0 | 16:26:58Z bis 16:34:04Z (Commit), gemessen an Startnachricht und Systemzeit; Arbeit lief während der Wartezeit auf die Antwort weiter; Review nicht enthalten |
| P04 | 1 bis zur Rückweisung (OQ-007, Auswahl mit drei Optionen und Empfehlung); weitere folgen im Entscheidungsdialog | 2 (Startbefehl; Rückweisung 17:10:03Z) | 1 (Rückweisung: Architektur ohne Dialog entschieden) | 16:44:07Z bis 16:57:08Z (Commit `3d6cba7`), gemessen an Startnachricht und Systemzeit; Review nicht enthalten |

### Library-Prüfungen

| ID | Status | Beleg | Aktion | Verbleibende Lücke |
| --- | --- | --- | --- | --- |
| L01 | nicht geprüft (P01–P04 erfüllt) | P01 lief mit Zielbild und Repo-Zugriff; P02, P03 und P04 liefen allein mit ihren Eingaben von `main` (`dda0896`, `b82a2b7`, `b1a0318`), ohne spätere Schritte vorauszusetzen; P04 verweist Einrichtung und Kommandoausführung ausdrücklich an P09/P10 und Sicherheitsbewertung an P05 | P01–P04 ausgeführt | P05–P10 ausstehend |
| L02 | nicht erfüllt in P04 (siehe FIND-010), sonst teilweise erfüllt | P01, P02 ohne Frage. P03 und P04 stellten je genau eine Frage (OQ-001, OQ-007) als Auswahl mit drei Optionen, Folgen und Empfehlung, ohne Freitext; vorhandene Antworten wurden nicht erneut abgefragt. P04 entschied übrige Technik als `proposed`-ADR statt sie einzeln abzufragen | Fragen gestellt | Antwort auf OQ-007 ausstehend; Fragen späterer Schritte |
| L03 | teilweise erfüllt | P02, P03 und P04 starteten je in einer neuen Session ohne Chat-Historie, aus den Dateien auf `main` und der Library. Zusätzlich lagen Projektnotizen und ein Auftragstext der Projektsitzung vor (Arbeitsregeln, keine Inhalte). P04 speicherte die aktive Frage OQ-007 im Journal vor dem Stellen | P02–P04 ausgeführt | Fortsetzung in neuer Session nach Pause mit aktiver Frage nicht geprüft; OQ-007 kann diesen Fall belegen, falls die Antwort erst in einer späteren Session übernommen wird |
| L04 | erfüllt (maschinell), manuelle Checkliste nicht geprüft | Block „COMMON CONTRACT“ bis „END COMMON CONTRACT“ aus allen zehn Dateien extrahiert: je 87 Zeilen, identischer SHA-256 (Präfix `83aec07fa6aca7ba`); zu Beginn von P02, P03 und P04 unverändert wiederholt | Vergleich per Shell-Skript, 14.10.2026 (P01–P04) | Library verlangt Abgleich als Checkliste ohne Helper; dieser steht aus. Der Library-Ordner ist kein Git-Repo, daher kein Git-Bezug |
| L05 | nicht geprüft (P01–P04-Ergebnisse vorhanden) | siehe Schrittergebnisse; `ARCHITECTURE.md` verlinkt FR, DESIGN.md und ADRs statt sie zu kopieren; CSP-Wert steht nur in ADR-0005, Gates nur in ARCHITECTURE.md Abschnitt 10; mögliche Widersprüche als FIND-001 bis FIND-009 erfasst | – | P05–P10, Behandlung der Befunde in P06 |
| L06 | nicht geprüft | – | – | P10 |
| L07 | nicht geprüft (P01–P04 erfüllt) | Status und Review je Schritt dokumentiert; Ergebnis als PR, kein Push auf `main`, kein Merge ohne Anweisung; P04 als Selbstreview gekennzeichnet; ADRs `proposed`, keine Annahme behauptet | P04-PR erstellt | Review P04; spätere Schritte |

### Schrittergebnisse

| Schritt | Prüfung | Status | Beleg | Lücke |
| --- | --- | --- | --- | --- |
| P01 | 1: Nutzeraufgaben und Grenzen in REQUIREMENTS.md und FRs | erfüllt (Review Alex) | Jeder Zielbild-Abschnitt ist mindestens einem FR oder REQUIREMENTS.md zugeordnet | keine |
| P01 | 2: Offene Fragen mit Fundstellen, Journal, Befugnisse, kein Stack | erfüllt (Review Alex) | Abschnitte „Offene Fragen“ und „Delegation und Befugnisse“; keine Technik gewählt | keine |
| P02 | 1: TEMPLATE.md und FRs im selben Format, beobachtbare Kriterien, gültige Referenzen | erfüllt (Review Alex) | Formatprüfung: 26 FR, 39 AC, keine Fehler; Fehlerprobe mit kaputtem JSON und doppelter AC-ID wurde zurückgewiesen (2 von 2 Fehlern gemeldet). Kriterien in FR-004 und FR-008 ohne „verständlich“ formuliert | Beobachtbarkeit von „lesbar“ hängt an OQ-002 (FIND-006); Prüfung noch nicht automatisiert (P10) |
| P02 | 2: Bedeutungen und IDs erhalten, Platzhalter keine Produktanforderungen | erfüllt (Review Alex) | Keine ID, Quelle, Basis oder Status geändert; Diff betrifft nur drei Kriterientexte. Beispiel in TEMPLATE.md nutzt `FR-PLACEHOLDER`, liegt nicht unter `FR-*.md` und ist nicht in `REQUIREMENTS.md` gelistet | keine |
| P03 | 1: DESIGN.md beschreibt benötigte Tokens, Komponenten und Zustände ohne zusätzliche Funktionen | erfüllt (Review Alex) | Jede Komponente und jeder Teilzustand in `DESIGN.md` nennt ein FR; Abdeckung aller 26 FR per Skript geprüft; Do's and Don'ts schließen Bedienelemente ohne FR aus; Stufe 3 (`draft`) nicht gestaltet | Identität hängt an OQ-006 |
| P03 | 2: Bedienungs- und Zugänglichkeitsziele mit geplanten automatischen und manuellen Nachweisen | erfüllt als Planung (Review Alex) | Zielkette A11Y-1 bis A11Y-9 mit Kriterium, Nachweis, Gate und WCAG-2.2-Quelle; 22 Kontrastpaare berechnet; manuelle Prüfungen mit Verantwortung (Vorschlag Alex). Fehlerprobe: verfälschte Randfarbe, falsche Token-Referenz und vertauschte Abschnittsreihenfolge wurden gemeldet (3 von 3 Fehlerarten, Exit-Code 1) | Scans und manuelle Prüfungen erst mit Oberfläche ausführbar (P10 bzw. Umsetzung); Werkzeugwahl P04 |
| P04 | 1: Architekturtext und Diagramme stimmen bei Komponenten, Flüssen und Grenzen überein | erfüllt (Selbstreview), Review Alex ausstehend | Skriptprüfung: CMP-01 bis CMP-08 in Tabelle und Diagrammen identisch, alle FLOW- und TB-Bezüge definiert, 8 Diagramme fehlerfrei gerendert; Fehlerprobe (umbenannte Komponente im Diagramm, entfernte FR-Zeile, entfernter MADR-Abschnitt) mit 3 von 3 Fehlern und Exit-Code 1 erkannt | Prüfung nicht automatisiert im Repo (P10) |
| P04 | 2: Entscheidungen mit nachvollziehbarem Status, Alternativen und konkreten Stackregeln | erfüllt als Vorschlag (Selbstreview), Review Alex ausstehend | ADR-0001 bis ADR-0008 mit je mindestens zwei Optionen, Status `proposed`, Vorgaben getrennt in ARCHITECTURE.md Abschnitt 2; Regeln Abschnitt 10 (tsconfig-Optionen, Lint-Regeln, verbotene DOM-APIs, CSP-Mechanismus, Lockfile, Node 24, geplante Kommandos) | Keine ADR angenommen; OQ-007 offen; Kommandos nicht eingerichtet (P10) |
