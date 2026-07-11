import { Hono } from "hono";
import { cartItemIdParamSchema, cartItemInputSchema, productIdParamSchema } from "@dotco/contracts";
import type { AppBindings } from "../types/context.js";
import { requireAuth } from "../middleware/auth.js";

export const cartRoutes = new Hono<AppBindings>()
  .use("*", requireAuth)
  .get("/cart", (c) => c.json({ data: { items: [], totals: null }, meta: {}, requestId: c.get("requestId") }))
  .post("/cart/items", async (c) => {
    const body = cartItemInputSchema.parse(await c.req.json());
    return c.json({ data: { ...body, itemId: crypto.randomUUID(), serverPriced: true }, meta: {}, requestId: c.get("requestId") }, 202);
  })
  .patch("/cart/items/:itemId", async (c) => {
    const params = cartItemIdParamSchema.parse(c.req.param());
    const body = cartItemInputSchema.pick({ quantity: true }).parse(await c.req.json());
    return c.json({ data: { ...params, ...body, serverPriced: true }, meta: {}, requestId: c.get("requestId") });
  })
  .delete("/cart/items/:itemId", (c) => c.json({ data: { ...cartItemIdParamSchema.parse(c.req.param()), deleted: true }, meta: {}, requestId: c.get("requestId") }))
  .delete("/cart", (c) => c.json({ data: { cleared: true }, meta: {}, requestId: c.get("requestId") }))
  .get("/wishlist", (c) => c.json({ data: { items: [] }, meta: {}, requestId: c.get("requestId") }))
  .post("/wishlist/items", async (c) => c.json({ data: { ...productIdParamSchema.parse(await c.req.json()), added: true }, meta: {}, requestId: c.get("requestId") }, 202))
  .delete("/wishlist/items/:productId", (c) => c.json({ data: { ...productIdParamSchema.parse(c.req.param()), deleted: true }, meta: {}, requestId: c.get("requestId") }));
