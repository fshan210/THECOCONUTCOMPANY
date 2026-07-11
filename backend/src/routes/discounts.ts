import { Hono } from "hono";
import { discountClaimSchema } from "@dotco/contracts";
import type { AppBindings } from "../types/context.js";
import { requireAuth } from "../middleware/auth.js";

export const discountRoutes = new Hono<AppBindings>()
  .post("/discounts/first-purchase/claim", requireAuth, async (c) => {
    const body = discountClaimSchema.parse(await c.req.json());
    return c.json({ data: { email: body.email.toLowerCase(), status: "PENDING_VERIFIED_EMAIL", expiresInDays: 30 }, meta: {}, requestId: c.get("requestId") }, 202);
  })
  .get("/discounts/me", requireAuth, (c) => c.json({ data: { items: [] }, meta: {}, requestId: c.get("requestId") }));
