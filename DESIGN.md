---
version: alpha
name: Scanner PWA
description: Ruhige, kontrastreiche Werkzeugoberfläche für einen mobilen Dokumentenscanner im Browser; die gescannte Seite steht im Mittelpunkt.
colors:
  primary: "#17589F"
  primary-hover: "#124A87"
  on-primary: "#FFFFFF"
  background: "#F4F7FA"
  surface: "#FFFFFF"
  on-surface: "#102B5E"
  on-surface-variant: "#44546A"
  outline: "#6B7A8F"
  error: "#B3261E"
  error-container: "#FDECEA"
  on-error-container: "#8C1D18"
  success-container: "#E8F4EC"
  on-success-container: "#1E6B3A"
  disabled-container: "#E3E8EF"
  on-disabled: "#5B6B80"
  camera-surface: "#000000"
  camera-toolbar: "#0B1A33"
  on-camera: "#FFFFFF"
  focus-ring: "#17589F"
  focus-ring-on-camera: "#FFFFFF"
  paper: "#FFFFFF"
typography:
  headline-md:
    fontFamily: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
  title-md:
    fontFamily: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
  body-md:
    fontFamily: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.45
  label-lg:
    fontFamily: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.25
  mono-sm:
    fontFamily: ui-monospace, "SF Mono", Menlo, Consolas, monospace
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.45
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  target-min: 48px
  shutter: 72px
  content-max: 600px
  page-aspect: 0.7071
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px
components:
  app-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.title-md}"
    height: 56px
    padding: "{spacing.md}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    height: "{spacing.target-min}"
    padding: "{spacing.lg}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
  button-primary-disabled:
    backgroundColor: "{colors.disabled-container}"
    textColor: "{colors.on-disabled}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    height: "{spacing.target-min}"
    padding: "{spacing.lg}"
  button-secondary-hover:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary-hover}"
  button-icon:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.full}"
    size: "{spacing.target-min}"
  button-icon-disabled:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-disabled}"
  shutter-button:
    backgroundColor: "{colors.on-camera}"
    textColor: "{colors.camera-toolbar}"
    rounded: "{rounded.full}"
    size: "{spacing.shutter}"
  camera-toolbar:
    backgroundColor: "{colors.camera-toolbar}"
    textColor: "{colors.on-camera}"
    typography: "{typography.label-lg}"
    padding: "{spacing.md}"
  camera-viewport:
    backgroundColor: "{colors.camera-surface}"
    textColor: "{colors.on-camera}"
  page-preview:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.none}"
  page-list-item:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.sm}"
  alert-error:
    backgroundColor: "{colors.error-container}"
    textColor: "{colors.on-error-container}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  status-success:
    backgroundColor: "{colors.success-container}"
    textColor: "{colors.on-success-container}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  progress-indicator:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
  empty-state:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.body-md}"
  diagnostic-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.mono-sm}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
---

# Design – Scanner PWA

Maßgebliche Gestaltungsdatei nach dem Format Google DESIGN.md alpha
(Commit `9bf8eae67128b6cc55ad9bf86665767deb4c11cd`,
<https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/docs/spec.md>).
Das Format ist eine experimentelle Austauschkonvention, kein Prüfstandard. Die
Tokens im Kopf sind die verbindlichen Werte; der Text erklärt ihre Verwendung.
Abschnittsüberschriften bleiben englisch, damit Werkzeuge des Formats sie
erkennen; Fließtext ist deutsch.

Fachliches Verhalten steht in den [Anforderungsdatensätzen](docs/requirements/),
offene Fragen im [Klärungsjournal](docs/clarifications.md). Diese Datei legt
nur fest, wie Zustände und Aktionen aussehen und zugänglich bedient werden;
sie fügt keine Funktionen hinzu und wählt keine Technik.

