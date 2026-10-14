# Klärungsjournal – Scanner PWA

Kurzes Journal nach dem COMMON CONTRACT der AI Prompt Library (PL-WEB-4.0).
Dokumentationssprache Deutsch, Bezeichner Englisch.

## Stand

| Feld | Wert |
| --- | --- |
| Aktueller Schritt | P02 Anforderungsvorlage – bereit zum Review (PR an `main`) |
| Nächster Schritt | P03 Designgrundlage (`DESIGN.md`), nach Freigabe und Merge von P02 |
| Aktive Frage | keine |
| Review | P01: Selbstreview, danach menschliches Review durch Alex (PR #11 nach einer Rückweisungsrunde akzeptiert, 14.10.2026). P02: nur Selbstreview durch den Agenten; menschliches Review ausstehend |

## Delegation und Befugnisse

| Befugnis | Umfang und Grenzen | Quelle |
| --- | --- | --- |
| Ausführung P01 | Agent führt P01 aus; Start durch Alex mit „Starte“ (14.10.2026, Projektthread). | Alex, 14.10.2026 |
| Ausführung P02 | Agent führt P02 in neuer Session aus den Dateien auf `main` aus („Nächster Schritt ist P02 in einer neuen Session direkt mit den Dateien auf main starten.“). | Alex, 14.10.2026 |
| Git | Arbeit auf eigenem Branch, Ergebnis als Pull Request. Keine claude.ai-Links in Dateien, PR-Beschreibungen oder Commit-Nachrichten. Kein direkter Push auf `main` (einmalige Ausnahme beim Leeren von `main`, Commit `d126d41`, ist verbraucht). | Alex, Arbeitsweise vom 14.10.2026 |
| Merge | Nur auf ausdrückliche Anweisung je PR. Für PR #11 (P01) erteilt als Squash-and-Merge nach `main`. Für den P02-PR noch nicht erteilt. | Alex, 14.10.2026 |
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

Keine Frage blockiert P02 oder P03 vollständig; OQ-001 wird zu Beginn von P03
gebraucht. Fragen werden gestellt, wenn ihr zuständiger Schritt sie benötigt.

| ID | Frage | Zuständig | Betrifft | Blockiert | Vorschlag (keine Antwort) |
| --- | --- | --- | --- | --- | --- |
| OQ-001 | In welcher Sprache ist die Oberfläche? | REQUIREMENTS.md, DESIGN.md (P03) | alle Texte | P03 | Deutsch |
| OQ-002 | Welche Referenzfotos gelten als Erfolgs- und Fehlerfall, und woran wird „lesbar“ gemessen? | FR-006, FR-007, FR-008 | Tests | Testerstellung (P10) | Fixtures aus dem Backup-Branch nach Sichtprüfung übernehmen |
| OQ-003 | Zielbild verlangt „durchgängig A4 hoch“, Stufe 3 nennt Letter als Exportformat. Gilt A4 als Standard und Letter nur als Option? | FR-023 | Stufe 3 | nein | A4 Standard, Letter nur als bewusste Auswahl |
| OQ-004 | Zielbild sagt „Bilder bleiben im Arbeitsspeicher“, Stufe 3 sieht lokale Entwürfe vor. Wie lange und wo dürfen Seiten lokal gespeichert werden, und wie werden sie gelöscht? | FR-026, FR-011, SECURITY.md (P05) | Stufe 3, Datenschutz | nein | Nur nach Zustimmung, mit Löschaktion; Entscheidung in P05 |
| OQ-005 | Welche Speichertoleranz gilt bei wiederholtem Scannen, und gibt es eine Höchstzahl an Seiten? | FR-017, FR-018 | Speicher, Stufe 2 | nein | Festlegung mit Messverfahren in P04/P10 |

## Antworten

| Frage | Antwort | Grundlage |
| --- | --- | --- |
| – | Noch keine Antworten. | – |

## Unbearbeitete Themen für spätere Schritte

- Unterstützte Browser und Mindestversionen (insbesondere iOS Safari) – technische Frage für P04.
- Aktivierung des Diagnosemodus (FR-016) – Gestaltung P03 bzw. Architektur P04.
- PDF-Dateiname beim Download – Gestaltung P03.

## Befunde aus P02

Formreview aller 26 Datensätze gegen die [Vorlage](requirements/TEMPLATE.md).
Inhalte, Quellen und IDs wurden nicht umgedeutet; Befunde gehen an P06/P07.

| ID | Befund | Betrifft | Behandlung |
| --- | --- | --- | --- |
| FIND-001 | Aussage enthält mehr als ein Verhalten: Live-Vorschau und Kamera beenden; keine Datenübertragung und keine Fremdressourcen; Letter-Auswahl und A4-Standard. | FR-003, FR-011, FR-023 | Nicht geteilt, da Teilen AC-IDs verschieben würde. Vorschlag: in P06 abgetrennte Verhalten als neue FR mit eigenen Kriterien anlegen, vorhandene AC-IDs bleiben. |
| FIND-002 | Aussage ohne passendes Kriterium: Vorrang Front- vor Webcam (FR-002), „ohne sichtbare Qualitätseinbuße durch Kompression“ (FR-007), Installierbarkeit getrennt nach Smartphone und Desktop (FR-012). | FR-002, FR-007, FR-012 | Offen für P06; Vorschlag: je ein zusätzliches Kriterium. |
| FIND-003 | Möglicher Widerspruch: FR-015 nennt fünf Zustände ohne Verarbeitung und ohne Fehlerzustände, FR-004 und FR-008 verlangen Fehlermeldungen, der Leitablauf nennt „Verarbeiten“. | FR-015, FR-004, FR-008 | Offen für P03 (Zustände in DESIGN.md) und P06. |
| FIND-004 | Kriterien nennen deutsche Bedienbezeichnungen („Kamera starten“, „Neu aufnehmen“, „Übernehmen“, „Teilen“), obwohl die Oberflächensprache offen ist. | FR-001, FR-004, FR-008, FR-009, FR-025, OQ-001 | Gelten als Arbeitsnamen bis OQ-001 beantwortet ist (P03). |
| FIND-005 | „die Prüfung läuft automatisiert“ steht im Ergebnis eines Kriteriums; das ist eine Prüfvorgabe aus dem Zielbild, Abschnitt „Qualitätsziele“, kein Produktergebnis. | FR-006-AC-1, FR-008-AC-1 | Belassen, um die Vorgabe nicht abzuschwächen; Abbildung als Gate in P09/P10. |
| FIND-006 | `ready`-Datensätze mit offener Frage. Die Fragen blockieren laut Tabelle oben Tests oder spätere Stufen, nicht das Verhalten; „lesbar“ und „ohne sichtbare Verzerrung“ sind erst mit OQ-002 messbar. | FR-006, FR-007, FR-008 (OQ-002), FR-011 (OQ-004), FR-018 (OQ-005) | Status `ready` beibehalten; OQ-002 vor Testerstellung klären. |

## Schrittstatus

| Schritt | Status | Ergebnis | Prüfungen |
| --- | --- | --- | --- |
| P01 | abgeschlossen, von Alex akzeptiert | `REQUIREMENTS.md`, 26 Datensätze `docs/requirements/FR-001` bis `FR-026` (21 ready, 5 draft), dieses Journal | ID-Eindeutigkeit, JSON-Gültigkeit, Pflichtfelder und relative Links per Skript geprüft (siehe Durchlaufprotokoll) |
| P02 | bereit zum Review | [`docs/requirements/TEMPLATE.md`](requirements/TEMPLATE.md); FR-004 und FR-008 sprachlich beobachtbar gemacht; Link in `REQUIREMENTS.md`; Befunde FIND-001 bis FIND-006 | Formatprüfung per Ad-hoc-Python-Skript außerhalb des Repos (P02 legt keine Werkzeuge an): 26 FR, 39 AC, JSON, Pflichtfelder, IDs, Überschriften, OQ-Bezüge, relative Links und Anker fehlerfrei; Fehlerprobe erkannt (siehe Durchlaufprotokoll) |
| P03–P10 | offen | – | – |

## Durchlaufprotokoll (Funktionsprüfung der Prompt Library)

Maßstab: Prüfprotokoll in der Library (`lib/README.md`, PL-WEB-4.0, Stand 14.10.2026).
Status je Prüfung: erfüllt / nicht erfüllt / nicht geprüft. Gesamtstatus:
**bedingt bestanden** bis L01–L07 und alle Schrittergebnisse belegt sind.

### Zähler

| Schritt | Fragen an Alex | Freitexteingaben | Unterbrechungen | Dauer |
| --- | --- | --- | --- | --- |
| P01 | 0 | 2 (Startbefehl „Starte“, Review-Kommentar) | 1 (Rückweisung im Review) | 15:29:59Z bis 15:34:20Z (Commit), gemessen an Thread-Start und Systemzeit |
| P02 | 0 | 1 (Startbefehl) | 0 | 16:16:32Z bis 16:19:49Z (Commit), gemessen an Startnachricht und Systemzeit; Review-Zeit nicht enthalten |

### Library-Prüfungen

| ID | Status | Beleg | Aktion | Verbleibende Lücke |
| --- | --- | --- | --- | --- |
| L01 | nicht geprüft (P01, P02 erfüllt) | P01 lief mit Zielbild und Repo-Zugriff; P02 lief allein mit seinen Eingaben (`REQUIREMENTS.md`, FR-Datensätze, Journal) von `main` (`dda0896`), ohne spätere Schritte vorauszusetzen | P01, P02 ausgeführt | P03–P10 ausstehend |
| L02 | nicht geprüft (P01, P02 ohne Frage) | P01 und P02 stellten keine Frage; Befunde aus P02 sind mit Vorschlag erfasst statt abgefragt | – | Fragen späterer Schritte |
| L03 | teilweise erfüllt | P02 startete in einer neuen Session ohne Chat-Historie von P01, aus den Dateien auf `main` (`dda0896`) und der Library. Zusätzlich lagen Projektnotizen und ein Auftragstext der Projektsitzung vor (Arbeitsregeln, keine Inhalte) | P02 ausgeführt | Fortsetzung nach Pause mit aktiver Frage nicht geprüft |
| L04 | erfüllt (maschinell), manuelle Checkliste nicht geprüft | Block „COMMON CONTRACT“ bis „END COMMON CONTRACT“ aus allen zehn Dateien extrahiert: je 87 Zeilen, identischer SHA-256 (Präfix `83aec07fa6aca7ba`); zu Beginn von P02 unverändert wiederholt | Vergleich per Shell-Skript, 14.10.2026 (P01 und P02) | Library verlangt Abgleich als Checkliste ohne Helper; dieser steht aus. Der Library-Ordner ist kein Git-Repo, daher kein Git-Bezug |
| L05 | nicht geprüft (P01-, P02-Ergebnisse vorhanden) | siehe Schrittergebnisse; mögliche Widersprüche als FIND-001 bis FIND-006 erfasst | – | P03–P10, Behandlung der Befunde in P06 |
| L06 | nicht geprüft | – | – | P10 |
| L07 | nicht geprüft (P01 erfüllt, P02 ausstehend) | Status und Review je Schritt dokumentiert; Ergebnis als PR, kein Push auf `main`, kein Merge ohne Anweisung | P02-PR erstellt, nur Selbstreview | Review von P02 durch Alex; spätere Schritte |

### Schrittergebnisse

| Schritt | Prüfung | Status | Beleg | Lücke |
| --- | --- | --- | --- | --- |
| P01 | 1: Nutzeraufgaben und Grenzen in REQUIREMENTS.md und FRs | erfüllt (Review Alex) | Jeder Zielbild-Abschnitt ist mindestens einem FR oder REQUIREMENTS.md zugeordnet | keine |
| P01 | 2: Offene Fragen mit Fundstellen, Journal, Befugnisse, kein Stack | erfüllt (Review Alex) | Abschnitte „Offene Fragen“ und „Delegation und Befugnisse“; keine Technik gewählt | keine |
| P02 | 1: TEMPLATE.md und FRs im selben Format, beobachtbare Kriterien, gültige Referenzen | erfüllt (Selbstreview) | Formatprüfung: 26 FR, 39 AC, keine Fehler; Fehlerprobe mit kaputtem JSON und doppelter AC-ID wurde zurückgewiesen (2 von 2 Fehlern gemeldet). Kriterien in FR-004 und FR-008 ohne „verständlich“ formuliert | Beobachtbarkeit von „lesbar“ hängt an OQ-002 (FIND-006); Prüfung noch nicht automatisiert (P10) |
| P02 | 2: Bedeutungen und IDs erhalten, Platzhalter keine Produktanforderungen | erfüllt (Selbstreview) | Keine ID, Quelle, Basis oder Status geändert; Diff betrifft nur drei Kriterientexte. Beispiel in TEMPLATE.md nutzt `FR-PLACEHOLDER`, liegt nicht unter `FR-*.md` und ist nicht in `REQUIREMENTS.md` gelistet | Menschliches Review ausstehend |
