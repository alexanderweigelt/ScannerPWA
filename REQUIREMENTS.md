# Anforderungen – Scanner PWA

Überblick über die fachlichen Anforderungen. Maßgeblich sind die verlinkten
Datensätze unter [docs/requirements](docs/requirements/); diese Datei fasst sie
nur zusammen. Offene Fragen, Entscheidungen und Status stehen in
[docs/clarifications.md](docs/clarifications.md).
Neue und geänderte Datensätze folgen der
[Vorlage für Anforderungsdatensätze](docs/requirements/TEMPLATE.md).

**Grundlage:** das von Alex am 14.10.2026 angenommene
Zielbild Scanner PWA
(Basis `supplied`). Technik, Frameworks und Architektur werden erst in P04
entschieden.

## Zweck

Scanner PWA ist ein mobiler Dokumentenscanner, der vollständig im Browser läuft:
Dokument fotografieren, automatisch als flache, gut lesbare A4-Seite aufbereiten
und als PDF herunterladen. Bilder verlassen das Gerät nie. Die App ist
installierbar und nach dem ersten Besuch offline nutzbar.

**Leitablauf:** Kamera starten → Aufnehmen → Verarbeiten → Vorschau → Seite
hinzufügen → PDF exportieren, mit möglichst wenig Reibung.

## Akteure

| Akteur | Beschreibung |
| --- | --- |
| Person mit Smartphone (primär) | Digitalisiert unterwegs ein Papierdokument mit der Rückkamera, Android oder iOS. |
| Person mit Laptop/Desktop (sekundär) | Nutzt eine Webcam. |
| Maintainer | Prüft Scanqualität über Referenzbilder und Diagnosemodus. |

