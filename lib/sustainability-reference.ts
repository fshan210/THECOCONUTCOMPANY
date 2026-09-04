/** Supplied reference-board UI data, not audited company impact or a live batch registry. */
export const REFERENCE_BATCH = 'CO-W-2608-0147';
export const REFERENCE_UNITS = 24;
export const REFERENCE_PACK_SIZE = 6;
export const REFERENCE_COEFFICIENTS = { diverted: 0.36, biochar: 0.09, carbon: 0.27 } as const;

export function normalizeBatchCode(input: string) {
  return input.trim().toUpperCase();
}

export function isReferenceBatch(input: string) {
  return normalizeBatchCode(input) === REFERENCE_BATCH;
}

export function calculateReferenceImpact(quantity: number, packs = false) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 999) return null;
  const units = quantity * (packs ? REFERENCE_PACK_SIZE : 1);
  return {
    units,
    diverted: Number((units * REFERENCE_COEFFICIENTS.diverted).toFixed(2)),
    biochar: Number((units * REFERENCE_COEFFICIENTS.biochar).toFixed(2)),
    carbon: Number((units * REFERENCE_COEFFICIENTS.carbon).toFixed(2)),
  };
}
