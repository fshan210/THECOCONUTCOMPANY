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
  for (const filename of ["sunrise-reset.png", "balanced-hustle.png", "evening-wind-down.png", "origin-to-everyday.png", ...Array.from({ length: 6 }, (_, index) => `background-${index + 1}.png`)]) {
    assert.ok(source.includes(filename), `expected ${filename}`);
  }
  for (const forbidden of ["VAP", "execution milestones", "Phase-one", "verified impact dashboard", "CO₂e reduced", "plastic avoided", "verified buyer"]) {
    assert.equal(source.includes(forbidden), false, `forbidden Home copy: ${forbidden}`);
  }
  assert.match(source, /href="\/sustainability"/);
  assert.match(source, /autoPlay muted loop playsInline/);
  assert.match(source, /onEnded=\{restart\}/);
  assert.equal(source.includes("split(\"\")"), false, "counter text must remain semantic whole text");
});
