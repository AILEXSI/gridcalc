# AISI GRID Playbook

## CASE 001 — Dual-Meter Household (anonymisierte LichtBlick-Referenz)

**Status:** Dokumentierter Abrechnungsfall, kein validierter Tarifwechsel.  
**Quelle:** Zwei private Jahresabrechnungen 2025/26. Originalbelege bleiben außerhalb dieses öffentlichen Repositories.  
**Datenschutz:** Keine Namen, Adressen, IBANs, Zählernummern, Kunden-/Vertragsnummern oder Marktlokations-IDs veröffentlichen.

### Eingabedaten (brutto)

| Kennzahl | Wärmepumpe | Haushaltsstrom |
|---|---:|---:|
| Abrechnungszeitraum | 29.04.2025–28.04.2026 | 01.06.2025–31.05.2026 |
| Verbrauch | 16.083,20 kWh | 5.544,99 kWh |
| Jahresabrechnung | 4.217,29 € | 1.899,69 € |
| Vorauszahlungen | 4.140,00 € | 3.300,00 € |
| Saldo | 77,29 € Nachzahlung | 1.400,31 € Guthaben |
| Zuletzt abgerechneter Arbeitspreis | 24,11 ct/kWh (HT und NT gleich) | 28,18 ct/kWh |
| Zuletzt ausgewiesener Grundpreis | 176,87 €/Jahr | 235,25 €/Jahr |
| Neuer Abschlag | 338 €/Monat | 150 €/Monat |
| Nächstmöglicher Kündigungstermin laut Rechnung | 28.04.2027 | 31.05.2027 |

**Gesamt:** 21.628,19 kWh; 6.116,98 € Kosten über zwei jeweils zwölfmonatige, aber nicht deckungsgleiche Abrechnungsperioden. Das entspricht rechnerisch 509,75 €/Monat, nicht einem synchronen Kalenderjahr.

### Erkenntnisse und Prüfregeln

1. **Getrennte Messstellen/Verträge getrennt bewerten.** Wärmepumpen- und Haushaltsstrom dürfen bei der Tarifberechnung nicht zu einer einzigen Marktlokation zusammengeführt werden.
2. **Abschläge sind keine Energiekosten.** Guthaben und Nachzahlungen ergeben sich aus Zahlungen minus tatsächlich abgerechneten Kosten. Ein Guthaben ist keine Tarifersparnis.
3. **Historische Preise von aktuellen Preisen trennen.** Die Rechnungen enthalten unterjährige Preisänderungen. Für Prognosen sind aktuelle vertragliche Konditionen oder neue Angebote nötig; der letzte Rechnungsabschnitt allein beweist keine künftige Preisgarantie.
4. **HT/NT-Fähigkeit prüfen.** Beim Wärmepumpenzähler sind zwei Register ausgewiesen, im letzten Abschnitt jedoch identische HT-/NT-Arbeitspreise. Prüfen, ob echte Zweitarifangebote günstiger sind und technisch sowie vertraglich passen.
5. **Zählerstands-Provenienz erhalten.** Messstellenbetreiber-Werte und vom Lieferanten errechnete Werte explizit unterscheiden. Schätzungen nicht automatisch als Fehler behandeln, aber gegen spätere reale Messwerte prüfen.
6. **Wechselzeitpunkte und Rechte validieren.** Kündigungstermine aus Rechnungen übernehmen, aktuelle Vertragslage und etwaige Sonderkündigungsrechte gesondert verifizieren. Kein Wechsel ohne dokumentierte Autorisierung.
7. **Marktangebote fair ranken.** Vergleich über Arbeitspreis, Grundpreis, Tarifzeitfenster, Netzentgeltregelungen, Laufzeit, Preisgarantie, Bonusbedingungen, Ökostromkriterien und Gesamtkosten; Provision darf das Ranking nicht verzerren.
8. **Einsparungen als Szenarien kennzeichnen.** 1 ct/kWh Differenz bedeutet bei konstantem Verbrauch ca. 160,83 €/Jahr für die Wärmepumpe und 55,45 €/Jahr für Haushaltsstrom, bevor Grundpreis- und weitere Unterschiede berücksichtigt werden.
9. **Datensparsamkeit und Agency.** Private Rechnungen nur im autorisierten privaten Speicher; öffentlich ausschließlich anonymisierte Fallkennzahlen. Bots schlagen vor, deterministische Prüfungen validieren, Nutzer autorisiert den Wechsel, jede Aktion wird protokolliert.
10. **Keine Live-Angebote behaupten.** Dieser Fall dokumentiert Verbrauch und Kosten, aber noch keinen verifizierten günstigeren Anbieter.

### Akzeptanztests für GriDcalc

- Beide Abrechnungen getrennt einlesen und den Gesamtverbrauch 21.628,19 kWh sowie Gesamtbetrag 6.116,98 € korrekt bilden.
- Guthaben 1.400,31 € nicht als Einsparung verbuchen.
- Historische Mischkosten nicht mit aktuellem Tarifpreis verwechseln.
- HT/NT gleichpreisig erkennen, ohne automatisch einen Zweitarifvorteil zu behaupten.
- Geschätzte Messwerte mit Provenienz markieren.
- Beide Kündigungstermine getrennt führen.
- Bei fehlenden Live-Tarifdaten Status `NOT_VERIFIED` anzeigen und keinen Anbieterwechsel auslösen.

**Nächster Schritt:** Aktuelle, lieferstellenbezogene Wärmepumpen- und Haushaltsstromangebote einholen und als datierte, nachvollziehbare Vergleichsergebnisse gegen die Baseline prüfen.
