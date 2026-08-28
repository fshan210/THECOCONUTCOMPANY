import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the cinematic homepage narrative order remains locked", async () => {
  const source = await readFile(new URL("../../components/home/CinematicHomePage.tsx", import.meta.url), "utf8");
  const sequence = [
    "<Hero ",
    "<HomePinnedScrubVideo",
    "<OriginScene",
    "<ReceiptSection",
    "<RoutineSection",
    "<RealLifeSection",
    "<RecipeSection",
    "<SustainabilitySection",
    "<NewsletterSection"
  ];
  const indices = sequence.map((marker) => source.lastIndexOf(marker));
  assert.ok(indices.every((index) => index >= 0), "every canonical homepage section must remain present");
  assert.deepEqual([...indices].sort((a, b) => a - b), indices, "canonical homepage sections must remain in approved order");
});

test("the Home route has one owner and one footer handoff", async () => {
  const source = await readFile(new URL("../../components/home/ReferenceHomePage.tsx", import.meta.url), "utf8");
  assert.equal(source.match(/<CinematicHomeSequence/g)?.length, 1);
  assert.equal(source.slice(source.lastIndexOf("export function ReferenceHomePage")).match(/<ReferenceHeader/g)?.length, 1);
  assert.equal(source.slice(source.lastIndexOf("export function ReferenceHomePage")).match(/<ReferenceFooter/g)?.length, 1);
});

test("Home uses supplied assets, safe claims, and required newsletter behavior", async () => {
  const source = await readFile(new URL("../../components/home/CinematicHomePage.tsx", import.meta.url), "utf8");
  for (const filename of ["sunrise-reset.png", "balanced-hustle.png", "evening-wind-down.png", "origin-to-everyday.png", "sustainability-farm.png", ...Array.from({ length: 6 }, (_, index) => `background-${index + 1}.png`)]) {
    assert.ok(source.includes(filename), `expected ${filename}`);
  }
  for (const forbidden of ["VAP", "execution milestones", "Phase-one", "verified impact dashboard", "CO₂e reduced", "plastic avoided", "verified buyer"]) {
    assert.equal(source.includes(forbidden), false, `forbidden Home copy: ${forbidden}`);
  }
  assert.match(source, /href="\/sustainability"/);
  assert.match(source, /autoPlay muted loop playsInline/);
  assert.match(source, /onEnded=\{restart\}/);
  assert.match(source, /video\.currentTime = 0\.01/);
  const newsletterSource = source.slice(source.indexOf("function NewsletterSection"), source.indexOf("export function CinematicHomeSequence"));
  assert.equal(newsletterSource.includes("fallback"), false, "newsletter video must not swap to a loop fallback state");
  assert.equal(source.includes("split(\"\")"), false, "counter text must remain semantic whole text");
});

test("Home renders one Origin scene and deletes the scrub-stage duplicate", async () => {
  const source = await readFile(new URL("../../components/home/CinematicHomePage.tsx", import.meta.url), "utf8");
  assert.equal(source.match(/origin-to-everyday\.png/g)?.length, 1);
  assert.equal(source.match(/data-home-section="origin-everyday"/g)?.length, 1);
  assert.equal(source.includes("scrubOriginPreview"), false, "the duplicate must be deleted from the render tree");
});

test("Home maps the supplied lifestyle set and grounds transparent product cutouts", async () => {
  const source = await readFile(new URL("../../components/home/CinematicHomePage.tsx", import.meta.url), "utf8");
  for (const filename of ["coconut-oil.png", "face-wash.png", "coconut-milk.png", "hair-serum.png", "coconut-flour.png", "moisturizer.png", "melt-icecream.png", "shampoo.png"]) {
    assert.ok(source.includes(`/lifestyle/${filename}`), `expected supplied lifestyle asset ${filename}`);
  }
  for (const legacy of ["lifestyle scene.png", "lifestyle Scene.png", "Botanica-Shampoo-Lifestyle Scene.png", "coconut vinegar-lifestyle scene.png"]) {
    assert.equal(source.includes(legacy), false, `legacy lifestyle asset must be removed: ${legacy}`);
  }
  assert.ok((source.match(/corrections\.productStage/g)?.length ?? 0) >= 2, "product rail and routine builder need grounding stages");
  assert.ok((source.match(/corrections\.productCutout/g)?.length ?? 0) >= 2, "transparent product images need directional drop shadows");
});

test("Home keeps the narrow-screen overflow guard and correction motion fallbacks", async () => {
  const source = await readFile(new URL("../../components/home/CinematicHomePage.tsx", import.meta.url), "utf8");
  const correctionCss = await readFile(new URL("../../components/home/CinematicHomeCorrections.module.css", import.meta.url), "utf8");
  const globalCss = await readFile(new URL("../../app/globals.css", import.meta.url), "utf8");
  const shellSource = await readFile(new URL("../../components/home/ReferenceHomePage.tsx", import.meta.url), "utf8");
  assert.match(source, /overflowX: "clip"/);
  assert.match(source, /useScroll/);
  assert.match(source, /useTransform/);
  assert.equal(source.match(/<SectionTransition \/>/g)?.length, 9, "each major Home scene needs the shared cinematic transition layer");
  assert.match(source, /co-cinematic-flow/);
  assert.match(globalCss, /\.co-cinematic-section-transition/);
  assert.match(globalCss, /\.co-cinematic-footer-transition::before/);
  assert.match(shellSource, /co-reference-footer co-cinematic-footer-transition/);
  assert.match(correctionCss, /prefers-reduced-motion: reduce/);
  assert.match(correctionCss, /@media \(max-width: 430px\)/);
});
