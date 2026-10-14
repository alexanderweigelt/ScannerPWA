# FR-001 – Kamera auf Nutzeraktion starten

```json
{
  "id": "FR-001",
  "title": "Kamera auf Nutzeraktion starten",
  "status": "ready",
  "statement": "Wenn die Person auf dem Startbildschirm die Aktion „Kamera starten“ auslöst, soll die App die Kameraberechtigung anfordern und nach Zustimmung die Live-Vorschau öffnen. Ohne diese Aktion soll die App keinen Kamerazugriff anfordern.",
  "basis": "supplied",
  "source_refs": [
    "https://claude.ai/code/artifact/f047bfc6-ec21-486c-a9f9-e126312b5b1a (Zielbild Scanner PWA, Abschnitt „Kernfunktionen und Nutzerablauf“)",
    "https://claude.ai/code/artifact/f047bfc6-ec21-486c-a9f9-e126312b5b1a (Zielbild Scanner PWA, Abschnitt „Rahmenbedingungen“)"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-001-AC-1",
      "given": "Die App wurde geöffnet und zeigt den Startbildschirm.",
      "when": "Noch keine Aktion wurde ausgelöst.",
      "then": "Es wurde kein Kamerazugriff angefordert und keine Kamera ist aktiv.",
      "test_refs": []
    },
    {
      "id": "FR-001-AC-2",
      "given": "Der Startbildschirm ist sichtbar und die Kameraberechtigung ist noch nicht entschieden.",
      "when": "Die Person löst „Kamera starten“ aus und stimmt der Berechtigungsabfrage zu.",
      "then": "Die Live-Vorschau der Kamera wird angezeigt.",
      "test_refs": []
    }
  ],
  "open_question_ids": []
}
```
