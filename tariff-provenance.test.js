const assert = require('node:assert/strict');
const { validateTariffRecord } = require('./tariff-provenance.js');
let count = 0;
function test(name, fn) { fn(); count++; console.log('PASS ' + count + ' ' + name); }
const base = {
  id: 'TEST-001', supplierName: 'Example Supplier', productName: 'Example Fixed 12', sourceName: 'Synthetic fixture',
  sourceUrl: 'https://example.invalid/tariff', retrievedAt: '2026-10-12T10:00:00Z',
  verificationStatus: 'ILLUSTRATIVE',
  geography: { scope: 'POSTCODE', postcodes: ['76571'], coverageBasis: 'Synthetic test fixture only' },
  pricing: { consumptionPriceCtPerKwh: 28.5, annualBasePriceEur: 180, includesTaxesAndLevies: true, assumption: 'Illustrative 3500 kWh/year, no bonus' }
};
test('accepts a well-formed illustrative record', () => assert.equal(validateTariffRecord(base, new Date('2026-10-13T00:00:00Z')).valid, true));
test('does not upgrade illustrative data to verified', () => assert.equal(validateTariffRecord(base).displayStatus, 'ILLUSTRATIVE'));
test('rejects missing source URL', () => assert.ok(validateTariffRecord({ ...base, sourceUrl: '' }).errors.includes('sourceUrl is required')));
test('rejects javascript URLs', () => assert.ok(validateTariffRecord({ ...base, sourceUrl: 'javascript:alert(1)' }).errors.includes('sourceUrl must use HTTP(S)')));
test('rejects invalid postcode shape', () => assert.ok(validateTariffRecord({ ...base, geography: { ...base.geography, postcodes: ['123'] } }).errors.includes('each postcode must be a five-digit string')));
test('rejects numeric postcode values instead of coercing them', () => assert.ok(validateTariffRecord({ ...base, geography: { ...base.geography, postcodes: [76571] } }).errors.includes('each postcode must be a five-digit string')));
test('rejects negative prices', () => assert.ok(validateTariffRecord({ ...base, pricing: { ...base.pricing, annualBasePriceEur: -1 } }).errors.includes('pricing.annualBasePriceEur must be a finite non-negative number')));
test('rejects NaN prices', () => assert.equal(validateTariffRecord({ ...base, pricing: { ...base.pricing, consumptionPriceCtPerKwh: NaN } }).valid, false));
test('rejects unsupported status', () => assert.equal(validateTariffRecord({ ...base, verificationStatus: 'TRUST_ME' }).valid, false));
test('VERIFIED requires verification evidence fields', () => { const r = validateTariffRecord({ ...base, verificationStatus: 'VERIFIED' }); assert.ok(r.errors.includes('verifiedAt is required for VERIFIED records')); assert.ok(r.errors.includes('verificationMethod is required for VERIFIED records')); assert.ok(r.errors.includes('validFrom is required for VERIFIED records')); });
test('VERIFIED requires explicit postcode coverage', () => { const r = validateTariffRecord({ ...base, verificationStatus: 'VERIFIED', verifiedAt: '2026-10-12T10:00:00Z', verificationMethod: 'manual source check', validFrom: '2026-10-01', geography: { scope: 'UNKNOWN', postcodes: [], coverageBasis: 'unknown' } }); assert.ok(r.errors.includes('VERIFIED records require known geography scope')); assert.ok(r.errors.includes('VERIFIED records require explicit postcode coverage')); });
test('expired verified tariff displays STALE', () => { const r = validateTariffRecord({ ...base, verificationStatus: 'VERIFIED', verifiedAt: '2026-09-01', verificationMethod: 'manual source check', validFrom: '2026-09-01', validUntil: '2026-09-30', geography: { scope: 'POSTCODE', postcodes: ['76571'], coverageBasis: 'supplier tariff page checked' } }, new Date('2026-10-13')); assert.equal(r.displayStatus, 'STALE'); });
test('rejects reversed validity dates', () => assert.ok(validateTariffRecord({ ...base, validFrom: '2026-10-10', validUntil: '2026-10-01' }).errors.includes('validUntil must not precede validFrom')));
test('rejects future retrieval timestamps', () => assert.ok(validateTariffRecord({ ...base, retrievedAt: '2027-10-12T10:00:00Z' }, new Date('2026-10-13')).errors.includes('retrievedAt cannot be in the future')));
test('rejects null record safely', () => assert.equal(validateTariffRecord(null).valid, false));
console.log(count + ' / ' + count + ' PASS');