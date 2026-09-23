import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { addGuestCartItem, normalizeGuestCart, removeGuestCartItem, toCartMergeItems, updateGuestCartQuantity } from "../../lib/cart/cart-context";
import { shopProducts } from "../../lib/catalog";
import { commerceCatalog } from "@dotco/contracts";
import { projectStorefrontCatalog } from "../../lib/content/catalog-authority";
import { fallbackProducts } from "../../lib/content/fallback-data";
import {
  advanceCartScope,
  isCurrentCartScope,
  overlayPendingCartLines,
  planPendingLineReconciliation,
  type CartSessionScope
} from "../../lib/cart/cart-consistency";

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

test("late customer cart responses cannot cross a logout or account swap", async () => {
  let scope: CartSessionScope = { owner: "customer-a@example.com", generation: 0 };
  let visible = "customer-a";
  let resolveA!: (value: string) => void;
  const delayedA = new Promise<string>((resolve) => { resolveA = resolve; });
  const capturedA = scope;
  const settleA = delayedA.then((value) => {
    if (isCurrentCartScope(scope, capturedA)) visible = value;
  });

  scope = advanceCartScope(scope, "customer-b@example.com");
  visible = "customer-b";
  resolveA("late-customer-a");
  await settleA;
  assert.equal(visible, "customer-b");

  const capturedB = scope;
  scope = advanceCartScope(scope, null);
  assert.equal(isCurrentCartScope(scope, capturedB), false);
  assert.equal(scope.owner, null);
});

test("new optimistic lines reconcile only through the server-issued item id", () => {
  const server = [{ slug: "co-water", quantity: 1, itemId: "hashed-server-item-id" }];
  assert.deepEqual(planPendingLineReconciliation(server, [{ slug: "co-water", quantity: 3 }], "co-water"), {
    action: "patch", itemId: "hashed-server-item-id", quantity: 3
  });
  assert.deepEqual(planPendingLineReconciliation(server, [], "co-water"), {
    action: "delete", itemId: "hashed-server-item-id"
  });
  assert.deepEqual(planPendingLineReconciliation(server, [{ slug: "co-water", quantity: 1 }], "co-water"), { action: "apply" });

  const twoLines = [
    ...server,
    { slug: "co-kitchen-coconut-oil", quantity: 2, itemId: "second-server-item-id" }
  ];
  assert.deepEqual(planPendingLineReconciliation(twoLines, [
    { slug: "co-water", quantity: 1 },
    { slug: "co-kitchen-coconut-oil", quantity: 4 }
  ], "co-kitchen-coconut-oil"), { action: "patch", itemId: "second-server-item-id", quantity: 4 });
});

test("rapid edits made while an add response is deferred converge to the latest intent", async () => {
  let optimistic = [{ slug: "co-water", quantity: 1 }];
  let resolvePost!: (value: Array<{ slug: string; quantity: number; itemId: string }>) => void;
  const delayedPost = new Promise<Array<{ slug: string; quantity: number; itemId: string }>>((resolve) => { resolvePost = resolve; });
  const planned = delayedPost.then((serverItems) => planPendingLineReconciliation(serverItems, optimistic, "co-water"));

  // +++ then - leaves an absolute latest quantity of two while POST is pending.
  optimistic = [{ slug: "co-water", quantity: 3 }];
  optimistic = [{ slug: "co-water", quantity: 2 }];
  resolvePost([{ slug: "co-water", quantity: 1, itemId: "hashed-server-item-id" }]);
  assert.deepEqual(await planned, { action: "patch", itemId: "hashed-server-item-id", quantity: 2 });

  let resolveRemoval!: (value: Array<{ slug: string; quantity: number; itemId: string }>) => void;
  const delayedRemoval = new Promise<Array<{ slug: string; quantity: number; itemId: string }>>((resolve) => { resolveRemoval = resolve; });
  const removalPlan = delayedRemoval.then((serverItems) => planPendingLineReconciliation(serverItems, optimistic, "co-water"));
  optimistic = [];
  resolveRemoval([{ slug: "co-water", quantity: 2, itemId: "hashed-server-item-id" }]);
  assert.deepEqual(await removalPlan, { action: "delete", itemId: "hashed-server-item-id" });
});

