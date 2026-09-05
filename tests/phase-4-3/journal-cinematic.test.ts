import assert from "node:assert/strict";
import test from "node:test";
import { existsSync } from "node:fs";
import {
  forms,
  processes,
  dishes,
  resolveCoconut,
} from "../../components/journal/journal-config";
import {
  categories,
  filterStories,
  mergeStories,
  referenceStories,
} from "../../components/journal/journal-data";
import { recipes as referenceRecipes } from "../../components/recipes/recipe-data";
import { recipes, shopProducts } from "../../lib/catalog";
import { fallbackJournalPosts } from "../../lib/content/fallback-data";
import { mediaUrl } from "../../lib/media";

test("all 120 coconut selections resolve deterministically to existing recipes and assets", () => {
  const keys = new Set();
  for (const form of forms)
    for (const process of processes)
      for (const dish of dishes) {
        const config = { form, process, dish };
        const result = resolveCoconut(config);
        assert.deepEqual(result, resolveCoconut(config));
        keys.add(result.key);
        assert.ok(
          [...recipes, ...referenceRecipes].some((r) => r.slug === result.slug),
          result.slug,
        );
        assert.ok(existsSync(`public${result.image}`), result.image);
        assert.ok(
          !result.product.slug ||
            shopProducts.some((p) => p.slug === result.product.slug),
        );
        assert.ok(result.note.length > 100);
        if (process === "Fermented" || dish === "Bake" || form === "Flour")
          assert.equal(result.alternative, true);
      }
  assert.equal(keys.size, 120);
});
test("changing form, process and dish changes substantive recommendation content", () => {
  const base = resolveCoconut({
    form: "Milk",
    process: "Fresh",
    dish: "Curry",
  });
  const oil = resolveCoconut({ form: "Oil", process: "Fresh", dish: "Curry" });
  const drink = resolveCoconut({
    form: "Milk",
    process: "Fresh",
    dish: "Drink",
  });
  const fermented = resolveCoconut({
    form: "Milk",
    process: "Fermented",
    dish: "Curry",
  });
  assert.notEqual(base.slug, oil.slug);
  assert.notEqual(base.product.slug, oil.product.slug);
  assert.notEqual(base.image, drink.image);
  assert.notEqual(base.note, fermented.note);
  assert.equal(fermented.alternative, true);
});
test("archive preserves published CMS stories and filters by category, place and case-insensitive text", () => {
  const all = mergeStories(fallbackJournalPosts);
  for (const post of fallbackJournalPosts)
    assert.ok(all.some((s) => s.id === post.slug));
  for (const category of categories.filter((c) => c !== "All"))
    assert.ok(
      filterStories(all, category, "", "Newest").every(
        (s) => s.category === category,
      ),
    );
  assert.ok(filterStories(all, "All", "  POLLACHI  ", "Newest").length >= 3);
  assert.equal(
    filterStories(all, "All", "no-matching-story-xyz", "Newest").length,
    0,
  );
  assert.equal(
    all.find((s) => s.id === fallbackJournalPosts[0].slug)?.displayDate,
    fallbackJournalPosts[0].date,
  );
  const sorted = filterStories(referenceStories, "All", "", "Newest");
  assert.equal(sorted[0].date, "2025-05-12");
  assert.equal(
    filterStories(referenceStories, "All", "", "Oldest")[0].date,
    "2025-05-07",
  );
});
test("Journal assets remain local with an external media origin without changing other paths", () => {
  const old = process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL = "https://media.example.test";
  try {
    assert.equal(
      mediaUrl("/assets/redesign/journal/cinematic/hero.webp"),
      "/assets/redesign/journal/cinematic/hero.webp",
    );
    assert.equal(
      mediaUrl("/assets/other.png"),
      "https://media.example.test/site-media/v1/assets/other.png",
    );
  } finally {
    if (old === undefined) delete process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
    else process.env.NEXT_PUBLIC_MEDIA_BASE_URL = old;
  }
});
