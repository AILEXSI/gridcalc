# GriDcalc

Eigenständiger Stromtarif-Rechner von AILEXSI, Deutsch/Englisch.

## Starten

Die Dateien index.html, app.js und calc.js gemeinsam bereitstellen. Keine Installation und kein Build erforderlich.

Lokal beispielsweise:

```sh
python -m http.server 8000
```

Danach http://localhost:8000 öffnen. Für statisches Hosting das Repository-Hauptverzeichnis verwenden.

## Aktueller Funktionsumfang

- Zwei manuell eingegebene Tarife anhand Verbrauch, Arbeitspreis und jährlichem Grundpreis vergleichen.
- Jahreskosten, jährliche und monatliche Differenz sowie Rechenwege anzeigen.
- Deutsch/Englisch, Eingabevalidierung, Zurücksetzen und Drucken/PDF.
- Beispiel: 15.000 kWh; 24 ct/kWh + 180 Euro gegenüber 21 ct/kWh + 150 Euro ergibt 3.780 Euro gegenüber 3.300 Euro, also 480 Euro jährliche Differenz.

Keine Live-Tarifsuche, keine Vertragsprüfung durch KI, kein automatischer Anbieterwechsel und keine Kundenbetreuung durch Bots implementiert. Diese Funktionen sind geplante Erweiterungen. Der Rechner berücksichtigt keine Boni, zeitvariablen Preise oder weiteren Vertragsbedingungen.

PLAYBOOK.md enthält ergänzende Projektanforderungen. Dessen Akzeptanztests für Rechnungsimport und getrennte Messstellen sind noch nicht in dieser Website implementiert.

## Stand und Prüfung

Snapshot der Sites-Version 56d32575a04c46e523ef0aea4fed372b182a1eed vom 12.10.2026. Keine automatische Synchronisierung mit Sites.

12 Rechenszenarien und JavaScript-Syntax wurden bei Erstellung geprüft. Visuelle Browserprüfung war nicht verfügbar. Betreiber- und Hostingangaben vor öffentlichem Produktivbetrieb vervollständigen.

## V0.2 Entwicklungszweig — Dual-Meter CASE 001

- `case001.html`: separat aufrufbares, browserlokales Testlabor mit Wärmepumpe (HT/NT) und Haushalt.
- `grid-engine.js`: reine, validierte Berechnungen für Einzeltarif, HT/NT, Abrechnungssaldo und Portfolio.
- `grid-engine.test.js`: 33 Node.js-Assertions; ausführen mit `node grid-engine.test.js`.
- Referenzwerte aus `PLAYBOOK.md` sind anonymisiert. Keine Konten, IBANs, Vertragsnummern oder echten Identitäten im Quelltext.
- `fixtures/synthetic-customers.json`: Max, Monday und AISI als rein fiktive Testpersonen, nicht zahlbare Bankplatzhalter, keine Einwilligungen.\n- Auf `case001.html` können getrennte Vergleichspreise für Wärmepumpe (HT/NT) und Haushalt simuliert werden.\n- **Nicht implementiert:** Live-Angebote, PDF-Import, echte Kundenakten, SEPA, Anbieterwechsel und externe Schnittstellen. Anbieterstatus bleibt `NOT_VERIFIED`.
- Der Zweig ist ein Entwicklungsstand. Erst nach grünen Tests und Review in `main` übernehmen. Die ChatGPT-Sites-Veröffentlichung ist weiterhin separat.
