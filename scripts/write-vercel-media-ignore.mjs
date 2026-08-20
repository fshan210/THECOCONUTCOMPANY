import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const ignorePath = path.join(root, ".vercelignore");
const inventoryPath = path.join(root, "migration-reports", "inventory", "public-assets.json");
const begin = "# BEGIN generated runtime media migration exclusions";
const end = "# END generated runtime media migration exclusions";
const inventory = JSON.parse(await readFile(inventoryPath, "utf8"));
const buildRequired = new Set([
  "public/assets/media-library.generated.json",
]);
const bundledRuntimePrefixes = [
  "public/assets/about/floating-coconut-water-splash.png",
  "public/assets/home/co-hero-coconut-transparent-v1.webp",
  "public/assets/home/generated/",
  "public/assets/backgrounds/water-material/co-coconut-water-material.png",
  "public/assets/backgrounds/day-with-co/midday-kitchen.png",
  "public/assets/products/transparent-current/",
  "public/assets/video/homepage-v2/",
];
const isBuildRequired = (relativePath) =>
  buildRequired.has(relativePath)
  || bundledRuntimePrefixes.some((prefix) => relativePath.startsWith(prefix));
const excluded = inventory.assets
  .filter((asset) =>
    !isBuildRequired(asset.relativePath)
    && (asset.classification === "A-runtime-remote" || asset.classification === "C-archive-source"),
  )
  .map((asset) => asset.relativePath)
  .sort((left, right) => left.localeCompare(right));

const current = await readFile(ignorePath, "utf8");
const blockPattern = new RegExp(`${begin}[\\s\\S]*?${end}\\n?`, "g");
const base = current.replace(blockPattern, "").trimEnd();
const next = `${base}\n\n${begin}\n${excluded.join("\n")}\n${end}\n`;
await writeFile(ignorePath, next);
process.stdout.write(`${JSON.stringify({ excludedCount: excluded.length }, null, 2)}\n`);
