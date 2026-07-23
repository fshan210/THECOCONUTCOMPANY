import assert from "node:assert/strict";
import test from "node:test";
import { boundedSlideIndex, pointerDistance, shouldSuppressDraggedClick } from "../../components/sliders/interaction";
import { coconutScrollAssets, coconutStageIndex } from "../../lib/experience/coconut-scroll-config";

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

test("coconut stages and viewport-specific manifests are deterministic", () => {
  assert.equal(coconutScrollAssets.version, "v3");
  assert.equal(coconutScrollAssets.frameCount, 18);
  assert.equal(coconutScrollAssets.desktop.avif.length, 18);
  assert.equal(coconutScrollAssets.mobile.avif.length, 18);
  assert.match(coconutScrollAssets.desktop.avif[0], /\/desktop\//);
  assert.match(coconutScrollAssets.mobile.avif[0], /\/mobile\//);
  assert.deepEqual([0, .21, .41, .66, .85].map(coconutStageIndex), [0, 1, 2, 3, 4]);
  assert.equal(coconutStageIndex(1), 4);
  assert.equal(coconutStageIndex(0), 0);
});
