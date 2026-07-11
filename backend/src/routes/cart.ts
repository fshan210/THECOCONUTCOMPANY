import { Hono } from "hono";
import { cartItemIdParamSchema, cartItemInputSchema, productIdParamSchema } from "@dotco/contracts";
import type { AppBindings } from "../types/context.js";
import { requireAuth } from "../middleware/auth.js";
import { getCart, getWishlist, saveCart, saveWishlist } from "../services/user-data.js";
import { getProductById } from "../services/catalog.js";

export const cartRoutes = new Hono<AppBindings>()
  .use("*", requireAuth)
  .get("/cart", async (c) => { const cart = await getCart(c.get("user")!.userId); return c.json({ data: { ...cart, totals: null }, meta: {}, requestId: c.get("requestId") }); })
  .post("/cart/items", async (c) => {
    const body = cartItemInputSchema.parse(await c.req.json());
    if (!getProductById(body.productId)) return c.json({ data: null, meta: { removed: true }, requestId: c.get("requestId") }, 404);
    const current = await getCart(c.get("user")!.userId);
    const items = [...current.items.filter((item) => item.productId !== body.productId), body];
    return c.json({ data: await saveCart(c.get("user")!.userId, items), meta: { serverPriced: true }, requestId: c.get("requestId") }, 202);
  })
  .patch("/cart/items/:itemId", async (c) => {
    const params = cartItemIdParamSchema.parse(c.req.param());
    const body = cartItemInputSchema.pick({ quantity: true }).parse(await c.req.json());
    return c.json({ data: { ...params, ...body, serverPriced: true }, meta: {}, requestId: c.get("requestId") });
  })
  .delete("/cart/items/:itemId", (c) => c.json({ data: { ...cartItemIdParamSchema.parse(c.req.param()), deleted: true }, meta: {}, requestId: c.get("requestId") }))
  .delete("/cart", (c) => c.json({ data: { cleared: true }, meta: {}, requestId: c.get("requestId") }))
  .get("/wishlist", async (c) => c.json({ data: await getWishlist(c.get("user")!.userId), meta: {}, requestId: c.get("requestId") }))
  .post("/wishlist/items", async (c) => { const body = productIdParamSchema.parse(await c.req.json()); const current = await getWishlist(c.get("user")!.userId); return c.json({ data: await saveWishlist(c.get("user")!.userId, Array.from(new Set([...current.productIds, body.productId]))), meta: {}, requestId: c.get("requestId") }, 202); })
  .delete("/wishlist/items/:productId", async (c) => { const body = productIdParamSchema.parse(c.req.param()); const current = await getWishlist(c.get("user")!.userId); return c.json({ data: await saveWishlist(c.get("user")!.userId, current.productIds.filter((id) => id !== body.productId)), meta: {}, requestId: c.get("requestId") }); });
