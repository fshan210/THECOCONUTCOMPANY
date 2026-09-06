import assert from "node:assert/strict";
import { test } from "node:test";
import { createClientSubmissionLock } from "../../lib/auth/client-submission-lock";
import fs from "node:fs";

function deferred() {
  let reject!: (reason: Error) => void;
  let resolve!: () => void;
  const promise = new Promise<void>((onResolve, onReject) => {
    resolve = onResolve;
    reject = onReject;
  });
  return { promise, reject, resolve };
}

function verificationHarness() {
  const lock = createClientSubmissionLock();
  const requests: Array<ReturnType<typeof deferred>> = [];
  const submit = () => {
    if (!lock.tryAcquire()) return;
    const request = deferred();
    requests.push(request);
    void request.promise.catch(() => lock.release());
  };
  return { lock, requests, submit };
}

test("verification lock rejects synchronous double Enter submissions", async () => {
  const harness = verificationHarness();
  harness.submit();
  harness.submit();
  assert.equal(harness.requests.length, 1);
  harness.requests[0].resolve();
});

test("verification lock rejects a rapid Verify double click", async () => {
  const harness = verificationHarness();
  harness.submit();
  harness.submit();
  assert.equal(harness.requests.length, 1);
  harness.requests[0].resolve();
});

test("verification lock rejects Enter plus click and permits a settled retry", async () => {
  const harness = verificationHarness();
  harness.submit();
  harness.submit();
  assert.equal(harness.requests.length, 1);

  harness.requests[0].reject(new Error("recoverable verification failure"));
  await assert.rejects(harness.requests[0].promise);
  harness.submit();
  assert.equal(harness.requests.length, 2);
  harness.requests[1].resolve();
});

test("Auth routes reuse the canonical cookie dialog with a 44px mobile trigger", () => {
  const launchExperience = fs.readFileSync("components/launch/LaunchExperience.tsx", "utf8");
  assert.match(launchExperience, /const cinematicAuthRoutes = new Set/);
  assert.match(launchExperience, /cinematicAuthRoute \? "grid size-11" : "hidden size-10 md:grid"/);
  assert.match(launchExperience, /onClick=\{\(\) => setPreferencesOpen\(true\)\}/);
  assert.equal((launchExperience.match(/<Dialog\.Root open=\{preferencesOpen\}/g) || []).length, 1);
});
