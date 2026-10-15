# FR-006 – Dokument erkennen und entzerren

```json
{
  "id": "FR-006",
  "title": "Dokument erkennen und entzerren",
  "status": "ready",
  "statement": "Wenn ein Foto aufgenommen wurde, soll die App das Dokument im Bild finden, seine Ecken bestimmen, es perspektivisch entzerren und als Seite im A4-Hochformat (210 × 297 mm) ausgeben.",
  "basis": "supplied",
  "source_refs": [
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „Kernfunktionen und Nutzerablauf“",
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „UX-Anforderungen“",
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „Qualitätsziele“",
    "Antwort von Alex auf OQ-002, 15.10.2026 07:20:27Z (Bilder) und 07:21:46Z (Messverfahren), siehe [Journal, Antworten](../clarifications.md#antworten)"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-006-AC-1",
      "given": "Das Referenzfoto für eine erfolgreiche Erkennung liegt vor.",
      "when": "Die Verarbeitung läuft.",
      "then": "Es entsteht eine Seite im Seitenverhältnis 1:√2 (A4 hoch); jede erkannte Ecke weicht höchstens 1,5 % der Bilddiagonale von der markierten Soll-Ecke des Referenzfotos ab; die Prüfung läuft automatisiert.",
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
  "open_question_ids": []
}
```
