# FR-012 – Als App installierbar

```json
{
  "id": "FR-012",
  "title": "Als App installierbar",
  "status": "ready",
  "statement": "Die App soll auf Smartphone und Desktop als Progressive Web App installierbar sein und installiert in einem eigenständigen App-Fenster mit App-Icon starten.",
  "basis": "supplied",
  "source_refs": [
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „Rahmenbedingungen“",
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „Ausbaustufen“"
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
    },
    {
      "id": "FR-012-AC-3",
      "given": "Die App ist unter ihrer öffentlichen Adresse auf einem Android-Smartphone, einem iPhone und einem Desktop-Rechner in einem unterstützten Browser geöffnet.",
      "when": "Die Person installiert sie über die Installationsfunktion des jeweiligen Browsers.",
      "then": "Die Installation gelingt auf allen drei Geräten.",
      "test_refs": []
    }
  ],
  "open_question_ids": []
}
```
