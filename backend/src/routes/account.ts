import { Hono } from "hono";
import { addressIdParamSchema, addressInputSchema, mePatchSchema } from "@dotco/contracts";
import type { AppBindings } from "../types/context.js";
import { requireAuth } from "../middleware/auth.js";
import { deleteAddress, deleteProfile, listAddresses, provisionProfile, saveAddress, updateProfile } from "../services/user-data.js";

export const accountRoutes = new Hono<AppBindings>()
  .get("/me", requireAuth, async (c) => {
    const user = c.get("user");
    const profile = await provisionProfile(user!);
    return c.json({ data: { userId: user?.userId, email: user?.email, roles: user?.roles, profile }, meta: {}, requestId: c.get("requestId") });
  })
  .patch("/me", requireAuth, async (c) => {
    const body = mePatchSchema.parse(await c.req.json());
    const profile = await updateProfile(c.get("user")!, body);
    return c.json({ data: profile, meta: { persisted: true }, requestId: c.get("requestId") });
  })
  .delete("/me", requireAuth, async (c) => { await deleteProfile(c.get("user")!.userId); return c.json({ data: { deletionRequested: true }, meta: {}, requestId: c.get("requestId") }); })
  .get("/me/addresses", requireAuth, async (c) => c.json({ data: await listAddresses(c.get("user")!.userId), meta: {}, requestId: c.get("requestId") }))
  .post("/me/addresses", requireAuth, async (c) => {
    const body = addressInputSchema.parse(await c.req.json());
    return c.json({ data: await saveAddress(c.get("user")!.userId, body), meta: { persisted: true }, requestId: c.get("requestId") }, 202);
  })
  .patch("/me/addresses/:addressId", requireAuth, async (c) => {
    const params = addressIdParamSchema.parse(c.req.param());
    const body = addressInputSchema.parse(await c.req.json());
    return c.json({ data: await saveAddress(c.get("user")!.userId, body, params.addressId), meta: { persisted: true }, requestId: c.get("requestId") });
  })
  .delete("/me/addresses/:addressId", requireAuth, async (c) => {
    const params = addressIdParamSchema.parse(c.req.param());
    await deleteAddress(c.get("user")!.userId, params.addressId);
    return c.json({ data: { ...params, deleted: true }, meta: {}, requestId: c.get("requestId") });
  });
