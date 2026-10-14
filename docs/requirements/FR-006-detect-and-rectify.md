# FR-006 – Dokument erkennen und entzerren

```json
{
  "id": "FR-006",
  "title": "Dokument erkennen und entzerren",
  "status": "ready",
  "statement": "Wenn ein Foto aufgenommen wurde, soll die App das Dokument im Bild finden, seine Ecken bestimmen, es perspektivisch entzerren und als Seite im A4-Hochformat (210 × 297 mm) ausgeben.",
  "basis": "supplied",
  "source_refs": [
    "https://claude.ai/code/artifact/f047bfc6-ec21-486c-a9f9-e126312b5b1a (Zielbild Scanner PWA, Abschnitt „Kernfunktionen und Nutzerablauf“)",
    "https://claude.ai/code/artifact/f047bfc6-ec21-486c-a9f9-e126312b5b1a (Zielbild Scanner PWA, Abschnitt „UX-Anforderungen“)",
    "https://claude.ai/code/artifact/f047bfc6-ec21-486c-a9f9-e126312b5b1a (Zielbild Scanner PWA, Abschnitt „Qualitätsziele“)"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-006-AC-1",
      "given": "Das Referenzfoto für eine erfolgreiche Erkennung liegt vor.",
      "when": "Die Verarbeitung läuft.",
      "then": "Es entsteht eine Seite im Seitenverhältnis A4 hoch, deren Inhalt das Dokument ohne sichtbare perspektivische Verzerrung zeigt; die Prüfung läuft automatisiert.",
      "test_refs": []
    },
    {
      "id": "FR-006-AC-2",
      "given": "Ein Foto zeigt ein quer liegendes Dokument.",
      "when": "Die Verarbeitung läuft.",
      "then": "Die ausgegebene Seite ist im Hochformat.",
      "test_refs": []
    }
  ],
  "open_question_ids": [
    "OQ-002"
  ]
}
```
