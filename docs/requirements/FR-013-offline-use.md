# FR-013 – Offline nach dem ersten Besuch nutzbar

```json
{
  "id": "FR-013",
  "title": "Offline nach dem ersten Besuch nutzbar",
  "status": "ready",
  "statement": "Nachdem die App einmal online geladen wurde, soll sie ohne Netzverbindung starten und der gesamte Ablauf soll ohne Netz nutzbar sein.",
  "basis": "supplied",
  "source_refs": [
    "https://claude.ai/code/artifact/f047bfc6-ec21-486c-a9f9-e126312b5b1a (Zielbild Scanner PWA, Abschnitt „Rahmenbedingungen“)",
    "https://claude.ai/code/artifact/f047bfc6-ec21-486c-a9f9-e126312b5b1a (Zielbild Scanner PWA, Abschnitt „Ausbaustufen“)"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-013-AC-1",
      "given": "Die App wurde einmal online vollständig geladen.",
      "when": "Das Gerät ist offline und die App wird neu geöffnet.",
      "then": "Die App startet und der Ablauf von Kamera bis PDF-Download funktioniert.",
      "test_refs": []
    }
  ],
  "open_question_ids": []
}
```
