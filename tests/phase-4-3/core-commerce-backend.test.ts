import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { addGuestCartItem, normalizeGuestCart, removeGuestCartItem, toCartMergeItems, updateGuestCartQuantity } from "../../lib/cart/cart-context";
import { shopProducts } from "../../lib/catalog";

test("guest cart add, duplicate SKU, reload, quantity and remove behavior is deterministic", () => {
  let cart = addGuestCartItem([], "co-water");
  cart = addGuestCartItem(cart, "co-water");
  cart = addGuestCartItem(cart, "co-water", { sku: "CO-CW-200-UHT-P", unitPrice: 65, variantLabel: "200ml · UHT · With pulp" });
  assert.equal(cart.length, 2);
  assert.equal(cart.find((item) => !item.sku)?.quantity, 2);
  const reloaded = normalizeGuestCart(JSON.parse(JSON.stringify(cart)), shopProducts);
  assert.deepEqual(reloaded, cart);
  const updated = updateGuestCartQuantity(reloaded, "co-water", 4);
  assert.equal(updated.find((item) => !item.sku)?.quantity, 4);
  assert.deepEqual(removeGuestCartItem(updated, "co-water").map((item) => item.sku), ["CO-CW-200-UHT-P"]);
});

test("guest merge payload never sends price or total", () => {
  const bundleMetadata = [{ bundleId: "bundle-guest-01", bundleName: "Kitchen ritual" }, { bundleId: "bundle-guest-02" }];
  const payload = toCartMergeItems([{ slug: "co-water", sku: "CO-CW-200-UHT-P", unitPrice: 0.01, quantity: 2, bundleMetadata }]);
  assert.deepEqual(payload, [{ productId: "co-water", variantId: "CO-CW-200-UHT-P", quantity: 2, bundleMetadata }]);
  assert.equal("unitPrice" in payload[0]!, false);
});

test("commerce clients keep synchronous mutation guards, optimistic rollback and one saved-content API", async () => {
  const [cartSource, savedSource, detailSource] = await Promise.all([
    readFile(new URL("../../lib/cart/cart-context.tsx", import.meta.url), "utf8"),
    readFile(new URL("../../lib/customer/use-saved-content.ts", import.meta.url), "utf8"),
    readFile(new URL("../../components/recipes/RecipeDetailPage.tsx", import.meta.url), "utf8")
  ]);
  assert.match(cartSource, /locksRef\.current/);
  assert.match(cartSource, /queuedMutationsRef\.current/);
  assert.match(cartSource, /replaceItems\(addGuestCartItem\(itemsRef\.current/);
  assert.match(cartSource, /applyServerCart\(await request\("\/api\/customer\/cart"\)\)/);
  assert.match(cartSource, /\/api\/customer\/cart/);
  assert.match(savedSource, /pendingRef\.current/);
  assert.match(savedSource, /if \(removing\) next\.add\(itemId\); else next\.delete\(itemId\)/);
  assert.match(savedSource, /co-saved-content-changed/);
  assert.doesNotMatch(detailSource, /localStorage/);
  assert.match(detailSource, /useSavedContent\("recipe"\)/);
});
