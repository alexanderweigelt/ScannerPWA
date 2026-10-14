# FR-003 – Live-Vorschau im Hochformat

```json
{
  "id": "FR-003",
  "title": "Live-Vorschau im Hochformat",
  "status": "ready",
  "statement": "Während die Kamera aktiv ist, soll die App die Live-Vorschau im Hochformat ohne Verzerrung anzeigen und eine Aktion zum Beenden der Kamera anbieten. Wenn die Person die Kamera beendet, soll die App die Kamera freigeben und zum Startbildschirm zurückkehren.",
  "basis": "supplied",
  "source_refs": [
    "https://claude.ai/code/artifact/f047bfc6-ec21-486c-a9f9-e126312b5b1a (Zielbild Scanner PWA, Abschnitt „Kernfunktionen und Nutzerablauf“)",
    "https://claude.ai/code/artifact/f047bfc6-ec21-486c-a9f9-e126312b5b1a (Zielbild Scanner PWA, Abschnitt „UX-Anforderungen“)"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-003-AC-1",
      "given": "Die Kamera ist aktiv.",
      "when": "Die Live-Vorschau wird angezeigt.",
      "then": "Die Vorschau ist im Hochformat und das Seitenverhältnis des Kamerabilds bleibt unverzerrt.",
      "test_refs": []
    },
    {
      "id": "FR-003-AC-2",
      "given": "Die Kamera ist aktiv.",
      "when": "Die Person beendet die Kamera.",
      "then": "Die Kamera ist freigegeben und der Startbildschirm wird angezeigt.",
      "test_refs": []
    }
  ],
  "open_question_ids": []
}
```
