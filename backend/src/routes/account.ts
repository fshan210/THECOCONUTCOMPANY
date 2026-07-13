import { Hono } from "hono";
import { addressIdParamSchema, addressInputSchema, mePatchSchema } from "@dotco/contracts";
import type { AppBindings } from "../types/context.js";
import { requireAuth } from "../middleware/auth.js";
import { deleteProfile, listAddresses, provisionProfile, updateProfile } from "../services/user-data.js";

export const accountRoutes = new Hono<AppBindings>()
  .use("*", requireAuth)
  .get("/me", async (c) => {
    const user = c.get("user");
    const profile = await provisionProfile(user!);
    return c.json({ data: { userId: user?.userId, email: user?.email, roles: user?.roles, profile }, meta: {}, requestId: c.get("requestId") });
  })
  .patch("/me", async (c) => {
    const body = mePatchSchema.parse(await c.req.json());
    const profile = await updateProfile(c.get("user")!, body);
    return c.json({ data: profile, meta: { persisted: true }, requestId: c.get("requestId") });
  })
  .delete("/me", async (c) => { await deleteProfile(c.get("user")!.userId); return c.json({ data: { deletionRequested: true }, meta: {}, requestId: c.get("requestId") }); })
  .get("/me/addresses", async (c) => c.json({ data: await listAddresses(c.get("user")!.userId), meta: {}, requestId: c.get("requestId") }))
  .post("/me/addresses", async (c) => {
    const body = addressInputSchema.parse(await c.req.json());
    return c.json({ data: { ...body, addressId: crypto.randomUUID(), saved: false }, meta: {}, requestId: c.get("requestId") }, 202);
  })
  .patch("/me/addresses/:addressId", async (c) => {
    const params = addressIdParamSchema.parse(c.req.param());
    const body = addressInputSchema.partial().parse(await c.req.json());
    return c.json({ data: { ...params, ...body, saved: false }, meta: {}, requestId: c.get("requestId") });
  })
  .delete("/me/addresses/:addressId", (c) => {
    const params = addressIdParamSchema.parse(c.req.param());
    return c.json({ data: { ...params, deleted: true }, meta: {}, requestId: c.get("requestId") });
  });
