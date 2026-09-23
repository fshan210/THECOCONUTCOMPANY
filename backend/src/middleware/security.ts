import type { MiddlewareHandler } from "hono";
import type { AppBindings } from "../types/context.js";

export const secureHeaders: MiddlewareHandler<AppBindings> = async (c, next) => {
  await next();
  c.header("x-content-type-options", "nosniff");
  c.header("referrer-policy", "strict-origin-when-cross-origin");
  c.header("permissions-policy", "camera=(), microphone=(), geolocation=()");
  c.header("x-frame-options", "DENY");
  if (c.req.url.startsWith("https://")) c.header("strict-transport-security", "max-age=31536000; includeSubDomains; preload");
  if (["/v1/me", "/v1/cart", "/v1/orders", "/v1/wishlist", "/v1/saved"].some((path) => c.req.path.startsWith(path))) {
    c.header("cache-control", "private, no-store, max-age=0");
    c.header("pragma", "no-cache");
    c.header("expires", "0");
  }
};
