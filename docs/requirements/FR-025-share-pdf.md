# FR-025 – PDF über das Teilen-Menü weitergeben

```json
{
  "id": "FR-025",
  "title": "PDF über das Teilen-Menü weitergeben",
  "status": "draft",
  "statement": "Wo das Gerät ein Teilen-Menü anbietet, soll die App das erzeugte PDF darüber weitergeben können; sonst bleibt der Download.",
  "basis": "supplied",
  "source_refs": [
    "https://claude.ai/code/artifact/f047bfc6-ec21-486c-a9f9-e126312b5b1a (Zielbild Scanner PWA, Abschnitt „Ausbaustufen“)"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-025-AC-1",
      "given": "Das Gerät unterstützt das Teilen von Dateien.",
      "when": "Die Person wählt „Teilen“ für das PDF.",
      "then": "Das Teilen-Menü des Geräts öffnet sich mit dem PDF.",
      "test_refs": []
    },
    {
      "id": "FR-025-AC-2",
      "given": "Das Gerät unterstützt kein Teilen von Dateien.",
      "when": "Die Exportansicht wird angezeigt.",
      "then": "Der Download ist verfügbar und keine wirkungslose Teilen-Aktion wird angeboten.",
      "test_refs": []
    }
  ],
  "open_question_ids": []
}
```
