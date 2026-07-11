import { orderPreviewSchema, type OrderPreviewInput } from "@dotco/contracts";

const prices = new Map([
  ["co-water-330", 12000],
  ["meltco-mango-350", 22000],
  ["toasted-coconut-chips", 16000],
  ["body-lotion-200", 49900]
]);

export function previewOrder(input: OrderPreviewInput) {
  const parsed = orderPreviewSchema.parse(input);
  const items = parsed.items.map((item) => {
    const unitAmount = prices.get(item.productId) ?? 0;
    return {
      productId: item.productId,
      variantId: item.variantId ?? null,
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
