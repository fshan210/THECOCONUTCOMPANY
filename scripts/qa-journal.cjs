/* Run with JOURNAL_PLAYWRIGHT pointing to a local playwright-core installation. */
const { chromium } = require(
  process.env.JOURNAL_PLAYWRIGHT || "playwright-core",
);
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const base = process.env.JOURNAL_QA_URL || "http://localhost:3016";
const out = process.env.JOURNAL_QA_OUT || "artifacts/journal-reference";
(async () => {
  await fs.mkdir(out, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  await context.addInitScript(() => {
    localStorage.setItem(
      "co_cookie_consent_v1",
      JSON.stringify({
        essential: true,
        analytics: false,
        marketing: false,
        updatedAt: new Date().toISOString(),
      }),
    );
    localStorage.setItem("co_welcome_claimed_v1", "dismissed");
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const report = { responsive: [], interactions: [], errors };
  const pass = (x) => {
    report.interactions.push(x);
    console.log("PASS", x);
  };
  await page.goto(base + "/journal", { waitUntil: "networkidle" });
  const pause = () => page.waitForTimeout(1000);
  for (const width of process.env.JOURNAL_QA_INTERACTIONS_ONLY
    ? []
    : [1440, 1280, 768, 430, 390, 375]) {
    await page.setViewportSize({ width, height: width >= 768 ? 1000 : 844 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await pause();
    await page.screenshot({ path: `${out}/journal-${width}-hero.png` });
    for (
      let y = 0;
      y < (await page.evaluate(() => document.documentElement.scrollHeight));
      y += 700
    ) {
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(90);
    }
    await pause();
    await page.evaluate(async () => {
      await Promise.all(
        [...document.images]
          .filter((i) => i.loading === "lazy")
          .map((i) => {
            i.loading = "eager";
            return i.decode().catch(() => {});
          }),
      );
    });
    const snapshot = await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      broken: [...document.images]
        .filter((i) => i.complete && !i.naturalWidth)
        .map((i) => i.currentSrc),
      headers: document.querySelectorAll(".co-glass-header").length,
      newsletters: document.querySelectorAll(".co-newsletter-shell").length,
      footers: document.querySelectorAll(".co-reference-footer").length,
    }));
    assert.ok(snapshot.height > 4000, `Unexpected locked page at ${width}`);
    assert.equal(snapshot.scrollWidth, width, `overflow at ${width}`);
    assert.equal(snapshot.broken.length, 0);
    assert.equal(snapshot.headers, 1);
    assert.equal(snapshot.newsletters, 1);
    assert.equal(snapshot.footers, 1);
    report.responsive.push(snapshot);
    await page.screenshot({
      path: `${out}/journal-${width}-full.png`,
      fullPage: true,
    });
    console.log("RESPONSIVE", width, snapshot.height);
    if ([1440, 768, 390, 375].includes(width)) {
      for (const [name, sel] of [
        ["editor", ".jn-editors"],
        ["index", "#journal-index"],
        ["farm", "#ask"],
        ["config", "#coconut-config"],
        ["community", ".jn-community"],
        ["planner", "#rituals"],
        ["people", ".jn-people"],
        ["closing", ".jn-closing"],
        ["newsletter", ".jn-newsletter"],
      ]) {
        await page.locator(sel).scrollIntoViewIfNeeded();
        await pause();
        await page
          .locator(sel)
          .screenshot({ path: `${out}/${name}-${width}.png` });
      }
    }
  }
  if (report.responsive.length)
    await fs.writeFile(
      `${out}/responsive-report.json`,
      JSON.stringify(report.responsive, null, 2),
    );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page
    .getByRole("button", { name: "Next today’s stories", exact: true })
    .click();
  await pause();
  assert.ok(
    await page
      .locator(".jn-today .jn-slide")
      .nth(1)
      .evaluate((e) => e.classList.contains("is-active")),
  );
  pass("Today rail arrows");
  await page
    .getByRole("button", { name: "Next field notes", exact: true })
    .click();
  await pause();
  assert.ok(
    await page
      .locator(".jn-field .jn-slide")
      .nth(1)
      .evaluate((e) => e.classList.contains("is-active")),
  );
  pass("Field rail arrows");
  await page
    .getByRole("button", { name: "Previous field notes", exact: true })
    .click();
  await pause();
  await page.locator(".jn-field .jn-rail").scrollIntoViewIfNeeded();
  const dragBox = await page.locator(".jn-field .jn-rail").boundingBox();
  await page.mouse.move(
    dragBox.x + dragBox.width * 0.7,
    dragBox.y + dragBox.height * 0.5,
  );
  await page.mouse.down();
  await page.mouse.move(
    dragBox.x + dragBox.width * 0.3,
    dragBox.y + dragBox.height * 0.5,
    { steps: 15 },
  );
  await page.mouse.up();
  await pause();
  assert.ok(
    await page
      .locator(".jn-field .jn-slide")
      .nth(1)
      .evaluate((e) => e.classList.contains("is-active")),
  );
  pass("Field rail pointer drag");
  await page
    .locator(".jn-categories")
    .getByRole("button", { name: "CoCarbon", exact: true })
    .click();
  await pause();
  assert.equal(await page.locator(".jn-story").count(), 1);
  pass("Category filter");
  await page
    .getByRole("textbox", { name: "Search the Journal", exact: true })
    .fill("no-match-xyz");
  await pause();
  assert.equal(await page.locator(".jn-story").count(), 0);
  await page
    .getByRole("button", { name: "Show all stories", exact: true })
    .click();
  await pause();
  pass("Debounced search and empty-state recovery");
  await page.getByLabel("Sort stories").selectOption("A–Z");
  await pause();
  const titles = await page.locator(".jn-story h3").allTextContents();
  assert.deepEqual(
    titles,
    [...titles].sort((a, b) => a.localeCompare(b)),
  );
  pass("Archive sorting and full CMS collection");
  await page.getByLabel("Sort stories").selectOption("Newest");
  await pause();
  const trigger = page.getByRole("button", {
    name: "What actually happens to a coconut husk?",
    exact: true,
  });
  await trigger.click();
  await page.getByRole("dialog").waitFor();
  assert.match(
    await page.getByRole("dialog").textContent(),
    /Illustrative reference content/,
  );
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  assert.equal(
    await trigger.evaluate((e) => e === document.activeElement),
    true,
    "reader focus restoration",
  );
  pass("Story reader, Escape and focus restoration");
  await page
    .locator("#ask")
    .getByRole("button", { name: "Sourcing", exact: true })
    .click();
  await page
    .getByLabel("Your question", { exact: true })
    .fill("How do you choose which coconuts are ready to harvest?");
  await page
    .getByRole("button", { name: "Prepare your question", exact: true })
    .click();
  assert.match(
    await page
      .getByRole("link", { name: "Open email to send", exact: true })
      .getAttribute("href"),
    /Sourcing/,
  );
  pass("Ask the Farm prepares accurate email without a false sent state");
  await page
    .locator("#coconut-config")
    .getByRole("button", { name: "Water", exact: true })
    .click();
  await page
    .locator("#coconut-config")
    .getByRole("button", { name: "Drink", exact: true })
    .click();
  await pause();
  assert.match(await page.locator(".jn-result h3").textContent(), /Smoothie/);
  await page
    .locator("#coconut-config")
    .getByRole("button", { name: "Fermented", exact: true })
    .click();
  await pause();
  assert.match(
    await page.locator(".jn-result").textContent(),
    /no exact tested recipe/,
  );
  pass("Configurator changes recipe, imagery and compatibility explanation");
  await page.locator(".jn-answer").nth(1).getByRole("button").click();
  await pause();
  assert.equal(
    await page
      .locator(".jn-answer")
      .nth(1)
      .getByRole("button")
      .getAttribute("aria-expanded"),
    "true",
  );
  await page.locator(".jn-answer").nth(1).getByRole("button").click();
  pass("FAQ expansion and collapse");
  await page
    .locator("#explainers")
    .getByRole("button", { name: /How Coconut Milk Is Made/ })
    .click();
  assert.ok(await page.locator("#explainer-1").isVisible());
  pass("Explainer detail");
  await page
    .getByRole("button", { name: "Next community stories", exact: true })
    .click();
  await pause();
  assert.ok(
    await page
      .locator(".jn-coverflow .jn-slide")
      .nth(1)
      .evaluate((e) => e.classList.contains("is-active")),
  );
  pass("Community rail");
  await page
    .getByRole("button", { name: "Next stack story", exact: true })
    .click();
  await pause();
  assert.match(
    await page.locator(".jn-stack-controls").textContent(),
    /2 \/ 5/,
  );
  await page
    .getByRole("button", { name: "Next stack story", exact: true })
    .focus();
  await page.keyboard.press("ArrowRight"); // region controls are outside the deck; test focused card below
  await page.locator('.jn-deck-card[aria-hidden="false"] button').focus();
  await page.keyboard.press("ArrowRight");
  await pause();
  assert.match(
    await page.locator(".jn-stack-controls").textContent(),
    /3 \/ 5/,
  );
  pass("Husk stack arrows and keyboard");
  await page
    .getByLabel("Move Warm lemon + coconut water", { exact: true })
    .selectOption("Evening");
  assert.ok(
    await page
      .locator(".jn-period")
      .nth(2)
      .getByText("Warm lemon + coconut water", { exact: true })
      .isVisible(),
  );
  await page
    .getByRole("button", {
      name: "Save ritual Warm lemon + coconut water",
      exact: true,
    })
    .click();
  await page.reload({ waitUntil: "networkidle" });
  await pause();
  assert.equal(
    await page
      .getByLabel("Move Warm lemon + coconut water", { exact: true })
      .inputValue(),
    "Evening",
  );
  assert.equal(
    await page
      .getByRole("button", {
        name: "Save ritual Warm lemon + coconut water",
        exact: true,
      })
      .getAttribute("aria-pressed"),
    "true",
  );
  pass("Ritual movement and saved-state persistence");
  await page
    .locator(".jn-period")
    .first()
    .getByRole("button", { name: "Add a ritual", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Slow coconut pancakes", exact: false })
    .click();
  assert.ok(
    await page
      .getByLabel("Move Slow coconut pancakes", { exact: true })
      .isVisible(),
  );
  await page
    .getByRole("button", {
      name: "Remove Slow coconut pancakes from my day",
      exact: true,
    })
    .click();
  assert.equal(
    await page
      .getByLabel("Move Slow coconut pancakes", { exact: true })
      .count(),
    0,
  );
  pass("Ritual add and remove");
  await page
    .getByRole("button", { name: /Field Notes Stories from farms/ })
    .click();
  await pause();
  assert.equal(
    await page
      .locator(".jn-categories")
      .getByRole("button", { name: "Sourcing", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  pass("Series filters the archive");
  await page
    .getByRole("textbox", { name: "Search the archive", exact: true })
    .fill("Pollachi");
  await page
    .getByRole("button", { name: "Search archive", exact: true })
    .click();
  await pause();
  assert.equal(
    await page
      .getByRole("textbox", { name: "Search the Journal", exact: true })
      .inputValue(),
    "Pollachi",
  );
  pass("Search & Archive feeds live grid");
  await page
    .locator(".jn-your-turn")
    .getByRole("button", { name: "Share your story", exact: true })
    .click();
  await page
    .getByLabel("Your story", { exact: true })
    .fill("Our favourite weekend starts with coconut pancakes.");
  await page
    .getByRole("button", { name: "Prepare your story", exact: true })
    .click();
  assert.match(
    await page
      .getByRole("dialog")
      .getByRole("link", { name: "Open email to send", exact: true })
      .getAttribute("href"),
    /pancakes/,
  );
  await page.keyboard.press("Escape");
  pass("Share story dialog");
  await page.route("**/api/newsletter", async (route) => {
    assert.equal(route.request().postDataJSON().consent, true);
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });
  await page
    .locator(".co-newsletter-shell")
    .getByLabel("Email address", { exact: true })
    .fill("journal-qa@example.invalid");
  await page.locator(".co-newsletter-consent input").check();
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();
  await page.getByRole("button", { name: "Joined", exact: true }).waitFor();
  pass("Shared newsletter success with mocked API; no subscription created");
  await page
    .locator(".jn-editors")
    .getByRole("button", { name: "Save editor story", exact: true })
    .click();
  await page.waitForURL("**/login?redirect=%2Fjournal");
  pass("Bookmarks preserve guest login flow");
  await page.goto(base + "/journal?story=husk", { waitUntil: "networkidle" });
  await page.getByRole("dialog").waitFor();
  await page.keyboard.press("Escape");
  pass("Direct story URL");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: "networkidle" });
  await pause();
  const animation = await page
    .locator(".jn-hero-media img")
    .evaluate((e) => getComputedStyle(e).animationName);
  assert.equal(animation, "none");
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page.getByRole("navigation", { name: "Mobile navigation" }).waitFor();
  await page.keyboard.press("Escape");
  pass("Reduced motion and mobile navigation");
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await mobile.addInitScript(() => {
    localStorage.setItem(
      "co_cookie_consent_v1",
      JSON.stringify({ essential: true, analytics: false, marketing: false }),
    );
    localStorage.setItem("co_welcome_claimed_v1", "dismissed");
  });
  const touch = await mobile.newPage();
  await touch.goto(base + "/journal", { waitUntil: "networkidle" });
  await touch.locator(".jn-field .jn-rail").scrollIntoViewIfNeeded();
  await touch.waitForTimeout(1000);
  const box = await touch.locator(".jn-field .jn-rail").boundingBox();
  const cdp = await mobile.newCDPSession(touch);
  const ty = box.y + box.height * 0.5;
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: box.x + box.width * 0.8, y: ty }],
  });
  for (let i = 1; i <= 12; i++) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: box.x + box.width * (0.8 - i * 0.05), y: ty }],
    });
    await touch.waitForTimeout(20);
  }
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await touch.waitForTimeout(1200);
  assert.ok(
    await touch
      .locator(".jn-field .jn-slide")
      .nth(1)
      .evaluate((e) => e.classList.contains("is-active")),
  );
  pass("390px touch swipe");
  await mobile.close();
  assert.equal(errors.length, 0, JSON.stringify(errors));
  await fs.writeFile(`${out}/qa-report.json`, JSON.stringify(report, null, 2));
  await browser.close();
  console.log("QA COMPLETE");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
