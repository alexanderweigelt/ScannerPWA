# FR-004 – Kamerafehler verständlich behandeln

```json
{
  "id": "FR-004",
  "title": "Kamerafehler verständlich behandeln",
  "status": "ready",
  "statement": "Wenn der Kamerazugriff verweigert wird oder keine Kamera verfügbar ist, soll die App eine verständliche Meldung anzeigen und einen Weg zurück sowie einen erneuten Versuch anbieten, ohne zu hängen.",
  "basis": "supplied",
  "source_refs": [
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „UX-Anforderungen“"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-004-AC-1",
      "given": "Die Person hat den Kamerazugriff verweigert.",
      "when": "Sie löst „Kamera starten“ aus.",
      "then": "Eine verständliche Meldung erklärt die Ursache und bietet einen erneuten Versuch sowie die Rückkehr zum Startbildschirm an.",
      "test_refs": []
    },
    {
      "id": "FR-004-AC-2",
      "given": "Das Gerät besitzt keine nutzbare Kamera.",
      "when": "Die Person löst „Kamera starten“ aus.",
      "then": "Eine verständliche Meldung wird angezeigt und die App bleibt bedienbar.",
      "test_refs": []
    }
  ],
  "open_question_ids": []
}
```
