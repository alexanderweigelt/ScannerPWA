---
status: proposed
date: 2026-10-14
decision-makers: Alex (Annahme ausstehend)
consulted: –
informed: –
---

# ADR-0003 – Eigener minimaler PDF-Writer

## Context and Problem Statement

Die App erzeugt auf dem Gerät ein PDF mit einer A4-Hochformatseite je
übernommenem Scan, in angezeigter Reihenfolge, auch offline
([FR-010](../requirements/FR-010-export-pdf.md),
[FR-021](../requirements/FR-021-multipage-pdf.md)). Jede Seite ist ein
einzelnes Rasterbild ohne Text, Schrift oder Formular. Womit wird das PDF
geschrieben?

## Decision Drivers

* Nur Bildseiten in fester Größe 595,28 × 841,89 pt (210 × 297 mm).
* Keine Laufzeitabhängigkeit ohne Not; Lieferkette (P05).
* Prüfbarkeit: Seitenzahl, Seitengröße und Reihenfolge im Test auslesbar.
* Stufe 3 sieht Letter und Qualitätsstufen vor ([FR-023](../requirements/FR-023-page-format.md), [FR-024](../requirements/FR-024-quality-size.md)).

## Considered Options

* Eigener Writer: je Seite ein JPEG-Bild (`/DCTDecode`), Katalog, Seitenbaum, Querverweistabelle
* `pdf-lib` (npm 1.17.1, letzte Veröffentlichung 2022)
* `jspdf` (npm 4.2.1, 2026)

## Decision Outcome

Chosen option: "Eigener Writer", because ein PDF aus JPEG-Seiten nur wenige
Objekte nach ISO 32000 braucht, das JPEG unverändert eingebettet werden kann
(kein Neukodieren) und dadurch keine Bibliothek ausgeliefert werden muss.

Seiten werden nach der Übernahme einmal als JPEG kodiert (Qualität als
Konstante, Startwert 0,92; FR-007 „ohne sichtbare Qualitätseinbuße“ wird mit
OQ-002 gemessen). Seitengröße und Bildqualität sind Parameter, damit FR-023
und FR-024 ohne neuen Writer möglich sind.

### Consequences

* Good, because keine Abhängigkeit und kleiner Code mit eindeutigem Verhalten.
* Good, because das gespeicherte JPEG je Seite ist zugleich die speichersparende Form der Seitenliste (FR-017).
* Bad, because PDF-Struktur wird selbst geschrieben; Fehler zeigen sich erst beim Öffnen. Maßnahme: Test parst das Ergebnis mit einem unabhängigen Leser (Dev-Abhängigkeit, Auswahl P10).

### Confirmation

Unit-Test erzeugt 1 und 3 Seiten und prüft mit einem unabhängigen PDF-Parser
Seitenzahl, MediaBox und Reihenfolge (FR-010-AC-1, FR-021-AC-1).

## Pros and Cons of the Options

### `pdf-lib`

* Good, because ausgereifte API, kann JPEG einbetten.
* Bad, because seit 2022 ohne Veröffentlichung; ungepflegte Laufzeitabhängigkeit.
* Bad, because deutlich mehr Funktionsumfang als nötig.

### `jspdf`

* Good, because gepflegt und verbreitet.
* Bad, because großer Funktionsumfang (Text, HTML, Schriften) und größeres Bundle für reine Bildseiten.

## More Information

PDF-Aufbau nach ISO 32000-2:2020 (PDF 2.0); Seitengröße A4 nach ISO 216.
