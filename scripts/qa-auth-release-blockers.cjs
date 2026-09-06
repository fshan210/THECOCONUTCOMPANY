/* Run with AUTH_QA_PLAYWRIGHT pointing to a local playwright-core installation. */
const { chromium } = require(process.env.AUTH_QA_PLAYWRIGHT || "playwright-core");
const assert = require("node:assert/strict");

const base = process.env.AUTH_QA_URL || "http://127.0.0.1:3010";
const executablePath = process.env.AUTH_QA_CHROME;
const launchOptions = executablePath ? { executablePath, headless: true } : { channel: "chrome", headless: true };

function consentState() {
  return JSON.stringify({ essential: true, analytics: false, marketing: false, updatedAt: new Date().toISOString() });
}

async function gotoReady(page, url, readySelector) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.locator(readySelector).waitFor({ timeout: 30_000 });
}

async function prepareVerificationKeyboard(page, slots) {
  await page.waitForFunction(() => {
    const input = document.querySelector('[aria-label="Verification digit 6"]');
    if (!input) return false;
    const reactPropsKey = Object.keys(input).find((key) => key.startsWith("__reactProps$"));
    return Boolean(reactPropsKey && input[reactPropsKey]?.onKeyDown);
  }, null, { timeout: 8_000 });
  await slots.nth(5).focus();
  await page.keyboard.press("ArrowLeft");
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("aria-label")), "Verification digit 5");
  await page.keyboard.press("ArrowRight");
}

async function waitForReactHandler(page, selector, handler) {
  await page.waitForFunction(({ selector, handler }) => {
    const element = document.querySelector(selector);
    if (!element) return false;
    const reactPropsKey = Object.keys(element).find((key) => key.startsWith("__reactProps$"));
    return Boolean(reactPropsKey && element[reactPropsKey]?.[handler]);
  }, { selector, handler }, { timeout: 15_000 });
}

let browser;

(async () => {
  browser = await chromium.launch(launchOptions);
  const report = { otp: [], cookiePreferences: [], noConsent: null };

  async function verifyRace(name, trigger) {
    const page = await browser.newPage({ viewport: { width: 390, height: 900 } });

    let slots;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await gotoReady(page, `${base}/verify-email?email=qa%40example.com`, ".co-auth-code-row");
      await page.waitForTimeout(750);
      slots = page.locator(".co-auth-code-row input");
      try {
        await prepareVerificationKeyboard(page, slots);
        break;
      } catch (error) {
        if (attempt === 2) throw error;
      }
    }
    await page.evaluate(() => {
      const nativeFetch = window.fetch.bind(window);
      window.__authQaCalls = 0;
      let settleFirst;
      const firstPending = new Promise((resolve) => { settleFirst = resolve; });
      window.__settleAuthQa = () => settleFirst(new Response(JSON.stringify({ ok: false, message: "That verification code is invalid or expired." }), { status: 400, headers: { "content-type": "application/json" } }));
      window.fetch = (input, init) => {
        const url = typeof input === "string" ? input : input.url;
        if (url.endsWith("/api/auth/cognito") && init?.method === "POST") {
          window.__authQaCalls += 1;
          if (window.__authQaCalls === 1) return firstPending;
          return Promise.resolve(new Response(JSON.stringify({ ok: false, message: "That verification code is invalid or expired." }), { status: 400, headers: { "content-type": "application/json" } }));
        }
        return nativeFetch(input, init);
      };
    });
    for (let index = 0; index < 6; index += 1) await slots.nth(index).fill(String(index + 1));
    await page.waitForTimeout(1_500);
    await slots.nth(5).focus();
    await trigger(page, slots);
    await page.waitForTimeout(1_000);
    const firstAttempt = await page.evaluate(() => ({
      calls: window.__authQaCalls,
      activeLabel: document.activeElement?.getAttribute("aria-label"),
      digits: [...document.querySelectorAll(".co-auth-code-row input")].map((element) => element.value).join(""),
      notice: document.querySelector(".co-auth-notice")?.textContent,
      verifying: document.querySelector(".co-auth-primary")?.textContent
    }));
    assert.equal(firstAttempt.calls, 1, `${name} issued an unexpected confirmation count; state=${JSON.stringify(firstAttempt)}`);

    await page.evaluate(() => window.__settleAuthQa());
    await page.locator('.co-auth-notice[role="alert"]').waitFor();
    for (let index = 0; index < 6; index += 1) await slots.nth(index).fill(String(index + 1));
    await page.getByRole("button", { name: "Verify & continue" }).click();
    await page.waitForTimeout(1_000);
    const callsAfterRetry = await page.evaluate(() => window.__authQaCalls);
    assert.equal(callsAfterRetry, 2, `${name} did not permit one intentional retry`);
    report.otp.push({ scenario: name, firstRaceCalls: 1, callsAfterRetry });
    await page.close();
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
      element.click();
      element.click();
    });
  });

  await verifyRace("Enter + click", async (page, slots) => {
    await slots.nth(5).evaluate((element) => {
      element.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true, cancelable: true }));
      element.closest(".co-auth-verify").querySelector(".co-auth-primary").click();
    });
  });

  {
    const context = await browser.newContext({ viewport: { width: 390, height: 900 } });
    const page = await context.newPage();
    await gotoReady(page, `${base}/login`, ".co-auth-page--login");
    await page.getByRole("region", { name: "Cookie consent" }).waitFor({ timeout: 10_000 });
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
    await gotoReady(page, `${base}/login`, ".co-auth-page--login");
    const trigger = page.getByRole("button", { name: "Manage cookie preferences" });
    await trigger.waitFor({ timeout: 10_000 });
    await waitForReactHandler(page, '[aria-label="Manage cookie preferences"]', "onClick");
    assert.equal(await trigger.isVisible(), true, `cookie preferences hidden at ${width}`);
    const box = await trigger.boundingBox();
    assert.ok(box && box.width >= 44 && box.height >= 44, `cookie target below 44px at ${width}`);
    await trigger.evaluate((element) => element.click());
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
