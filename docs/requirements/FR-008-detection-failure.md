# FR-008 – Fehlgeschlagene Erkennung wiederholbar machen

```json
{
  "id": "FR-008",
  "title": "Fehlgeschlagene Erkennung wiederholbar machen",
  "status": "ready",
  "statement": "Wenn im Foto kein Dokument erkannt wird, soll die App das Foto behalten, eine verständliche Meldung anzeigen und eine neue Aufnahme anbieten.",
  "basis": "supplied",
  "source_refs": [
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „Kernfunktionen und Nutzerablauf“",
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „UX-Anforderungen“",
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „Qualitätsziele“"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-008-AC-1",
      "given": "Das Referenzfoto ohne erkennbares Dokument liegt vor.",
      "when": "Die Verarbeitung läuft.",
      "then": "Die App meldet verständlich, dass kein Dokument erkannt wurde, zeigt das Foto weiter an und bietet „Neu aufnehmen“ an; die Prüfung läuft automatisiert.",
      "test_refs": []
    },
    {
      "id": "FR-008-AC-2",
      "given": "Die Fehlermeldung wird angezeigt.",
      "when": "Die Person wählt „Neu aufnehmen“.",
      "then": "Die Live-Vorschau ist wieder aktiv.",
      "test_refs": []
    }
  ],
  "open_question_ids": [
    "OQ-002"
  ]
}
```
