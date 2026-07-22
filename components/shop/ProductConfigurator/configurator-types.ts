export type ProductSize = 100 | 200 | 500;
export type ProcessingMethod = "UHT" | "RAW";
export type PulpOption = "with-pulp" | "without-pulp";
export type ProductConfiguration = { sizeMl: ProductSize; processing: ProcessingMethod; pulp: PulpOption; };
export type ConfiguredVariant = ProductConfiguration & { sku: string; price: number; image: string; title: string; description: string; available: boolean; availabilityNote?: string; };