**Herkunft der Werte:** Alle Tokens sind Vorschläge des Agenten (`proposed`)
im Rahmen der Ausführung von P03. Farben sind aus dem Icon des früheren
Projektstands abgeleitet (beobachtet in
`backup/opencv-stand-2026-10-14:public/icons/scanner.svg`, Farben `#102b5e`,
`#17589f`); ob diese Farbwelt und das Icon übernommen werden, ist offen
([OQ-006](docs/clarifications.md#offene-fragen)). Die Oberflächensprache ist
Deutsch (OQ-001, Antwort von Alex am 14.10.2026, siehe
[Antworten](docs/clarifications.md#antworten)); Dokumentsprache `de`.

## Overview

Scanner PWA ist ein Werkzeug für unterwegs: ein Dokument fotografieren, eine
flache A4-Seite erhalten, ein PDF speichern (Zielbild Scanner PWA (angenommen
von Alex, 14.10.2026), Abschnitt „Kern“). Die Oberfläche wirkt sachlich,
ruhig und vertrauenswürdig. Sie tritt hinter Kamerabild und Seite zurück.

Leitlinien, abgeleitet aus dem Zielbild, Abschnitt „UX-Grundsätze“:

- **Mobile-first:** Smartphone im Hochformat ist der Ausgangsfall; Desktop
  zeigt dieselbe Ansicht zentriert mit begrenzter Breite.
- **Eine Hauptaktion pro Ansicht:** Sie liegt unten im Daumenbereich und ist
  die einzige Schaltfläche in `{colors.primary}` als Fläche.
- **Lesbarkeit vor Effekt:** keine Verläufe, keine dekorativen Animationen,
  keine Effekte auf der gescannten Seite.
- **Eindeutige Zustände:** Jede Ansicht hat eine sichtbare Überschrift, die
  den Zustand benennt, und mindestens eine verfügbare Aktion
  ([FR-015](docs/requirements/FR-015-clear-states.md)).
- **Fehler sind wiederholbar:** Jede Fehlermeldung nennt die Ursache und bietet
  einen nächsten Schritt.

### Ansichten und Zustände

Die Ansichten bilden die fünf Zustände aus
[FR-015](docs/requirements/FR-015-clear-states.md) ab. Verarbeitung und
Fehler werden als Teilzustand der jeweiligen Ansicht dargestellt, nicht als
weiterer Zustand (Behandlung von FIND-003 für die Gestaltung; die fachliche
Klärung bleibt bei P06).

| Ansicht (Überschrift) | FR-015-Zustand | Teilzustände | Hauptaktion | Weitere Aktionen | Grundlage |
| --- | --- | --- | --- | --- | --- |
| Start („Scanner“) | Start | Standard; Kamerafehler (`alert-error`); eingebettet in fremder Seite (Hinweistext, keine Kamera-Aktion) | „Kamera starten“; eingebettet: Link „Scanner direkt öffnen“ | „Erneut versuchen“, „Zurück“ bei Fehler | [FR-001](docs/requirements/FR-001-start-camera.md), [FR-004](docs/requirements/FR-004-camera-errors.md), [FR-027](docs/requirements/FR-027-no-camera-when-framed.md) |
| Kamera („Dokument aufnehmen“) | Kamera aktiv | Kamera startet (`progress-indicator`); Live-Vorschau | Auslöser (`shutter-button`) | „Kamera beenden“ | [FR-002](docs/requirements/FR-002-camera-fallback.md), [FR-003](docs/requirements/FR-003-live-preview.md), [FR-005](docs/requirements/FR-005-capture-photo.md) |
| Ergebnis („Seite prüfen“) | Scan-Vorschau | Verarbeitung (`progress-indicator` über eingefrorenem Foto); Erfolg; Erkennung fehlgeschlagen (`alert-error` mit Foto) | „Übernehmen“ bzw. bei Fehler „Neu aufnehmen“ | „Neu aufnehmen“ | [FR-006](docs/requirements/FR-006-detect-and-rectify.md) bis [FR-009](docs/requirements/FR-009-result-preview.md), [FR-016](docs/requirements/FR-016-debug-steps.md) |
| Seiten („Seiten (n)“) | Seitenliste | mit Seiten; leer (`empty-state`) | „PDF erstellen“ (leer: deaktiviert) | „Seite hinzufügen“, je Seite „Löschen“, „Nach oben“, „Nach unten“ | [FR-009](docs/requirements/FR-009-result-preview.md)-AC-3, [FR-018](docs/requirements/FR-018-add-page.md) bis [FR-020](docs/requirements/FR-020-reorder-pages.md) |
| Export („PDF erstellen“) | Export | PDF wird erstellt (`progress-indicator`); Download gestartet (`status-success`) | „Fertig“ (zurück zu Seiten) | – | [FR-010](docs/requirements/FR-010-export-pdf.md), [FR-021](docs/requirements/FR-021-multipage-pdf.md) |

In Stufe 1 zeigt die Seitenansicht genau eine Seite ohne Verschiebe- und
Hinzufügen-Aktionen; diese erscheinen mit Stufe 2
(Zielbild, Abschnitt „Ausbaustufen“).

Ohne eigene Ansicht: [FR-011](docs/requirements/FR-011-on-device-only.md) und
[FR-013](docs/requirements/FR-013-offline-use.md) betreffen die Gestaltung nur
über selbst ausgelieferte Schriften und Symbole (siehe Typography);
[FR-012](docs/requirements/FR-012-installable-pwa.md) über App-Icon und
Manifestfarben (siehe Colors, OQ-006);
[FR-014](docs/requirements/FR-014-subpath-hosting.md) und
[FR-017](docs/requirements/FR-017-stable-memory.md) haben keine
Gestaltungsaspekte.

## Colors

Eine Farbwelt aus tiefem Blau und neutralen Flächen; Farbe trägt Bedeutung,
nie allein (siehe Zugänglichkeit).

- **Primary `{colors.primary}`:** einzige Interaktionsfarbe; Hauptaktion,
  Textschaltflächen, Fokusring. Hover verdunkelt auf `{colors.primary-hover}`.
- **On-surface `{colors.on-surface}`:** Text und Symbole auf hellen Flächen.
  `{colors.on-surface-variant}` für Hilfstexte.
- **Background / Surface:** `{colors.background}` als Seitenhintergrund,
  `{colors.surface}` für Leisten, Listen und Schaltflächen. Die gescannte
  Seite liegt immer auf `{colors.paper}` und hebt sich durch einen Rand in
  `{colors.outline}` ab.
- **Outline `{colors.outline}`:** Ränder von Bedienelementen und Seitenrahmen
  (Nicht-Text-Kontrast ≥ 3:1).
- **Error / Success:** `{colors.error-container}` mit
  `{colors.on-error-container}` für Fehlermeldungen,
  `{colors.success-container}` mit `{colors.on-success-container}` für
  Erfolgsmeldungen; jeweils mit Symbol und Text.
- **Kamera:** Die Kameraansicht ist dunkel (`{colors.camera-surface}`), damit
  das Kamerabild nicht überstrahlt wird. Bedienelemente liegen auf einer
  undurchsichtigen Leiste `{colors.camera-toolbar}`, nie direkt auf dem
  Videobild, weil dessen Kontrast unbekannt ist. Fokus dort in
  `{colors.focus-ring-on-camera}`.
- **Disabled:** `{colors.disabled-container}` mit `{colors.on-disabled}`; nur
  für „PDF erstellen“ bei leerer Seitenliste und nicht verfügbare
  Verschiebe-Aktionen am Listenrand.

Ein dunkles Farbschema ist nicht vorgesehen: Keine Anforderung verlangt es,
und die Kameraansicht ist bereits dunkel. App-Farben im Installationsmanifest
(Theme- und Hintergrundfarbe) verwenden `{colors.primary}` und
`{colors.background}`.

## Typography

Systemschriften des Geräts; es werden keine Schriftdateien geladen. Das hält
die App klein, offline verfügbar und frei von Fremdressourcen
([FR-011](docs/requirements/FR-011-on-device-only.md),
[FR-013](docs/requirements/FR-013-offline-use.md)).

- **`headline-md`:** Überschrift jeder Ansicht (eine pro Ansicht, `h1`).
- **`title-md`:** Titel in der App-Leiste und Abschnittstitel.
- **`body-md`:** Fließtext, Meldungen, Listeneinträge. Mindestgröße für
  Fließtext.
- **`body-sm`:** nur für Hilfstexte (z. B. Seitenzahl unter einer Miniatur);
  nie kleiner als 14px.
- **`label-lg`:** Schaltflächenbeschriftungen.
- **`mono-sm`:** Messwerte im Diagnosebereich.

Texte skalieren mit der Schriftgrößeneinstellung des Geräts (relative
Einheiten bei der Umsetzung); maximal zwei Schriftstärken (400, 600).

## Layout

- **Einspaltig, mobile-first.** Inhalt nutzt die volle Breite mit
  `{spacing.md}` Rand; ab breiteren Fenstern begrenzt auf
  `{spacing.content-max}` und zentriert.
- **Aufbau jeder Ansicht:** App-Leiste oben, Inhalt in der Mitte, Aktionsleiste
  unten mit der Hauptaktion rechts bzw. in voller Breite. Sichere Bereiche
  (Notch, Home-Indikator) bleiben frei.
- **Kamera:** Videobild füllt den verfügbaren Raum; Bild und gescannte Seite
  erscheinen in einem Hochformat-Rahmen ohne Verzerrung; überstehende Teile
  werden abgeschnitten oder mit `{colors.camera-surface}` aufgefüllt, nie
  gestreckt ([FR-003](docs/requirements/FR-003-live-preview.md)). Die
  Kamera-Leiste mit Auslöser liegt unten, „Kamera beenden“ oben links.
- **Seitenrahmen:** Seitenvorschau und Miniaturen haben das Seitenverhältnis
  A4 hoch `{spacing.page-aspect}` (210 : 297) und werden vollständig gezeigt
  ([FR-006](docs/requirements/FR-006-detect-and-rectify.md)).
- **Geräteausrichtung:** Die App sperrt die Ausrichtung nicht. „Hochformat“
  meint Vorschau- und Seitenrahmen, nicht das Gerät; im Querformat stehen
  Rahmen und Aktionsleiste nebeneinander (WCAG 2.2, SC 1.3.4).
- **Abstände:** 8px-Raster `{spacing.sm}`; `{spacing.xs}` nur innerhalb von
  Bedienelementen.
- **Zielgröße:** Jedes Bedienelement ist mindestens `{spacing.target-min}`
  groß; der Auslöser `{spacing.shutter}`.

## Elevation & Depth

Flach. Hierarchie entsteht durch Flächenfarben (`background` gegenüber
`surface`), Ränder in `{colors.outline}` und Abstand. Keine Schatten außer
einem einzigen dezenten Schatten unter der Seitenvorschau, damit das weiße
Blatt als Blatt erkennbar ist; die Erkennbarkeit hängt nicht am Schatten,
sondern am Rand.

## Shapes

- Schaltflächen, Meldungen, Diagnosebereich: `{rounded.md}`.
- Listeneinträge der Seitenliste: `{rounded.lg}`.
- Auslöser und Symbolschaltflächen: `{rounded.full}`.
- Gescannte Seite und Miniaturen: `{rounded.none}`, damit die Seitenkanten
  unverfälscht sichtbar sind.

## Components

Nur Komponenten und Zustände, die die Ansichten oben brauchen. Für jede
Komponente gilt der Fokusring: 3px in `{colors.focus-ring}` mit 2px Abstand,
auf der Kamera-Leiste in `{colors.focus-ring-on-camera}`; er wird nie
entfernt und nie von Leisten verdeckt.

| Komponente | Zweck | Zustände | Grundlage |
| --- | --- | --- | --- |
| `app-bar` | Titel der App, auf Unteransichten Zurück-Aktion | Standard | [FR-015](docs/requirements/FR-015-clear-states.md) |
| `button-primary` | eine Hauptaktion je Ansicht; in der eingebetteten Ansicht als Link mit gleichem Aussehen ([FR-027](docs/requirements/FR-027-no-camera-when-framed.md)) | Standard, Hover, Fokus, deaktiviert, lädt (Beschriftung bleibt, Fortschritt daneben, nicht erneut auslösbar) | alle Ansichten |
| `button-secondary` | Nebenaktionen („Neu aufnehmen“, „Seite hinzufügen“, „Erneut versuchen“) | Standard, Hover, Fokus; 1px Rand `{colors.outline}` | [FR-004](docs/requirements/FR-004-camera-errors.md), [FR-008](docs/requirements/FR-008-detection-failure.md), [FR-009](docs/requirements/FR-009-result-preview.md), [FR-018](docs/requirements/FR-018-add-page.md) |
| `button-icon` | Seitenaktionen „Löschen“, „Nach oben“, „Nach unten“; „Kamera beenden“ | Standard, Fokus, deaktiviert (am Listenanfang/-ende) | [FR-003](docs/requirements/FR-003-live-preview.md), [FR-019](docs/requirements/FR-019-delete-page.md), [FR-020](docs/requirements/FR-020-reorder-pages.md) |
| `shutter-button` | Aufnahme auslösen | Standard, Fokus, gedrückt (kurz eingedrückt, kein Blitzeffekt) | [FR-005](docs/requirements/FR-005-capture-photo.md) |
| `camera-toolbar` / `camera-viewport` | Kamerabild und Bedienleiste | Kamera startet, aktiv | [FR-002](docs/requirements/FR-002-camera-fallback.md), [FR-003](docs/requirements/FR-003-live-preview.md) |
| `page-preview` | entzerrte Seite im Scan-Look oder eingefrorenes Foto, unverändert dargestellt | Verarbeitung, Erfolg, Erkennung fehlgeschlagen (Foto bleibt sichtbar) | [FR-006](docs/requirements/FR-006-detect-and-rectify.md), [FR-007](docs/requirements/FR-007-scan-look.md), [FR-008](docs/requirements/FR-008-detection-failure.md), [FR-009](docs/requirements/FR-009-result-preview.md) |
| `page-list-item` | Miniatur, „Seite n von m“, Seitenaktionen | Standard, Fokus | [FR-018](docs/requirements/FR-018-add-page.md) bis [FR-021](docs/requirements/FR-021-multipage-pdf.md) |
| `alert-error` | Fehlerursache und nächster Schritt | sichtbar mit Fehlersymbol | [FR-004](docs/requirements/FR-004-camera-errors.md), [FR-008](docs/requirements/FR-008-detection-failure.md) |
| `status-success` | Bestätigung „PDF heruntergeladen“ | sichtbar mit Häkchensymbol | [FR-010](docs/requirements/FR-010-export-pdf.md) |
| `progress-indicator` | „Kamera wird gestartet“, „Seite wird verarbeitet“, „PDF wird erstellt“ | läuft (unbestimmt, mit Text) | [FR-006](docs/requirements/FR-006-detect-and-rectify.md), [FR-010](docs/requirements/FR-010-export-pdf.md) |
| `empty-state` | „Noch keine Seiten“ mit „Seite hinzufügen“ | leer | [FR-019](docs/requirements/FR-019-delete-page.md) |
| `diagnostic-panel` | Zwischenschritte (erkannte Ecken, entzerrtes Bild) unter der Ergebnis-Vorschau | nur sichtbar bei aktivem Diagnosemodus | [FR-016](docs/requirements/FR-016-debug-steps.md) |

**Meldungstexte:** Jede Meldung hat die Form
„Ursache. Nächster Schritt.“, z. B. „Kamerazugriff wurde nicht erlaubt.
Erlaube den Zugriff in den Browser-Einstellungen und versuche es erneut.“,
„Keine nutzbare Kamera gefunden.“, „Die Kamera ist in eingebetteten Seiten gesperrt.
Öffne den Scanner direkt.“, „Kein Dokument erkannt. Lege das Dokument
auf einen kontrastreichen Untergrund und nimm es neu auf.“

**Diagnosemodus:** Die Darstellung steht hier. Er existiert nur im
Entwicklungs- und Diagnose-Build
([ADR-0007](docs/adr/ADR-0007-diagnosemodus-nur-im-entwicklungs-build.md));
in der veröffentlichten App gibt es ihn und eine Bedienung dafür nicht.

**PDF-Dateiname:** `scan-JJJJ-MM-TT-hhmm.pdf` mit lokaler Zeit des Geräts,
z. B. `scan-2026-10-14-1830.pdf` (Vorschlag; „scan“ ist auch im Deutschen
üblich).

**Stufe 3:** [FR-022](docs/requirements/FR-022-manual-crop.md),
[FR-023](docs/requirements/FR-023-page-format.md),
[FR-024](docs/requirements/FR-024-quality-size.md),
[FR-025](docs/requirements/FR-025-share-pdf.md) und
[FR-026](docs/requirements/FR-026-restore-session.md) sind `draft` und werden
erst gestaltet, wenn sie `ready` sind. Vorab gilt: Ecken-Verschieben braucht
eine Alternative ohne Ziehen (WCAG 2.2, SC 2.5.7).

## Do's and Don'ts

- Do: genau eine Hauptaktion pro Ansicht in `{colors.primary}`.
- Do: jede Ansicht mit einer `h1`, die den Zustand benennt.
- Do: Fehler immer mit Ursache, Symbol und Wiederholungs- oder Zurück-Aktion.
- Do: Seitenumsortierung über „Nach oben“/„Nach unten“ anbieten; Ziehen ist
  höchstens eine zusätzliche Möglichkeit.
- Do: Bedienelemente auf der Kamera nur auf der undurchsichtigen Leiste.
- Don't: Bedeutung nur über Farbe vermitteln.
- Don't: die gescannte Seite verzerren, abrunden oder mit Effekten versehen.
- Don't: Schriften, Icons oder Bilder von fremden Servern laden.
- Don't: Geräteausrichtung sperren oder Zoomen verhindern.
- Don't: Bedienelemente ohne Anforderung hinzufügen (z. B. eigene
  Installations- oder Offline-Hinweise, Einstellungen, Kamerawahl).
- Don't: Blitz- oder Blinkeffekte beim Auslösen; Bewegungen entfallen bei
  reduzierter Bewegung des Systems.

## Accessibility & Verification

Ziel: WCAG 2.2 Stufe A und AA für alle Ansichten und den gesamten Leitablauf,
nicht nur für einzelne Elemente. Primärquelle: W3C Recommendation WCAG 2.2
vom 12.12.2024, <https://www.w3.org/TR/WCAG22/> (gelesen 14.10.2026).
Semantik nach WHATWG HTML Living Standard,
<https://html.spec.whatwg.org/multipage/> (gelesen 14.10.2026, Stand der Seite
„Last Updated 13 October 2026“).

### Zielkette

| Ziel | Messbares Kriterium | Nachweis | Gate | Quelle |
| --- | --- | --- | --- | --- |
| A11Y-1 Namen und Rollen | Jedes Bedienelement ist ein natives Element mit zugänglichem Namen; Symbolschaltflächen haben einen Textnamen (z. B. „Seite 2 löschen“); Seitenbilder haben einen Alternativtext „Seite n von m“ | automatischer Scan je Ansicht/Teilzustand; manuelle Prüfung mit Screenreader | Scan blockierend in CI (Werkzeug [ADR-0006](docs/adr/ADR-0006-testwerkzeuge.md), Einrichtung P10); manuell vor Release | SC 1.1.1, 1.3.1, 4.1.2 |
| A11Y-2 Tastatur und Fokus | Ganzer Leitablauf per Tastatur; Fokusreihenfolge folgt Lesereihenfolge; Fokus sichtbar (3px Ring) und nicht verdeckt; nach Ansichtswechsel liegt der Fokus auf der `h1` | manueller Tastaturdurchlauf; automatischer Ablauftest prüft Fokus nach Wechsel | Browser-Ablauftest (P10); manuell vor Release | SC 2.1.1, 2.4.3, 2.4.7, 2.4.11 |
| A11Y-3 Textkontrast | Normaler Text ≥ 4,5:1, großer Text ≥ 3:1 für alle Paare in der Tabelle unten | Berechnung der Token-Paare (unten); automatischer Scan | Token-Prüfung je Änderung an DESIGN.md; Scan in CI | SC 1.4.3 |
| A11Y-4 Nicht-Text-Kontrast | Ränder von Bedienelementen, Fokusring, Seitenrahmen ≥ 3:1 gegen angrenzende Fläche | Berechnung (unten); Sichtprüfung | Token-Prüfung; manuell | SC 1.4.11 |
| A11Y-5 Umbruch und Zoom | Bei 320 CSS px Breite und 400 % Zoom kein horizontales Scrollen außer Seitenbild; Text bei 200 % ohne Verlust; Zoomen nicht gesperrt | automatischer Test im Smartphone-Format; manuell Zoom 200 %/400 % | Browser-Ablauftest (P10); manuell | SC 1.4.4, 1.4.10, 1.3.4 |
| A11Y-6 Nicht nur Farbe | Fehler, Erfolg, deaktiviert und Fokus sind ohne Farbe erkennbar (Text, Symbol, Form) | manuelle Sichtprüfung in Graustufen | manuell vor Release | SC 1.4.1 |
| A11Y-7 Zielgröße und Ziehen | Ziele ≥ 48 × 48 CSS px (Pflicht ≥ 24 × 24); Umsortieren ohne Ziehen möglich | automatischer Scan; manuelle Prüfung Seitenliste | Scan in CI; manuell | SC 2.5.7, 2.5.8 |
| A11Y-8 Statusmeldungen | Verarbeitung, Ergebnis, Export und Listenänderungen („Seite 2 gelöscht“, „Seite 3 an Position 1“) werden ohne Fokuswechsel angesagt; Fehler als Warnmeldung | Screenreader-Prüfung (VoiceOver iOS, TalkBack Android); Ablauftest prüft Live-Region-Text | manuell vor Release; Ablauftest (P10) | SC 4.1.3 |
| A11Y-9 Sprache und Titel | Dokumentsprache gesetzt; Seitentitel nennt App und Ansicht | automatischer Scan | Scan in CI | SC 2.4.2, 3.1.1 (Dokumentsprache `de`) |

Automatisch gescannt werden alle Ansichten und Teilzustände aus der Tabelle
„Ansichten und Zustände“, jeweils im Desktop- und Smartphone-Format; die
Kamera wird im Test durch eine simulierte Quelle ersetzt (Einrichtung P10).
Ein automatischer Scan belegt keine volle Konformität.

**Manuelle Prüfungen** (Verantwortung: Maintainer, Vorschlag Alex; vor jedem
Release, Ergebnis im Journal): Tastaturdurchlauf am Desktop; Zoom 200 % und
400 %; VoiceOver auf iPhone und TalkBack auf Android mit Rückkamera;
Inhaltsprüfung der Meldungstexte auf Ursache und nächsten Schritt.

### Berechnete Kontrastpaare

Kontrast nach WCAG-Formel aus den Token-Werten berechnet (14.10.2026). Werte
gerundet; alle Paare erfüllen ihr Kriterium.

| Vordergrund | Hintergrund | Verhältnis | Kriterium |
| --- | --- | --- | --- |
| `on-primary` | `primary` | 7,16:1 | Text ≥ 4,5 |
| `on-primary` | `primary-hover` | 8,92:1 | Text ≥ 4,5 |
| `on-surface` | `surface` | 13,73:1 | Text ≥ 4,5 |
| `on-surface` | `background` | 12,77:1 | Text ≥ 4,5 |
| `on-surface-variant` | `surface` | 7,71:1 | Text ≥ 4,5 |
| `on-surface-variant` | `background` | 7,18:1 | Text ≥ 4,5 |
| `primary` | `surface` | 7,16:1 | Text ≥ 4,5 |
| `primary-hover` | `background` | 8,29:1 | Text ≥ 4,5 |
| `on-error-container` | `error-container` | 7,97:1 | Text ≥ 4,5 |
| `on-success-container` | `success-container` | 5,77:1 | Text ≥ 4,5 |
| `on-disabled` | `disabled-container` | 4,42:1 | freigestellt (deaktiviert), Ziel ≥ 3 |
| `on-disabled` | `surface` | 5,44:1 | freigestellt (deaktiviert), Ziel ≥ 3 |
| `on-camera` | `camera-toolbar` | 17,36:1 | Text ≥ 4,5 |
| `outline` | `surface` | 4,37:1 | Nicht-Text ≥ 3 |
| `outline` | `background` | 4,06:1 | Nicht-Text ≥ 3 |
| `outline` | `paper` | 4,37:1 | Nicht-Text ≥ 3 (Seitenrahmen) |
| `focus-ring` | `surface` | 7,16:1 | Nicht-Text ≥ 3 |
| `focus-ring` | `background` | 6,66:1 | Nicht-Text ≥ 3 |
| `focus-ring-on-camera` | `camera-toolbar` | 17,36:1 | Nicht-Text ≥ 3 |
| `shutter-button` (`on-camera`) | `camera-toolbar` | 17,36:1 | Nicht-Text ≥ 3 |
| `error` | `surface` | 6,54:1 | Nicht-Text ≥ 3 (Fehlersymbol) |
| `error` | `error-container` | 5,72:1 | Nicht-Text ≥ 3 (Fehlersymbol in Meldung) |
