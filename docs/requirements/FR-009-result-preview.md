# FR-009 – Ergebnis-Vorschau mit Übernehmen oder Neu aufnehmen

```json
{
  "id": "FR-009",
  "title": "Ergebnis-Vorschau mit Übernehmen oder Neu aufnehmen",
  "status": "ready",
  "statement": "Wenn die Verarbeitung erfolgreich war, soll die App die erzeugte Seite als Vorschau mit den Aktionen „Übernehmen“ und „Neu aufnehmen“ anzeigen.",
  "basis": "supplied",
  "source_refs": [
    "https://claude.ai/code/artifact/f047bfc6-ec21-486c-a9f9-e126312b5b1a (Zielbild Scanner PWA, Abschnitt „Kernfunktionen und Nutzerablauf“)"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-009-AC-1",
      "given": "Eine Seite wurde erfolgreich verarbeitet.",
      "when": "Die Vorschau erscheint.",
      "then": "Die Seite und die Aktionen „Übernehmen“ und „Neu aufnehmen“ sind sichtbar.",
      "test_refs": []
    },
    {
      "id": "FR-009-AC-2",
      "given": "Die Ergebnis-Vorschau ist sichtbar.",
      "when": "Die Person wählt „Neu aufnehmen“.",
      "then": "Die Seite wird verworfen und die Live-Vorschau ist wieder aktiv.",
      "test_refs": []
    },
    {
      "id": "FR-009-AC-3",
      "given": "Die Ergebnis-Vorschau ist sichtbar.",
      "when": "Die Person wählt „Übernehmen“.",
      "then": "Die Seite steht für den PDF-Export bereit.",
      "test_refs": []
    }
  ],
  "open_question_ids": []
}
```
