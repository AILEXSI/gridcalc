# GriDcalc tariff data contract

## Purpose

This contract defines the minimum metadata a tariff record must carry before it can be considered by a future comparison workflow. It is a data-quality gate, not proof that a supplier offer is genuine, current, contractually applicable, or available at a customer's delivery point.

The implementation is currently in `tariff-provenance.js`. Its Node.js tests are in `tariff-provenance.test.js`.

## Required record shape

```js
{
  id: "source-stable-record-id",
  supplierName: "Supplier name as published",
  productName: "Offer name as published",
  sourceName: "Supplier tariff page or document",
  sourceUrl: "https://supplier.example/offer",
  retrievedAt: "2026-10-13T10:00:00Z",
  verificationStatus: "ILLUSTRATIVE",
  geography: {
    scope: "POSTCODE",
    postcodes: ["76571"],
    coverageBasis: "Explicitly checked source evidence"
  },
  pricing: {
    consumptionPriceCtPerKwh: 28.5,
    annualBasePriceEur: 180,
    includesTaxesAndLevies: true,
    assumption: "Gross prices, stated consumption, no bonus"
  },
  validFrom: "2026-10-01",
  validUntil: "2027-09-30",
  verifiedAt: "2026-10-13T10:05:00Z",
  verificationMethod: "Manual comparison against the cited source"
}
```

The values above are a shape example only. The supplier, URL, postcode, and prices are not a real offer and must not be presented as one.

## Status semantics

- `VERIFIED`: evidence fields are present and metadata passes validation. This still does not establish legal eligibility, actual availability, or correctness of the source.
- `INCOMPLETE`: required evidence or metadata is missing or invalid.
- `STALE`: a previously verified record is beyond its stated validity end date.
- `ILLUSTRATIVE`: synthetic/example values only.
- `UNKNOWN`: status or underlying evidence cannot be established.

Never automatically promote `ILLUSTRATIVE`, `UNKNOWN`, `INCOMPLETE`, or `STALE` to `VERIFIED`. A supplier name list, national supplier presence, or a successful HTTP request is not evidence of a tariff's availability for a postcode.

## Required behaviour before a record enters a customer comparison

1. Validate the record with `validateTariffRecord(record, now)`.
2. Reject records where `valid === false`.
3. Only allow a comparison candidate when `displayStatus === "VERIFIED"`.
4. Independently check the actual source evidence, applicable postcode/grid area, price basis (gross/net), validity period, contract duration, price guarantee, bonus conditions, and special meter requirements.
5. Preserve the source URL, retrieval timestamp, verification method, and the record snapshot used in the calculation.
6. Show the customer which data is verified, stale, illustrative, incomplete, or unknown.
7. Keep the current manual-input calculator available even when no verified offers exist. Do not manufacture a best offer or savings claim to fill an empty result set.

## Known implementation boundary

The validator currently checks metadata consistency and some basic fields. It does not fetch external pages, parse supplier documents, verify source claims, confirm postcode-level availability, assess contract terms, or integrate records into the browser comparison UI. Those remain separate implementation tasks and must be tested before a paid pilot relies on them.

## Release gate

Do not market live tariff comparison until an end-to-end test proves that a real, dated source record is loaded, checked for the customer's postcode and contract assumptions, rejected when stale/incomplete, used by the deterministic calculator, and displayed with source and status. A synthetic fixture can test the pipeline but cannot count as real market coverage.
