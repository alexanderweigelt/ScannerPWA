# Scanner PWA

Mobiler Dokumentenscanner, der vollständig im Browser läuft: Dokument
fotografieren, automatisch als flache, gut lesbare A4-Seite aufbereiten und als
PDF herunterladen. Bilder verlassen das Gerät nie.

> **Versuchsprojekt:** Scanner PWA erprobt, wie sich ein komplexes Projekt mit
> Unterstützung unterschiedlicher KI-Coding-Agents umsetzen lässt; Grundlage
> des Vorgehens ist die AI Prompt Library (PL-WEB-4.0). Hintergrund und
> Projektvision stehen im [Wiki](https://github.com/alexanderweigelt/ScannerPWA/wiki).

## Stand

**Nur Spezifikation, noch kein Produktcode.** Es gibt keine lauffähige App,
keine Tests, keine CI und kein Deployment aus diesem Stand. Was unter der
Projektadresse mit dem Unterpfad `/ScannerPWA/` gegebenenfalls ausgeliefert
wird, stammt nicht aus diesem Stand.

| Feld | Wert |
| --- | --- |
| Spezifikationsbaseline | Commit `827177c` auf `main` (P07, Squash-Merge von PR #17), Bericht in [docs/baseline-review.md](docs/baseline-review.md); kein Tag |
| Automatische Spezifikationsprüfung | geplant (P10), bisher nur manuell geprüft |
| Arbeitsschritt | P08 Projekt-README; Verlauf und nächster Schritt im [Klärungsjournal](docs/clarifications.md#stand) |

## Zweck und Nutzer

Primär nutzen Personen die App unterwegs mit der Rückkamera eines Smartphones
(Android oder iOS), sekundär mit einer Laptop-Webcam. Es gibt keine Konten und
keinen Server. Die Oberfläche ist deutsch.

Leitablauf: Kamera starten → Aufnehmen → Verarbeiten → Vorschau → Seite
hinzufügen → PDF exportieren.

Geplanter Umfang in drei Ausbaustufen (Einzelseite, mehrseitig, Komfort); der
Status jeder Anforderung steht in [REQUIREMENTS.md](REQUIREMENTS.md). Maßstab
ist das Zielbild Scanner PWA (angenommen von Alex, 14.10.2026).

## Wo was steht

| Thema | Maßgebliche Datei |
| --- | --- |
| Fachliches Verhalten | Datensätze in [docs/requirements](docs/requirements/), Überblick in [REQUIREMENTS.md](REQUIREMENTS.md), Format in [TEMPLATE.md](docs/requirements/TEMPLATE.md) |
| Gestaltung und Zugänglichkeit | [DESIGN.md](DESIGN.md) |
| Architektur, Diagramme, geplante Kommandos | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Technische Entscheidungen | [ADRs in docs/adr](docs/adr/README.md) |
| Sicherheit, Bedrohungsmodell, Meldeweg | [SECURITY.md](SECURITY.md) |
| Offene Fragen, Antworten, Befugnisse, Verlauf | [docs/clarifications.md](docs/clarifications.md) |
| Prüfung der Spezifikation | [docs/baseline-review.md](docs/baseline-review.md) |
| Arbeitsregeln für Coding-Agents | `AGENTS.md`, geplant als nächster Schritt (P09), noch nicht vorhanden |

**Neues Verhalten** wird zuerst als Anforderungsdatensatz unter
`docs/requirements/` nach der Vorlage beschrieben und in REQUIREMENTS.md
verlinkt. **Bestehende Entscheidungen** stehen in den ADRs (Technik), in
SECURITY.md (Sicherheit), in DESIGN.md (Gestaltung) und mit Antwort und
Quelle im Klärungsjournal. Diese README wiederholt keine dieser Festlegungen.

## Voraussetzungen und Kommandos

**Verfügbar:** Das Repository enthält nur Markdown-Dateien. Zum Lesen und
Mitarbeiten genügen Git und ein Markdown-Betrachter. Es gibt kein
`package.json` und damit noch keine ausführbaren Projektkommandos.

**Geplant (Einrichtung in P10, nicht ausgeführt):** Laufzeit Node 24 und die
Kommandos aus [ARCHITECTURE.md, Abschnitt 10.4](ARCHITECTURE.md#104-geplante-kommandos-und-gates),
darunter `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test:unit`,
`npm run build`, `npm run test:e2e`, `npm run test:a11y` und der automatische
Spezifikationscheck `npm run check:spec`. Diese Kommandos funktionieren erst,
wenn P10 sie angelegt und tatsächlich ausgeführt hat.

## Weiterarbeiten

1. Im [Klärungsjournal](docs/clarifications.md#stand) „Nächster Schritt“ und
   „Aktive Frage“ lesen.
2. Die dort genannten maßgeblichen Dateien lesen, bevor etwas geändert wird.
3. Auf einem eigenen Branch arbeiten und das Ergebnis als Pull Request
   vorlegen.

## Mitarbeit

* Kleine, einzeln prüfbare Änderungen, je Änderung ein Pull Request.
* Nur die zuständige Datei ändern (siehe „Wo was steht“); keine doppelten
  Festlegungen.
* Bei jeder verhaltensändernden Änderung betroffene Anforderungen und Tests
  prüfen und nötige Anpassungen im selben Pull Request vornehmen.
* Vor dem Review prüfen: Links, IDs und, sobald vorhanden, die Kommandos aus
  ARCHITECTURE.md 10.4.
* Kein Push auf `main`; Merge und jede Veröffentlichung nur auf ausdrückliche
  Anweisung von Alex.
* Sicherheitslücken vertraulich melden, wie in
  [SECURITY.md](SECURITY.md#schwachstellen-melden) beschrieben.

## Bekannte Grenzen

* Kein Produktcode; keine Aussage über Funktion, Zugänglichkeit oder
  Sicherheit der App ist am Produkt nachgewiesen.
* Offene Punkte und Blocker stehen in
  [docs/baseline-review.md](docs/baseline-review.md#offene-punkte-und-blocker),
  darunter echte Referenzfotos, die Zeitgrenze OQ-010 und die
  Antwortheader der GitHub Page.
* Die Funktionsprüfung der AI Prompt Library in diesem Projekt ist
  **bedingt bestanden**, bis alle Prüfungen belegt sind
  ([Durchlaufprotokoll](docs/clarifications.md#durchlaufprotokoll-funktionsprüfung-der-prompt-library)).
