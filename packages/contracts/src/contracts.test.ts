import test from "node:test";
import assert from "node:assert/strict";
import { cartAddInputSchema, cartMergeInputSchema, commerceCatalog, mePatchSchema, newsletterSubscriptionSchema, productListQuerySchema, roleSchema, savedContentItemSchema } from "./index.js";

test("role schema rejects public role escalation strings", () => {
  assert.equal(roleSchema.safeParse("CUSTOMER").success, true);
  assert.equal(roleSchema.safeParse("SUPER_ADMIN").success, false);
});

test("newsletter schema requires explicit consent and rejects honeypot content", () => {
  assert.equal(newsletterSubscriptionSchema.safeParse({ email: "hello@example.com", consent: true }).success, true);
  assert.equal(newsletterSubscriptionSchema.safeParse({ email: "hello@example.com", consent: false }).success, false);
  assert.equal(newsletterSubscriptionSchema.safeParse({ email: "hello@example.com", consent: true, honeypot: "bot" }).success, false);
});

test("product list query caps page size", () => {
  const parsed = productListQuerySchema.parse({ limit: "500" });
  assert.equal(parsed.limit, 50);
});

test("saved content accepts only supported ownership-scoped kinds", () => {
  assert.equal(savedContentItemSchema.safeParse({ kind: "recipe", itemId: "coconut-cooler" }).success, true);
  assert.equal(savedContentItemSchema.safeParse({ kind: "admin", itemId: "coconut-cooler" }).success, false);
});

test("cart mutations require idempotency and reject browser prices and totals", () => {
  assert.equal(cartAddInputSchema.safeParse({ productId: "co-water", quantity: 1, idempotencyKey: "cart-key-123456" }).success, true);
  assert.equal(cartAddInputSchema.safeParse({ productId: "co-water", quantity: 1 }).success, false);
  assert.equal(cartAddInputSchema.safeParse({ productId: "co-water", quantity: 1, unitPrice: 1, idempotencyKey: "cart-key-123456" }).success, false);
  assert.equal(cartMergeInputSchema.safeParse({ items: [{ productId: "co-water", quantity: 1, total: 1 }], idempotencyKey: "merge-key-123456" }).success, false);
});

test("profile patch validates structured preferences and address", () => {
  assert.equal(mePatchSchema.safeParse({ firstName: "Fazil", displayName: "Fazil", newsletterOptIn: true, address: { city: "Palakkad", country: "India" } }).success, true);
  assert.equal(mePatchSchema.safeParse({ phone: "x".repeat(60) }).success, false);
});

test("commerce catalog has unique stable identities, positive minor-unit prices and unique variant SKUs", () => {
  assert.equal(new Set(commerceCatalog.map((product) => product.id)).size, commerceCatalog.length);
  assert.equal(new Set(commerceCatalog.map((product) => product.slug)).size, commerceCatalog.length);
  assert.equal(commerceCatalog.every((product) => product.id === product.slug && Number.isInteger(product.amount) && product.amount > 0), true);
  const variants = commerceCatalog.flatMap((product) => product.variants ?? []);
  assert.equal(new Set(variants.map((variant) => variant.sku)).size, variants.length);
  assert.equal(variants.every((variant) => variant.id === variant.sku && Number.isInteger(variant.amount) && variant.amount > 0), true);
});
