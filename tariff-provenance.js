/* Tariff provenance contract for GriDcalc. Metadata validation is not proof that a tariff is true or available. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.TariffProvenance = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const STATUSES = ['VERIFIED', 'INCOMPLETE', 'STALE', 'ILLUSTRATIVE', 'UNKNOWN'];
  const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const nonEmpty = value => typeof value === 'string' && value.trim().length > 0;
  const validDate = value => typeof value === 'string' && !Number.isNaN(Date.parse(value));
  const nonNegative = value => typeof value === 'number' && Number.isFinite(value) && value >= 0;
  function validateTariffRecord(record, now = new Date()) {
    const errors = [];
    if (!isObject(record)) return { valid: false, errors: ['record must be an object'], displayStatus: 'UNKNOWN' };
    for (const key of ['id', 'supplierName', 'productName', 'sourceName']) {
      if (!nonEmpty(record[key])) errors.push(key + ' is required');
    }
    if (!nonEmpty(record.sourceUrl)) errors.push('sourceUrl is required');
    else { try { const url = new URL(record.sourceUrl); if (!['http:', 'https:'].includes(url.protocol)) errors.push('sourceUrl must use HTTP(S)'); } catch { errors.push('sourceUrl must be a valid URL'); } }
    if (!validDate(record.retrievedAt)) errors.push('retrievedAt must be a valid date');
    if (!STATUSES.includes(record.verificationStatus)) errors.push('verificationStatus must be one of ' + STATUSES.join(', '));
    if (!isObject(record.geography)) errors.push('geography is required');
    else {
      if (!['POSTCODE', 'GRID_AREA', 'BASIC_SUPPLY_AREA', 'NATIONAL', 'UNKNOWN'].includes(record.geography.scope)) errors.push('geography.scope is invalid');
      if (!Array.isArray(record.geography.postcodes)) errors.push('geography.postcodes must be an array');
      else if (record.geography.postcodes.some(p => !new RegExp('^[0-9]{5}$').test(p))) errors.push('each postcode must be a five-digit string');
      if (!nonEmpty(record.geography.coverageBasis)) errors.push('geography.coverageBasis is required');
    }
    if (!isObject(record.pricing)) errors.push('pricing is required');
    else {
      for (const key of ['consumptionPriceCtPerKwh', 'annualBasePriceEur']) {
        if (!nonNegative(record.pricing[key])) errors.push('pricing.' + key + ' must be a finite non-negative number');
      }
      if (typeof record.pricing.includesTaxesAndLevies !== 'boolean') errors.push('pricing.includesTaxesAndLevies must be boolean');
      if (!nonEmpty(record.pricing.assumption)) errors.push('pricing.assumption is required');
    }
    if (record.validFrom !== undefined && !validDate(record.validFrom)) errors.push('validFrom must be a valid date when supplied');
    if (record.validUntil !== undefined && !validDate(record.validUntil)) errors.push('validUntil must be a valid date when supplied');
    if (validDate(record.validFrom) && validDate(record.validUntil) && Date.parse(record.validUntil) < Date.parse(record.validFrom)) errors.push('validUntil must not precede validFrom');
    if (record.verificationStatus === 'VERIFIED') {
      for (const key of ['verifiedAt', 'verificationMethod']) if (!nonEmpty(record[key])) errors.push(key + ' is required for VERIFIED records');
      if (!validDate(record.validFrom)) errors.push('validFrom is required for VERIFIED records');
      if (!isObject(record.geography) || record.geography.scope === 'UNKNOWN' || record.geography.scope === undefined) errors.push('VERIFIED records require known geography scope');
      if (!Array.isArray(record.geography?.postcodes) || record.geography.postcodes.length === 0) errors.push('VERIFIED records require explicit postcode coverage');
    }
    let displayStatus = STATUSES.includes(record.verificationStatus) ? record.verificationStatus : 'UNKNOWN';
    if (validDate(record.retrievedAt) && Date.parse(record.retrievedAt) > now.getTime() + 5 * 60 * 1000) errors.push('retrievedAt cannot be in the future');
    if (validDate(record.validUntil) && Date.parse(record.validUntil) < now.getTime() && displayStatus === 'VERIFIED') displayStatus = 'STALE';
    if (errors.length && displayStatus === 'VERIFIED') displayStatus = 'INCOMPLETE';
    return { valid: errors.length === 0, errors, displayStatus };
  }
  return { STATUSES, validateTariffRecord };
});