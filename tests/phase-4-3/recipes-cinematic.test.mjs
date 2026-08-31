import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pagePath = new URL("../../components/recipes/ReferenceRecipesPage.tsx", import.meta.url);
const cssPath = new URL("../../styles/reference-recipes.css", import.meta.url);

test("Recipes keeps one route owner and the approved scene order", async () => {
  const source = await readFile(pagePath, "utf8");
  const markers = ["recipe-hero", "recipe-culture", "world-section", "moment rd-glass", "recipe-lab", "three-worlds", "lifestyle", "recipe-index", "community-recipes", "passed-around", "<Newsletter/>"];
  let cursor = -1;
  for (const marker of markers) {
    const next = source.indexOf(marker, cursor + 1);
    assert.ok(next > cursor, `expected ${marker} after previous scene`);
    cursor = next;
  }
  assert.equal((source.match(/<DarkShell/g) ?? []).length, 1);
  assert.equal(source.includes("<DarkFooter"), false);
});

test("Recipes includes working discovery, Lab, save and reduced-motion paths", async () => {
  const source = await readFile(pagePath, "utf8");
  const css = await readFile(cssPath, "utf8");
  for (const token of ["function score", "Surprise me", "chooseMood", "useSavedContent", "recipe-filters", "No recipes match", "scrollIntoView"]) assert.ok(source.includes(token), `missing ${token}`);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /scroll-snap-type:x mandatory/);
  assert.match(css, /@media\(max-width:430px\)/);
});
