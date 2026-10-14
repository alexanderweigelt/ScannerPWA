# FR-021 – Mehrseitiges PDF in angezeigter Reihenfolge

```json
{
  "id": "FR-021",
  "title": "Mehrseitiges PDF in angezeigter Reihenfolge",
  "status": "ready",
  "statement": "Wenn die Seitenliste mehrere Seiten enthält und die Person den Export auslöst, soll die App ein PDF erzeugen, das jede Seite genau einmal in exakt der angezeigten Reihenfolge enthält.",
  "basis": "supplied",
  "source_refs": [
    "https://claude.ai/code/artifact/f047bfc6-ec21-486c-a9f9-e126312b5b1a (Zielbild Scanner PWA, Abschnitt „Kernfunktionen und Nutzerablauf“)",
    "https://claude.ai/code/artifact/f047bfc6-ec21-486c-a9f9-e126312b5b1a (Zielbild Scanner PWA, Abschnitt „Ausbaustufen“)"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-021-AC-1",
      "given": "Die Seitenliste zeigt C, A, B.",
      "when": "Die Person exportiert das PDF.",
      "then": "Das PDF hat drei A4-Hochformatseiten in der Reihenfolge C, A, B.",
      "test_refs": []
    }
  ],
  "open_question_ids": []
}
```
