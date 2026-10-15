---
status: accepted
date: 2026-10-14
decision-makers: Alex (OQ-007, Auswahl am 14.10.2026 17:17Z)
consulted: –
informed: –
---

# ADR-0002 – Eigene Bildverarbeitung im Web Worker, OpenCV.js als Plan B

## Context and Problem Statement

Die App muss ein Dokument im Foto finden, vier Ecken bestimmen, perspektivisch
auf A4 hoch entzerren und einen kontrastreichen Schwarz-Weiß-Look erzeugen
([FR-006](../requirements/FR-006-detect-and-rectify.md),
[FR-007](../requirements/FR-007-scan-look.md)); misslingt die Erkennung, bleibt
das Foto mit klarer Meldung erhalten
([FR-008](../requirements/FR-008-detection-failure.md)). Der frühere Stand
(Branch `backup/opencv-stand-2026-10-14`, beobachtet) nutzte OpenCV.js und
erreichte das Ziel nicht; die Ursache ist nicht dokumentiert. Womit wird die
Verarbeitung umgesetzt, und wo läuft sie?

## Decision Drivers

* Alles auf dem Gerät, alles selbst ausgeliefert, offline nach dem ersten Besuch ([FR-011](../requirements/FR-011-on-device-only.md), [FR-013](../requirements/FR-013-offline-use.md)).
* Automatisierte Prüfung mit Referenzbildern, Zwischenschritte sichtbar ([FR-016](../requirements/FR-016-debug-steps.md), OQ-002).
* Oberfläche bleibt während der Verarbeitung bedienbar und zeigt einen Fortschritt (DESIGN.md, `progress-indicator`).
* Stabiler Speicher bei wiederholtem Scannen ([FR-017](../requirements/FR-017-stable-memory.md)).
* Größe des Offline-Caches auf Smartphones.

## Considered Options

* Eigene Pipeline in TypeScript auf Typed Arrays, im Web Worker (ohne Plan B)
* OpenCV.js (WASM) selbst gehostet, im Web Worker
* Eigene Pipeline, OpenCV.js als Plan B bei Nichtbestehen der Referenzbilder

## Decision Outcome

Chosen option: "Eigene Pipeline, OpenCV.js als Plan B bei Nichtbestehen der
Referenzbilder" (Entscheidung Alex, OQ-007), because die eigene Pipeline ohne
mehrere Megabyte WASM auskommt, jede Stufe als reine Funktion mit
Referenzbildern in Node testbar ist und Zwischenergebnisse für den
Diagnosemodus direkt verfügbar sind, und weil ein benannter Rückfallweg das
Risiko R-01 begrenzt.

**Plan B:** Besteht die eigene Pipeline die Referenzbild-Prüfung FR-006-AC-1
nicht, wird OpenCV.js selbst gehostet im selben Worker hinter derselben
Nachrichtenschnittstelle eingesetzt (Erkennung und Entzerrung). Der Wechsel
braucht eine Folge-ADR mit gemessener Bundle-Größe und Speicherverhalten
(FR-017); Hauptthread und Tests bleiben unverändert.

Pipeline (CMP-04, reine Funktionen auf `Uint8ClampedArray`/`Float32Array`):

1. Arbeitskopie verkleinern (lange Kante ≤ 1000 px), Graustufen.
2. Glätten (Gauß), Kanten (Sobel + Hysterese nach Canny).
3. Kandidaten-Vierecke aus Konturen bzw. dominanten Linien; Auswahl des
   größten konvexen Vierecks mit Plausibilitätsregeln (Mindestfläche,
   Innenwinkel, Seitenverhältnis). Ohne gültigen Kandidaten: Ergebnis
   `not-found` mit Grundcode → FR-008.
4. Ecken auf die volle Auflösung hochrechnen, Homografie aus vier Punkten,
   inverse Abbildung mit bilinearer Interpolation direkt auf A4 hoch
   (Zielraster 1654 × 2339 px ≈ 200 dpi; Querlage wird gedreht, FR-006-AC-2).
5. Scan-Look: lokale adaptive Schwelle über Integralbild (Verfahren nach
   Sauvola oder Bradley, Wahl per Referenzbild in der Umsetzung).

Der Worker erhält die Pixel als übertragbaren `ArrayBuffer` (keine Kopie) und
gibt die Seite und – nur im Diagnosemodus – Zwischenbilder zurück. Er braucht
weder DOM noch `OffscreenCanvas`, was die Safari-Unterstützung vereinfacht.

### Consequences

* Good, because kein Fremdcode im Verarbeitungspfad, Offline-Cache bleibt klein.
* Good, because jede Stufe ist einzeln testbar und im Diagnosemodus sichtbar.
* Bad, because Erkennungsqualität hängt an eigenem Code; Risiko R-01 in ARCHITECTURE.md.
* Bad, because Rechenzeit in reinem JavaScript; Maßnahme: kleine Arbeitskopie für die Erkennung, volle Auflösung nur für die Entzerrung.

### Confirmation

Unit-Tests je Stufe; Referenzbild-Tests FR-006-AC-1 (Erfolg) und
FR-008-AC-1 (sauberes Scheitern) in CI (Bilder und Maß: Antwort auf OQ-002, Kriterien in FR-006-AC-1 und FR-008-AC-1). Fällt die
Erfolgsprüfung mit vertretbarem Aufwand nicht grün aus, greift Plan B.

## Pros and Cons of the Options

### OpenCV.js (WASM) selbst gehostet

* Good, because bewährte Implementierungen von Canny, `findContours`, `warpPerspective`, `adaptiveThreshold`.
* Bad, because mehrere Megabyte WASM/JS im Offline-Cache (Paket `@techstark/opencv-js` 5.0.0-release.1, npm-Registry 14.10.2026; Größe in der Umsetzung zu messen).
* Bad, because Speicher wird manuell freigegeben (`Mat.delete()`); Fehler dort widersprechen FR-017.
* Bad, because derselbe Ansatz wie der gescheiterte Stand, ohne bekannte Ursache.

### Eigene Pipeline in TypeScript auf Typed Arrays, im Web Worker (ohne Plan B)

* Good, because kleinster Offline-Cache, keine Fremdabhängigkeit.
* Bad, because kein vorab festgelegter Rückfallweg bei unzureichender Qualität.

## More Information

Referenzbilder und Lesbarkeitsmaß: Antwort von Alex auf OQ-002 (15.10.2026); echte Smartphone-Fotos von Alex stehen noch aus.
Antwort auf OQ-007 in [docs/clarifications.md](../clarifications.md#antworten).
