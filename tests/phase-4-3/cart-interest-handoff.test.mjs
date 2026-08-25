import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("cart surfaces use the consent-safe launch handoff instead of checkout controls", async () => {
  const [drawer, page, handoff] = await Promise.all([
    readSource("../../components/cart/CartDrawer.tsx"),
    readSource("../../components/cart/CartPage.tsx"),
    readSource("../../components/cart/CartInterestHandoff.tsx"),
  ]);

  assert.match(drawer, /<CartInterestHandoff/);
  assert.match(page, /<CartInterestHandoff/);
  assert.doesNotMatch(drawer, /Checkout coming soon|disabled aria-label="Checkout/);
  assert.doesNotMatch(page, /Checkout coming soon|Order summary|Calculated at checkout/);
  assert.match(handoff, /fetch\("\/api\/newsletter"/);
  assert.match(handoff, /consent,/);
  assert.match(handoff, /cart_drawer_early_access/);
  assert.match(handoff, /cart_page_early_access/);
  assert.match(handoff, /\/contact#contact-form/);
  assert.match(handoff, /does not place an order or reserve stock/i);
  assert.match(handoff, /does not store a trade enquiry/i);
});

test("cart handoff avoids unsupported commerce promises", async () => {
  const handoff = await readSource("../../components/cart/CartInterestHandoff.tsx");
  assert.doesNotMatch(handoff, /free shipping|delivery window|secure checkout|track(?:ing)? order|payment accepted/i);
});
