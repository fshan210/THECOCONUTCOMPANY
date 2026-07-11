import type { MiddlewareHandler } from "hono";
import type { DotCoRole } from "@dotco/contracts";
import type { AppBindings } from "../types/context.js";
import { getEnv } from "../config/env.js";
import { forbidden, unauthorized } from "../errors/api-error.js";
import { hasRole } from "../auth/authorization.js";
import { verifyBearerToken } from "../auth/jwt.js";

export const optionalAuth: MiddlewareHandler<AppBindings> = async (c, next) => {
  const auth = c.req.header("authorization");
  if (auth) c.set("user", await verifyBearerToken(auth));
  await next();
};

export const requireAuth: MiddlewareHandler<AppBindings> = async (c, next) => {
  const env = getEnv();
  if (env.APP_ENV === "local" && env.ENABLE_AUTH_BYPASS_FOR_LOCAL_TESTS) {
    c.set("user", { userId: "local-test-user", email: "local@example.com", roles: ["ADMIN"], tokenUse: "access" });
    await next();
    return;
  }
  c.set("user", await verifyBearerToken(c.req.header("authorization")));
  await next();
};

export function requireRole(allowed: DotCoRole[]): MiddlewareHandler<AppBindings> {
  return async (c, next) => {
    const user = c.get("user");
    if (!user) throw unauthorized();
    if (!hasRole(user.roles, allowed)) throw forbidden();
    await next();
  };
}
