const { chromium } = require(process.env.CORE_QA_PLAYWRIGHT || "/Users/fazilshersha/.codex/qa/sustainability-release/node_modules/playwright-core");
const crypto = require("node:crypto");
const fs = require("node:fs");
const assert = require("node:assert/strict");

const base = (process.env.CORE_QA_URL || "http://localhost:3100").replace(/\/$/, "");
const api = (process.env.CORE_QA_API_URL || "http://localhost:8787").replace(/\/$/, "");
const output = process.env.CORE_QA_OUTPUT || "artifacts/core-commerce-qa";
const secret = process.env.CORE_QA_SESSION_SECRET || "account-local-qa-only-not-a-production-key";
fs.mkdirSync(output, { recursive: true });

function sessionCookie() {
  const key = crypto.createHash("sha256").update(secret).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const payload = Buffer.concat([cipher.update(JSON.stringify({ accessToken: "local-commerce-qa", sub: "commerce-qa", email: "commerce-qa@example.com", name: "Afsala Khan", expiresAt: Math.floor(Date.now() / 1000) + 7200 })), cipher.final()]);
  return [iv, cipher.getAuthTag(), payload].map((part) => part.toString("base64url")).join(".");
}

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(350);
}

async function responsiveAudit(browser) {
  const context = await browser.newContext();
  await context.addCookies([{ name: "co_aws_session", value: sessionCookie(), url: base, httpOnly: true, sameSite: "Lax" }]);
  await context.addInitScript(() => {
    localStorage.setItem("co_cookie_consent_v1", JSON.stringify({ essential: true, analytics: false, marketing: false, updatedAt: new Date().toISOString() }));
    localStorage.setItem("co_welcome_claimed_v1", "dismissed");
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const routes = ["/", "/about", "/shop", "/recipes", "/sustainability", "/journal", "/login", "/register", "/account", "/cart"];
  const widths = [1440, 1280, 768, 430, 390, 375];
  const results = [];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 960 });
    for (const route of routes) {
      if (route === "/login" || route === "/register") await context.clearCookies();
      else await context.addCookies([{ name: "co_aws_session", value: sessionCookie(), url: base, httpOnly: true, sameSite: "Lax" }]);
      const errorStart = errors.length;
      const response = await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 90_000 });
      await page.waitForLoadState("networkidle", { timeout: 5_000 }).catch(() => undefined);
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 900) {
          window.scrollTo({ top: y, behavior: "instant" });
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
        window.scrollTo({ top: 0, behavior: "instant" });
        await document.fonts.ready;
      });
      const metrics = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc || image.src),
        headers: document.querySelectorAll(".co-glass-header, .rd-header").length,
        blockingConsoleErrors: []
      }));
      results.push({ route, width, status: response?.status() ?? 0, ...metrics, pageErrors: errors.slice(errorStart) });
    }
  }
  assert.equal(results.some((result) => result.status >= 400 || result.overflow || result.brokenImages.length || result.pageErrors.length), false, JSON.stringify(results.filter((result) => result.status >= 400 || result.overflow || result.brokenImages.length || result.pageErrors.length), null, 2));
  fs.writeFileSync(`${output}/responsive.json`, JSON.stringify(results, null, 2));
  await context.close();
  return results;
}

