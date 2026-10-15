# FR-003 – Live-Vorschau im Hochformat

```json
{
  "id": "FR-003",
  "title": "Live-Vorschau im Hochformat",
  "status": "ready",
  "statement": "Während die Kamera aktiv ist, soll die App die Live-Vorschau in einem Hochformat-Rahmen ohne Verzerrung anzeigen, ohne die Ausrichtung des Geräts zu sperren, und eine Aktion zum Beenden der Kamera anbieten. Wenn die Person die Kamera beendet, soll die App die Kamera freigeben und zum Startbildschirm zurückkehren.",
  "basis": "supplied",
  "source_refs": [
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „Kernfunktionen und Nutzerablauf“",
    "Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt „UX-Anforderungen“",
    "DESIGN.md, Abschnitt „Layout“ (Geräteausrichtung, FIND-007)"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-003-AC-1",
      "given": "Die Kamera ist aktiv.",
      "when": "Die Live-Vorschau wird angezeigt.",
      "then": "Der Vorschaurahmen ist im Hochformat, auch wenn das Gerät quer gehalten wird; das Seitenverhältnis des Kamerabilds bleibt unverzerrt; die Ausrichtung des Geräts ist nicht gesperrt.",
      "test_refs": []
    },
    {
      "id": "FR-003-AC-2",
      "given": "Die Kamera ist aktiv.",
      "when": "Die Person beendet die Kamera.",
      "then": "Die Kamera ist freigegeben und der Startbildschirm wird angezeigt.",
      "test_refs": []
    }
  ],
  "open_question_ids": []
}
```
