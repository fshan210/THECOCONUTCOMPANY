import { Hono } from "hono";
import type { AppBindings } from "../types/context.js";
import { getEnv } from "../config/env.js";

export const healthRoutes = new Hono<AppBindings>()
  .get("/health", (c) => c.json({ data: { ok: true, service: "dotco-api", environment: getEnv().APP_ENV }, meta: {}, requestId: c.get("requestId") }))
  .get("/ready", (c) => {
    const env = getEnv();
    const ready = Boolean(env.COMMERCE_TABLE_NAME && env.CONTENT_TABLE_NAME && env.AUDIT_TABLE_NAME);
    return c.json({ data: { ok: ready, dependencies: { dynamodb: "configured", cognito: env.COGNITO_USER_POOL_ID ? "configured" : "missing" } }, meta: {}, requestId: c.get("requestId") }, ready ? 200 : 503);
  });
