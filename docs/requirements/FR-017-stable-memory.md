# FR-017 – Speicherverbrauch bei wiederholtem Scannen stabil

```json
{
  "id": "FR-017",
  "title": "Speicherverbrauch bei wiederholtem Scannen stabil",
  "status": "draft",
  "statement": "Wenn die Person wiederholt aufnimmt, verwirft und neu aufnimmt, soll der Speicherverbrauch der App nicht stetig steigen.",
  "basis": "supplied",
  "source_refs": [
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „Qualitätsziele“"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-017-AC-1",
      "given": "Die App läuft und hat bereits einige Scan-Zyklen durchlaufen.",
      "when": "Weitere Zyklen aus Aufnehmen, Verarbeiten und Verwerfen folgen.",
      "then": "Der belegte Speicher nach den weiteren Zyklen liegt innerhalb der in OQ-005 festzulegenden Toleranz des Ausgangswerts.",
      "test_refs": []
    }
  ],
  "open_question_ids": [
    "OQ-005"
  ]
}
```
