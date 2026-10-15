# FR-002 – Kamera automatisch auswählen

```json
{
  "id": "FR-002",
  "title": "Kamera automatisch auswählen",
  "status": "ready",
  "statement": "Wenn die Kamera gestartet wird, soll die App automatisch die Rückkamera verwenden; ist diese nicht verfügbar, eine Kamera, die sich als Frontkamera meldet; ist auch diese nicht verfügbar, eine andere angeschlossene Kamera (z. B. Webcam).",
  "basis": "supplied",
  "source_refs": [
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „UX-Anforderungen“",
    "Antwort von Alex auf OQ-008, 15.10.2026 06:48:28Z, siehe [Journal, Antworten](../clarifications.md#antworten)"
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
    },
    {
      "id": "FR-002-AC-3",
      "given": "Das Gerät besitzt keine Rückkamera, aber eine Kamera, die sich als Frontkamera meldet, und eine weitere Kamera.",
      "when": "Die Kamera wird gestartet.",
      "then": "Die Live-Vorschau zeigt das Bild der als Frontkamera gemeldeten Kamera, ohne dass die Person eine Kamera auswählen muss.",
      "test_refs": []
    }
  ],
  "open_question_ids": []
}
```
