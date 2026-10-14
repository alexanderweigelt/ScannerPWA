---
status: proposed
date: 2026-10-14
decision-makers: Alex (Annahme ausstehend)
consulted: –
informed: –
---

# ADR-0004 – Eigener Service Worker mit Precache-Liste aus dem Build

## Context and Problem Statement

Nach dem ersten Besuch muss die App offline starten und vollständig nutzbar
sein ([FR-013](../requirements/FR-013-offline-use.md)), installierbar sein
([FR-012](../requirements/FR-012-installable-pwa.md)) und unter dem Unterpfad
`/ScannerPWA/` funktionieren ([FR-014](../requirements/FR-014-subpath-hosting.md)).
Es gibt keine Netzanfragen außer dem Laden der eigenen Dateien. Wie wird das
Offline-Verhalten umgesetzt?

## Decision Drivers

* Alle Dateien eines Builds sind bekannt und gehasht.
* Ein Update darf keine laufende Sitzung mit Seiten unterbrechen.
* Wenige Abhängigkeiten; Verhalten im Test vollständig nachvollziehbar.

## Considered Options

* Eigener Service Worker; ein kleines Vite-Plugin im Repository schreibt Build-Version und Dateiliste hinein
* `vite-plugin-pwa` (npm 2.0.0) mit Workbox (`workbox-build` 7.4.1)

## Decision Outcome

Chosen option: "Eigener Service Worker", because die App genau eine Strategie
braucht (Precache aller Build-Dateien, Cache-first, Navigation auf
`index.html`) und dafür rund hundert Zeilen genügen, die vollständig getestet
werden.

Verhalten (CMP-06):

* `install`: alle Dateien der Liste in einen Cache `scanner-<buildhash>` laden; schlägt eine fehl, scheitert die Installation (kein halber Offline-Stand).
* `activate`: alte `scanner-*`-Caches löschen.
* `fetch`: nur gleicher Ursprung und `GET`; Navigation im Scope → gecachtes `index.html` (Suchparameter ignoriert, ADR-0007); sonst Cache, dann Netz. Keine Laufzeit-Caches, keine fremden Ursprünge.
* Update: neuer Worker wartet; kein `skipWaiting` während einer Sitzung. Er übernimmt beim nächsten Start der App.
* Registrierung relativ (`./sw.js`, Scope `./`), damit der Unterpfad gilt.

### Consequences

* Good, because keine Laufzeit- und nur eine kleine Build-Abhängigkeit (eigenes Plugin).
* Good, because Verhalten ist klein genug für vollständige Browser-Tests (offline, Update).
* Bad, because Randfälle (Quota, abgebrochene Installation) werden selbst behandelt und getestet.

### Confirmation

Browser-Test: erster Besuch online, dann Offline-Kontext, Neustart, Ablauf bis
PDF (FR-013-AC-1, FR-010-AC-2); Test mit zwei Builds prüft, dass der alte Cache
entfernt wird und eine offene Sitzung nicht neu lädt.

## Pros and Cons of the Options

### `vite-plugin-pwa` mit Workbox

* Good, because verbreitet, erzeugt Manifest und Precache automatisch.
* Bad, because große Build-Abhängigkeitskette für eine einzige Strategie.
* Bad, because erzeugter Code ist schwerer gegen FR-011 („keine fremden Ursprünge“) zu prüfen als eigener.

## More Information

Service Worker, W3C, <https://www.w3.org/TR/service-workers/>; Web App
Manifest, W3C, <https://www.w3.org/TR/appmanifest/> (aus dieser Umgebung nicht
abrufbar; Prüfung in P10 im Browser).
