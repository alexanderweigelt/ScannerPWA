# FR-005 – Foto in voller Auflösung aufnehmen

```json
{
  "id": "FR-005",
  "title": "Foto in voller Auflösung aufnehmen",
  "status": "ready",
  "statement": "Wenn die Person in der Live-Vorschau die Aufnahme auslöst, soll die App das aktuelle Kamerabild einfrieren und in der vollen verfügbaren Auflösung der Kamera festhalten.",
  "basis": "supplied",
  "source_refs": [
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „Kernfunktionen und Nutzerablauf“"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-005-AC-1",
      "given": "Die Live-Vorschau ist aktiv.",
      "when": "Die Person löst die Aufnahme aus.",
      "then": "Das angezeigte Bild steht still und das festgehaltene Foto hat die volle Auflösung des aktiven Kamerastreams, nicht die Größe der Vorschau.",
      "test_refs": []
    }
  ],
  "open_question_ids": []
}
```
