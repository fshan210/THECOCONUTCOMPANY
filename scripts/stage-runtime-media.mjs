import { link, mkdir } from "node:fs/promises";
import path from "node:path";
import { readFile } from "node:fs/promises";

const root = process.cwd();
const inventory = JSON.parse(await readFile(path.join(root, "migration-reports", "inventory", "public-assets.json"), "utf8"));
const stagingRoot = path.join(root, "migration-reports", "staging");
const runtimeAssets = inventory.assets.filter((asset) => asset.classification === "A-runtime-remote");

let linked = 0;
let alreadyStaged = 0;
for (const asset of runtimeAssets) {
  const source = path.join(root, asset.relativePath);
  const destination = path.join(stagingRoot, asset.proposedS3Key);
  await mkdir(path.dirname(destination), { recursive: true });
  try {
    await link(source, destination);
    linked += 1;
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    alreadyStaged += 1;
  }
}

console.log(JSON.stringify({ stagingRoot, expected: runtimeAssets.length, linked, alreadyStaged }, null, 2));