Es gibt keine Konten, Rollen oder serverseitigen Akteure. Die Sprache der
Oberfläche ist Deutsch (OQ-001, Antwort von Alex am 14.10.2026, siehe
[Antworten](docs/clarifications.md#antworten)).

## Rahmenbedingungen (vorgegeben)

Diese Punkte sind extern vorgegebene Fakten, keine technischen Entscheidungen:

- Auslieferung als statische GitHub Page unter
  `https://alexanderweigelt.github.io/ScannerPWA/`, ohne Serverkomponente
  ([FR-014](docs/requirements/FR-014-subpath-hosting.md)).
- Bildverarbeitung und PDF-Erzeugung vollständig auf dem Gerät, kein Upload,
  keine Laufzeit-Ressourcen von Fremdservern
  ([FR-011](docs/requirements/FR-011-on-device-only.md)).
- Kamerazugriff nur nach Zustimmung über HTTPS
  ([FR-001](docs/requirements/FR-001-start-camera.md)).

## Datenflüsse

Kamerabild → Foto → entzerrte Seite → Seitenliste → PDF-Download. Alle Daten
bleiben im Arbeitsspeicher des Geräts. Lokale Entwürfe sind erst für Stufe 3
vorgesehen und noch offen ([OQ-004](docs/clarifications.md#offene-fragen)).

## Anforderungen nach Ausbaustufe

### Stufe 1 – Einzelseite

| ID | Titel | Status |
| --- | --- | --- |
| [FR-001](docs/requirements/FR-001-start-camera.md) | Kamera auf Nutzeraktion starten | ready |
| [FR-002](docs/requirements/FR-002-camera-fallback.md) | Kamera automatisch auswählen | ready |
| [FR-003](docs/requirements/FR-003-live-preview.md) | Live-Vorschau im Hochformat | ready |
| [FR-004](docs/requirements/FR-004-camera-errors.md) | Kamerafehler verständlich behandeln | ready |
| [FR-005](docs/requirements/FR-005-capture-photo.md) | Foto in voller Auflösung aufnehmen | ready |
| [FR-006](docs/requirements/FR-006-detect-and-rectify.md) | Dokument erkennen und entzerren | ready |
| [FR-007](docs/requirements/FR-007-scan-look.md) | Kontrastreichen Scan-Look erzeugen | ready |
| [FR-008](docs/requirements/FR-008-detection-failure.md) | Fehlgeschlagene Erkennung wiederholbar machen | ready |
| [FR-009](docs/requirements/FR-009-result-preview.md) | Ergebnis-Vorschau mit Übernehmen oder Neu aufnehmen | ready |
| [FR-010](docs/requirements/FR-010-export-pdf.md) | PDF exportieren und herunterladen | ready |
| [FR-011](docs/requirements/FR-011-on-device-only.md) | Bilder verlassen das Gerät nie | ready |
| [FR-012](docs/requirements/FR-012-installable-pwa.md) | Als App installierbar | ready |
| [FR-013](docs/requirements/FR-013-offline-use.md) | Offline nach dem ersten Besuch nutzbar | ready |
| [FR-014](docs/requirements/FR-014-subpath-hosting.md) | Unter dem Unterpfad /ScannerPWA/ voll funktionsfähig | ready |
| [FR-015](docs/requirements/FR-015-clear-states.md) | Eindeutige App-Zustände | ready |
| [FR-016](docs/requirements/FR-016-debug-steps.md) | Zwischenschritte zur Fehlersuche sichtbar machen | ready |
| [FR-017](docs/requirements/FR-017-stable-memory.md) | Speicherverbrauch bei wiederholtem Scannen stabil | draft |
| [FR-027](docs/requirements/FR-027-no-camera-when-framed.md) | Keine Kamera in eingebetteter Ansicht | ready |

### Stufe 2 – Mehrseitig

Muss bei Stufe 1 bereits mitgedacht werden.

| ID | Titel | Status |
| --- | --- | --- |
| [FR-018](docs/requirements/FR-018-add-page.md) | Weitere Seite hinzufügen | ready |
| [FR-019](docs/requirements/FR-019-delete-page.md) | Einzelne Seite löschen | ready |
| [FR-020](docs/requirements/FR-020-reorder-pages.md) | Seiten umsortieren | ready |
| [FR-021](docs/requirements/FR-021-multipage-pdf.md) | Mehrseitiges PDF in angezeigter Reihenfolge | ready |

### Stufe 3 – Komfort

| ID | Titel | Status |
| --- | --- | --- |
| [FR-022](docs/requirements/FR-022-manual-crop.md) | Zuschnitt manuell nachjustieren | draft |
| [FR-023](docs/requirements/FR-023-page-format.md) | Exportformat A4 oder Letter wählen | draft |
| [FR-024](docs/requirements/FR-024-quality-size.md) | Qualität bzw. Dateigröße wählen | draft |
| [FR-025](docs/requirements/FR-025-share-pdf.md) | PDF über das Teilen-Menü weitergeben | draft |
| [FR-026](docs/requirements/FR-026-restore-session.md) | Unterbrochene Sitzung lokal wiederherstellen | draft |

## Ausschlüsse

- Keine Serverkomponente, keine Konten, kein Upload, keine Cloud-Speicherung.
- Kein Nachladen von Ressourcen fremder Server zur Laufzeit.
- Texterkennung (OCR) ist nicht Teil des Zielbilds und daher nicht im Umfang
  (Beobachtung, keine ausdrückliche Vorgabe).
- Keine native App; installiert wird ausschließlich als PWA.

## Gemeinsame Ziele

Für das Projekt gelten die gemeinsamen Ziele korrektes spezifiziertes Verhalten,
zugängliche Bedienung (Ziel WCAG 2.2 AA), sichere Auslieferung und
Datenverarbeitung sowie wartbarer, reproduzierbarer Code. Messbare Kriterien,
Nachweise und Gates legen die zuständigen Dateien in späteren Schritten fest
(Gestaltung P03, Architektur P04, Sicherheit P05, Kommandos P09/P10).

Projektspezifische Qualitätsziele aus dem Zielbild: automatisiert geprüfte
Referenzbilder ([FR-006](docs/requirements/FR-006-detect-and-rectify.md),
[FR-008](docs/requirements/FR-008-detection-failure.md)), sichtbare
Zwischenschritte ([FR-016](docs/requirements/FR-016-debug-steps.md)),
automatisierte Ablaufprüfung auf Desktop- und Smartphone-Format, Prüfung der
Kamera auf echten Geräten (Smartphone mit Rückkamera, Laptop mit Webcam) und
stabiler Speicher ([FR-017](docs/requirements/FR-017-stable-memory.md)).
