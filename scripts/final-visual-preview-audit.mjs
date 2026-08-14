import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("/Users/fazilshersha/.npm/_npx/361ceb562f3b3235/node_modules/playwright");

const baseUrl = process.argv[2];
if (!baseUrl) throw new Error("Usage: node scripts/final-visual-preview-audit.mjs <preview-url>");

const outputRoot = path.resolve("migration-reports/final/visual-proof");
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const routes = [
  "/",
  "/shop",
  "/shop/co-water",
  "/journal",
  "/journal/social-cocreation-hub",
  "/sustainability",
  "/about",
  "/founders",
  "/recipes",
  "/cart",
];
const viewports = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-430", width: 430, height: 932 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "desktop-1920", width: 1920, height: 1080 },
];

const slug = (route) => route === "/" ? "home" : route.replace(/^\//, "").replaceAll("/", "--");
const isVisible = (element) => {
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
};

await fs.mkdir(outputRoot, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: chromePath });
const results = { baseUrl, auditedAt: new Date().toISOString(), routes: [], special: {} };

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    for (const route of routes) {
      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];
      const badResponses = [];
      page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
      page.on("pageerror", (error) => pageErrors.push(error.message));
      page.on("response", (response) => { if (response.status() >= 400) badResponses.push({ status: response.status(), url: response.url() }); });

      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 60_000 });
      await page.waitForTimeout(1800);
      await page.mouse.move(Math.round(viewport.width * 0.38), Math.round(viewport.height * 0.42));
      await page.waitForTimeout(450);

      const initial = await page.evaluate((visibleSource) => {
        const visible = eval(`(${visibleSource})`);
        const ripple = document.querySelector("[data-global-water-ripple]");
        const current = Array.from(document.querySelectorAll('[aria-current="page"]')).find(visible);
        const button = Array.from(document.querySelectorAll("button, a")).find((element) => visible(element) && getComputedStyle(element).borderRadius !== "0px");
        const parallax = document.querySelector("[data-co-parallax]");
        const headings = Array.from(document.querySelectorAll(".co-site-content h1, .co-site-content h2"));
        return {
          title: document.title,
          overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          ripple: ripple ? {
            state: ripple.getAttribute("data-ripple-state"),
            interactive: ripple.getAttribute("data-ripple-interactive"),
            drops: Number(ripple.getAttribute("data-ripple-drop-count") || 0),
            canvasCount: ripple.querySelectorAll("canvas").length,
            position: getComputedStyle(ripple).position,
          } : null,
          activeNav: current ? {
            text: current.textContent?.trim(),
            transform: getComputedStyle(current).transform,
            fontWeight: getComputedStyle(current).fontWeight,
          } : null,
          buttonMaterial: button ? {
            text: button.textContent?.trim().slice(0, 80),
            backdropFilter: getComputedStyle(button).backdropFilter,
            backgroundImage: getComputedStyle(button).backgroundImage,
          } : null,
          reveal: {
            total: headings.length,
            pending: headings.filter((element) => element.hasAttribute("data-co-reveal-pending")).length,
            visible: headings.filter((element) => element.hasAttribute("data-co-reveal-visible")).length,
          },
          parallax: parallax ? { translate: getComputedStyle(parallax).translate, transform: getComputedStyle(parallax).transform } : null,
        };
      }, isVisible.toString());

      await page.screenshot({ path: path.join(outputRoot, `${viewport.name}--${slug(route)}--top.jpg`), type: "jpeg", quality: 78 });
      await page.evaluate(() => window.scrollTo({ top: Math.max(0, document.documentElement.scrollHeight * 0.58), behavior: "instant" }));
      await page.waitForTimeout(900);
      const motionAfterScroll = await page.evaluate(() => {
        const parallax = document.querySelector("[data-co-parallax]");
        const headings = Array.from(document.querySelectorAll(".co-site-content h1, .co-site-content h2"));
        return {
          revealVisible: headings.filter((element) => element.hasAttribute("data-co-reveal-visible")).length,
          parallax: parallax ? { translate: getComputedStyle(parallax).translate, transform: getComputedStyle(parallax).transform } : null,
        };
      });

      await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
      await page.waitForTimeout(700);
      const footerAlignment = await page.evaluate(() => {
        const footer = document.querySelector("footer");
        const newsletterHeading = Array.from(document.querySelectorAll("h2")).find((element) => element.textContent?.includes("Stay in the loop"));
        const newsletter = newsletterHeading?.closest("section")?.firstElementChild;
        if (!footer || !newsletter) return null;
        const footerInner = footer.firstElementChild;
        if (!footerInner) return null;
        const a = newsletter.getBoundingClientRect();
        const b = footerInner.getBoundingClientRect();
        return { newsletter: { left: a.left, right: a.right }, footer: { left: b.left, right: b.right }, leftDelta: b.left - a.left, rightDelta: b.right - a.right };
      });
      if (["/", "/shop", "/journal"].includes(route)) {
        await page.screenshot({ path: path.join(outputRoot, `${viewport.name}--${slug(route)}--footer.jpg`), type: "jpeg", quality: 78 });
      }

      results.routes.push({
        route,
        viewport,
        status: response?.status() ?? null,
        initial,
        motionAfterScroll,
        footerAlignment,
        consoleErrors,
        pageErrors,
        badResponses: badResponses.filter((entry, index, all) => all.findIndex((item) => item.url === entry.url && item.status === entry.status) === index),
      });
      await page.close();
    }
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const shop = await context.newPage();
  await shop.goto(`${baseUrl}/shop`, { waitUntil: "networkidle" });
  await shop.waitForTimeout(1500);
  results.special.shop = await shop.evaluate(() => Array.from(document.querySelectorAll("[data-product-slug]")).map((card) => ({
    slug: card.getAttribute("data-product-slug"),
    name: card.querySelector("h3")?.textContent?.trim(),
    image: card.querySelector("img")?.currentSrc,
    href: card.querySelector('a[href^="/shop/"]')?.getAttribute("href"),
    text: card.textContent?.replace(/\s+/g, " ").trim().slice(0, 240),
  })));
  const quickViewButton = shop.getByRole("button", { name: /Quick view/i }).first();
  if (await quickViewButton.count()) {
    await quickViewButton.click();
    await shop.waitForTimeout(500);
    results.special.quickView = await shop.locator('[role="dialog"]').evaluate((dialog) => ({
      text: dialog.textContent?.replace(/\s+/g, " ").trim().slice(0, 500),
      image: dialog.querySelector("img")?.currentSrc,
      href: dialog.querySelector('a[href^="/shop/"]')?.getAttribute("href"),
    }));
    await shop.screenshot({ path: path.join(outputRoot, "desktop-1440--shop--quick-view.jpg"), type: "jpeg", quality: 82 });
  }

  const journal = await context.newPage();
  await journal.goto(`${baseUrl}/journal`, { waitUntil: "networkidle" });
  await journal.waitForTimeout(800);
  const journalSlider = journal.locator("[data-smooothy-slider]").first();
  const t0 = await journalSlider.getAttribute("data-current-slide");
  await journal.waitForTimeout(5200);
  const t5 = await journalSlider.getAttribute("data-current-slide");
  await journalSlider.hover();
  await journal.mouse.down();
  await journal.mouse.move(400, 450);
  await journal.mouse.up();
  const afterInteraction = await journalSlider.getAttribute("data-current-slide");
  await journal.waitForTimeout(5200);
  const afterResume = await journalSlider.getAttribute("data-current-slide");
  results.special.journalAutoplay = { t0, t5, afterInteraction, afterResume };

  const home = await context.newPage();
  await home.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await home.getByRole("heading", { name: ".CO OUTSIDE THE SHELF" }).scrollIntoViewIfNeeded();
  await home.waitForTimeout(900);
  results.special.lifestyle = await home.evaluate(() => {
    const heading = Array.from(document.querySelectorAll("h2")).find((element) => element.textContent?.includes("OUTSIDE THE SHELF"));
    const section = heading?.closest("section");
    const originals = section ? Array.from(section.querySelectorAll("article")).filter((article) => article.getAttribute("aria-hidden") !== "true") : [];
    return { originalCards: originals.length, images: originals.map((article) => article.querySelector("img")?.currentSrc) };
  });
  await home.screenshot({ path: path.join(outputRoot, "desktop-1440--home--lifestyle-gallery.jpg"), type: "jpeg", quality: 82 });
  await context.close();

  const reducedContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await reducedPage.waitForTimeout(1000);
  results.special.reducedMotion = await reducedPage.evaluate(() => {
    const ripple = document.querySelector("[data-global-water-ripple]");
    return {
      rippleState: ripple?.getAttribute("data-ripple-state"),
      rippleCanvases: ripple?.querySelectorAll("canvas").length,
      pendingReveals: document.querySelectorAll("[data-co-reveal-pending]").length,
      parallaxNodes: document.querySelectorAll("[data-co-parallax]").length,
    };
  });
  await reducedContext.close();
} finally {
  await browser.close();
}

await fs.writeFile(path.join(outputRoot, "preview-audit.json"), `${JSON.stringify(results, null, 2)}\n`);
console.log(JSON.stringify({ output: path.join(outputRoot, "preview-audit.json"), routeChecks: results.routes.length, special: results.special }, null, 2));
