import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { recipeIndexRecipeIds, recipes as detailRecipes } from "../../components/recipes/recipe-data";
import { fallbackRecipes } from "../../lib/content/fallback-data";
import {
  canonicalRecipeIdentities,
  resolveRecipeIdentity,
  resolveSavedRecipe,
} from "../../lib/recipes/canonical";

const previouslyUnresolved = [
  "tropical-coconut-chia-pudding",
  "coconut-thai-veggie-curry",
  "green-coconut-detox-smoothie",
  "chocolate-coconut-pudding",
  "melt-co-mango-nice-cream",
  "coconut-energy-balls",
] as const;

test("canonical recipe identities and public slugs are unique", () => {
  const recipeIds = canonicalRecipeIdentities.map((identity) => identity.recipeId);
  const slugs = canonicalRecipeIdentities.map((identity) => identity.slug);
  assert.equal(new Set(recipeIds).size, recipeIds.length);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.equal(new Set(fallbackRecipes.map((recipe) => recipe.slug)).size, fallbackRecipes.length);
});

test("every Recipes experience save identity resolves through the canonical catalog", () => {
  for (const recipeId of recipeIndexRecipeIds) {
    const identity = resolveRecipeIdentity(recipeId);
    const saved = resolveSavedRecipe(recipeId, fallbackRecipes);
    assert.ok(identity, `missing canonical identity for ${recipeId}`);
    assert.ok(saved, `saved recipe ${recipeId} is not renderable`);
    assert.equal(saved.persistedId, recipeId);
    assert.equal(saved.recipe.slug, identity.slug);
  }
});

test("the six previously unresolved saved recipe ids render their exact canonical recipes", () => {
  for (const recipeId of previouslyUnresolved) {
    const saved = resolveSavedRecipe(recipeId, fallbackRecipes);
    const detail = detailRecipes.find((recipe) => recipe.slug === recipeId);
    assert.ok(saved, `missing saved recipe ${recipeId}`);
    assert.ok(detail, `missing detail recipe ${recipeId}`);
    assert.equal(saved.recipe.slug, detail.slug);
    assert.equal(saved.recipe.title, detail.title);
  }
});

test("the former chocolate-coconut-pudding collision is deterministic", () => {
  const legacy = resolveSavedRecipe("chocolate-coconut-pudding", fallbackRecipes);
  assert.equal(legacy?.persistedId, "chocolate-coconut-pudding");
  assert.equal(legacy?.recipe.slug, "chocolate-coconut-pudding");
  assert.equal(legacy?.recipe.title, "Chocolate Coconut Pudding");
  assert.equal(resolveSavedRecipe("coconut-flour-pancakes", fallbackRecipes)?.recipe.title, "Coconut Flour Pancakes");
  assert.equal(resolveSavedRecipe("brazilian-coconut-pudding", fallbackRecipes)?.recipe.title, "Brazilian Coconut Pudding");
});

test("Saved Recipes resolves persisted ids before rendering and keeps persisted ids for removal", async () => {
  const [accountData, accountPage, recipesPage] = await Promise.all([
    readFile(new URL("../../lib/account/data.ts", import.meta.url), "utf8"),
    readFile(new URL("../../components/account/AccountPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../../components/recipes/ReferenceRecipesPage.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(accountData, /resolveSavedRecipe\(persistedId, recipes\)/);
  assert.match(accountPage, /savedRecipeEntries\.map/);
  assert.match(accountPage, /persistedId:id/);
  assert.doesNotMatch(recipesPage, /slug:\s*"chocolate-coconut-pudding"/);
});
