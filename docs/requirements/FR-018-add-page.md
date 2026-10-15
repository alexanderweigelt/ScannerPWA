# FR-018 – Weitere Seite hinzufügen

```json
{
  "id": "FR-018",
  "title": "Weitere Seite hinzufügen",
  "status": "ready",
  "statement": "Wenn mindestens eine Seite übernommen wurde und die Person „Seite hinzufügen“ auslöst, soll die App eine neue Aufnahme starten und die neue Seite nach Übernahme an das Ende der Seitenliste anfügen.",
  "basis": "supplied",
  "source_refs": [
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „Kernfunktionen und Nutzerablauf“",
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „Ausbaustufen“"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-018-AC-1",
      "given": "Die Seitenliste enthält eine Seite.",
      "when": "Die Person fügt eine weitere Seite hinzu und übernimmt sie.",
      "then": "Die Seitenliste enthält zwei Seiten, die neue an letzter Stelle.",
      "test_refs": []
    }
  ],
  "open_question_ids": [
    "OQ-011"
  ]
}
```
