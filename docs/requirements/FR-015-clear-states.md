# FR-015 – Eindeutige App-Zustände

```json
{
  "id": "FR-015",
  "title": "Eindeutige App-Zustände",
  "status": "ready",
  "statement": "Die App soll sich jederzeit in genau einem erkennbaren Zustand befinden: Start, Kamera aktiv, Scan-Vorschau, Seitenliste oder Export.",
  "basis": "supplied",
  "source_refs": [
    "https://claude.ai/code/artifact/f047bfc6-ec21-486c-a9f9-e126312b5b1a (Zielbild Scanner PWA, Abschnitt „UX-Anforderungen“)"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-015-AC-1",
      "given": "Die App wird durch den Leitablauf und alle Fehlerwege geführt.",
      "when": "Ein beliebiger Zeitpunkt wird betrachtet.",
      "then": "Genau ein Zustand ist sichtbar erkennbar und es gibt keinen Zustand ohne verfügbare Aktion.",
      "test_refs": []
    }
  ],
  "open_question_ids": []
}
```
