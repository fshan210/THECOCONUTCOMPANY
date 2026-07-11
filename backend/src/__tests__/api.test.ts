import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../app.js";

test("health returns response envelope with request id", async () => {
  const app = createApp();
  const response = await app.request("/v1/health");
  assert.equal(response.status, 200);
  const body = await response.json() as { data: { ok: boolean }; requestId: string };
  assert.equal(body.data.ok, true);
  assert.equal(typeof body.requestId, "string");
});

test("protected route rejects unauthenticated access", async () => {
  const app = createApp();
  const response = await app.request("/v1/me");
  assert.equal(response.status, 401);
  const body = await response.json() as { error: { code: string } };
  assert.equal(body.error.code, "UNAUTHORIZED");
});

test("CORS does not approve unknown origins", async () => {
  const app = createApp();
  const response = await app.request("/v1/health", { headers: { origin: "https://evil.example" } });
  assert.equal(response.headers.get("access-control-allow-origin"), null);
});
