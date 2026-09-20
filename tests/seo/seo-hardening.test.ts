import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fallbackJournalPosts, fallbackProducts, fallbackRecipes } from "../../lib/content/fallback-data";
import { absoluteCanonicalUrl, createPageMetadata, siteUrl } from "../../lib/seo/metadata";
import { buildSitemapUrls, indexableStaticRoutes, noindexRoutePrefixes } from "../../lib/seo/routes";
import { articleSchema, organizationSchema, productSchema, recipeSchema, websiteSchema } from "../../lib/seo/structured-data";
import { serializeJsonLd } from "../../components/seo/StructuredData";
import robots from "../../app/robots";

test("canonical URLs always resolve to the apex Production origin", () => {
  assert.equal(absoluteCanonicalUrl("/shop/?sort=new"), `${siteUrl}/shop`);
  assert.equal(absoluteCanonicalUrl("recipes//coconut-basbousa/"), `${siteUrl}/recipes/coconut-basbousa`);

  const metadata = createPageMetadata({ title: "Shop", description: "Shop description", path: "/shop" });
  assert.deepEqual(metadata.alternates, { canonical: "/shop" });
  assert.equal("languages" in (metadata.alternates ?? {}), false);
  assert.equal(metadata.openGraph?.url, `${siteUrl}/shop`);
});

test("indexable and noindex metadata have explicit crawler policy", () => {
  const publicMetadata = createPageMetadata({ title: "Recipes", description: "Recipe description", path: "/recipes" });
  const privateMetadata = createPageMetadata({ title: "Account", description: "Private account", path: "/account", index: false });
  const searchMetadata = createPageMetadata({ title: "Search", description: "Search results", path: "/search", index: false, follow: true });

  assert.equal((publicMetadata.robots as { index?: boolean }).index, true);
  assert.equal((publicMetadata.robots as { follow?: boolean }).follow, true);
  assert.equal((privateMetadata.robots as { index?: boolean }).index, false);
  assert.equal((privateMetadata.robots as { follow?: boolean }).follow, false);
  assert.equal((searchMetadata.robots as { index?: boolean }).index, false);
  assert.equal((searchMetadata.robots as { follow?: boolean }).follow, true);
});

test("sitemap is canonical, unique, deterministic, and excludes private routes", () => {
  const first = buildSitemapUrls(fallbackProducts, fallbackRecipes);
  const second = buildSitemapUrls(fallbackProducts, fallbackRecipes);
  const urls = first.map((entry) => entry.url);

  assert.deepEqual(first, second);
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(indexableStaticRoutes.every((route) => urls.includes(new URL(route, siteUrl).toString())));
  assert.ok(fallbackProducts.every((product) => urls.includes(`${siteUrl}/shop/${product.slug}`)));
  assert.ok(fallbackRecipes.every((recipe) => urls.includes(`${siteUrl}/recipes/${recipe.slug}`)));
  assert.ok(urls.every((url) => url.startsWith(`${siteUrl}/`) || url === `${siteUrl}/`));
  assert.ok(urls.every((url) => !noindexRoutePrefixes.some((prefix) => new URL(url).pathname === prefix || new URL(url).pathname.startsWith(`${prefix}/`))));
  assert.ok(first.every((entry) => !("lastModified" in entry)));
});

test("robots declares canonical sitemaps without treating HTML noindex as privacy", () => {
  const policy = robots();
  const serialized = JSON.stringify(policy);
  assert.match(serialized, new RegExp(`${siteUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/sitemap\\.xml`));
  assert.match(serialized, /image-sitemap\.xml/);
  assert.doesNotMatch(serialized, /news-sitemap\.xml/);
  assert.ok(serialized.includes("/api/"));
});

