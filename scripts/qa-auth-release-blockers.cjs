/* Run with AUTH_QA_PLAYWRIGHT pointing to a local playwright-core installation. */
const { chromium } = require(process.env.AUTH_QA_PLAYWRIGHT || "playwright-core");
const assert = require("node:assert/strict");

const base = process.env.AUTH_QA_URL || "http://127.0.0.1:3010";
const executablePath = process.env.AUTH_QA_CHROME;
const launchOptions = executablePath ? { executablePath, headless: true } : { channel: "chrome", headless: true };

function consentState() {
  return JSON.stringify({ essential: true, analytics: false, marketing: false, updatedAt: new Date().toISOString() });
}

let browser;

(async () => {
  browser = await chromium.launch(launchOptions);
  const report = { otp: [], cookiePreferences: [], noConsent: null };

  async function verifyRace(name, trigger) {
    const context = await browser.newContext({ viewport: { width: 390, height: 900 } });
    const page = await context.newPage();
    let calls = 0;
    let settleFirst;
    const firstPending = new Promise((resolve) => { settleFirst = resolve; });

    await page.route("**/api/auth/cognito", async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      calls += 1;
      if (calls === 1) {
        await firstPending;
        return route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ ok: false, message: "That verification code is invalid or expired." }) });
      }
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    });

    await page.goto(`${base}/verify-email?email=qa%40example.com`, { waitUntil: "networkidle" });
    const slots = page.locator(".co-auth-code-row input");
    for (let index = 0; index < 6; index += 1) await slots.nth(index).fill(String(index + 1));
    await trigger(page, slots);
    await page.waitForTimeout(150);
    assert.equal(calls, 1, `${name} issued concurrent confirmation requests`);

    settleFirst();
    await page.getByRole("alert").waitFor();
    for (let index = 0; index < 6; index += 1) await slots.nth(index).fill(String(index + 1));
    await page.getByRole("button", { name: "Verify & continue" }).click();
    await page.waitForTimeout(150);
    assert.equal(calls, 2, `${name} did not permit one intentional retry`);
    report.otp.push({ scenario: name, firstRaceCalls: 1, callsAfterRetry: calls });
    await context.close();
  }

  await verifyRace("Enter + Enter", async (page, slots) => {
    await slots.nth(5).evaluate((element) => {
      const init = { key: "Enter", code: "Enter", bubbles: true, cancelable: true };
      element.dispatchEvent(new KeyboardEvent("keydown", init));
      element.dispatchEvent(new KeyboardEvent("keydown", init));
    });
  });

  await verifyRace("Verify double click", async (page) => {
    await page.getByRole("button", { name: "Verify & continue" }).evaluate((element) => {
      element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
      element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    });
  });

  await verifyRace("Enter + click", async (page, slots) => {
    await slots.nth(5).evaluate((element) => {
      element.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true, cancelable: true }));
      element.closest(".co-auth-verify").querySelector(".co-auth-primary").dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    });
  });

  {
    const context = await browser.newContext({ viewport: { width: 390, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${base}/login`, { waitUntil: "networkidle" });
    report.noConsent = { bannerVisible: await page.getByRole("region", { name: "Cookie consent" }).isVisible(), preferencesTriggerVisible: await page.getByRole("button", { name: "Manage cookie preferences" }).isVisible().catch(() => false) };
    assert.equal(report.noConsent.bannerVisible, true);
    assert.equal(report.noConsent.preferencesTriggerVisible, false);
    await context.close();
  }

  for (const width of [1440, 430, 390, 375]) {
    const context = await browser.newContext({ viewport: { width, height: width >= 768 ? 1000 : 900 } });
    await context.addInitScript((value) => {
      localStorage.setItem("co_cookie_consent_v1", value);
      localStorage.setItem("co_welcome_claimed_v1", "dismissed");
    }, consentState());
    const page = await context.newPage();
    await page.goto(`${base}/login`, { waitUntil: "networkidle" });
    const trigger = page.getByRole("button", { name: "Manage cookie preferences" });
    assert.equal(await trigger.isVisible(), true, `cookie preferences hidden at ${width}`);
    const box = await trigger.boundingBox();
    assert.ok(box && box.width >= 44 && box.height >= 44, `cookie target below 44px at ${width}`);
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Cookie preferences" });
    await dialog.waitFor();
    await dialog.getByText("Marketing", { exact: true }).click();
    await dialog.getByRole("button", { name: "Save preferences" }).click();
    const saved = JSON.parse(await page.evaluate(() => localStorage.getItem("co_cookie_consent_v1")));
    assert.equal(saved.marketing, true, `canonical consent did not save at ${width}`);
    report.cookiePreferences.push({ width, visible: true, target: { width: box.width, height: box.height }, dialogOpened: true, saved: true });
    await context.close();
  }

  console.log(JSON.stringify(report, null, 2));
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await browser?.close();
});
