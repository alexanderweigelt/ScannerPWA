# FR-023 – Exportformat A4 oder Letter wählen

```json
{
  "id": "FR-023",
  "title": "Exportformat A4 oder Letter wählen",
  "status": "draft",
  "statement": "Wenn die Person vor dem Export das Seitenformat Letter wählt, soll die App das PDF im Format Letter hoch erzeugen; ohne Auswahl bleibt A4 hoch.",
  "basis": "supplied",
  "source_refs": [
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „Ausbaustufen“",
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „UX-Anforderungen“"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-023-AC-1",
      "given": "Keine Formatauswahl wurde getroffen.",
      "when": "Die Person exportiert.",
      "then": "Das PDF ist A4 hoch.",
      "test_refs": []
    },
    {
      "id": "FR-023-AC-2",
      "given": "Die Person hat Letter gewählt.",
      "when": "Sie exportiert.",
      "then": "Das PDF ist Letter hoch (8,5 × 11 in).",
      "test_refs": []
    }
  ],
  "open_question_ids": [
    "OQ-003"
  ]
}
```
