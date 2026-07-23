import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const manifest = JSON.parse(await readFile(new URL("../../public/experience/coconut-bottle/v3/manifest.json", import.meta.url), "utf8"));

test("coconut manifest contains one reversible 18-frame sequence per viewport", () => {
  assert.equal(manifest.frameCount, 18);
  for (const viewport of ["desktop", "mobile"]) {
    const avif = manifest.outputs.filter((item) => item.viewport === viewport && item.path.endsWith(".avif"));
    const jpeg = manifest.outputs.filter((item) => item.viewport === viewport && item.path.endsWith(".jpg"));
    assert.equal(avif.length, 18);
    assert.equal(jpeg.length, 18);
    assert.deepEqual(avif.map((item) => item.frame), Array.from({ length: 18 }, (_, index) => index));
    assert.ok(avif.every((item) => item.bytes < 180_000));
  }
});

test("locked opening and final holds remain pixel-stable after encoding", () => {
  for (const viewport of ["desktop", "mobile"]) {
    const avif = manifest.outputs.filter((item) => item.viewport === viewport && item.path.endsWith(".avif"));
    assert.equal(avif[0].sha256, avif[1].sha256);
    assert.equal(avif[1].sha256, avif[2].sha256);
    assert.equal(avif[15].sha256, avif[16].sha256);
    assert.equal(avif[16].sha256, avif[17].sha256);
  }
  assert.match(manifest.seamPolicy, /never directly crossfaded/i);
});
