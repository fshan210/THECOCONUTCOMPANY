import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pagePath = new URL(
  "../../components/recipes/ReferenceRecipesPage.tsx",
  import.meta.url,
);
const cssPath = new URL("../../styles/reference-recipes.css", import.meta.url);

test("Recipes keeps one route owner and the approved scene order", async () => {
  const source = await readFile(pagePath, "utf8");
  const markers = [
    "recipe-hero",
    "recipe-culture",
    "world-section",
    "moment rd-glass",
    "recipe-lab",
    "three-worlds",
    "lifestyle",
    "recipe-index",
    "community-recipes",
    "passed-around",
    "recipes-newsletter",
  ];
  let cursor = -1;
  for (const marker of markers) {
    const next = source.indexOf(marker, cursor + 1);
    assert.ok(next > cursor, `expected ${marker} after previous scene`);
    cursor = next;
  }
  assert.equal((source.match(/<ReferenceHeader/g) ?? []).length, 1);
  assert.equal((source.match(/<ReferenceFooter/g) ?? []).length, 1);
  assert.equal((source.match(/<NewsletterSection/g) ?? []).length, 1);
  assert.equal(source.includes("<DarkShell"), false);
  assert.equal(source.includes("<DarkFooter"), false);
});

test("Recipes includes working discovery, Lab, save and reduced-motion paths", async () => {
  const source = await readFile(pagePath, "utf8");
  const css = await readFile(cssPath, "utf8");
  for (const token of [
    "function score",
    "Surprise me",
    "chooseMood",
    "useSavedContent",
    "recipe-filters",
    "No recipes match",
    "scrollIntoView",
    "useRecipesMotion",
    "world-route__active",
    "AnimatePresence",
  ])
    assert.ok(source.includes(token), `missing ${token}`);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /scroll-snap-type:\s*x mandatory/);
  assert.match(css, /@media\s*\(max-width:\s*430px\)/);
  assert.match(css, /\.recipes-scenes\s*{[^}]*width:\s*100%/s);
  assert.match(css, /\.recipe-hero\s*{[^}]*max-width:\s*none/s);
  assert.doesNotMatch(css, /\.variation-tabs\s*{[^}]*margin:\s*-80px/s);
  assert.match(css, /a\[aria-label="\.CO home"\]/);
  assert.match(css, /min-width:\s*44px\s*!important/);
});
