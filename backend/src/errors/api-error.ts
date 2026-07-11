import type { ApiErrorCode } from "@dotco/contracts";

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly fields: Record<string, string[]> | undefined;

  constructor(status: number, code: ApiErrorCode, message: string, fields?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

export const badRequest = (message = "The request could not be processed.") => new ApiError(400, "BAD_REQUEST", message);
export const unauthorized = (message = "Sign in is required.") => new ApiError(401, "UNAUTHORIZED", message);
export const forbidden = (message = "You do not have permission to perform this action.") => new ApiError(403, "FORBIDDEN", message);
export const notFound = (message = "The requested resource was not found.") => new ApiError(404, "NOT_FOUND", message);
export const conflict = (message = "This request conflicts with the current resource state.") => new ApiError(409, "CONFLICT", message);
export const rateLimited = (message = "Too many requests. Please try again shortly.") => new ApiError(429, "RATE_LIMITED", message);
export const payloadTooLarge = (message = "The request body is too large.") => new ApiError(413, "PAYLOAD_TOO_LARGE", message);
