import { Hono } from "hono";
import { discountClaimSchema } from "@dotco/contracts";
import type { AppBindings } from "../types/context.js";
import { requireAuth } from "../middleware/auth.js";
import { claimFirstPurchase } from "../services/marketing.js";

export const discountRoutes = new Hono<AppBindings>()
  .post("/discounts/first-purchase/claim", requireAuth, async (c) => {
    const body = discountClaimSchema.parse(await c.req.json());
    const user = c.get("user")!;
    if (!user.email || user.email.toLowerCase() !== body.email.toLowerCase()) return c.json({ data: null, meta: { reason: "email_mismatch" }, requestId: c.get("requestId") }, 403);
    return c.json({ data: await claimFirstPurchase(body.email, body.idempotencyKey), meta: {}, requestId: c.get("requestId") }, 202);
  })
  .get("/discounts/me", requireAuth, (c) => c.json({ data: { items: [] }, meta: {}, requestId: c.get("requestId") }));
