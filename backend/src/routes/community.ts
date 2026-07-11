import { Hono } from "hono";
import { communitySubmissionSchema } from "@dotco/contracts";
import type { AppBindings } from "../types/context.js";
import { requireAuth } from "../middleware/auth.js";

export const communityRoutes = new Hono<AppBindings>()
  .post("/community/submissions", requireAuth, async (c) => {
    const body = communitySubmissionSchema.parse(await c.req.json());
    return c.json({ data: { submissionId: crypto.randomUUID(), status: "PENDING_REVIEW", ...body }, meta: {}, requestId: c.get("requestId") }, 202);
  })
  .get("/community/me/submissions", requireAuth, (c) => c.json({ data: { items: [] }, meta: {}, requestId: c.get("requestId") }));
