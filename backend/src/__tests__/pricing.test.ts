import test from "node:test";
import assert from "node:assert/strict";
import { previewOrder } from "../services/pricing.js";

test("order preview ignores client prices and calculates server totals", () => {
  const preview = previewOrder({
    items: [
      { productId: "co-water-330", quantity: 2 },
      { productId: "meltco-mango-350", quantity: 1 }
    ]
  });
  assert.equal(preview.subtotal, 46000);
  assert.equal(preview.total, 46000);
  assert.equal(preview.status, "DRAFT");
});
