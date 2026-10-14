# FR-011 – Bilder verlassen das Gerät nie

```json
{
  "id": "FR-011",
  "title": "Bilder verlassen das Gerät nie",
  "status": "ready",
  "statement": "Die App soll Kamerabilder, Scans und PDFs ausschließlich auf dem Gerät verarbeiten und keine dieser Daten über das Netzwerk übertragen; zur Laufzeit soll sie keine Ressourcen von fremden Servern laden.",
  "basis": "supplied",
  "source_refs": [
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „Zielgruppe und Nutzungsszenario“",
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „Rahmenbedingungen“"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-011-AC-1",
      "given": "Der gesamte Ablauf von Kamera bis PDF-Download wird durchlaufen.",
      "when": "Der Netzwerkverkehr wird aufgezeichnet.",
      "then": "Keine Anfrage enthält Bild- oder PDF-Daten und keine Anfrage geht an einen anderen Ursprung als den der App.",
      "test_refs": []
    }
  ],
  "open_question_ids": [
    "OQ-004"
  ]
}
```
