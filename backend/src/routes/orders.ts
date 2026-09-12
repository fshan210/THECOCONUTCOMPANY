import { Hono } from "hono";
import { orderPreviewSchema } from "@dotco/contracts";
import type { AppBindings } from "../types/context.js";
import { requireAuth } from "../middleware/auth.js";
import { previewOrder } from "../services/pricing.js";
import { conflict } from "../errors/api-error.js";

export const orderRoutes = new Hono<AppBindings>()
  .post("/orders/preview", requireAuth, async (c) => {
    const body = orderPreviewSchema.parse(await c.req.json());
    return c.json({ data: previewOrder(body), meta: { serverPriced: true }, requestId: c.get("requestId") });
  })
  .post("/orders", requireAuth, () => { throw conflict("Order creation is deferred until payment and fulfilment are enabled."); })
  .get("/orders", requireAuth, (c) => c.json({ data: { items: [] }, meta: {}, requestId: c.get("requestId") }))
  .get("/orders/:orderId", requireAuth, (c) => c.json({ data: { orderId: c.req.param("orderId"), status: "NOT_IMPLEMENTED" }, meta: {}, requestId: c.get("requestId") }, 202));
