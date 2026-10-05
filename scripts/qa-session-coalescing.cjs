/* Deterministic browser regression; run with SESSION_QA_URL set to a Preview or local server. */
const assert = require("node:assert/strict");
const { chromium } = require(process.env.SESSION_QA_PLAYWRIGHT || "/Users/fazilshersha/.codex/qa/sustainability-release/node_modules/playwright-core");

const base = process.env.SESSION_QA_URL || "http://127.0.0.1:3000";
const chrome = process.env.SESSION_QA_CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const guest = { authenticated: false, user: null };
const member = { authenticated: true, user: { name: "QA Member", email: "qa@example.invalid", initials: "QM", emailVerified: true, accountStatus: "active" } };

(async () => {
  const browser = await chromium.launch({ executablePath: chrome, headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`${base}/journal`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    const signIn = page.locator('a[aria-label="Sign in to your account"]');
    await signIn.first().waitFor({ timeout: 30_000 });
    // Desktop and mobile header links can coexist. Wait for any mounted link.
    await page.waitForFunction(() => [...document.querySelectorAll('a[aria-label="Sign in to your account"]')]
      .some((link) => Object.keys(link).some((key) => key.startsWith("__reactFiber$"))), null, { timeout: 30_000 });

    // Keep every session response under test control, including after abort.
    // This isolates the provider behavior from browser focus and network timing.
    await page.evaluate(() => {
      const realFetch = window.fetch.bind(window);
      const requests = [];
      window.__sessionQa = { requests };
      window.fetch = (input, init) => {
        if (String(input) !== "/api/auth/session") return realFetch(input, init);
        return new Promise((resolve) => requests.push({ resolve, aborted: () => init?.signal?.aborted ?? false }));
      };
    });
    const count = () => page.evaluate(() => window.__sessionQa.requests.length);
    const settle = (index, payload) => page.evaluate(({ index, payload }) => {
      window.__sessionQa.requests[index].resolve(new Response(JSON.stringify(payload), {
        status: 200, headers: { "content-type": "application/json" }
      }));
    }, { index, payload });

    await page.evaluate(() => window.dispatchEvent(new Event("co-auth-changed")));
    assert.equal(await count(), 1, "initial auth change must issue one session GET");
    await settle(0, member);
    await page.locator('a[aria-label="Open account for QA"]').first().waitFor({ timeout: 10_000 });

    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "visible" });
      document.dispatchEvent(new Event("visibilitychange"));
      window.dispatchEvent(new Event("focus"));
    });
    assert.equal(await count(), 2, "visibilitychange and focus must share one in-flight session GET");
    await settle(1, member);
    await page.waitForTimeout(50);

    await page.evaluate(() => {
      window.dispatchEvent(new Event("focus"));
      window.dispatchEvent(new Event("co-auth-changed"));
    });
    assert.equal(await count(), 4, "explicit auth change must replace the ordinary refresh");
    assert.equal(await page.evaluate(() => window.__sessionQa.requests[2].aborted()), true);
    await settle(3, member);
    await page.locator('a[aria-label="Open account for QA"]').first().waitFor({ timeout: 10_000 });
    await settle(2, guest);
    await page.waitForTimeout(100);
    assert.equal(await page.locator('a[aria-label="Open account for QA"]').count() > 0, true, "stale response overwrote newer auth state");
    console.log(JSON.stringify({ authenticatedPageSettled: true, normalOverlappingGets: 1, explicitReplacementGets: 2, staleResponseIgnored: true }));
    await page.close();
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
