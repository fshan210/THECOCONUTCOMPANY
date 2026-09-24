import assert from "node:assert/strict";
import test from "node:test";
import { getRateLimitKey, getSecurityEnvironment } from "../../lib/security/environment";

test("security state is partitioned by Vercel environment", () => {
  assert.equal(getSecurityEnvironment("preview"), "preview");
  assert.equal(getSecurityEnvironment("production"), "production");
  assert.equal(getSecurityEnvironment(undefined), "development");
  assert.notEqual(getRateLimitKey("preview", "customer_login", "qa@example.com"), getRateLimitKey("production", "customer_login", "qa@example.com"));
});
