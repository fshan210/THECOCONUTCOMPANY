import type { MiddlewareHandler } from "hono";
import type { AppBindings } from "../types/context.js";
import { getEnv } from "../config/env.js";

const allowedMethods = "GET,POST,PATCH,DELETE,OPTIONS";
const allowedHeaders = "authorization,content-type,idempotency-key,x-csrf-token,x-request-id";

export const strictCors: MiddlewareHandler<AppBindings> = async (c, next) => {
  const origin = c.req.header("origin");
  const env = getEnv();
  const allowed = origin && env.allowedOrigins.includes(origin);
  if (allowed) {
    c.header("access-control-allow-origin", origin);
    c.header("vary", "Origin");
    c.header("access-control-allow-credentials", "true");
    c.header("access-control-allow-methods", allowedMethods);
    c.header("access-control-allow-headers", allowedHeaders);
    c.header("access-control-max-age", "600");
  }
  if (c.req.method === "OPTIONS") {
    return c.body(null, allowed ? 204 : 403);
  }
  await next();
};
