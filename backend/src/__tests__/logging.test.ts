import assert from "node:assert/strict";
import test from "node:test";
import { sanitizeForLog } from "../observability/logger.js";

test("structured logging redacts credentials regardless of key spelling", () => {
  assert.deepEqual(sanitizeForLog({
    accessToken: "secret",
    refresh_token: "secret",
    OTP: "123456",
    privateKey: "secret",
    nested: { authorization: "Bearer secret", safe: "ok" }
  }), {
    accessToken: "[REDACTED]",
    refresh_token: "[REDACTED]",
    OTP: "[REDACTED]",
    privateKey: "[REDACTED]",
    nested: { authorization: "[REDACTED]", safe: "ok" }
  });
});
