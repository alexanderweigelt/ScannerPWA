# FR-024 – Qualität bzw. Dateigröße wählen

```json
{
  "id": "FR-024",
  "title": "Qualität bzw. Dateigröße wählen",
  "status": "draft",
  "statement": "Wenn die Person vor dem Export eine Qualitäts- bzw. Größenstufe wählt, soll die App das PDF mit dieser Stufe erzeugen.",
  "basis": "supplied",
  "source_refs": [
    "https://claude.ai/code/artifact/f047bfc6-ec21-486c-a9f9-e126312b5b1a (Zielbild Scanner PWA, Abschnitt „Ausbaustufen“)"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-024-AC-1",
      "given": "Dieselbe Seitenliste wird mit niedriger und mit hoher Stufe exportiert.",
      "when": "Beide PDFs werden verglichen.",
      "then": "Das PDF der niedrigen Stufe ist kleiner und der Text bleibt in beiden lesbar.",
      "test_refs": []
    }
  ],
  "open_question_ids": []
}
```
