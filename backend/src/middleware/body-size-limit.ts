import type { MiddlewareHandler } from "hono";
import { payloadTooLarge } from "../errors/api-error.js";
import type { AppBindings } from "../types/context.js";

export function bodySizeLimit(maxBytes = 64 * 1024): MiddlewareHandler<AppBindings> {
  return async (c, next) => {
    const length = Number(c.req.header("content-length") || 0);
    if (Number.isFinite(length) && length > maxBytes) throw payloadTooLarge();
    await next();
  };
}
