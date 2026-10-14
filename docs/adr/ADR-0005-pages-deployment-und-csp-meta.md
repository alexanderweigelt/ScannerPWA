---
status: accepted
date: 2026-10-14
decision-makers: Alex (Auswahl am 14.10.2026 17:21:42Z)
consulted: –
informed: –
---

# ADR-0005 – Deployment per Pages-Workflow und CSP als Meta-Element

## Context and Problem Statement

Vorgegeben ist eine statische GitHub Page unter
`https://alexanderweigelt.github.io/ScannerPWA/` ohne Serverkomponente
(Zielbild Scanner PWA (angenommen von Alex, 14.10.2026), Abschnitt
„Rahmenbedingungen“). GitHub Pages erlaubt keine eigenen HTTP-Antwortheader.
Wie kommt der Build auf die Page, und wie wird eine Content Security Policy
ausgeliefert?

## Decision Drivers

* Reproduzierbarer Build aus einem Commit, kein gebauter Code im Repository.
* Keine Geheimnisse; minimale Rechte im Workflow.
* CSP ohne Header-Kontrolle; Vite-Build erzeugt nur externe Skriptdateien.

## Considered Options

* GitHub-Actions-Workflow mit `actions/upload-pages-artifact` und `actions/deploy-pages`; CSP als `<meta http-equiv="Content-Security-Policy">`
* Build in einen Branch `gh-pages` pushen; CSP als Meta-Element
* Andere Hosting-Plattform mit eigenen Headern (verworfen: widerspricht der Vorgabe)

## Decision Outcome

Chosen option: "GitHub-Actions-Workflow … CSP als Meta-Element", because er nach
GitHub-Dokumentation ohne Push-Rechte auf einen Branch auskommt (Job braucht nur
`pages: write` und `id-token: write`) und das Artefakt genau dem geprüften
Build entspricht.

CSP-Mechanismus: externe Skripte von `'self'`, keine Inline-Skripte oder
-Styles, daher weder Hashes noch Nonces nötig (Nonces sind ohne Server
pro Antwort ohnehin nicht möglich). Geplanter Wert (Feinabstimmung P05/P10):

```text
default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' blob:;
media-src 'self' blob:; worker-src 'self'; connect-src 'self';
manifest-src 'self'; base-uri 'none'; form-action 'none'; object-src 'none'
```

Dazu `<meta name="referrer" content="no-referrer">`.

### Consequences

* Good, because Deployment ist an CI-Gates koppelbar (Deploy-Job hängt von Prüf-Jobs ab).
* Good, because strenge CSP ohne `'unsafe-inline'`.
* Bad, because per Meta-Element wirken `frame-ancestors`, `sandbox` und `report-uri` nicht (content-security-policy.com, Abschnitt „meta“); Clickjacking-Schutz und CSP-Berichte sind damit nicht verfügbar → P05.
* Bad, because `X-Content-Type-Options`, HSTS und weitere Header bestimmt GitHub Pages; tatsächliche Werte sind UNKNOWN, bis der Header-Test gegen die veröffentlichte Adresse läuft (Risiko R-04).

### Confirmation

Build-Test prüft, dass `dist/index.html` das Meta-Element enthält und kein
Inline-Skript; Browser-Test prüft fehlende CSP-Verstöße im Ablauf;
Header-Test gegen die veröffentlichte Adresse (ARCHITECTURE.md, Abschnitt 10).

## Pros and Cons of the Options

### Branch `gh-pages`

* Good, because einfach und verbreitet.
* Bad, because Workflow braucht Schreibrechte auf das Repository, gebauter Code liegt in der Git-Historie.

## More Information

GitHub Docs, „Using custom workflows with GitHub Pages“,
<https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages>
(abgerufen 14.10.2026: `actions/configure-pages@v5`,
`actions/upload-pages-artifact@v4`, `actions/deploy-pages@v4`; Artefakt als
gzip-tar, ohne symbolische Links). CSP im Meta-Element:
<https://content-security-policy.com/examples/meta> (abgerufen 14.10.2026);
normativ W3C CSP Level 3, <https://www.w3.org/TR/CSP3/>.
