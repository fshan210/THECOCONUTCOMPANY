import assert from "node:assert/strict";
import test from "node:test";
import { availableProcessing, findVariant, isOptionAvailable } from "../../components/shop/ProductConfigurator/availability";
import { configuredVariants } from "../../components/shop/ProductConfigurator/configurator-data";

test("the configurator resolves every declared combination to one unique SKU", () => {
  assert.equal(configuredVariants.length, 12);
  assert.equal(new Set(configuredVariants.map((variant) => variant.sku)).size, configuredVariants.length);
  for (const variant of configuredVariants) {
    assert.equal(findVariant(variant)?.sku, variant.sku);
    assert.ok(variant.image);
    assert.ok(variant.price > 0);
  }
});

test("100ml RAW variants remain blocked while supported combinations resolve", () => {
  assert.equal(isOptionAvailable({ sizeMl: 100, processing: "RAW" }), false);
  assert.deepEqual(availableProcessing(100), ["UHT"]);
  assert.equal(isOptionAvailable({ sizeMl: 200, processing: "RAW", pulp: "with-pulp" }), true);
  assert.equal(isOptionAvailable({ sizeMl: 500, processing: "UHT", pulp: "without-pulp" }), true);
});

test("variant identity keeps SKU, price and copy synchronized", () => {
  const variant = findVariant({ sizeMl: 500, processing: "RAW", pulp: "with-pulp" });
  assert.equal(variant?.sku, "CO-CW-500-RAW-P");
  assert.equal(variant?.price, 140);
  assert.match(variant?.description ?? "", /RAW/);
  assert.match(variant?.description ?? "", /with tender coconut pulp/);
});
