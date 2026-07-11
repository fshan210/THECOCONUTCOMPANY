import { Hono } from "hono";
import { orderCreateSchema, orderPreviewSchema } from "@dotco/contracts";
import type { AppBindings } from "../types/context.js";
import { requireAuth } from "../middleware/auth.js";
import { previewOrder } from "../services/pricing.js";

export const orderRoutes = new Hono<AppBindings>()
  .use("*", requireAuth)
  .post("/orders/preview", async (c) => {
    const body = orderPreviewSchema.parse(await c.req.json());
    return c.json({ data: previewOrder(body), meta: { serverPriced: true }, requestId: c.get("requestId") });
  })
  .post("/orders", async (c) => {
    const body = orderCreateSchema.parse(await c.req.json());
    const preview = previewOrder(body);
    return c.json({ data: { orderId: crypto.randomUUID(), ...preview, status: "PENDING_PAYMENT", paymentStatus: "UNPAID" }, meta: { idempotencyKey: body.idempotencyKey, serverPriced: true }, requestId: c.get("requestId") }, 202);
  })
  .get("/orders", (c) => c.json({ data: { items: [] }, meta: {}, requestId: c.get("requestId") }))
  .get("/orders/:orderId", (c) => c.json({ data: { orderId: c.req.param("orderId"), status: "NOT_IMPLEMENTED" }, meta: {}, requestId: c.get("requestId") }, 202));
