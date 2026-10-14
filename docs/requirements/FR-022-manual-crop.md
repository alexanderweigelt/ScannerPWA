# FR-022 – Zuschnitt manuell nachjustieren

```json
{
  "id": "FR-022",
  "title": "Zuschnitt manuell nachjustieren",
  "status": "draft",
  "statement": "Wenn eine Seite in der Ergebnis-Vorschau angezeigt wird, soll die Person die erkannten Ecken manuell verschieben können und die App soll die Seite mit den angepassten Ecken neu entzerren.",
  "basis": "supplied",
  "source_refs": [
    "https://claude.ai/code/artifact/f047bfc6-ec21-486c-a9f9-e126312b5b1a (Zielbild Scanner PWA, Abschnitt „Ausbaustufen“)"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-022-AC-1",
      "given": "Eine verarbeitete Seite wird in der Vorschau angezeigt.",
      "when": "Die Person verschiebt eine Ecke und bestätigt.",
      "then": "Die Seite wird mit der neuen Ecke neu entzerrt angezeigt.",
      "test_refs": []
    }
  ],
  "open_question_ids": []
}
```
