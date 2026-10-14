# FR-007 – Kontrastreichen Scan-Look erzeugen

```json
{
  "id": "FR-007",
  "title": "Kontrastreichen Scan-Look erzeugen",
  "status": "ready",
  "statement": "Wenn eine Seite entzerrt wurde, soll die App sie in einen kontrastreichen, gut lesbaren Schwarz-Weiß-Look überführen, ohne sichtbare Qualitätseinbuße durch Kompression.",
  "basis": "supplied",
  "source_refs": [
    "https://claude.ai/code/artifact/f047bfc6-ec21-486c-a9f9-e126312b5b1a (Zielbild Scanner PWA, Abschnitt „Kernfunktionen und Nutzerablauf“)",
    "https://claude.ai/code/artifact/f047bfc6-ec21-486c-a9f9-e126312b5b1a (Zielbild Scanner PWA, Abschnitt „UX-Anforderungen“)"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-007-AC-1",
      "given": "Das Referenzfoto für eine erfolgreiche Erkennung wurde entzerrt.",
      "when": "Der Scan-Look wird angewendet.",
      "then": "Die Seite ist schwarz-weiß mit hellem Hintergrund und dunklem Text; der Text des Referenzdokuments ist in der Ausgabe lesbar.",
      "test_refs": []
    }
  ],
  "open_question_ids": [
    "OQ-002"
  ]
}
```
