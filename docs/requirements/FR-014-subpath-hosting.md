# FR-014 – Unter dem Unterpfad /ScannerPWA/ voll funktionsfähig

```json
{
  "id": "FR-014",
  "title": "Unter dem Unterpfad /ScannerPWA/ voll funktionsfähig",
  "status": "ready",
  "statement": "Die App soll als statische Website unter https://alexanderweigelt.github.io/ScannerPWA/ ausgeliefert werden und unter diesem Unterpfad vollständig funktionieren.",
  "basis": "supplied",
  "source_refs": [
    "https://claude.ai/code/artifact/f047bfc6-ec21-486c-a9f9-e126312b5b1a (Zielbild Scanner PWA, Abschnitt „Rahmenbedingungen“)"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-014-AC-1",
      "given": "Die App ist unter https://alexanderweigelt.github.io/ScannerPWA/ veröffentlicht.",
      "when": "Sie wird geöffnet, installiert und offline gestartet.",
      "then": "Alle Ressourcen laden ohne Fehler aus dem Unterpfad und Installation sowie Offline-Start funktionieren dort.",
      "test_refs": []
    }
  ],
  "open_question_ids": []
}
```