test("every canonical recipe has unique identity and truthful detail schema", () => {
  const slugs = fallbackRecipes.map((recipe) => recipe.slug);
  const titles = fallbackRecipes.map((recipe) => recipe.title);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.equal(new Set(titles).size, titles.length);

  const schemas = fallbackRecipes.map(recipeSchema).filter((schema) => schema !== null);
  const incomplete = fallbackRecipes.filter((recipe) => !recipe.ingredients.length || !recipe.steps.length);
  assert.ok(schemas.length > 0);
  assert.ok(incomplete.length > 0);
  assert.ok(incomplete.every((recipe) => recipeSchema(recipe) === null));
  assert.equal(new Set(schemas.map((schema) => schema["@id"])).size, schemas.length);
  schemas.forEach((schema) => {
    assert.match(schema.url, /^https:\/\/cothecoconutcompany\.com\/recipes\//);
    assert.ok(Array.isArray(schema.image));
    assert.ok(schema.image.every((url) => url.startsWith("https://")));
    assert.ok(Array.isArray(schema.recipeIngredient) && schema.recipeIngredient.length > 0);
    assert.ok(Array.isArray(schema.recipeInstructions) && schema.recipeInstructions.length > 0);
    assert.equal("aggregateRating" in schema, false);
    assert.equal("review" in schema, false);
    assert.equal("nutrition" in schema, false);
    assert.equal("prepTime" in schema, false);
  });
});

test("unsupported product and journal entities are omitted", () => {
  assert.ok(fallbackProducts.every((product) => productSchema(product) === null));
  assert.ok(fallbackJournalPosts.every((post) => articleSchema(post) === null));
});

test("site entity schemas use stable canonical IDs and no fabricated ratings", () => {
  const schemas = [organizationSchema(), websiteSchema()];
  const serialized = JSON.stringify(schemas);
  assert.match(serialized, /https:\/\/cothecoconutcompany\.com\/#organization/);
  assert.match(serialized, /https:\/\/cothecoconutcompany\.com\/#website/);
  assert.doesNotMatch(serialized, /aggregateRating|reviewCount|gtin|mpn/);
});

test("JSON-LD serialization cannot terminate its script element", () => {
  const serialized = serializeJsonLd({ value: "</script><script>alert(1)</script>&\u2028" });
  assert.doesNotMatch(serialized, /<\/script>/i);
  assert.match(serialized, /\\u003c\/script\\u003e/);
  assert.match(serialized, /\\u0026/);
});

test("every private route family has a permanent noindex declaration", () => {
  const privatePages = [
    "app/(account)/account/page.tsx",
    "app/(account)/account/addresses/page.tsx",
    "app/(account)/account/empty/page.tsx",
    "app/(account)/account/payments/page.tsx",
    "app/(account)/account/security/page.tsx",
    "app/(account)/orders/page.tsx",
    "app/(account)/orders/history/page.tsx",
    "app/(account)/orders/[orderId]/page.tsx",
    "app/(account)/profile/page.tsx",
    "app/(account)/saved-recipes/page.tsx",
    "app/(account)/wishlist/page.tsx",
    "app/cart/page.tsx",
    "app/payment/page.tsx",
    "app/login/page.tsx",
    "app/register/page.tsx",
    "app/forgot-password/page.tsx",
    "app/reset-password/page.tsx",
    "app/verify-email/page.tsx",
    "app/email-verified/page.tsx",
  ];
  privatePages.forEach((file) => assert.match(readFileSync(resolve(file), "utf8"), /index:\s*false/, `${file} must remain noindex`));

  const authPages = [
    "app/login/page.tsx",
    "app/register/page.tsx",
    "app/forgot-password/page.tsx",
    "app/reset-password/page.tsx",
    "app/verify-email/page.tsx",
  ];
  authPages.forEach((file) => assert.doesNotMatch(readFileSync(resolve(file), "utf8"), /StructuredData/, `${file} must not emit JSON-LD`));

  const utilityRoute = readFileSync(resolve("app/[slug]/page.tsx"), "utf8");
  ["checkout", "track-order", "search", "payment"].forEach((slug) => assert.match(utilityRoute, new RegExp(`\\b${slug}\\b`)));
  assert.match(readFileSync(resolve("app/admin/layout.tsx"), "utf8"), /index:\s*false/);
  assert.match(readFileSync(resolve("app/status/[state]/page.tsx"), "utf8"), /index:\s*false/);
  assert.match(readFileSync(resolve("app/offline/page.tsx"), "utf8"), /index:\s*false/);
});

test("Preview noindex and canonical one-hop redirects are repository-owned", () => {
  const config = readFileSync(resolve("next.config.mjs"), "utf8");
  assert.match(config, /VERCEL_ENV/);
  assert.match(config, /X-Robots-Tag/);
  assert.match(config, /noindex, nofollow, noarchive/);
  assert.match(config, /source:\s*"\/terms"[\s\S]*destination:\s*"\/terms-and-conditions"/);
  assert.match(config, /source:\s*"\/our-story"[\s\S]*destination:\s*"\/about"/);
});
