import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("app/about/page.tsx", "utf8");
const about = readFileSync("components/about/CinematicAboutPage.tsx", "utf8");
const css = readFileSync("components/about/CinematicAboutPage.module.css", "utf8");
const shell = readFileSync("components/home/ReferenceHomePage.tsx", "utf8");
const media = readFileSync("lib/media.ts", "utf8");

test("About route has one cinematic owner and disconnects the legacy render path", () => {
  assert.match(page, /CinematicAboutPage/);
  assert.doesNotMatch(page, /ReferenceAboutPage/);
  assert.equal((about.match(/<ReferenceHeader\s*\/>/g) ?? []).length, 1);
  assert.equal((about.match(/<ReferenceFooter\s*\/>/g) ?? []).length, 1);
  assert.equal((about.match(/<h1/g) ?? []).length, 1);
  assert.doesNotMatch(about, /JourneyScrollStory|ReferenceAboutPage/);
});

test("About maps supplied assets to the required cinematic sequence", () => {
  for (const asset of [
    "where-it-begins.png",
    "grown-by-people.png",
    "process-with-care.png",
    "origin-to-everyday-living.png",
    "locally-rooted-built-to-travel.png",
    "traceable-origin.png",
    "better-use-less-waste.png",
    "built-by-people.png",
    "coconut-water.png",
    "kitchen.png",
    "botanica.png",
    "melt.png",
    "founders.png",
  ]) assert.match(about, new RegExp(asset.replaceAll(".", "\\.")));
  assert.match(media, /\/assets\/redesign\/about\//);
});

test("About preserves interactions, evidence-safe copy, and dark section dissolves", () => {
  assert.match(about, /BrandSlidingPuzzle/);
  assert.match(about, /aria-pressed=\{selected\}/);
  assert.match(about, /motion\.path/);
  assert.match(about, /autoPlay muted loop playsInline preload="metadata"/);
  assert.doesNotMatch(about, /XX\+|20XX|verified markets|carbon neutral/i);
  assert.match(css, /\.scene::before/);
  assert.match(css, /\.scene::after/);
  assert.match(css, /\.newsletter::after/);
  assert.match(css, /linear-gradient\(0deg, #120804/);
});

test("About keeps the approved shared shell dark while Home behavior remains shared", () => {
  assert.match(shell, /const cinematicShell = homeShell \|\| pathname === "\/about"/);
  assert.match(shell, /shopShell \|\| cinematicShell/);
});
