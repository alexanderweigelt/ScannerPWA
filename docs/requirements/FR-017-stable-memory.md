# FR-017 – Speicherverbrauch bei wiederholtem Scannen stabil

```json
{
  "id": "FR-017",
  "title": "Speicherverbrauch bei wiederholtem Scannen stabil",
  "status": "ready",
  "statement": "Wenn die Person wiederholt aufnimmt, verwirft und neu aufnimmt, soll der Speicherverbrauch der App nicht stetig steigen.",
  "basis": "supplied",
  "source_refs": [
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „Qualitätsziele“",
    "Antwort von Alex auf OQ-005, 15.10.2026 07:23:07Z, siehe [Journal, Antworten](../clarifications.md#antworten)"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-017-AC-1",
      "given": "Die App läuft in Chromium und hat 5 Scan-Zyklen zum Aufwärmen durchlaufen; danach werden Ausgangswerte nach Garbage Collection erfasst.",
      "when": "20 weitere Zyklen aus Aufnehmen, Verarbeiten und Verwerfen folgen.",
      "then": "Der JS-Heap liegt nach erneuter Garbage Collection höchstens 10 % über dem Ausgangswert; die Zahl offener Objekt-URLs und Canvas-Flächen größer 0 × 0 ist nach jedem Zyklus wieder gleich dem Ausgangswert.",
      "test_refs": []
    }
  ],
  "open_question_ids": []
}
```
