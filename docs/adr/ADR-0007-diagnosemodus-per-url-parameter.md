---
status: proposed
date: 2026-10-14
decision-makers: Alex (Annahme ausstehend)
consulted: –
informed: –
---

# ADR-0007 – Diagnosemodus per URL-Parameter

## Context and Problem Statement

Im Diagnosemodus zeigt die App die Zwischenschritte der Verarbeitung
([FR-016](../requirements/FR-016-debug-steps.md)); im normalen Ablauf gibt es
dafür keine sichtbare Bedienung (DESIGN.md, Abschnitt „Components“,
„Diagnosemodus“). Wie wird er aktiviert?

## Decision Drivers

* Keine zusätzliche Bedienung im normalen Ablauf.
* Im Test und auf echten Geräten ohne Entwicklerwerkzeuge einschaltbar.
* Funktioniert offline und unter dem Unterpfad.

## Considered Options

* URL-Parameter `?diagnose=1` beim Öffnen
* Versteckte Geste (z. B. langes Drücken auf den Titel)
* Build-Variante nur für Entwicklung

## Decision Outcome

Chosen option: "URL-Parameter `?diagnose=1`", because er auf jedem Gerät
eintippbar, im Test direkt setzbar und ohne Bedienelement ist. Der Wert wird
einmal beim Start gelesen; ohne den Parameter ist der Modus aus
(FR-016-AC-2). Der Service Worker beantwortet Navigationen unabhängig von
Suchparametern mit `index.html` (ADR-0004).

### Consequences

* Good, because keine versteckte Geste, die zufällig ausgelöst werden kann.
* Neutral, because der Parameter bleibt in der Adresse; eine installierte App startet ohne ihn (Start-URL `./`).
* Bad, because Diagnosedaten sind für jede Person einschaltbar; sie verlassen das Gerät aber nicht (FR-011).

### Confirmation

Browser-Test öffnet mit und ohne Parameter und prüft FR-016-AC-1/AC-2.

## Pros and Cons of the Options

### Versteckte Geste

* Bad, because zufällig auslösbar und schwer zugänglich zu beschreiben.

### Build-Variante nur für Entwicklung

* Bad, because auf der veröffentlichten Page und auf echten Geräten nicht nutzbar.
