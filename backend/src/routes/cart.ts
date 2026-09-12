import { Hono } from "hono";
import {
  cartAddInputSchema,
  cartItemIdParamSchema,
  cartMergeInputSchema,
  cartMutationInputSchema,
  cartQuantityInputSchema,
  productIdParamSchema,
  savedContentItemSchema,
  savedContentKindSchema
} from "@dotco/contracts";
import type { AppBindings } from "../types/context.js";
import { requireAuth } from "../middleware/auth.js";
import {
  addCartItem,
  clearCart,
  getCart,
  getWishlist,
  mergeCart,
  presentCart,
  removeCartItem,
  removeContentItem,
  saveContentItem,
  setCartItemQuantity
} from "../services/user-data.js";
import { isKnownProductId } from "../services/catalog.js";
import { notFound } from "../errors/api-error.js";

const mutationKey = (bodyKey: string | undefined, headerKey: string | undefined) => bodyKey ?? headerKey ?? crypto.randomUUID();

export const cartRoutes = new Hono<AppBindings>()
  .get("/cart", requireAuth, async (c) => { const cart = await getCart(c.get("user")!.userId); return c.json({ data: presentCart(cart), meta: { serverPriced: true }, requestId: c.get("requestId") }); })
  .post("/cart/items", requireAuth, async (c) => {
    const body = cartAddInputSchema.parse(await c.req.json());
    const cart = await addCartItem(c.get("user")!.userId, body, mutationKey(body.idempotencyKey, c.req.header("idempotency-key")));
    return c.json({ data: presentCart(cart), meta: { serverPriced: true }, requestId: c.get("requestId") }, 202);
  })
  .post("/cart/merge", requireAuth, async (c) => {
    const body = cartMergeInputSchema.parse(await c.req.json());
    const result = await mergeCart(c.get("user")!.userId, body.items, mutationKey(body.idempotencyKey, c.req.header("idempotency-key")));
    return c.json({ data: presentCart(result.cart), meta: { serverPriced: true, ignoredItemCount: result.ignoredItemCount }, requestId: c.get("requestId") });
  })
  .patch("/cart/items/:itemId", requireAuth, async (c) => {
    const params = cartItemIdParamSchema.parse(c.req.param());
    const body = cartQuantityInputSchema.parse(await c.req.json());
    const cart = await setCartItemQuantity(c.get("user")!.userId, params.itemId, body.quantity, mutationKey(body.idempotencyKey, c.req.header("idempotency-key")));
    return c.json({ data: presentCart(cart), meta: { serverPriced: true }, requestId: c.get("requestId") });
  })
  .delete("/cart/items/:itemId", requireAuth, async (c) => {
    const params = cartItemIdParamSchema.parse(c.req.param());
    const body = cartMutationInputSchema.parse(await c.req.json());
    const cart = await removeCartItem(c.get("user")!.userId, params.itemId, mutationKey(body.idempotencyKey, c.req.header("idempotency-key")));
    return c.json({ data: presentCart(cart), meta: { serverPriced: true }, requestId: c.get("requestId") });
  })
  .delete("/cart", requireAuth, async (c) => {
    const body = cartMutationInputSchema.parse(await c.req.json());
    const cart = await clearCart(c.get("user")!.userId, mutationKey(body.idempotencyKey, c.req.header("idempotency-key")));
    return c.json({ data: presentCart(cart), meta: { serverPriced: true }, requestId: c.get("requestId") });
  })
  .get("/wishlist", requireAuth, async (c) => c.json({ data: await getWishlist(c.get("user")!.userId), meta: {}, requestId: c.get("requestId") }))
  .post("/wishlist/items", requireAuth, async (c) => {
    const body = productIdParamSchema.parse(await c.req.json());
    if (!isKnownProductId(body.productId)) throw notFound("Product not found.");
    return c.json({ data: await saveContentItem(c.get("user")!.userId, "product", body.productId, mutationKey(undefined, c.req.header("idempotency-key"))), meta: { persisted: true }, requestId: c.get("requestId") }, 202);
  })
  .delete("/wishlist/items/:productId", requireAuth, async (c) => {
    const body = productIdParamSchema.parse(c.req.param());
    return c.json({ data: await removeContentItem(c.get("user")!.userId, "product", body.productId, mutationKey(undefined, c.req.header("idempotency-key"))), meta: { persisted: true }, requestId: c.get("requestId") });
  })
  .post("/saved", requireAuth, async (c) => {
    const body = savedContentItemSchema.parse(await c.req.json());
    if ((body.kind === "product" || body.kind === "recent") && !isKnownProductId(body.itemId)) throw notFound("Product not found.");
    return c.json({ data: await saveContentItem(c.get("user")!.userId, body.kind, body.itemId, mutationKey(body.idempotencyKey, c.req.header("idempotency-key"))), meta: { persisted: true }, requestId: c.get("requestId") }, 202);
  })
  .delete("/saved/:kind/:itemId", requireAuth, async (c) => {
    const kind = savedContentKindSchema.parse(c.req.param("kind"));
    const itemId = c.req.param("itemId");
    const key = mutationKey(c.req.query("idempotencyKey"), c.req.header("idempotency-key"));
    return c.json({ data: await removeContentItem(c.get("user")!.userId, kind, itemId, key), meta: { persisted: true }, requestId: c.get("requestId") });
  });
