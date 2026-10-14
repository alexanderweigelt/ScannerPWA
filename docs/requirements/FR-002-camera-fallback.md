# FR-002 – Kamera automatisch auswählen

```json
{
  "id": "FR-002",
  "title": "Kamera automatisch auswählen",
  "status": "ready",
  "statement": "Wenn die Kamera gestartet wird, soll die App automatisch die Rückkamera verwenden; ist diese nicht verfügbar, die Frontkamera; ist auch diese nicht verfügbar, eine angeschlossene Webcam.",
  "basis": "supplied",
  "source_refs": [
    "https://claude.ai/code/artifact/f047bfc6-ec21-486c-a9f9-e126312b5b1a (Zielbild Scanner PWA, Abschnitt „UX-Anforderungen“)"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-002-AC-1",
      "given": "Das Gerät besitzt eine Rück- und eine Frontkamera.",
      "when": "Die Kamera wird gestartet.",
      "then": "Die Live-Vorschau zeigt das Bild der Rückkamera.",
      "test_refs": []
    },
    {
      "id": "FR-002-AC-2",
      "given": "Das Gerät besitzt keine Rückkamera, aber eine Front- oder Webcam.",
      "when": "Die Kamera wird gestartet.",
      "then": "Die Live-Vorschau zeigt das Bild der verfügbaren Kamera, ohne dass die Person eine Kamera auswählen muss.",
      "test_refs": []
    }
  ],
  "open_question_ids": []
}
```
