/* Deterministic browser regression; run with SESSION_QA_URL set to a Preview or local server. */
const assert = require("node:assert/strict");
const { chromium } = require(process.env.SESSION_QA_PLAYWRIGHT || "/Users/fazilshersha/.codex/qa/sustainability-release/node_modules/playwright-core");

const base = process.env.SESSION_QA_URL || "http://127.0.0.1:3000";
const chrome = process.env.SESSION_QA_CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const guest = { authenticated: false, user: null };
const member = { authenticated: true, user: { name: "QA Member", email: "qa@example.invalid", initials: "QM", emailVerified: true, accountStatus: "active" } };
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  const browser = await chromium.launch({ executablePath: chrome, headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const pending = [];
    let count = 0;
    await page.route("**/api/auth/session", async (route) => {
      count += 1;
      pending.push(route);
    });
    await page.goto(`${base}/journal`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.locator('a[aria-label="Sign in to your account"]').waitFor({ timeout: 30_000 });
    await page.waitForFunction(() => {
      const link = document.querySelector('a[aria-label="Sign in to your account"]');
      return link && Object.keys(link).some((key) => key.startsWith("__reactFiber$"));
    }, null, { timeout: 30_000 });
    await wait(250);
    // Settle a mocked authenticated session before counting the refresh pair.
    await page.evaluate(() => window.dispatchEvent(new Event("co-auth-changed")));
    await wait(50);
    assert.equal(count, 1);
    await pending.shift().fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(member) });
    await page.locator('a[aria-label="Open account for QA"]').waitFor({ timeout: 10_000 });
    count = 0;
    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "visible" });
      document.dispatchEvent(new Event("visibilitychange"));
      window.dispatchEvent(new Event("focus"));
    });
    await wait(150);
    assert.equal(count, 1, "visibilitychange and focus must share one in-flight session GET");
    await pending.shift().fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(member) });
    await wait(50);

    // A forced auth change is allowed to supersede an ordinary refresh.
    await page.evaluate(() => window.dispatchEvent(new Event("focus")));
    await wait(50);
    assert.equal(count, 2);
    await page.evaluate(() => window.dispatchEvent(new Event("co-auth-changed")));
    await wait(150);
    assert.equal(count, 3, "explicit auth change must issue a replacement GET");
    await pending.pop().fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(member) });
    await page.locator('a[aria-label="Open account for QA"]').waitFor({ timeout: 10_000 });
    await pending.shift().fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(guest) }).catch(() => {});
    assert.equal(await page.locator('a[aria-label="Open account for QA"]').count(), 1);

    // Return a stale response even after abort to exercise the generation guard.
    await page.evaluate(() => {
      const realFetch = window.fetch.bind(window);
      const resolvers = [];
      window.__sessionQa = { resolvers, calls: 0, realFetch };
      window.fetch = (input, init) => {
        if (String(input) !== "/api/auth/session") return realFetch(input, init);
        window.__sessionQa.calls += 1;
        return new Promise((resolve) => resolvers.push(resolve));
      };
      window.dispatchEvent(new Event("focus"));
      window.dispatchEvent(new Event("co-auth-changed"));
    });
    assert.equal(await page.evaluate(() => window.__sessionQa.calls), 2);
    await page.evaluate((payload) => window.__sessionQa.resolvers[1](new Response(JSON.stringify(payload), { status: 200, headers: { "content-type": "application/json" } })), member);
    await page.locator('a[aria-label="Open account for QA"]').waitFor();
    await page.evaluate((payload) => window.__sessionQa.resolvers[0](new Response(JSON.stringify(payload), { status: 200, headers: { "content-type": "application/json" } })), guest);
    await wait(100);
    assert.equal(await page.locator('a[aria-label="Open account for QA"]').count(), 1, "stale response overwrote newer auth state");
    console.log(JSON.stringify({ authenticatedPageSettled: true, normalOverlappingGets: 1, explicitReplacementGets: 2, staleResponseIgnored: true }));
    await page.close();
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
