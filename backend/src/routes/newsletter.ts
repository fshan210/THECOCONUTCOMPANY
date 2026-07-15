import { Hono } from "hono";
import { newsletterDeleteSchema, newsletterSubscriptionSchema } from "@dotco/contracts";
import type { AppBindings } from "../types/context.js";
import { subscribeNewsletter } from "../services/marketing.js";

export const newsletterRoutes = new Hono<AppBindings>()
  .post("/newsletter/subscriptions", async (c) => {
    const body = newsletterSubscriptionSchema.parse(await c.req.json());
    const result = await subscribeNewsletter(body);
    return c.json({ data: { ...result, status: result.duplicate ? "already_subscribed" : "active", idempotent: true }, meta: {}, requestId: c.get("requestId") }, result.duplicate ? 200 : 202);
  })
  .delete("/newsletter/subscriptions", async (c) => {
    const body = newsletterDeleteSchema.parse(await c.req.json());
    return c.json({ data: { email: body.email.toLowerCase(), unsubscribed: true }, meta: {}, requestId: c.get("requestId") });
  });
