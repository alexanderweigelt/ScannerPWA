# FR-019 – Einzelne Seite löschen

```json
{
  "id": "FR-019",
  "title": "Einzelne Seite löschen",
  "status": "ready",
  "statement": "Wenn die Person in der Seitenliste eine Seite löscht, soll die App genau diese Seite entfernen und die Reihenfolge der übrigen Seiten beibehalten.",
  "basis": "supplied",
  "source_refs": [
    "https://claude.ai/code/artifact/f047bfc6-ec21-486c-a9f9-e126312b5b1a (Zielbild Scanner PWA, Abschnitt „Kernfunktionen und Nutzerablauf“)",
    "https://claude.ai/code/artifact/f047bfc6-ec21-486c-a9f9-e126312b5b1a (Zielbild Scanner PWA, Abschnitt „Ausbaustufen“)"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-019-AC-1",
      "given": "Die Seitenliste enthält die Seiten A, B, C.",
      "when": "Die Person löscht B.",
      "then": "Die Seitenliste enthält A, C in dieser Reihenfolge.",
      "test_refs": []
    }
  ],
  "open_question_ids": []
}
```
