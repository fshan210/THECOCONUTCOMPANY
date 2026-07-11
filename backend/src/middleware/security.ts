import type { MiddlewareHandler } from "hono";
import type { AppBindings } from "../types/context.js";

export const secureHeaders: MiddlewareHandler<AppBindings> = async (c, next) => {
  await next();
  c.header("x-content-type-options", "nosniff");
  c.header("referrer-policy", "strict-origin-when-cross-origin");
  c.header("permissions-policy", "camera=(), microphone=(), geolocation=()");
  c.header("x-frame-options", "DENY");
  if (c.req.url.startsWith("https://")) c.header("strict-transport-security", "max-age=31536000; includeSubDomains; preload");
  if (c.req.path.startsWith("/v1/me") || c.req.path.startsWith("/v1/cart") || c.req.path.startsWith("/v1/orders")) {
    c.header("cache-control", "private, no-store");
  }
};
