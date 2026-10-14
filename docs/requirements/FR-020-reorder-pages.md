# FR-020 – Seiten umsortieren

```json
{
  "id": "FR-020",
  "title": "Seiten umsortieren",
  "status": "ready",
  "statement": "Wenn die Person in der Seitenliste eine Seite an eine andere Position verschiebt, soll die App die angezeigte Reihenfolge entsprechend ändern.",
  "basis": "supplied",
  "source_refs": [
    "https://claude.ai/code/artifact/f047bfc6-ec21-486c-a9f9-e126312b5b1a (Zielbild Scanner PWA, Abschnitt „Kernfunktionen und Nutzerablauf“)",
    "https://claude.ai/code/artifact/f047bfc6-ec21-486c-a9f9-e126312b5b1a (Zielbild Scanner PWA, Abschnitt „Ausbaustufen“)"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-020-AC-1",
      "given": "Die Seitenliste enthält A, B, C.",
      "when": "Die Person verschiebt C an die erste Position.",
      "then": "Die Seitenliste zeigt C, A, B.",
      "test_refs": []
    }
  ],
  "open_question_ids": []
}
```
