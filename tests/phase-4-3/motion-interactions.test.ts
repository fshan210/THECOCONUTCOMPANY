import assert from "node:assert/strict";
import test from "node:test";
import { boundedSlideIndex, pointerDistance, shouldSuppressDraggedClick } from "../../components/sliders/interaction";

test("drag versus click threshold math is stable and modified clicks are preserved", () => {
  assert.equal(pointerDistance({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
  assert.equal(shouldSuppressDraggedClick(true, {}), true);
  assert.equal(shouldSuppressDraggedClick(true, { metaKey: true }), false);
  assert.equal(shouldSuppressDraggedClick(true, { ctrlKey: true }), false);
  assert.equal(shouldSuppressDraggedClick(false, {}), false);
});

test("reduced motion navigation cannot move outside the logical slide set", () => {
  assert.equal(boundedSlideIndex(-1, 6), 0);
  assert.equal(boundedSlideIndex(8, 6), 5);
  assert.equal(boundedSlideIndex(3, 6), 3);
  assert.equal(boundedSlideIndex(1, 0), 0);
});
