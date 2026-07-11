import test from "node:test";
import assert from "node:assert/strict";
import { hasRole, normalizeRoles } from "../auth/authorization.js";

test("unknown Cognito groups cannot escalate roles", () => {
  assert.deepEqual(normalizeRoles(["CUSTOMER", "SUPER_ADMIN", "ADMIN"]), ["CUSTOMER", "ADMIN"]);
  assert.deepEqual(normalizeRoles(["SUPER_ADMIN"]), ["CUSTOMER"]);
});

test("role checks are explicit allow-list checks", () => {
  assert.equal(hasRole(["CUSTOMER"], ["ADMIN"]), false);
  assert.equal(hasRole(["OPERATIONS"], ["OPERATIONS", "ADMIN"]), true);
});
