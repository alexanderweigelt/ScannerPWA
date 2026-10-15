# Issue-Zuordnung – Scanner PWA

Nur im verknüpften Modus (Antwort D-P10-3: GitHub-Issues, [Journal](clarifications.md#antworten)). Regeln: [Arbeitsplan, Nachverfolgung](work-plan.md#nachverfolgung).

| Feld | Wert |
| --- | --- |
| Anbieter | GitHub |
| Ziel | `alexanderweigelt/ScannerPWA` (Issues) |
| Markierung | erste Zeile des Issue-Texts `<!-- scannerpwa-wp: WP-NNN -->` |
| Letzter Abgleich | 15.10.2026, nach Anlage gelesen (Liste offener Issues, Stand `updated_at` je Zeile) |
| Ausstehende Operationen | keine |

## Feldzuordnung

| Gemeinsames Feld | Arbeitsplan | GitHub-Issue |
| --- | --- | --- |
| Titel | `WP-NNN` + Titel in „Übersicht“ | Titel |
| Umfang/Ergebnis | „Zweck“ im Paketabschnitt | Absatz nach der Markierung |
| FR/AC-Bezüge | Spalte „Kriterien“ | Zeile „Kriterien“ |
| Abhängigkeiten | Spalte „Abhängig von“ | Zeile „Abhängig von“ (WP-IDs) |
| Priorität | Spalte „Priorität“ | Zeile „Priorität“ und Label `prio:…` |
| Workflow-Status | Spalte „Status“: `entwurf`, `geplant`, `in Arbeit` → offen; `geliefert` → geschlossen (`completed`) | offen/geschlossen |

Nur bei GitHub: Label `arbeitspaket`, Zuständige, Kommentare, Meilensteine; sie werden nicht abgeglichen und nicht überschrieben.

## Zuordnung und letzte gemeinsame Werte

Gemeinsame Werte B = Stand von `docs/work-plan.md` in diesem Commit und Issue-Text wie angelegt; beim Anlegen identisch.

| WP | Issue | Remote-ID | Titel (B) | Priorität (B) | Status (B) | Issue-Stand (`updated_at`) |
| --- | --- | --- | --- | --- | --- | --- |
| WP-001 | [#22](https://github.com/alexanderweigelt/ScannerPWA/issues/22) | 5867324666 | Initiales Projekt-Setup und Prüfgrundlage | hoch | geplant / offen | 2026-10-15T13:44:49Z |
| WP-002 | [#23](https://github.com/alexanderweigelt/ScannerPWA/issues/23) | 5867328696 | App-Schale, Zustände und Schutz vor Einbettung | hoch | geplant / offen | 2026-10-15T13:45:02Z |
| WP-003 | [#24](https://github.com/alexanderweigelt/ScannerPWA/issues/24) | 5867330584 | Kamera starten, auswählen, Vorschau, Aufnahme | hoch | geplant / offen | 2026-10-15T13:45:08Z |
| WP-004 | [#25](https://github.com/alexanderweigelt/ScannerPWA/issues/25) | 5867331651 | Bildverarbeitung im Worker mit Referenzbildern | hoch | geplant / offen | 2026-10-15T13:45:12Z |
| WP-005 | [#26](https://github.com/alexanderweigelt/ScannerPWA/issues/26) | 5867333049 | Verarbeiten, Ergebnis-Vorschau und Abbruch | hoch | geplant / offen | 2026-10-15T13:45:16Z |
| WP-006 | [#27](https://github.com/alexanderweigelt/ScannerPWA/issues/27) | 5867333954 | PDF-Writer und Export einer Seite | hoch | geplant / offen | 2026-10-15T13:45:19Z |
| WP-007 | [#28](https://github.com/alexanderweigelt/ScannerPWA/issues/28) | 5867335998 | Diagnosemodus im Entwicklungs-Build | mittel | geplant / offen | 2026-10-15T13:45:25Z |
| WP-008 | [#29](https://github.com/alexanderweigelt/ScannerPWA/issues/29) | 5867336902 | Installierbar, offline, Unterpfad | mittel | geplant / offen | 2026-10-15T13:45:29Z |
| WP-009 | [#30](https://github.com/alexanderweigelt/ScannerPWA/issues/30) | 5867338130 | Nachweis Datenabfluss und Speicher | mittel | geplant / offen | 2026-10-15T13:45:32Z |
| WP-010 | [#31](https://github.com/alexanderweigelt/ScannerPWA/issues/31) | 5867339179 | Deployment und Abnahme Stufe 1 | mittel | geplant / offen | 2026-10-15T13:45:36Z |
| WP-011 | [#32](https://github.com/alexanderweigelt/ScannerPWA/issues/32) | 5867340085 | Seitenliste: hinzufügen, löschen, umsortieren | niedrig | geplant / offen | 2026-10-15T13:45:39Z |
| WP-012 | [#33](https://github.com/alexanderweigelt/ScannerPWA/issues/33) | 5867341098 | Mehrseitiges PDF | niedrig | geplant / offen | 2026-10-15T13:45:43Z |
| WP-013 | [#34](https://github.com/alexanderweigelt/ScannerPWA/issues/34) | 5867341871 | Stufe 3 Komfort | – | entwurf / offen | 2026-10-15T13:45:45Z |
