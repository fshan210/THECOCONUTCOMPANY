import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { safeReturnTo } from "../../lib/auth/safe-return";
import { sealAwsSession, unsealAwsSession } from "../../lib/auth/aws-session-crypto";
import { isSameOriginMutation, readBoundedJson } from "../../lib/security/request-integrity";
import { advanceSavedContentScope, isCurrentSavedContentScope } from "../../lib/customer/saved-consistency";

test("open redirects are reduced to an explicit same-site allowlist", () => {
  for (const attack of [
    "https://evil.example",
    "//evil.example",
    "javascript:alert(1)",
    "/\\evil.example",
    "/%2f%2fevil.example",
    "/%252f%252fevil.example",
    "/account/%2e%2e/api/customer/cart",
    "/account-security"
  ]) assert.equal(safeReturnTo(attack), "/shop");
  assert.equal(safeReturnTo("/account?tab=profile"), "/account?tab=profile");
  for (const path of ["/account/addresses", "/orders/history", "/saved-recipes", "/profile", "/recipes/coconut-basbousa", "/journal/social-cocreation-hub"]) {
    assert.equal(safeReturnTo(path), path);
  }
});

test("session sealing uses unique nonces and rejects tampering, malformed fields, and expiry", () => {
  const previous = process.env.COGNITO_SESSION_SECRET;
  process.env.COGNITO_SESSION_SECRET = "unit-test-secret-with-enough-entropy-only-for-tests";
  try {
    const payload = { accessToken: "access-token", sub: "customer-a", expiresAt: Math.floor(Date.now() / 1000) + 60 };
    const first = sealAwsSession(payload);
    const second = sealAwsSession(payload);
    assert.notEqual(first.split(".")[0], second.split(".")[0]);
    assert.deepEqual(unsealAwsSession(first), payload);
    assert.equal(unsealAwsSession(first.slice(0, -1) + (first.endsWith("a") ? "b" : "a")), null);
    assert.equal(unsealAwsSession("not.a.valid.session"), null);
    assert.equal(unsealAwsSession(sealAwsSession({ ...payload, accessToken: "", expiresAt: payload.expiresAt })), null);
    assert.equal(unsealAwsSession(sealAwsSession({ ...payload, expiresAt: Math.floor(Date.now() / 1000) - 1 })), null);
  } finally {
    if (previous === undefined) delete process.env.COGNITO_SESSION_SECRET;
    else process.env.COGNITO_SESSION_SECRET = previous;
  }
});

test("cookie-authenticated mutations require same-origin browser provenance", () => {
  const url = "https://cothecoconutcompany.com/api/customer/cart";
  assert.equal(isSameOriginMutation(new Request(url, { method: "POST", headers: { origin: "https://cothecoconutcompany.com" } })), true);
  assert.equal(isSameOriginMutation(new Request("http://localhost:3000/api/customer/cart", { method: "POST", headers: { origin: "http://localhost:3000" } })), true);
  assert.equal(isSameOriginMutation(new Request(url, { method: "POST", headers: { origin: "https://evil.example", "x-forwarded-host": "evil.example", "x-forwarded-proto": "https" } })), false);
  assert.equal(isSameOriginMutation(new Request("http://localhost:3000/api/customer/cart", { method: "POST", headers: { origin: "http://127.0.0.1:3000", host: "127.0.0.1:3000" } })), true);
  assert.equal(isSameOriginMutation(new Request(url, { method: "POST", headers: { referer: "https://cothecoconutcompany.com/cart" } })), true);
  assert.equal(isSameOriginMutation(new Request(url, { method: "POST" })), false);
  assert.equal(isSameOriginMutation(new Request(url, { method: "POST", headers: { origin: "https://evil.example" } })), false);
  assert.equal(isSameOriginMutation(new Request(url, { method: "POST", headers: { origin: "https://cothecoconutcompany.com", "sec-fetch-site": "cross-site" } })), false);
});

test("JSON body parsing enforces content type and actual byte limits", async () => {
  const url = "https://cothecoconutcompany.com/api/customer/cart";
  const valid = await readBoundedJson(new Request(url, { method: "POST", headers: { "content-type": "application/json; charset=utf-8" }, body: '{"ok":true}' }), 64);
  assert.deepEqual(valid, { ok: true, value: { ok: true } });
  const wrongType = await readBoundedJson(new Request(url, { method: "POST", headers: { "content-type": "text/plain" }, body: "{}" }));
  const oversized = await readBoundedJson(new Request(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ value: "x".repeat(100) }) }), 32);
  let consumed = 0;
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      consumed += 1;
      controller.enqueue(new Uint8Array(20));
    }
  });
  const streamed = await readBoundedJson(new Request(url, { method: "POST", headers: { "content-type": "application/json" }, body: stream, duplex: "half" } as RequestInit), 32);
  assert.equal(wrongType.ok ? 0 : wrongType.status, 415);
  assert.equal(oversized.ok ? 0 : oversized.status, 413);
  assert.equal(streamed.ok ? 0 : streamed.status, 413);
  assert.ok(consumed <= 3);
});

test("late saved-content responses cannot cross a logout or account swap", async () => {
  let scope = { owner: "customer-a@example.com" as string | null, generation: 0 };
  let visible = "customer-a";
  let resolve!: (value: string) => void;
  const delayed = new Promise<string>((done) => { resolve = done; });
  const captured = scope;
  const settle = delayed.then((value) => { if (isCurrentSavedContentScope(scope, captured)) visible = value; });
  scope = advanceSavedContentScope(scope, "customer-b@example.com");
  visible = "customer-b";
  resolve("late-customer-a");
  await settle;
  assert.equal(visible, "customer-b");
  assert.equal(isCurrentSavedContentScope(advanceSavedContentScope(scope, null), scope), false);
});

test("private BFFs and backend customer domains carry no-store policy", async () => {
  const [cart, saved, session, backend] = await Promise.all([
    readFile(new URL("../../app/api/customer/cart/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../../app/api/customer/saved/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../../app/api/auth/session/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../../backend/src/middleware/security.ts", import.meta.url), "utf8")
  ]);
  assert.match(cart, /privateJson/);
  assert.match(saved, /privateJson/);
  assert.match(session, /privateJson/);
  for (const path of ["v1\/me", "v1\/cart", "v1\/orders", "v1\/wishlist", "v1\/saved"]) assert.match(backend, new RegExp(path));
  assert.match(backend, /private, no-store, max-age=0/);
});

test("logout and account deletion clear every encrypted session chunk", async () => {
  const actions = await readFile(new URL("../../lib/customer/actions.ts", import.meta.url), "utf8");
  assert.match(actions, /maxAwsSessionChunks/);
  assert.equal((actions.match(/store\.delete\(awsSessionCookieName\(index\)\)/g) || []).length, 2);
});

test("site headers include defense-in-depth policy without enforcing an unproven CSP", async () => {
  const config = await readFile(new URL("../../next.config.mjs", import.meta.url), "utf8");
  for (const header of ["Content-Security-Policy-Report-Only", "X-Content-Type-Options", "Referrer-Policy", "Permissions-Policy", "Strict-Transport-Security"]) assert.match(config, new RegExp(header));
  assert.match(config, /frame-ancestors 'none'/);
  assert.doesNotMatch(config, /key: \"Content-Security-Policy\"/);
});
