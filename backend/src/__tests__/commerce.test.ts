import test from "node:test";
import assert from "node:assert/strict";
import {
  addCartItem,
  cartItemId,
  clearCart,
  deleteAddress,
  getAddress,
  getCart,
  getWishlist,
  listAddresses,
  mergeCart,
  presentCart,
  removeCartItem,
  removeContentItem,
  resetUserDataForTests,
  saveAddress,
  saveContentItem,
  setCartItemQuantity,
  updateProfile
} from "../services/user-data.js";

test.beforeEach(() => resetUserDataForTests());

test("signed-in cart persists authoritative prices, combines duplicate SKUs and protects idempotent adds", async () => {
  const first = await addCartItem("customer-a", { productId: "co-water", quantity: 1 }, "cart-add-key-0001");
  assert.equal(presentCart(first).subtotalAmount, 6000);
  await addCartItem("customer-a", { productId: "co-water", quantity: 1 }, "cart-add-key-0001");
  const combined = await addCartItem("customer-a", { productId: "co-water", quantity: 2 }, "cart-add-key-0002");
  assert.equal(combined.items.length, 1);
  assert.equal(combined.items[0]?.quantity, 3);
  assert.equal((await getCart("customer-a")).items[0]?.quantity, 3);
});

test("configured bundle lines retain metadata and server variant pricing", async () => {
  const cart = await addCartItem("customer-a", {
    productId: "co-water",
    variantId: "CO-CW-200-UHT-P",
    quantity: 1,
    bundle: { bundleId: "bundle-test-01", bundleName: "Build your ritual" }
  }, "bundle-add-key-0001");
  const presented = presentCart(cart);
  assert.equal(presented.items[0]?.unitAmount, 6500);
  assert.equal(presented.items[0]?.bundleMetadata[0]?.bundleId, "bundle-test-01");
});

test("guest-to-customer merge is idempotent, combines duplicates and safely ignores invalid products", async () => {
  await addCartItem("customer-a", { productId: "co-water", quantity: 1 }, "existing-cart-key-01");
  const input = [
    { productId: "co-water", quantity: 2, bundleMetadata: [{ bundleId: "bundle-guest-01" }, { bundleId: "bundle-guest-02" }] },
    { productId: "melt-co-mango-coconut", quantity: 1 },
    { productId: "invalid-product", quantity: 1 }
  ];
  const first = await mergeCart("customer-a", input, "merge-cart-key-0001");
  const retry = await mergeCart("customer-a", input, "merge-cart-key-0001");
  assert.equal(first.ignoredItemCount, 1);
  assert.equal(first.cart.items.find((item) => item.productId === "co-water")?.quantity, 3);
  assert.deepEqual(first.cart.items.find((item) => item.productId === "co-water")?.bundleMetadata?.map((bundle) => bundle.bundleId), ["bundle-guest-01", "bundle-guest-02"]);
  assert.deepEqual(retry.cart.items, first.cart.items);
});

test("cart quantity, remove, clear and customer isolation persist", async () => {
  const added = await addCartItem("customer-a", { productId: "co-kitchen-coconut-oil", quantity: 1 }, "cart-add-key-1001");
  const itemId = cartItemId(added.items[0]!);
  await setCartItemQuantity("customer-a", itemId, 4, "cart-qty-key-1001");
  assert.equal((await getCart("customer-a")).items[0]?.quantity, 4);
  assert.equal((await getCart("customer-b")).items.length, 0);
  await assert.rejects(() => removeCartItem("customer-b", itemId, "cart-remove-key-b1"), /Cart item not found/);
  await removeCartItem("customer-a", itemId, "cart-remove-key-a1");
  assert.equal((await getCart("customer-a")).items.length, 0);
  await addCartItem("customer-a", { productId: "co-water", quantity: 1 }, "cart-add-key-1002");
  await clearCart("customer-a", "cart-clear-key-1001");
  assert.equal((await getCart("customer-a")).items.length, 0);
});

test("wishlist and saved recipes are idempotent, concurrent-safe and isolated", async () => {
  await Promise.all([
    saveContentItem("customer-a", "product", "co-water", "saved-key-product-1"),
    saveContentItem("customer-a", "recipe", "coconut-mango-cooler", "saved-key-recipe-1")
  ]);
  await saveContentItem("customer-a", "recipe", "coconut-mango-cooler", "saved-key-recipe-1");
  const saved = await getWishlist("customer-a");
  assert.deepEqual(saved.productIds, ["co-water"]);
  assert.deepEqual(saved.recipeIds, ["coconut-mango-cooler"]);
  assert.deepEqual((await getWishlist("customer-b")).recipeIds, []);
  await removeContentItem("customer-a", "recipe", "coconut-mango-cooler", "remove-key-recipe-1");
  assert.deepEqual((await getWishlist("customer-a")).recipeIds, []);
});

test("supported profile and communication preferences persist without inventing unsupported data", async () => {
  const profile = await updateProfile({ userId: "customer-a", email: "customer@example.com", roles: ["CUSTOMER"], tokenUse: "access" }, {
    displayName: "Afsala Khan",
    preferredCategory: "Coconut Water",
    newsletterOptIn: true,
    marketingOptIn: false
  });
  assert.equal(profile.displayName, "Afsala Khan");
  assert.equal(profile.newsletterOptIn, true);
  assert.equal("rewardBalance" in profile, false);
  assert.equal("paymentMethods" in profile, false);
});

const address = (isDefault = false) => ({ fullName: "Afsala Khan", phone: "+91 98765 43210", line1: "12 Coconut Road", city: "Palakkad", region: "Kerala", postalCode: "678001", country: "in", isDefault });

test("addresses support CRUD, one default and ownership isolation", async () => {
  await saveAddress("customer-a", address(true), "address-a001");
  await saveAddress("customer-a", { ...address(true), line1: "22 Palm Road" }, "address-a002");
  let items = (await listAddresses("customer-a")).items;
  assert.equal(items.filter((item) => item.isDefault).length, 1);
  assert.equal(items.find((item) => item.addressId === "address-a002")?.country, "IN");
  await saveAddress("customer-a", { ...address(false), line1: "24 Palm Road" }, "address-a002", true);
  assert.equal((await getAddress("customer-a", "address-a002"))?.line1, "24 Palm Road");
  assert.equal(await getAddress("customer-b", "address-a002"), null);
  await assert.rejects(() => deleteAddress("customer-b", "address-a002"), /Address not found/);
  await deleteAddress("customer-a", "address-a002");
  items = (await listAddresses("customer-a")).items;
  assert.equal(items.some((item) => item.addressId === "address-a002"), false);
  await assert.rejects(() => saveAddress("customer-a", address(), "missing-id01", true), /Address not found/);
});
