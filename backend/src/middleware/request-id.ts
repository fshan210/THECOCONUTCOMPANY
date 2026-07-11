import type { MiddlewareHandler } from "hono";
import type { AppBindings } from "../types/context.js";

export const requestId: MiddlewareHandler<AppBindings> = async (c, next) => {
  const inbound = c.req.header("x-request-id");
  const id = inbound && /^[A-Za-z0-9_.:-]{8,128}$/.test(inbound) ? inbound : crypto.randomUUID();
  c.set("requestId", id);
  c.header("x-request-id", id);
  await next();
};
