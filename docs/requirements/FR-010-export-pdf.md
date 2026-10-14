# FR-010 – PDF exportieren und herunterladen

```json
{
  "id": "FR-010",
  "title": "PDF exportieren und herunterladen",
  "status": "ready",
  "statement": "Wenn die Person den Export auslöst, soll die App auf dem Gerät ein PDF im Format A4 hoch mit einer Seite pro übernommenem Scan erzeugen und direkt auf das Gerät herunterladen.",
  "basis": "supplied",
  "source_refs": [
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „Kernfunktionen und Nutzerablauf“",
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „Rahmenbedingungen“"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-010-AC-1",
      "given": "Eine Seite wurde übernommen.",
      "when": "Die Person löst den PDF-Export aus.",
      "then": "Ein Download startet; das PDF hat genau eine Seite mit 210 × 297 mm im Hochformat, die den Scan zeigt.",
      "test_refs": []
    },
    {
      "id": "FR-010-AC-2",
      "given": "Eine Seite wurde übernommen und das Gerät ist offline.",
      "when": "Die Person löst den PDF-Export aus.",
      "then": "Das PDF wird trotzdem erzeugt und heruntergeladen.",
      "test_refs": []
    }
  ],
  "open_question_ids": []
}
```
