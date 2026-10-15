# Scanner PWA

Ziel ist ein mobiler Dokumentenscanner, der vollständig im Browser läuft:
Dokument fotografieren, automatisch als flache, gut lesbare A4-Seite aufbereiten
und als PDF herunterladen, ohne dass Bilder das Gerät verlassen. Gedacht für die
Rückkamera eines Smartphones unterwegs, sekundär für eine Laptop-Webcam;
installierbar und offline nutzbar, ohne Konten und ohne Server.

> **Versuchsprojekt:** Scanner PWA erprobt, wie sich ein komplexes Projekt mit
> Unterstützung unterschiedlicher KI-Coding-Agents umsetzen lässt; Grundlage
> des Vorgehens ist die AI Prompt Library (PL-WEB-4.0). Hintergrund und
> Projektvision stehen im [Wiki](https://github.com/alexanderweigelt/ScannerPWA/wiki).

> **Projektphase: Spezifikation.** Das Repository enthält die geprüfte
> Spezifikation. Anwendungscode, Build-, Test- und Deployment-Werkzeuge sind
> noch nicht umgesetzt; die Dokumentation belegt weder eine lauffähige App
> noch ihre Konformität. Baseline und offene Punkte stehen im
> [Baseline-Bericht](docs/baseline-review.md), der aktuelle Schritt im
> [Klärungsjournal](docs/clarifications.md#stand).

## Spezifikation

| Dokument | Inhalt |
| --- | --- |
| [Anforderungen](REQUIREMENTS.md) | Zweck, Akteure, Ausbaustufen und Überblick über die Anforderungsdatensätze in [docs/requirements](docs/requirements/) |
| [Vorlage für Anforderungen](docs/requirements/TEMPLATE.md) | Felder eines Anforderungsdatensatzes |
| [Design](DESIGN.md) | Gestaltung, Zustände und Zugänglichkeit |
| [Architektur](ARCHITECTURE.md) | Bausteine, Abläufe, Diagramme, Engineering-Regeln und Kommandos |
| [Entscheidungen (ADR)](docs/adr/README.md) | Technische Entscheidungen |
| [Sicherheit](SECURITY.md) | Bedrohungsmodell, Sicherheitsziele, Prüfplan und Meldeweg |
| [Klärungsjournal](docs/clarifications.md) | Offene Fragen, Antworten, Befugnisse, Verlauf und Durchlaufprotokoll |
| [Baseline-Bericht](docs/baseline-review.md) | Prüfung und Bezug der Spezifikation |
| [Agent-Anweisungen](AGENTS.md) | Arbeitsregeln, Kommandos und Gates für Coding-Agents; Agents ohne automatisches Laden von `AGENTS.md` lesen die Datei zu Beginn jeder Sitzung |

Diese README ist ein Einstieg, keine zweite Spezifikation. Neues Verhalten
wird als Anforderungsdatensatz nach der Vorlage beschrieben; bestehende
Entscheidungen stehen in der jeweils zuständigen Datei oben.

## Kommandos

Es gibt noch keine ausführbaren Projektkommandos; zum Lesen und Mitarbeiten
genügen Git und ein Markdown-Betrachter. Die geplanten Kommandos stehen in
[ARCHITECTURE.md, Abschnitt 10.4](ARCHITECTURE.md#104-geplante-kommandos-und-gates)
und gelten erst, wenn sie eingerichtet und ausgeführt sind.

## Mitarbeit

* Kleine, einzeln prüfbare Änderungen, je Änderung ein Pull Request; kein
  Push auf `main`, Merge und Veröffentlichung nur auf ausdrückliche Anweisung.
* Nur die zuständige Datei ändern; betroffene Anforderungen und Tests prüfen
  und nötige Anpassungen im selben Pull Request vornehmen.
* Vor dem Review Links und IDs prüfen.
* Sicherheitslücken vertraulich melden, wie in
  [SECURITY.md](SECURITY.md#schwachstellen-melden) beschrieben.
