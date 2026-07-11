import type { MiddlewareHandler } from "hono";
import { rateLimited } from "../errors/api-error.js";
import type { AppBindings } from "../types/context.js";

const memory = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(limit = 120, windowMs = 60_000): MiddlewareHandler<AppBindings> {
  return async (c, next) => {
    const forwarded = c.req.header("x-forwarded-for")?.split(",")[0]?.trim();
    const key = `${forwarded || c.req.header("cf-connecting-ip") || "unknown"}:${c.req.path}`;
    const now = Date.now();
    const current = memory.get(key);
    if (!current || current.resetAt < now) {
      memory.set(key, { count: 1, resetAt: now + windowMs });
      await next();
      return;
    }
    current.count += 1;
    if (current.count > limit) throw rateLimited();
    await next();
  };
}