async function commerceFlows(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 900 } });
  await context.addInitScript(() => {
    localStorage.setItem("co_cookie_consent_v1", JSON.stringify({ essential: true, analytics: false, marketing: false, updatedAt: new Date().toISOString() }));
    localStorage.setItem("co_welcome_claimed_v1", "dismissed");
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  const results = [];

  await page.goto(`${base}/shop`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Add MELT.CO Mango Coconut to cart" }).click();
  await page.waitForFunction(() => JSON.parse(localStorage.getItem("co-cart") || "[]").length === 1);
  results.push("guest add and cart count");
  await page.goto(`${base}/cart`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /Increase MELT\.CO Mango Coconut/ }).click();
  await page.reload({ waitUntil: "domcontentloaded" });
  assert.match(await page.locator(".cm-quantity").first().innerText(), /2/);
  await page.getByRole("button", { name: /Remove MELT\.CO Mango Coconut/ }).click();
  await page.getByText("Good things start here.", { exact: true }).waitFor();
  results.push("guest quantity, reload persistence and remove");

  await page.goto(`${base}/shop`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Add MELT.CO Mango Coconut to cart" }).click();
  await page.waitForFunction(() => JSON.parse(localStorage.getItem("co-cart") || "[]").length === 1);
  const seed = await context.request.post(`${api}/v1/cart/items`, { data: { productId: "melt-co-mango-coconut", quantity: 1, idempotencyKey: `qa-seed-${crypto.randomUUID()}` } });
  assert.equal(seed.ok(), true);
  await context.addCookies([{ name: "co_aws_session", value: sessionCookie(), url: base, httpOnly: true, sameSite: "Lax" }]);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => localStorage.getItem("co-cart") === null);
  await page.goto(`${base}/cart`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelector(".cm-quantity")?.textContent?.includes("2"));
  assert.equal(await page.locator(".cm-cart-line").count(), 1);
  results.push("guest to authenticated cart merge without duplicate line");

  await page.goto(`${base}/shop`, { waitUntil: "domcontentloaded" });
  const wishlistButton = page.getByRole("button", { name: "Add MELT.CO Mango Coconut to wishlist" });
  await wishlistButton.click();
  await page.getByRole("button", { name: "Remove MELT.CO Mango Coconut from wishlist" }).waitFor();
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Remove MELT.CO Mango Coconut from wishlist" }).waitFor();
  await page.goto(`${base}/wishlist`, { waitUntil: "domcontentloaded" });
  const wishlistMain = page.getByRole("main");
  await wishlistMain.getByLabel("Saved item type").selectOption("product");
  const savedProduct = wishlistMain.locator(".ac-saved-card").filter({ hasText: "MELT.CO Mango Coconut" });
  assert.equal(await savedProduct.count(), 1);
  await savedProduct.locator(".ac-save-heart").click();
  await savedProduct.waitFor({ state: "detached" });
  await page.goto(`${base}/shop`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Add MELT.CO Mango Coconut to wishlist" }).waitFor();
  results.push("wishlist save, reload, account consistency and remove");

  await page.goto(`${base}/recipes/coconut-mango-cooler`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Save recipe", exact: true }).last().click();
  await page.getByRole("button", { name: "Remove recipe", exact: true }).first().waitFor();
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Remove recipe", exact: true }).first().waitFor();
  await page.goto(`${base}/saved-recipes`, { waitUntil: "domcontentloaded" });
  const recipesMain = page.getByRole("main");
  await recipesMain.locator(".ac-saved-card").filter({ hasText: "Coconut Mango Cooler" }).waitFor();
  const savedRecipe = recipesMain.locator(".ac-saved-card").filter({ hasText: "Coconut Mango Cooler" });
  assert.equal(await savedRecipe.count(), 1);
  await savedRecipe.locator(".ac-save-heart").click();
  await savedRecipe.waitFor({ state: "detached" });
  await page.goto(`${base}/recipes/coconut-mango-cooler`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Save recipe", exact: true }).first().waitFor();
  results.push("saved recipe save, reload, account consistency and remove");

  await page.goto(`${base}/account/addresses`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Add new address" }).click();
  for (const [name, value] of Object.entries({ fullName: "QA Recipient", phone: "+919876543219", line1: "42 QA Lane", city: "Kochi", region: "Kerala", postalCode: "682025" })) await page.locator(`[name="${name}"]`).fill(value);
  await page.locator('[name="isDefault"]').check();
  await page.getByRole("button", { name: "Save address", exact: true }).click();
  await page.getByRole("status").filter({ hasText: "Your address is saved." }).waitFor();
  await page.reload({ waitUntil: "domcontentloaded" });
  const address = page.getByRole("main").locator("article.ac-address").filter({ hasText: "QA Recipient" });
  assert.equal(await address.count(), 1);
  assert.match(await address.innerText(), /Preferred/);
  await address.getByRole("button", { name: "Edit", exact: true }).click();
  await page.locator('[name="line1"]').fill("43 QA Lane");
  await page.getByRole("button", { name: "Save address", exact: true }).click();
  await page.waitForFunction(() => document.querySelector("article.ac-address")?.textContent?.includes("43 QA Lane"));
  await address.getByRole("button", { name: "Delete", exact: true }).click();
  await address.getByRole("button", { name: "Confirm removal" }).click();
  await address.waitFor({ state: "detached" });
  results.push("address create, default, edit and delete");

  await page.goto(`${base}/profile`, { waitUntil: "domcontentloaded" });
  await page.getByLabel("Display name", { exact: true }).fill("Afsala Commerce QA");
  await page.getByRole("button", { name: "Save preferences" }).click();
  await page.getByRole("status").filter({ hasText: "Your preferences are saved." }).waitFor();
  await page.reload({ waitUntil: "domcontentloaded" });
  assert.equal(await page.getByLabel("Display name", { exact: true }).inputValue(), "Afsala Commerce QA");
  results.push("supported profile preferences persist");

  await context.clearCookies();
  await page.goto(`${base}/cart`, { waitUntil: "domcontentloaded" });
  await page.getByText("Good things start here.", { exact: true }).waitFor();
  await page.goto(`${base}/wishlist`, { waitUntil: "domcontentloaded" });
  assert.match(page.url(), /\/login\?redirect=%2Fwishlist/);
  results.push("logout isolation and protected return path");

  assert.deepEqual(pageErrors, []);
  fs.writeFileSync(`${output}/flows.json`, JSON.stringify({ results, pageErrors }, null, 2));
  await context.close();
  return results;
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CORE_QA_CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });
  try {
    const flows = process.env.CORE_QA_SKIP_FLOWS ? [] : await commerceFlows(browser);
    const responsive = process.env.CORE_QA_SKIP_RESPONSIVE ? [] : await responsiveAudit(browser);
    console.log(JSON.stringify({ base, flows, responsiveChecks: responsive.length }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exit(1); });
