import { ZodError } from "zod";
import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { ApiError } from "../errors/api-error.js";
import { logError, logWarn } from "../observability/logger.js";
import type { AppBindings } from "../types/context.js";

export const errorHandler: ErrorHandler<AppBindings> = (err, c) => {
  const requestId = c.get("requestId") || crypto.randomUUID();
  if (err instanceof ApiError) {
    if (err.status >= 500) logError("api_error", { requestId, code: err.code, status: err.status });
    else logWarn("api_error", { requestId, code: err.code, status: err.status });
    return c.json({ error: { code: err.code, message: err.message, fields: err.fields }, requestId }, err.status as ContentfulStatusCode);
  }
  if (err instanceof ZodError) {
    const fields = err.flatten().fieldErrors;
    logWarn("validation_error", { requestId, fields });
    return c.json({ error: { code: "VALIDATION_ERROR", message: "Check the highlighted fields and try again.", fields }, requestId }, 400);
  }
  logError("unhandled_error", { requestId, name: err.name, message: err.message });
  return c.json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong. Please try again." }, requestId }, 500);
};
