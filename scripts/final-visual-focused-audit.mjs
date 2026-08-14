import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("/Users/fazilshersha/.npm/_npx/361ceb562f3b3235/node_modules/playwright");
const baseUrl = process.argv[2];
if (!baseUrl) throw new Error("Pass the preview URL.");

const evidence = path.resolve("migration-reports/final/visual-proof");
const browser = await chromium.launch({ headless: true, executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const routes = ["/", "/shop", "/shop/co-water", "/journal", "/journal/social-cocreation-hub", "/sustainability", "/about", "/founders", "/recipes", "/cart"];
const checks = [];

try {
  for (const viewport of [{ name: "mobile-390", width: 390, height: 844 }, { name: "desktop-1440", width: 1440, height: 900 }]) {
    const context = await browser.newContext({ viewport });
    await context.addInitScript(() => localStorage.setItem("co_cookie_consent_v1", JSON.stringify({ essential: true, analytics: false, marketing: false, updatedAt: new Date().toISOString() })));
    for (const route of routes) {
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(1650);
      const before = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll(".co-site-content h1, .co-site-content h2"));
        const cta = Array.from(document.querySelectorAll(".co-primary-cta")).find((element) => {
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight;
        });
        return {
          pending: headings.filter((node) => node.getAttribute("data-co-reveal") === "pending").length,
          visible: headings.filter((node) => node.getAttribute("data-co-reveal") === "visible").length,
          glass: cta ? { text: cta.textContent?.trim(), backdropFilter: getComputedStyle(cta).backdropFilter, backgroundImage: getComputedStyle(cta).backgroundImage } : null,
        };
      });
      const parallax = page.locator('[data-co-parallax="active"]').first();
      let parallaxMotion = null;
      if (await parallax.count()) {
        await parallax.scrollIntoViewIfNeeded();
        await page.waitForTimeout(250);
        const atA = await parallax.evaluate((node) => ({ translate: getComputedStyle(node).translate, offset: node.getAttribute("data-co-parallax-offset") }));
        await page.evaluate(() => window.scrollBy({ top: 240, behavior: "instant" }));
        await page.waitForTimeout(250);
        const atB = await parallax.evaluate((node) => ({ translate: getComputedStyle(node).translate, offset: node.getAttribute("data-co-parallax-offset") }));
        parallaxMotion = { atA, atB };
      }
      await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight * 0.72, behavior: "instant" }));
      await page.waitForTimeout(600);
      const after = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll(".co-site-content h1, .co-site-content h2"));
        return { pending: headings.filter((node) => node.getAttribute("data-co-reveal") === "pending").length, visible: headings.filter((node) => node.getAttribute("data-co-reveal") === "visible").length };
      });
      checks.push({ viewport, route, before, after, parallaxMotion, errors });
      await page.close();
    }

    for (const route of ["/", "/shop", "/journal", "/sustainability"]) {
      const page = await context.newPage();
      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(1200);
      const name = route === "/" ? "home" : route.slice(1);
      await page.screenshot({ path: path.join(evidence, `${viewport.name}--${name}--clean-top.jpg`), type: "jpeg", quality: 82 });
      await page.close();
    }
    await context.close();
  }

  const hydration = {};
  for (const route of ["/", "/recipes"]) {
    hydration[route] = [];
    for (let index = 0; index < 10; index += 1) {
      const context = await browser.newContext({ viewport: index % 2 ? { width: 390, height: 844 } : { width: 1920, height: 1080 } });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(300);
      hydration[route].push(errors);
      await context.close();
    }
  }
  await fs.writeFile(path.join(evidence, "preview-focused-audit.json"), `${JSON.stringify({ baseUrl, auditedAt: new Date().toISOString(), checks, hydration }, null, 2)}\n`);
  console.log(JSON.stringify({ checks: checks.length, failures: checks.filter((check) => check.errors.length), hydration }, null, 2));
} finally {
  await browser.close();
}
