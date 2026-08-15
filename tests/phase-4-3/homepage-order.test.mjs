import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the production homepage narrative order remains locked", async () => {
  const source = await readFile(new URL("../../components/home/ReferenceHomePage.tsx", import.meta.url), "utf8");
  const sequence = [
    "<HeroScrapeSequence",
    "<OriginJourneySection",
    "<CoReceiptSection",
    "<StealRoutineSection",
    "<TestimonialsSection",
    "<OutsideShelfSection",
    "<RecipesSnapshot",
    "<SustainabilityBanner",
    "<CoNewsletterSection",
    "<ReferenceFooter"
  ];
  const indices = sequence.map((marker) => source.lastIndexOf(marker));
  assert.ok(indices.every((index) => index >= 0), "every canonical homepage section must remain present");
  assert.deepEqual([...indices].sort((a, b) => a - b), indices, "canonical homepage sections must remain in approved order");
});
