import type { ConfiguredVariant } from "./configurator-types";
declare global { interface Window { dataLayer?: unknown[]; } }
export function trackConfigurator(event: "configurator_change" | "configurator_add_to_cart", variant: ConfiguredVariant) { if (typeof window === "undefined") return; window.dataLayer?.push({ event, item_id: variant.sku, item_name: variant.title, price: variant.price, size_ml: variant.sizeMl, processing: variant.processing, pulp: variant.pulp }); }
