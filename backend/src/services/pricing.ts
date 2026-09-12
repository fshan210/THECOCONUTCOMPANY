import { orderPreviewSchema, type OrderPreviewInput } from "@dotco/contracts";
import { notFound } from "../errors/api-error.js";
import { resolveCatalogItem } from "./catalog.js";

export function previewOrder(input: OrderPreviewInput) {
  const parsed = orderPreviewSchema.parse(input);
  const items = parsed.items.map((item) => {
    const resolved = resolveCatalogItem(item.productId, item.variantId);
    if (!resolved) throw notFound("Product or variant not found.");
    const unitAmount = resolved.unitAmount;
    return {
      productId: resolved.product.id,
      variantId: resolved.variant?.id ?? null,
      quantity: item.quantity,
      unitAmount,
      lineTotal: unitAmount * item.quantity
    };
  });
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  return {
    status: "DRAFT" as const,
    currency: "INR" as const,
    items,
    subtotal,
    discounts: [],
    shipping: null,
    tax: null,
    total: subtotal
  };
}