test("a concurrent line response cannot overwrite another line's pending edit or removal", () => {
  const staleWholeCart = [
    { slug: "co-water", quantity: 1, itemId: "water-server-id" },
    { slug: "co-kitchen-coconut-oil", quantity: 2, itemId: "oil-server-id" }
  ];
  const pendingWaterEdit = [
    { slug: "co-water", quantity: 4, itemId: "water-server-id" },
    { slug: "co-kitchen-coconut-oil", quantity: 2, itemId: "oil-server-id" }
  ];
  assert.deepEqual(overlayPendingCartLines(staleWholeCart, pendingWaterEdit, [], ["water-server-id"]), [
    { slug: "co-kitchen-coconut-oil", quantity: 2, itemId: "oil-server-id" },
    { slug: "co-water", quantity: 4, itemId: "water-server-id" }
  ]);
  assert.deepEqual(overlayPendingCartLines(staleWholeCart, [pendingWaterEdit[1]!], [], ["water-server-id"]), [
    { slug: "co-kitchen-coconut-oil", quantity: 2, itemId: "oil-server-id" }
  ]);
});

test("storefront and backend commerce fields share one authority and reject CMS drift", () => {
  assert.deepEqual(shopProducts.map((product) => ({ slug: product.slug, price: product.price })), commerceCatalog.map((product) => ({ slug: product.slug, price: product.amount / 100 })));
  const drifted = {
    ...fallbackProducts[0]!,
    slug: "cms-renamed-product",
    name: "CMS renamed product",
    price: 1
  };
  const rogue = { ...fallbackProducts[0]!, id: "rogue-product", slug: "rogue-product", name: "Rogue", price: 1 };
  const projected = projectStorefrontCatalog(fallbackProducts, [drifted, rogue]);
  assert.equal(projected.some((product) => product.id === "rogue-product"), false);
  assert.equal(projected[0]?.slug, commerceCatalog[0]?.slug);
  assert.equal(projected[0]?.name, commerceCatalog[0]?.title);
  assert.equal(projected[0]?.price, (commerceCatalog[0]?.amount ?? 0) / 100);
});

test("commerce clients keep synchronous mutation guards, optimistic rollback and one saved-content API", async () => {
  const [cartSource, savedSource, detailSource] = await Promise.all([
    readFile(new URL("../../lib/cart/cart-context.tsx", import.meta.url), "utf8"),
    readFile(new URL("../../lib/customer/use-saved-content.ts", import.meta.url), "utf8"),
    readFile(new URL("../../components/recipes/RecipeDetailPage.tsx", import.meta.url), "utf8")
  ]);
  assert.match(cartSource, /locksRef\.current/);
  assert.match(cartSource, /queuedMutationsRef\.current/);
  assert.match(cartSource, /if \(!queue\.has\(operationKey\)\) applyServerCart\(cart, scope, operationKey\)/);
  assert.match(cartSource, /replaceItems\(addGuestCartItem\(itemsRef\.current/);
  assert.match(cartSource, /isCurrentCartScope\(scopeRef\.current, scope\)/);
  assert.match(cartSource, /\/api\/customer\/cart/);
  assert.match(savedSource, /pendingRef\.current/);
  assert.match(savedSource, /if \(removing\) next\.add\(itemId\); else next\.delete\(itemId\)/);
  assert.match(savedSource, /co-saved-content-changed/);
  assert.match(savedSource, /inFlightSavedRead/);
  assert.doesNotMatch(detailSource, /localStorage/);
  assert.match(detailSource, /useSavedContent\("recipe"\)/);
});
