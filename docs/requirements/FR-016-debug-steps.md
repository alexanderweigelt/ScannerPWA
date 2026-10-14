# FR-016 – Zwischenschritte zur Fehlersuche sichtbar machen

```json
{
  "id": "FR-016",
  "title": "Zwischenschritte zur Fehlersuche sichtbar machen",
  "status": "ready",
  "statement": "Wenn ein Diagnosemodus aktiv ist, soll die App die Zwischenschritte der Bildverarbeitung (u. a. erkannte Kanten bzw. Ecken und entzerrtes Bild) anzeigen.",
  "basis": "supplied",
  "source_refs": [
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „Qualitätsziele“"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-016-AC-1",
      "given": "Der Diagnosemodus ist aktiv.",
      "when": "Ein Foto wird verarbeitet.",
      "then": "Die Zwischenschritte der Verarbeitung einschließlich der erkannten Ecken sind sichtbar.",
      "test_refs": []
    },
    {
      "id": "FR-016-AC-2",
      "given": "Der Diagnosemodus ist nicht aktiv.",
      "when": "Ein Foto wird verarbeitet.",
      "then": "Es werden keine Zwischenschritte angezeigt.",
      "test_refs": []
    }
  ],
  "open_question_ids": []
}
```
