import { configuredVariants } from "./configurator-data";
import type { ConfiguredVariant, ProcessingMethod, ProductConfiguration, ProductSize, PulpOption } from "./configurator-types";

export function findVariant(configuration: ProductConfiguration): ConfiguredVariant | undefined { return configuredVariants.find((variant) => variant.sizeMl === configuration.sizeMl && variant.processing === configuration.processing && variant.pulp === configuration.pulp); }
export function isOptionAvailable(partial: Partial<ProductConfiguration>) {
  return configuredVariants.some((variant) => variant.available && Object.entries(partial).every(([key, value]) => value === undefined || variant[key as keyof ProductConfiguration] === value));
}
export const availableSizes = (processing?: ProcessingMethod, pulp?: PulpOption) => ([100, 200, 500] as ProductSize[]).filter((sizeMl) => isOptionAvailable({ sizeMl, processing, pulp }));
export const availableProcessing = (sizeMl?: ProductSize, pulp?: PulpOption) => (["UHT", "RAW"] as ProcessingMethod[]).filter((processing) => isOptionAvailable({ sizeMl, processing, pulp }));
