import test from "node:test";
import assert from "node:assert/strict";
import { cartItemInputSchema, communitySubmissionSchema, orderCreateSchema } from "@dotco/contracts";

test("cart validation rejects unsafe quantities", () => {
  assert.equal(cartItemInputSchema.safeParse({ productId: "co-water-330", quantity: 999 }).success, false);
  assert.equal(cartItemInputSchema.safeParse({ productId: "co-water-330", quantity: 2 }).success, true);
});

test("community submissions reject honeypot bot content", () => {
  assert.equal(communitySubmissionSchema.safeParse({
    title: "A coconut ritual",
    body: "This is a real community story about a daily coconut ritual.",
    category: "community",
    honeypot: "filled-by-bot"
  }).success, false);
});

test("order creation requires idempotency key", () => {
  assert.equal(orderCreateSchema.safeParse({ items: [{ productId: "co-water-330", quantity: 1 }] }).success, false);
  assert.equal(orderCreateSchema.safeParse({ items: [{ productId: "co-water-330", quantity: 1 }], idempotencyKey: "order-key-123456" }).success, true);
});
