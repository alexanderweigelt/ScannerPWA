# FR-027 – Keine Kamera in eingebetteter Ansicht

```json
{
  "id": "FR-027",
  "title": "Keine Kamera in eingebetteter Ansicht",
  "status": "ready",
  "statement": "Wenn die App im Frame einer anderen Seite läuft, soll die App keinen Kamerazugriff anfordern und statt der Aktion „Kamera starten“ einen Hinweis mit einem Link anzeigen, der die App ohne Frame unter ihrer eigenen Adresse öffnet.",
  "basis": "supplied",
  "source_refs": [
    "Antwort von Alex auf SD-2, 14.10.2026 17:42:03Z, siehe [Journal, Antworten](../clarifications.md#antworten)",
    "[SECURITY.md](../../SECURITY.md), SEC-08 und T-05"
  ],
  "acceptance_criteria": [
    {
      "id": "FR-027-AC-1",
      "given": "Die App ist im Frame einer anderen Seite eingebettet, die den Kamerazugriff für den Frame erlaubt.",
      "when": "Der Startbildschirm wird angezeigt und die Person bedient die App.",
      "then": "Es wurde kein Kamerazugriff angefordert, „Kamera starten“ wird nicht angeboten und ein Hinweis mit dem Link „Scanner direkt öffnen“ ist sichtbar.",
      "test_refs": []
    },
    {
      "id": "FR-027-AC-2",
      "given": "Der Hinweis in der eingebetteten Ansicht ist sichtbar.",
      "when": "Die Person wählt „Scanner direkt öffnen“.",
      "then": "Die App läuft ohne Frame unter ihrer eigenen Adresse und bietet „Kamera starten“ an.",
      "test_refs": []
    }
  ],
  "open_question_ids": []
}
```
