# Vorlage für Anforderungsdatensätze

Verbindliches Format für alle fachlichen Anforderungen unter
`docs/requirements/FR-*.md`. Die Vorlage selbst ist keine Anforderung: Ihre
Beispielwerte sind als `PLACEHOLDER` markiert und gehören nicht in die Übersicht
[REQUIREMENTS.md](../../REQUIREMENTS.md).

Grundlagen: EARS (<https://alistairmavin.com/ears/>) für die Aussage,
Given/When/Then (<https://cucumber.io/docs/gherkin/reference/>) für die
Akzeptanzkriterien.

## Datei

- Dateiname: `FR-<dreistellige Nummer>-<kurzer-englischer-slug>.md`, z. B.
  `FR-001-start-camera.md`. Die Nummer wird nie neu vergeben.
- Erste Zeile: `# <id> – <title>` mit denselben Werten wie im JSON-Objekt.
- Danach genau ein Block ` ```json ` mit dem Objekt unten. Optionaler, nicht
  normativer Kontext steht darunter unter der Überschrift `## Kontext`.

## Felder

| Feld | Pflicht | Regel |
| --- | --- | --- |
| `id` | ja | `FR-` plus dreistellige Nummer; eindeutig und stabil. |
| `title` | ja | Kurzer Titel in Dokumentationssprache; identisch mit der Überschrift. |
| `status` | ja | `draft` (Inhalt oder Kriterien noch nicht belastbar) oder `ready` (mindestens ein Kriterium, keine offene Frage, die das Verhalten selbst blockiert). |
| `statement` | ja | Genau eine normative Aussage im EARS-Stil (siehe unten). Beschreibt beobachtbares Produktverhalten, keine technische Lösung. |
| `basis` | ja | Herkunft: `supplied` (vom Menschen vorgegeben), `observed` (im Bestand beobachtet), `proposed` (Vorschlag des Agenten, nicht bestätigt) oder `delegated` (vom Agenten im dokumentierten Delegationsumfang entschieden). |
| `source_refs` | ja | Mindestens eine nachvollziehbare Quelle, z. B. `Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „…“`, eine Antwort im [Journal](../clarifications.md) oder eine relative Datei. |
| `acceptance_criteria` | ja | Liste von Kriterien mit `id`, `given`, `when`, `then`, `test_refs` (siehe unten). |
| `open_question_ids` | ja | IDs offener Fragen aus dem [Journal](../clarifications.md#offene-fragen), z. B. `OQ-002`; sonst `[]`. |

Zusätzliche Felder wie `dependencies` oder Verweise auf `SEC-…` bzw.
Designkriterien kommen nur hinzu, wenn sie tatsächlich gebraucht werden. Regeln
aus DESIGN.md oder SECURITY.md werden verlinkt, nicht kopiert.

## Aussage im EARS-Stil

Eine Aussage beschreibt ein atomares Verhalten mit einem dieser Muster:

| Muster | Form |
| --- | --- |
| allgemein | Die App soll … |
| ereignisgesteuert | Wenn <Auslöser>, soll die App … |
| zustandsgesteuert | Während <Zustand>, soll die App … |
| unerwünschtes Verhalten | Wenn <Fehlerfall>, soll die App … |
| optional | Wo <Merkmal vorhanden ist>, soll die App … |

Die Aussage benennt eine Produktbedingung („die Seite ist A4 hoch“), keine
Umsetzung („mit Bibliothek X“). Unbekannte Werte heißen `UNKNOWN` und verweisen
auf eine offene Frage.

## Akzeptanzkriterien

- `id`: `<FR-ID>-AC-<laufende Nummer>`, eindeutig und stabil.
- `given`, `when`, `then`: je ein unabhängiges Kriterium. `then` nennt ein von
  außen beobachtbares oder messbares Ergebnis. Subjektive Begriffe wie „lesbar“
  brauchen ein Messverfahren oder eine offene Frage.
- `test_refs`: echte relative Pfade zu vorhandenen Testdateien. `[]` bedeutet
  „Test geplant“, nicht „geprüft“.

## Beispiel

```json
{
  "id": "FR-PLACEHOLDER",
  "title": "PLACEHOLDER Titel",
  "status": "draft",
  "statement": "Wenn PLACEHOLDER-Auslöser eintritt, soll die App PLACEHOLDER-Ergebnis anzeigen.",
  "basis": "proposed",
  "source_refs": [
    "PLACEHOLDER Quelle"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-PLACEHOLDER-AC-1",
      "given": "PLACEHOLDER Ausgangslage",
      "when": "PLACEHOLDER Aktion",
      "then": "PLACEHOLDER beobachtbares Ergebnis",
      "test_refs": []
    }
  ],
  "open_question_ids": []
}
```

## Prüfung

Vor jedem Commit mit geänderten Datensätzen gilt:

1. Jeder JSON-Block lässt sich fehlerfrei parsen.
2. Alle Pflichtfelder sind vorhanden; FR- und AC-IDs sind eindeutig.
3. Überschrift und `id`/`title` stimmen überein.
4. Jeder `ready`-Datensatz hat mindestens ein Kriterium und keine blockierende
   offene Frage.
5. `test_refs` und relative Links zeigen auf vorhandene Dateien; jede
   `OQ-…`-ID steht im Journal.

Eine bestandene Formatprüfung belegt nicht, dass das Verhalten sinnvoll oder
korrekt umgesetzt ist. Die automatische Ausführung dieser Prüfung wird in P10
eingerichtet; bis dahin wird sie manuell bzw. per Ad-hoc-Kommando ausgeführt und
im Journal festgehalten.
