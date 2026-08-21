import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("shop route composes the approved discovery and bundle architecture", async () => {
  const [page, shop, hero, categories, bundle] = await Promise.all([
    source("../../app/shop/page.tsx"),
    source("../../components/shop/ReferenceShopPage.tsx"),
    source("../../components/shop/ShopHero.tsx"),
    source("../../components/shop/ShopCategorySlab.tsx"),
    source("../../components/shop/ShopBundleBuilder.tsx"),
  ]);

  assert.match(page, /<ReferenceShopPage contentProducts={products}/);
  assert.match(shop, /<ShopHero/);
  assert.match(shop, /<ShopWaterFilm/);
  assert.match(shop, /<ShopCategorySlab/);
  assert.match(shop, /<ShopBundleBuilder/);
  assert.match(hero, /shop-hero\/v1\/\$\{viewport\}/);
  assert.match(hero, /co-product-ecosystem-v1\.webp/);
  assert.match(hero, /mobileSrc=\{transparentPixel\}/);
  for (const label of ["All Products", ".CO Water", ".CO Kitchen", "BOTANiCA", "MELT", "Bundles & Gifts"]) assert.match(categories, new RegExp(label.replace(".", "\\.")));
  assert.match(bundle, /maxSlots = 5/);
  assert.match(bundle, /selectedProducts\.forEach\(\(product\) => cart\.addItem/);
  assert.match(bundle, /Catalog total/);
});

test("shop discovery remains functional and uses real-data-safe controls", async () => {
  const [shop, launch] = await Promise.all([
    source("../../components/shop/ReferenceShopPage.tsx"),
    source("../../components/launch/LaunchExperience.tsx"),
  ]);
  assert.match(shop, /product\.price > maxPrice/);
  assert.match(shop, /product\.collection\.includes/);
  assert.match(shop, /availability\.has/);
  assert.match(shop, /formats\.has/);
  assert.match(shop, /Price Low to High/);
  assert.match(shop, /window\.history\.pushState/);
  assert.match(shop, /window\.addEventListener\("popstate"/);
  assert.match(shop, /product\.cartSlug === "co-water" \? setConfiguratorOpen\(true\)/);
  assert.doesNotMatch(shop, /★★★★★|Free Shipping|14-day return|Secure Payments|Earn Rewards|Save ₹/i);
  assert.match(launch, /pathname === "\/shop" \|\| pathname\.startsWith\("\/shop\/"\)/);
});

test("shop water film defers transfer and provides motion-safe fallbacks", async () => {
  const film = await source("../../components/shop/ShopWaterFilm.tsx");
  assert.match(film, /preload="none"/);
  assert.match(film, /IntersectionObserver/);
  assert.match(film, /prefers-reduced-motion: reduce/);
  assert.match(film, /connection\?\.saveData/);
  assert.match(film, /videoRef\.current\?\.pause/);
  assert.match(film, /coconut-water-flow-mobile-v1\.mp4/);
  assert.match(film, /coconut-water-flow-desktop-v1\.mp4/);
});
