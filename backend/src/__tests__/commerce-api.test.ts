import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../app.js";
import { resetEnvForTests } from "../config/env.js";
import { resetUserDataForTests } from "../services/user-data.js";

const previousAppEnv = process.env.APP_ENV;
const previousBypass = process.env.ENABLE_AUTH_BYPASS_FOR_LOCAL_TESTS;

test.before(() => {
  process.env.APP_ENV = "local";
  process.env.ENABLE_AUTH_BYPASS_FOR_LOCAL_TESTS = "true";
  resetEnvForTests();
});
test.beforeEach(() => resetUserDataForTests());

test.after(() => {
  if (previousAppEnv === undefined) delete process.env.APP_ENV; else process.env.APP_ENV = previousAppEnv;
  if (previousBypass === undefined) delete process.env.ENABLE_AUTH_BYPASS_FOR_LOCAL_TESTS; else process.env.ENABLE_AUTH_BYPASS_FOR_LOCAL_TESTS = previousBypass;
  resetEnvForTests();
});

const json = (method: string, body: unknown) => ({ method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

test("cart API persists add, quantity, remove and clear with server totals", async () => {
  const app = createApp();
  const added = await app.request("/v1/cart/items", json("POST", { productId: "co-water", quantity: 2, idempotencyKey: "api-cart-add-0001" }));
  assert.equal(added.status, 202);
  const addedBody = await added.json() as { data: { items: Array<{ itemId: string }>; subtotalAmount: number } };
  assert.equal(addedBody.data.subtotalAmount, 12000);
  const itemId = addedBody.data.items[0]!.itemId;

  const updated = await app.request(`/v1/cart/items/${itemId}`, json("PATCH", { quantity: 3, idempotencyKey: "api-cart-qty-0001" }));
  assert.equal(updated.status, 200);
  const updatedBody = await updated.json() as { data: { totalQuantity: number } };
  assert.equal(updatedBody.data.totalQuantity, 3);

  assert.equal((await app.request(`/v1/cart/items/${itemId}`, json("DELETE", { idempotencyKey: "api-cart-remove-01" }))).status, 200);
  assert.equal((await app.request("/v1/cart", json("DELETE", { idempotencyKey: "api-cart-clear-001" }))).status, 200);
  const current = await app.request("/v1/cart");
  const currentBody = await current.json() as { data: { items: unknown[] } };
  assert.deepEqual(currentBody.data.items, []);
});

test("cart merge ignores invalid catalog lines and retry does not duplicate", async () => {
  const app = createApp();
  const body = { items: [{ productId: "co-water", quantity: 1 }, { productId: "not-a-product", quantity: 1 }], idempotencyKey: "api-cart-merge-001" };
  const first = await app.request("/v1/cart/merge", json("POST", body));
  const retry = await app.request("/v1/cart/merge", json("POST", body));
  const firstBody = await first.json() as { data: { totalQuantity: number }; meta: { ignoredItemCount: number } };
  const retryBody = await retry.json() as { data: { totalQuantity: number } };
  assert.equal(firstBody.meta.ignoredItemCount, 1);
  assert.equal(firstBody.data.totalQuantity, 1);
  assert.equal(retryBody.data.totalQuantity, 1);
});

test("saved-content API persists wishlist and recipe toggles", async () => {
  const app = createApp();
  assert.equal((await app.request("/v1/saved", json("POST", { kind: "product", itemId: "co-water", idempotencyKey: "api-save-product-1" }))).status, 202);
  assert.equal((await app.request("/v1/saved", json("POST", { kind: "recipe", itemId: "coconut-mango-cooler", idempotencyKey: "api-save-recipe-01" }))).status, 202);
  let response = await app.request("/v1/wishlist");
  let body = await response.json() as { data: { productIds: string[]; recipeIds: string[] } };
  assert.deepEqual(body.data.productIds, ["co-water"]);
  assert.deepEqual(body.data.recipeIds, ["coconut-mango-cooler"]);
  response = await app.request("/v1/saved/recipe/coconut-mango-cooler?idempotencyKey=api-remove-recipe1", { method: "DELETE" });
  assert.equal(response.status, 200);
  body = await (await app.request("/v1/wishlist")).json() as typeof body;
  assert.deepEqual(body.data.recipeIds, []);
});

test("address API enforces existing-resource edit/delete and one default", async () => {
  const app = createApp();
  const base = { fullName: "Afsala Khan", phone: "+91 98765 43210", line1: "12 Coconut Road", city: "Palakkad", region: "Kerala", postalCode: "678001", country: "IN", isDefault: true };
  const first = await app.request("/v1/me/addresses", json("POST", base));
  const second = await app.request("/v1/me/addresses", json("POST", { ...base, line1: "22 Palm Road" }));
  const secondId = ((await second.json()) as { data: { addressId: string } }).data.addressId;
  const listed = await (await app.request("/v1/me/addresses")).json() as { data: { items: Array<{ isDefault: boolean }> } };
  assert.equal(listed.data.items.filter((item) => item.isDefault).length, 1);
  assert.equal(first.status, 202);
  assert.equal((await app.request("/v1/me/addresses/missing-id01", json("PATCH", base))).status, 404);
  assert.equal((await app.request(`/v1/me/addresses/${secondId}`, { method: "DELETE" })).status, 200);
  assert.equal((await app.request(`/v1/me/addresses/${secondId}`, { method: "DELETE" })).status, 404);
});

test("order creation remains explicitly deferred", async () => {
  const response = await createApp().request("/v1/orders", json("POST", { items: [{ productId: "co-water", quantity: 1 }], idempotencyKey: "order-key-123456" }));
  assert.equal(response.status, 409);
  const body = await response.json() as { error: { code: string } };
  assert.equal(body.error.code, "CONFLICT");
});
