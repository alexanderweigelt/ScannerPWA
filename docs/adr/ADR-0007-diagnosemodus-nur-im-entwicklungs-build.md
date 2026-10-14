---
status: accepted
date: 2026-10-14
decision-makers: Alex (Auswahl am 14.10.2026 17:23:00Z)
consulted: –
informed: –
---

# ADR-0007 – Diagnosemodus nur im Entwicklungs-Build

## Context and Problem Statement

Im Diagnosemodus zeigt die App die Zwischenschritte der Verarbeitung
([FR-016](../requirements/FR-016-debug-steps.md)); im normalen Ablauf gibt es
dafür keine sichtbare Bedienung (DESIGN.md, Abschnitt „Components“,
„Diagnosemodus“). Wie wird er aktiviert?

## Decision Drivers

* Keine zusätzliche Bedienung im normalen Ablauf.
* Im Test einschaltbar, auf echten Geräten möglichst ohne Entwicklerwerkzeuge.
* Funktioniert offline und unter dem Unterpfad.

## Considered Options

* URL-Parameter `?diagnose=1` beim Öffnen
* Versteckte Geste (z. B. langes Drücken auf den Titel)
* Nur im Entwicklungs-Build

## Decision Outcome

Chosen option: "Nur im Entwicklungs-Build" (Entscheidung Alex), because
Personen, die die veröffentlichte App nutzen, den Diagnosemodus nie sehen oder
einschalten können und die Diagnoseanzeige nicht in der ausgelieferten App
enthalten ist.

Umsetzung: Eine Build-Konstante (`import.meta.env.MODE === 'diagnose'` bzw.
eine per Vite `define` gesetzte Konstante) schaltet die Diagnose ein. Sie ist
an im Entwicklungsserver (`vite`) und in einem eigenen Build
(`vite build --mode diagnose`), aus im Produktions-Build, der veröffentlicht
wird. Der Produktions-Build enthält den Diagnose-Code nicht (Tree-Shaking über
die Konstante). FR-016-AC-2 („nicht aktiv“) gilt damit für die veröffentlichte
App immer.

### Consequences

* Good, because die veröffentlichte App hat keinen Diagnose-Schalter und keinen Diagnose-Code.
* Good, because kein URL-Parameter muss an einer Eingabegrenze ausgewertet werden.
* Bad, because auf echten Smartphones braucht der Diagnose-Build einen eigenen Weg aufs Gerät: Kamera nur über HTTPS, also lokaler Entwicklungsserver mit HTTPS oder eine getrennte Auslieferung. Der Weg wird bei der Umsetzung festgelegt (offene Folgefrage, kein Werkzeug hier gewählt).
* Bad, because Fehler, die nur auf dem Gerät einer Person auftreten, lassen sich nicht mit der veröffentlichten App diagnostizieren.

### Confirmation

Browser-Test gegen den Diagnose-Build prüft FR-016-AC-1; Browser-Test gegen
den Produktions-Build prüft FR-016-AC-2; Build-Prüfung stellt sicher, dass
`dist/` keinen Diagnose-Code enthält.

## Pros and Cons of the Options

### URL-Parameter `?diagnose=1`

* Good, because auf jedem Gerät mit der veröffentlichten App nutzbar.
* Bad, because jeder, der den Parameter kennt, kann ihn einschalten; Diagnose-Code wird ausgeliefert.

### Versteckte Geste

* Bad, because zufällig auslösbar und schwer zugänglich zu beschreiben.
