# FR-012 – Als App installierbar

```json
{
  "id": "FR-012",
  "title": "Als App installierbar",
  "status": "ready",
  "statement": "Die App soll auf Smartphone und Desktop als Progressive Web App installierbar sein und installiert in einem eigenständigen App-Fenster mit App-Icon starten.",
  "basis": "supplied",
  "source_refs": [
    "https://claude.ai/code/artifact/f047bfc6-ec21-486c-a9f9-e126312b5b1a (Zielbild Scanner PWA, Abschnitt „Rahmenbedingungen“)",
    "https://claude.ai/code/artifact/f047bfc6-ec21-486c-a9f9-e126312b5b1a (Zielbild Scanner PWA, Abschnitt „Ausbaustufen“)"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-012-AC-1",
      "given": "Die App ist unter ihrer öffentlichen Adresse geöffnet.",
      "when": "Die Installierbarkeit wird geprüft.",
      "then": "Der Browser erkennt die App als installierbar.",
      "test_refs": []
    },
    {
      "id": "FR-012-AC-2",
      "given": "Die App wurde installiert.",
      "when": "Sie wird vom Home-Bildschirm bzw. Desktop gestartet.",
      "then": "Sie öffnet in einem eigenständigen Fenster ohne Browser-Bedienleiste und zeigt ihr App-Icon.",
      "test_refs": []
    }
  ],
  "open_question_ids": []
}
```
