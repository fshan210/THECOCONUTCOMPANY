import test from "node:test";
import assert from "node:assert/strict";
import { newsletterSubscriptionSchema, productListQuerySchema, roleSchema } from "./index.js";

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
