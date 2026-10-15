# FR-015 – Eindeutige App-Zustände

```json
{
  "id": "FR-015",
  "title": "Eindeutige App-Zustände",
  "status": "ready",
  "statement": "Die App soll sich jederzeit in genau einem erkennbaren Zustand befinden: Start, Kamera aktiv, Scan-Vorschau, Seitenliste oder Export; Verarbeitung, PDF-Erstellung, Fehler und Hinweise sind sichtbar benannte Teilzustände eines dieser Zustände und bieten jeweils mindestens eine Aktion.",
  "basis": "supplied",
  "source_refs": [
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „UX-Anforderungen“",
    "Antwort von Alex auf OQ-009, 15.10.2026 06:50:30Z, siehe [Journal, Antworten](../clarifications.md#antworten)"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-015-AC-1",
      "given": "Die App wird durch den Leitablauf und alle Fehlerwege geführt.",
      "when": "Ein beliebiger Zeitpunkt wird betrachtet.",
      "then": "Genau ein Zustand ist sichtbar erkennbar und es gibt keinen Zustand ohne verfügbare Aktion.",
      "test_refs": []
    },
    {
      "id": "FR-015-AC-2",
      "given": "Eine Seite wird verarbeitet oder das PDF wird erstellt.",
      "when": "Die Person wählt während der Verarbeitung „Neu aufnehmen“ bzw. während der PDF-Erstellung „Abbrechen“.",
      "then": "Der Vorgang endet ohne Ergebnis; nach „Neu aufnehmen“ ist die Live-Vorschau aktiv, nach „Abbrechen“ zeigt die Seitenliste unveränderte Seiten.",
      "test_refs": []
    },
    {
      "id": "FR-015-AC-3",
      "given": "Die Verarbeitung einer Seite oder die PDF-Erstellung dauert länger als die Zeitgrenze (Wert UNKNOWN, OQ-010).",
      "when": "Die Zeitgrenze ist erreicht.",
      "then": "Die App beendet den Vorgang und zeigt eine Meldung mit Ursache und der Aktion „Neu aufnehmen“ bzw. „Erneut versuchen“.",
      "test_refs": []
    }
  ],
  "open_question_ids": [
    "OQ-010"
  ]
}
```
