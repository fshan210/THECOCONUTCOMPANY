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

test("public content and newsletter routes are not shadowed by protected middleware", async () => {
  const app = createApp();
  const content = await app.request("/v1/recipes");
  assert.equal(content.status, 200);

  const newsletter = await app.request("/v1/newsletter/subscriptions", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: "newsletter-test@example.invalid",
      source: "test",
      consent: true,
      honeypot: ""
    })
  });
  assert.equal(newsletter.status, 202);
});

test("CORS does not approve unknown origins", async () => {
  const app = createApp();
  const response = await app.request("/v1/health", { headers: { origin: "https://evil.example" } });
  assert.equal(response.headers.get("access-control-allow-origin"), null);
});
