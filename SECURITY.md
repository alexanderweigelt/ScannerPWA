# Sicherheit – Scanner PWA

Maßgebliche Datei für Sicherheitsziele, Kontrollen, Prüfplan und das einzige
Bedrohungsmodell. Komponenten (CMP), Flüsse (FLOW), Vertrauensgrenzen (TB)
und Diagramme stehen in [ARCHITECTURE.md](ARCHITECTURE.md) und werden hier nur
referenziert. Fachliches Verhalten steht in den
[Anforderungsdatensätzen](docs/requirements/), offene Fragen und Antworten im
[Klärungsjournal](docs/clarifications.md).

**Status:** spezifiziert, nichts implementiert, nichts am Produkt verifiziert.
Entscheidungen mit der Kennung SD-n gelten erst, wenn Alex sie per Auswahl
getroffen hat; Stand siehe [Abschnitt 8](#8-sicherheitsentscheidungen).

## 1. Grundlagen und Quellen

| Quelle | Version / Bezug | Verwendung | Prüfung der Quelle |
| --- | --- | --- | --- |
| OWASP ASVS | 5.0.0, [JSON](https://raw.githubusercontent.com/OWASP/ASVS/v5.0.0/5.0/docs_en/OWASP_Application_Security_Verification_Standard_5.0.0_en.json) | Auswahl der Kontroll-IDs in Abschnitt 5 und 6 | SHA-256 `bcdbec214d70abcfad9284a31d4f9e5134305831d628aad3aa85d7e26626cb35` am 14.10.2026 nachgerechnet, stimmt mit dem vorgegebenen Digest überein; jede genannte ID und ihr Text wurden aus dieser Datei gelesen |
| OWASP Cheat Sheet „Content Security Policy“ | `master`, abgerufen 14.10.2026, SHA-256 der Datei beginnt mit `4d5e2f4d1c42ae58` | CSP per Meta-Element und dessen Grenzen | gelesen (Abschnitt „Content-Security-Policy Meta Tag“) |
| OWASP Cheat Sheet „HTTP Headers“ | `master`, abgerufen 14.10.2026, Präfix `df04323a8b10ef16` | HSTS, `nosniff`, Referrer-Policy | gelesen |
| OWASP Cheat Sheet „Threat Modeling“ | `master`, abgerufen 14.10.2026, Präfix `5102d1557d58fdc1` | Vorgehen, STRIDE als Denkanstoß | gelesen |
| STRIDE (Microsoft Threat Modeling Tool) | <https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats> | Kategorien S, T, R, I, D, E | aus dieser Umgebung nicht abrufbar; Kategorien laut OWASP Cheat Sheet |
| TLS 1.3, RFC 8446; TLS-Empfehlungen, RFC 9325 (BCP 195) | <https://www.rfc-editor.org/rfc/rfc8446>, <https://www.rfc-editor.org/rfc/rfc9325.html> | SEC-01 | aus dieser Umgebung nicht abrufbar; Kriterium (kein TLS 1.0/1.1, TLS 1.2 und 1.3) ist bei P06 gegen RFC 9325, Abschnitt 3.1.1, zu prüfen |
| NIST SSDF 1.1, SP 800-218 | <https://csrc.nist.gov/pubs/sp/800/218/final> | Practices PS, PW, RV in SEC-16 bis SEC-19 | aus dieser Umgebung nicht abrufbar; Practice-IDs aus Kenntnis der Veröffentlichung, Verifikationslücke bei P06 |
| Chromium HSTS-Preload-Liste | `chromium/chromium` Branch `main`, `net/http/transport_security_state_static.json`, abgerufen 14.10.2026 | SEC-02 | Beobachtung: `github.io` ist nicht enthalten (nur `github.com` u. a.) |

Ausgangsbasis: [ARCHITECTURE.md](ARCHITECTURE.md) (P04, `215e760`), insbesondere
Abschnitt 3 (TB-1 bis TB-3), 10.3 (Eingaben, Ausgabe, Ursprung, Transport) und
11 (Risiken R-04 bis R-07); CSP-Wert in
[ADR-0005](docs/adr/ADR-0005-pages-deployment-und-csp-meta.md).

Nicht gewählt: ein pauschales ASVS-Level. Ausgewählt sind die Kontrollen, die
aus den tatsächlichen Schutzobjekten und Einstiegspunkten folgen
(Abschnitt 2 und 3); bewusst ausgeschlossene Bereiche stehen in Abschnitt 6.

## 2. Schutzobjekte und Datenklassen

| ID | Schutzobjekt | Ort | Schutzbedarf | Begründung |
| --- | --- | --- | --- | --- |
| A-1 | Videostrom der Kamera | TB-1, CMP-03 | hoch | Zeigt Umgebung und Dokumente der Person |
| A-2 | Foto, entzerrte Seite, Seitenliste, PDF | TB-1, CMP-03 bis CMP-07, Arbeitsspeicher und Download | hoch | Persönliche Dokumente (Verträge, Ausweise, Rechnungen); Zielbild: „Bilder verlassen das Gerät nie“ ([FR-011](docs/requirements/FR-011-on-device-only.md)) |
| A-3 | Kamera-Berechtigung | Browser, je Ursprung | hoch | Wer sie mitnutzt, kann die Kamera öffnen |
| A-4 | Ausgelieferter App-Code (`dist/`, Cache Storage `scanner-<buildhash>`) | TB-2 → TB-1, CMP-06, CMP-08 | hoch (Integrität) | Manipulierter Code erreicht A-1 bis A-3 |
| A-5 | Repository, Workflow, `GITHUB_TOKEN`, Pages-Einstellungen | TB-2 | hoch (Integrität) | Quelle von A-4 |
| A-6 | Build- und Testabhängigkeiten (npm, GitHub Actions) | TB-2 | hoch (Integrität) | Laufen im Build und erzeugen A-4 |
| A-7 | Diagnose-Zwischenbilder | nur Entwicklungs- und Diagnose-Build ([ADR-0007](docs/adr/ADR-0007-diagnosemodus-nur-im-entwicklungs-build.md)) | hoch | Enthalten A-2; dürfen nicht in die veröffentlichte App |

Datenklassen nach ASVS V14.1.1: **Klasse D (Dokumentdaten)** = A-1, A-2, A-7;
alle übrigen Daten der App sind öffentlich (eigener Code, Icons, Manifest).
Schutzanforderungen der Klasse D (V14.1.2): nur im Arbeitsspeicher von TB-1,
keine Übertragung, keine Speicherung in Browser-Speichern, keine Protokollierung,
Freigabe nach Gebrauch (Abschnitt 5, SEC-12). Eine Speicherung für FR-026
(Stufe 3) braucht SD-3.

## 3. Einstiegspunkte und Akteure

| ID | Einstiegspunkt | Grenze / Fluss | Daten |
| --- | --- | --- | --- |
| EP-1 | HTTPS-`GET` der App-Dateien von GitHub Pages | TB-2 → TB-1, FLOW-01, FLOW-06 | öffentlicher Code |
| EP-2 | Videostrom aus `getUserMedia` | Browser → CMP-03, FLOW-02, FLOW-03 | Klasse D |
| EP-3 | Worker-Nachrichten | TB-3, FLOW-03 | Klasse D, Zahlen |
| EP-4 | URL der Seite (Pfad, Suchparameter, Fragment) | Browser → CMP-01, CMP-06 | werden nicht ausgewertet ([ARCHITECTURE.md 10.3](ARCHITECTURE.md#103-eingaben-ausgabe-ursprung-transport)) |
| EP-5 | `fetch`-Ereignisse im Service Worker | CMP-06 | Anfragen des Dokuments |
| EP-6 | Einbettung durch eine fremde Seite (`iframe`) | fremder Ursprung → TB-1 | Bedienoberfläche |
| EP-7 | Mögliche andere Seiten desselben Ursprungs `https://alexanderweigelt.github.io` (ob es welche gibt: SD-1) | gleicher Ursprung, anderer Pfad | Zugriff auf Speicher, Service Worker, Berechtigungen des Ursprungs |
| EP-8 | Pull Request, Commit, Workflow-Lauf | TB-2, FLOW-07 | Code, Konfiguration |
| EP-9 | npm-Registry und GitHub Actions bei `npm ci` und im Workflow | TB-2, FLOW-07 | fremder Code |

Akteure: **Person** (nutzt die App, Eigentümerin der Klasse-D-Daten);
**Netzangreifer** (zwischen Gerät und Pages); **fremde Website** (bettet ein,
verlinkt); **andere Seite desselben Ursprungs** (falls vorhanden, SD-1; auch
eine Lücke darin); **kompromittierte Abhängigkeit oder Action**;
**Maintainer** (Alex, Schreibrechte); **weitere Person am selben Gerät**.
Es gibt keine Konten, keinen Server und keine KI-Schnittstelle im Produkt;
KI-gestützte Entwicklung führt keinen Endpunkt in die App ein.

## 4. Bedrohungsmodell

Vorgehen nach OWASP Threat Modeling: Modell aus ARCHITECTURE.md (Diagramme
CTX, CNT, FLOW-01 bis FLOW-05, DEP), STRIDE als Denkanstoß je Grenze und
Fluss, nur plausible Bedrohungen. Keine eigenen Diagramme. Kategorie:
S Spoofing, T Tampering, R Repudiation, I Information Disclosure,
D Denial of Service, E Elevation of Privilege.

| ID | STRIDE | Komponente / Fluss | Bedrohung | Folge | Kontrollen | Verbleibende Lücke |
| --- | --- | --- | --- | --- | --- | --- |
| T-01 | T, I | EP-1, FLOW-01, CMP-08 | Netzangreifer liefert über HTTP oder schwaches TLS manipulierten Code aus | Fremder Code im Ursprung, Zugriff auf A-1 bis A-3 | SEC-01, SEC-02 | HSTS und TLS-Parameter bestimmt GitHub (UNKNOWN, R-04); `github.io` nicht in der Chromium-Preload-Liste, der allererste Aufruf per `http://` ist ungeschützt |
| T-02 | T, E | CMP-01, EP-4 | Skriptinjektion über DOM-Ausgabe oder dynamische Codeausführung | Fremder Code, Datenabfluss | SEC-03, SEC-04 | keine bekannte |
| T-03 | I | CMP-01 bis CMP-07, alle FLOWs | Abfluss von Klasse-D-Daten an fremde Server (eingeschleuster Code, Fremdressource, Tracker) | Verletzung von FR-011 | SEC-03, SEC-05, SEC-16 | `connect-src 'self'` erlaubt Anfragen an den eigenen Ursprung; eingeschleuster Code könnte Daten in einer `GET`-URL an `alexanderweigelt.github.io` senden (Zugriffsprotokolle von GitHub). Mitigiert nur durch T-02- und T-08-Kontrollen |
| T-04 | I, E | EP-7, Cache Storage, Berechtigungen | Eine andere Seite desselben Ursprungs (Ursprung = Schema + Host + Port; der Pfad `/ScannerPWA/` trennt nicht) (oder eine Lücke darin) liest Speicher, meldet den Service Worker ab oder nutzt die erteilte Kamera-Berechtigung | Zugriff auf A-1/A-3, Offline-Fähigkeit gestört | SEC-09, SEC-12 | Trennung je Pfad ist im Browser nicht möglich (ASVS V3.5.4 nicht erfüllbar ohne eigenen Hostnamen); Umgang offen: SD-1 |
| T-05 | S, T | EP-6, CMP-01 | Fremde Seite bettet die App ein und verleitet zu Klicks (Clickjacking), z. B. auf „Kamera starten“ | Ungewollte Aktion in der App | SEC-08 | `frame-ancestors` wirkt nicht per Meta-Element (R-06); Umgang offen: SD-2 |
| T-06 | I | EP-1, CMP-08 | Browser deutet eine Antwort mit falschem oder fehlendem `Content-Type` als anderes Format | Ausführung in falschem Kontext | SEC-06 | `nosniff` setzt GitHub Pages oder nicht (UNKNOWN, R-04) |
| T-07 | I | alle FLOWs mit Anfrage | Referer-Header verrät Pfad oder Parameter an Dritte | Informationsabfluss | SEC-07 | keine; die App hat keine Anfragen an Dritte |
| T-08 | T, E | EP-9, EP-8, FLOW-07, A-6 | Kompromittiertes npm-Paket oder kompromittierte Action verändert den Build oder stiehlt das Workflow-Token | Manipulierte App für alle Nutzenden | SEC-16, SEC-17, SEC-18 | Audit erkennt nur bekannte Schwachstellen, nicht neue Schadpakete; Restrisiko durch minimale Abhängigkeiten und Review begrenzt |
| T-09 | T | EP-8, A-5 | Unbefugte oder ungeprüfte Änderung auf `main` wird automatisch veröffentlicht | Manipulierte oder fehlerhafte App | SEC-17 | Schutz von `main` hängt an Repository-Einstellungen; Umgang offen: SD-6 |
| T-10 | I | A-5, Repository | Geheimnis wird eingecheckt oder im Build sichtbar | Missbrauch des Geheimnisses | SEC-18 | keine; App braucht keine Geheimnisse |
| T-11 | D, E | EP-3, TB-3, CMP-04 | Fehlerhafte oder übergroße Nachricht bzw. Riesenauflösung der Kamera | Absturz, Speicherüberlauf, hängende Oberfläche | SEC-10, SEC-11 | Höchstzahl an Seiten offen (OQ-005) |
| T-12 | D, T | CMP-06, EP-5, FLOW-06 | Service Worker liefert dauerhaft einen alten oder fremden Stand aus (Cache-Vergiftung, fremde Anfragen im Cache) | Sicherheitskorrekturen kommen nicht an, Offline-Stand fehlerhaft | SEC-13 | Wer die App nie neu startet, behält den alten Stand bis zum Neustart (ADR-0004) |
| T-13 | I | CMP-04, CMP-08, A-7 | Diagnose-, Test- oder Repository-Dateien gelangen in die veröffentlichte App | Zusätzliche Angriffsfläche, Zwischenbilder sichtbar | SEC-14 | keine |
| T-14 | I | CMP-05, CMP-07, Gerät | Klasse-D-Daten bleiben nach Gebrauch zurück (Objekt-URLs, Kamera läuft weiter, Browser-Speicher, Protokolle) | Einsicht durch weitere Person am Gerät oder EP-7 | SEC-12, SEC-20 | Heruntergeladene PDFs liegen bewusst im Download-Ordner (gewollt); FR-026 (Stufe 3) offen: SD-3 |
| T-15 | I | CMP-01, CMP-02 | Fehlermeldung zeigt interne Details (Stack-Trace, Pufferinhalt) | Informationsabfluss, Verwirrung | SEC-15 | keine |
| T-16 | S | CMP-03, EP-2 | Kamera wird ohne bewusste Aktion oder länger als nötig geöffnet | Unbemerkte Aufnahme | SEC-20 | Kamera-Anzeige des Browsers ist außerhalb der App |
| T-17 | T, I | A-4 bis A-6 | Bekannte Schwachstelle wird nicht gemeldet oder nicht behoben | Ausnutzbare Lücke bleibt bestehen | SEC-19 | Meldeweg und Fristen offen: SD-4, SD-5 |

Repudiation (R) ist geprüft und ohne Bedrohung: Es gibt keine Konten, keine
serverseitigen Aktionen und keine Transaktionen, deren Urheberschaft
nachzuweisen wäre.

## 5. Sicherheitsziele

Zielkette je SEC: messbares Kriterium → Durchsetzung → Nachweis → Gate →
Quelle. Kommandos sind in [ARCHITECTURE.md 10.4](ARCHITECTURE.md#104-geplante-kommandos-und-gates)
geplant und werden in P09/P10 eingerichtet; „geplant“ bedeutet nicht
eingerichtet. Die Spalte „Gate“ nennt, was blockiert.

### Auslieferung und Browser

| ID | Ziel und messbares Kriterium | Durchsetzung | Nachweis | Gate | Quelle |
| --- | --- | --- | --- | --- | --- |
| SEC-01 | **Sicherer Transport.** `http://alexanderweigelt.github.io/ScannerPWA/` antwortet mit Umleitung (301/308) auf dieselbe `https://`-Adresse; die HTTPS-Antwort nutzt ein öffentlich vertrauenswürdiges Zertifikat; ein Handshake mit TLS 1.0 oder 1.1 scheitert, mit TLS 1.2 und 1.3 gelingt er | GitHub Pages, Einstellung „Enforce HTTPS“ (manuell, Alex) | `test:deployed`: Umleitung und Zertifikat; TLS-Probe mit `openssl s_client` je Version (Ergänzung in ARCHITECTURE.md 10.4) | Freigabekriterium (Abschnitt 7); Test nach jedem Deployment | ASVS 5.0.0 V12.2.1, V12.2.2, V12.1.1; RFC 8446; RFC 9325 |
| SEC-02 | **HSTS.** Jede HTTPS-Antwort unter `/ScannerPWA/` trägt `Strict-Transport-Security` mit `max-age` ≥ 31536000 | nicht konfigurierbar, GitHub Pages | `test:deployed` liest den Header | Freigabekriterium; Ergebnis UNKNOWN bis zum ersten Lauf (R-04). Fehlt der Header, ist SEC-02 **nicht erfüllt** und wird Alex zur Entscheidung vorgelegt, nicht umgedeutet | ASVS 5.0.0 V3.4.1 (`includeSubDomains` aus L2 nicht steuerbar, keine Preload-Pflicht ohne Projektgrund) |
| SEC-03 | **CSP.** `dist/index.html` enthält genau ein `<meta http-equiv="Content-Security-Policy">` mit dem Wert aus ADR-0005 (mindestens `default-src 'none'`, `script-src 'self'`, `object-src 'none'`, `base-uri 'none'`, `connect-src 'self'`); kein `'unsafe-inline'`, `'unsafe-eval'`, kein Inline-Skript oder -Stil; 0 CSP-Verstöße im gesamten Ablauf | `index.html`, Vite-Build | Build-Prüfung (Meta vorhanden, Wert identisch, kein Inline-Code); `test:e2e` sammelt `securitypolicyviolation`-Ereignisse und Konsolenmeldungen = 0; `test:deployed` prüft das Meta-Element in der ausgelieferten Seite | CI blockierend vor Deployment | ASVS 5.0.0 V3.4.3 (Abweichung: Meta-Element statt Header-Feld, da Pages keine Header erlaubt; ADR-0005); OWASP CSP Cheat Sheet |
| SEC-04 | **Sichere DOM-Ausgabe, keine dynamische Codeausführung.** 0 Vorkommen von `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval`, `new Function`, String-`setTimeout` im Quellcode; Texte nur über `textContent` | ESLint-Regeln (ARCHITECTURE.md 10.2) | `npm run lint` mit Negativtest (Regel meldet ein absichtliches Vorkommen) | CI blockierend, Pre-Commit | ASVS 5.0.0 V3.2.2, V1.3.2 |
| SEC-05 | **Keine Fremdressourcen, kein Datenabfluss.** Im Ablauf von Kamera bis PDF gehen 0 Anfragen an andere Ursprünge, 0 Anfragen mit anderer Methode als `GET`, 0 Anfragen mit Körper; `dist/` enthält keine absolute URL zu einem fremden Host in geladenen Ressourcen | CSP (SEC-03), Architektur (C-3), kein Tracking | `test:e2e` Netzmitschnitt (FR-011-AC-1); Build-Prüfung auf fremde URLs in `dist/` | CI blockierend | ASVS 5.0.0 V14.2.3, V3.6.1 (erfüllt durch Verzicht auf extern gehostete Ressourcen, daher kein SRI nötig); [FR-011](docs/requirements/FR-011-on-device-only.md) |
| SEC-06 | **Korrekte Inhaltstypen, kein MIME-Sniffing.** Jede ausgelieferte Datei hat den passenden `Content-Type` (`text/html`, `text/javascript`, `text/css`, `application/manifest+json`, Bildtyp); jede Antwort trägt `X-Content-Type-Options: nosniff` | Dateiendungen im Build; Header durch GitHub Pages (nicht konfigurierbar) | `test:deployed` prüft je Datei der Precache-Liste beide Header | Freigabekriterium; `nosniff` UNKNOWN (R-04), bei Fehlen **nicht erfüllt** und Vorlage an Alex | ASVS 5.0.0 V3.4.4 |
| SEC-07 | **Referrer-Policy.** `<meta name="referrer" content="no-referrer">` in `index.html`. Kriterium für sensible Referrer: keine Anfrage der App trägt einen `Referer`-Header | `index.html` (ADR-0005) | Build-Prüfung (Meta vorhanden); `test:e2e` prüft im Netzmitschnitt, dass kein `Referer` gesendet wird | CI blockierend | ASVS 5.0.0 V3.4.5; OWASP HTTP Headers Cheat Sheet (empfiehlt mindestens `strict-origin-when-cross-origin`; `no-referrer` ist strenger und genügt, weil die App keine Referer braucht) |
| SEC-08 | **Schutz vor Einbettung.** Entwurf, abhängig von SD-2: Läuft die App in einem Frame (`window.top !== window.self`), startet sie die Kamera nicht und zeigt nur einen Hinweis mit Link zum direkten Öffnen | CMP-01 | `test:e2e` lädt die App in ein `iframe` einer Testseite und prüft: kein `getUserMedia`-Aufruf, Hinweis sichtbar | CI blockierend | ASVS 5.0.0 V3.4.6 (per Meta-Element nicht erfüllbar; Ersatzkontrolle) |
| SEC-09 | **Gemeinsamer Ursprung.** Entwurf, abhängig von SD-1: Restrisiko T-04 ist dokumentiert; die App legt keine Klasse-D-Daten in ursprungsweite Speicher (SEC-12); vor jedem Release ist bekannt, welche anderen Seiten unter `alexanderweigelt.github.io` veröffentlicht sind | Dokumentation; manuelles Gate | Manuelles Gate „Ursprungsinventar“ (Abschnitt 7) | Freigabekriterium, sofern SD-1 so entschieden | ASVS 5.0.0 V3.5.4 (nicht erfüllbar unter der vorgegebenen Adresse) |

### Daten und Verarbeitung im Gerät

| ID | Ziel und messbares Kriterium | Durchsetzung | Nachweis | Gate | Quelle |
| --- | --- | --- | --- | --- | --- |
| SEC-10 | **Eingaben an Grenzen prüfen.** Der Worker verarbeitet nur Nachrichten der erwarteten Form (Typ-Feld aus fester Liste, Breite und Höhe ganzzahlig 1 bis 8192, Puffergröße = Breite × Höhe × 4) und antwortet sonst mit Fehler ohne Berechnung; der Hauptthread prüft Antworten des Workers ebenso; Suchparameter und Fragment werden nicht ausgewertet | `src/processing/messages.ts` (ARCHITECTURE.md 10.1) | `test:unit` mit Negativfällen (falscher Typ, 0, 8193, falsche Puffergröße, fehlende Felder) | CI blockierend | ASVS 5.0.0 V2.2.1, V3.5.5 (Syntax; Herkunftsprüfung entfällt beim eigenen Dedicated Worker) |
| SEC-11 | **Ressourcen begrenzen.** Höchstens ein Foto in voller Auflösung gleichzeitig; Verarbeitung im Worker, die Oberfläche bleibt bedienbar; bei Ausnahme oder Speichermangel endet die Verarbeitung im Teilzustand mit Aktion | CMP-03, CMP-04, ARCHITECTURE.md 8.1, 8.2 | `test:unit` (Grenzen), `test:memory` (FR-017), `test:e2e` (Fehlerpfad Worker) | CI blockierend; `test:memory` erst nach OQ-005 | ASVS 5.0.0 V15.1.3, V15.2.2 |
| SEC-12 | **Dokumentdaten nur flüchtig.** Nach einem vollständigen Ablauf und nach „Seite löschen“ enthalten `localStorage`, `sessionStorage`, IndexedDB und Cache Storage keine Klasse-D-Daten (Cache Storage nur Dateien der Precache-Liste); jede Objekt-URL wird widerrufen; die App schreibt keine Klasse-D-Daten in die Konsole und sendet keine Telemetrie | CMP-05, CMP-06, CMP-07, ARCHITECTURE.md 8.2, 8.3 | `test:e2e` liest nach dem Ablauf alle Speicher aus und vergleicht Cache-Einträge mit der Precache-Liste; `test:unit` für Widerruf der Objekt-URLs | CI blockierend | ASVS 5.0.0 V14.1.1, V14.1.2, V14.3.3, V14.2.3 |
| SEC-13 | **Service Worker begrenzt.** Er bearbeitet nur `GET` des eigenen Ursprungs im Scope `/ScannerPWA/`, legt nur Dateien der Precache-Liste ab, keine Laufzeit-Caches, löscht alte `scanner-*`-Caches bei Aktivierung | CMP-06 (ADR-0004) | `test:e2e`: Anfrage an fremden Ursprung und `POST` werden nicht beantwortet bzw. nicht gecacht; zwei Builds nacheinander, alter Cache entfernt | CI blockierend | projektspezifisch (W3C Service Workers); ASVS 5.0.0 V14.2.5 nur sinngemäß (L3, Web Cache Deception) |
| SEC-14 | **Nur nötige Funktionen in Produktion.** Das Pages-Artefakt enthält nur `dist/` aus dem Produktions-Build: keine Diagnose-Ausgaben (FR-016-AC-2), keine Testdateien, kein `.git`, keine Quellkarten mit eingebetteten Quellen | Vite-Modus `production`, ADR-0007, Workflow lädt nur `dist/` hoch | Build-Prüfung (Dateiliste gegen erlaubte Endungen, Diagnose-Kennungen fehlen); `test:e2e` gegen Produktions-Build (FR-016-AC-2) | CI blockierend vor Deployment | ASVS 5.0.0 V13.4.1, V13.4.2, V15.2.3 |
| SEC-15 | **Sichere Fehlerbehandlung.** Bei unerwarteten Fehlern zeigt die App nur die in DESIGN.md festgelegten Meldungen, keine Stack-Traces oder Rohdaten; ein Fehler führt nie zu einem Export unvollständiger Seiten | CMP-02, ARCHITECTURE.md 8.1 | `test:unit` (Zustandsmaschine: Fehlerereignisse), `test:e2e` (erzwungener Worker-Fehler) | CI blockierend | ASVS 5.0.0 V16.5.1, V16.5.3 |
| SEC-20 | **Kamera nur bewusst und kurz.** `getUserMedia` wird nur nach „Kamera starten“ bzw. „Erneut versuchen“ aufgerufen; beim Verlassen von „Kamera aktiv“ sind alle Tracks beendet (`readyState === 'ended'`) | CMP-03 (FLOW-02) | `test:e2e` mit simulierter Kamera (FR-001-AC-1, FR-003-AC-2); manuelle Prüfung auf echtem Gerät: Kamera-Anzeige des Browsers erlischt | CI blockierend; manuelles Gate Geräteprüfung | projektspezifisch; [FR-001](docs/requirements/FR-001-start-camera.md), [FR-003](docs/requirements/FR-003-live-preview.md) |

### Entwicklung, Lieferkette und Schwachstellen

| ID | Ziel und messbares Kriterium | Durchsetzung | Nachweis | Gate | Quelle |
| --- | --- | --- | --- | --- | --- |
| SEC-16 | **Abhängigkeiten kontrolliert.** `dependencies` ist leer (jede Laufzeitabhängigkeit braucht eine ADR); `package-lock.json` ist eingecheckt und Inventar aller Pakete; CI installiert nur per `npm ci`; `npm audit --audit-level=high` meldet 0 Funde; Behebung innerhalb der Fristen aus SD-5 | `package.json`, `.npmrc` (`save-exact=true`), CI (ARCHITECTURE.md 10.5) | `npm ci`, `npm audit --audit-level=high`; Build-Prüfung `dependencies` leer | CI blockierend vor Deployment | ASVS 5.0.0 V15.1.1, V15.1.2, V15.2.1; NIST SSDF 1.1 PW.4 |
| SEC-17 | **Workflow und Veröffentlichung geschützt.** Alle Actions sind auf Commit-SHA festgelegt; Rechte je Job minimal (Standard `contents: read`, nur Deploy-Job `pages: write`, `id-token: write`); Deployment nur von `main` und nur nach erfolgreichen Prüf-Jobs; weiterer Schutz von `main` nach SD-6 | `.github/workflows/` (P10), Repository-Einstellungen | Workflow-Prüfung im Review (Liste der `uses:` ohne SHA = 0, `permissions` gesetzt); manuelles Gate Repository-Einstellungen (Abschnitt 7) | CI blockierend für Prüfjobs; manuelles Gate | NIST SSDF 1.1 PS.1, PO.3; ASVS 5.0.0 V13.3.2 |
| SEC-18 | **Keine Geheimnisse.** Repository und `dist/` enthalten 0 Geheimnisse; CI nutzt nur das automatische `GITHUB_TOKEN` | Architektur (ARCHITECTURE.md 10.3), Secret-Scan (Werkzeuge nach SD-6) | `npx secretlint "**/*"` mit Negativtest (absichtlich eingefügtes Testmuster wird gemeldet) | CI blockierend, Pre-Commit | ASVS 5.0.0 V13.3.1, V13.3.2; NIST SSDF 1.1 PS.1 |
| SEC-19 | **Schwachstellen melden und behandeln.** Es gibt einen dokumentierten Meldeweg (SD-4) und Fristen für die Behebung nach Schwere (SD-5); jede Meldung erhält eine Bewertung, Behebung per PR mit vollständigem Gate-Lauf | Repository-Datei bzw. -Einstellung nach SD-4 | manuelles Gate: Meldeweg auf GitHub sichtbar; Fristen eingehalten (Audit-Funde mit Datum im PR) | manuelles Gate vor Release | ASVS 5.0.0 V15.1.1; NIST SSDF 1.1 RV.1, RV.2 |

SEC-20 steht thematisch im Block „Daten und Verarbeitung im Gerät“.

## 6. Bewertete Bereiche ohne Kontrolle

Diese ASVS-Kapitel wurden geprüft und sind ausgeschlossen, weil die
Fähigkeit im Produkt fehlt. Wird sie später hinzugefügt, ist der Bereich neu
zu bewerten. Eine fehlende, aber nötige Umsetzung ist eine Lücke, kein
Ausschluss.

| Bereich (ASVS 5.0.0) | Grund |
| --- | --- |
| V6 Authentication, V7 Session Management, V8 Authorization, V9 Self-contained Tokens, V10 OAuth/OIDC | Keine Konten, keine Sitzungen auf einem Server, keine Rollen (REQUIREMENTS.md, Ausschlüsse) |
| V3.3 Cookie Setup | Die App setzt und liest keine Cookies |
| V3.5.1 bis V3.5.3 (CSRF), V4 API and Web Service | Keine serverseitige Funktion, keine API; einzige Anfragen sind `GET` statischer Dateien |
| V3.4.2 CORS | Keine CORS-Anfragen, keine eigenen Header |
| V3.4.7 CSP-Berichte, V3.4.8 COOP | Per Meta-Element nicht verfügbar bzw. nur als Header-Feld; keine Fenster-Beziehungen zu fremden Seiten. Als bekannte Grenze der Plattform vermerkt |
| V1.2.4 bis V1.2.10, V1.3.6 bis V1.3.11 | Keine Datenbank, kein Betriebssystemaufruf, kein LDAP/XPath/LaTeX/Mail, keine serverseitigen Anfragen, kein CSV-Export |
| V5.2, V5.3 Datei-Upload und -Speicherung; V5.4.1, V5.4.3 | Kein Upload; der Download-Dateiname ist fest (`scan-JJJJ-MM-TT-hhmm.pdf`, DESIGN.md), nicht nutzergesteuert |
| V11 Cryptography | Die App verschlüsselt und signiert nichts; der Build-Hash im Cache-Namen ist kein Sicherheitsmechanismus. Transport-Kryptografie siehe SEC-01 |
| V12.1.2 bis V12.1.5, V12.3 | TLS-Konfiguration und Zertifikate verwaltet GitHub; keine Dienst-zu-Dienst-Kommunikation. ECH und Preload ohne Projektgrund nicht gefordert |
| V16.1 bis V16.4 Logging | Kein Server, keine Protokolle; bewusst keine clientseitigen Protokolle mit Daten (SEC-12) |
| V17 WebRTC | `getUserMedia` nur lokal; kein `RTCPeerConnection`, kein TURN- oder Media-Server |
| V2.4 Anti-automation | Keine serverseitige Funktion, die automatisiert missbraucht werden könnte |

## 7. Prüfplan und Freigabe

### Automatisierte Prüfungen

Kommandos und ihr Ort stehen in
[ARCHITECTURE.md 10.4](ARCHITECTURE.md#104-geplante-kommandos-und-gates); diese
Tabelle ordnet nur zu. Jede Prüfung enthält mindestens einen Negativfall.

| Kommando (geplant) | SEC | Negativfall |
| --- | --- | --- |
| `npm run lint` | SEC-04 | absichtliches `innerHTML` wird gemeldet |
| `npm run test:unit` | SEC-10, SEC-11, SEC-12, SEC-15 | ungültige Worker-Nachrichten, Fehlerereignisse |
| `npm run build` + Build-Prüfung | SEC-03, SEC-05, SEC-07, SEC-14, SEC-16 | Inline-Skript, fremde URL, fehlendes Meta, Diagnose-Kennung in `dist/` werden gemeldet |
| `npm run test:e2e` | SEC-03, SEC-05, SEC-07, SEC-08, SEC-12, SEC-13, SEC-15, SEC-20 | CSP-Verstoß, fremde Anfrage, App im `iframe`, `POST` an Service Worker |
| `npm run test:deployed` | SEC-01, SEC-02, SEC-03, SEC-06 | `http://` ohne Umleitung, fehlender Header, TLS 1.1 akzeptiert |
| `npm audit --audit-level=high` | SEC-16 | – (externe Datenbank) |
| `npx secretlint "**/*"` | SEC-18 | Testmuster wird gemeldet |

Lokale HTTP-Server (`vite preview`) sind Entwicklungsumgebung; sie belegen
SEC-01, SEC-02 und SEC-06 nicht. Diese gelten erst mit `test:deployed` gegen
`https://alexanderweigelt.github.io/ScannerPWA/` als geprüft.

### Manuelle Gates

| Gate | Verantwortung | Verfahren | Beleg |
| --- | --- | --- | --- |
| MG-1 Pages-Einstellungen | Alex | Repository → Settings → Pages: Quelle „GitHub Actions“, „Enforce HTTPS“ aktiv | Eintrag im Journal mit Datum |
| MG-2 Ursprungsinventar (falls SD-1 so entschieden) | Alex | Liste der unter `alexanderweigelt.github.io` veröffentlichten Repositories prüfen; jede Seite ist bekannt und gepflegt | Eintrag im Journal mit Datum und Liste |
| MG-3 Repository-Schutz (nach SD-6) | Alex | gewählte Einstellungen prüfen | Eintrag im Journal |
| MG-4 Kamera auf echten Geräten | Alex | Android, iPhone, Laptop: Kamera startet nur nach Aktion, Browser-Anzeige erlischt nach Verlassen | Eintrag im Journal (gemeinsam mit dem Geräte-Gate aus ARCHITECTURE.md 10.4) |
| MG-5 Meldeweg (nach SD-4) | Alex | Meldeweg ist für Außenstehende auffindbar | Eintrag im Journal |

### Freigabekriterien

Eine Ausbaustufe gilt erst als veröffentlichungsreif, wenn SEC-01 bis SEC-07,
SEC-10 bis SEC-18, SEC-20 sowie SEC-08, SEC-09 und SEC-19 in der von Alex
entschiedenen Form verifiziert sind und MG-1 bis MG-5 einen Beleg haben.
Ein nicht erfüllter Header (SEC-02, SEC-06) wird nicht als erfüllt gewertet;
eine ausdrückliche Annahme des Restrisikos durch Alex wird mit Begründung im
Journal und in dieser Datei geführt.

## 8. Sicherheitsentscheidungen

| ID | Frage | Betrifft | Stand |
| --- | --- | --- | --- |
| SD-1 | Laufen unter `https://alexanderweigelt.github.io` weitere Pages, und wie wird T-04 behandelt? | T-04, SEC-09, MG-2, R-05 | offen; erste Fassung (17:35:39Z) von Alex zurückgewiesen (unbelegte Annahme „andere Pages“, FIND-011), neu gestellt 17:39:27Z |
| SD-2 | Schutz vor Einbettung ohne `frame-ancestors` | T-05, SEC-08, R-06 | offen |
| SD-3 | Lokale Speicherung von Seiten für FR-026 (Stufe 3) | T-14, SEC-12, OQ-004 | offen |
| SD-4 | Meldeweg für Schwachstellen | T-17, SEC-19, MG-5 | offen |
| SD-5 | Fristen für die Behebung von Schwachstellen | T-17, SEC-16, SEC-19 | offen |
| SD-6 | Schutz von `main` und GitHub-Sicherheitsfunktionen | T-08, T-09, SEC-17, SEC-18, MG-3 | offen |

## 9. Stand

| Bereich | Spezifiziert | Implementiert | Verifiziert |
| --- | --- | --- | --- |
| SEC-01 bis SEC-20 | ja (SEC-08, SEC-09, SEC-19 abhängig von SD) | nein | nein |
| Quelle ASVS 5.0.0 | – | – | Digest stimmt (14.10.2026) |
| Pages-Antwortheader (HSTS, `nosniff`, `Content-Type`) | SEC-02, SEC-06 | nicht steuerbar | UNKNOWN; aus dieser Umgebung nicht abrufbar (R-04) |

Keine pauschale Konformitätsaussage: Diese Datei belegt weder ein ASVS-Level
noch die Erfüllung einer Kontrolle.
