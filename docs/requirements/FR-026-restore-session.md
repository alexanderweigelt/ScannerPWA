# FR-026 – Unterbrochene Sitzung lokal wiederherstellen

```json
{
  "id": "FR-026",
  "title": "Unterbrochene Sitzung lokal wiederherstellen",
  "status": "draft",
  "statement": "Wenn eine Sitzung mit übernommenen Seiten unterbrochen wurde und die App erneut geöffnet wird, soll die App anbieten, die Seiten aus einem lokalen Entwurf auf dem Gerät wiederherzustellen.",
  "basis": "supplied",
  "source_refs": [
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „Ausbaustufen“",
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „Rahmenbedingungen“"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-026-AC-1",
      "given": "Zwei Seiten wurden übernommen und die App wurde geschlossen.",
      "when": "Die App wird erneut geöffnet.",
      "then": "Die App bietet an, die zwei Seiten wiederherzustellen; nach Zustimmung erscheinen sie in derselben Reihenfolge.",
      "test_refs": []
    }
  ],
  "open_question_ids": [
    "OQ-004"
  ]
}
```
