import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const rootDir = process.cwd();
const sourceDir = path.join(rootDir, "assets-source", "products", "transparent-current");
const outputDir = path.join(rootDir, "public", "assets", "products", "transparent-current");

const approvedAssets = [
  ["co-coconut-water-master-v1.png", "co-coconut-water-v1.webp"],
  ["co-kitchen-coconut-oil-master-v1.png", "co-kitchen-coconut-oil-v1.webp"],
  ["co-kitchen-coconut-flour-master-v1.png", "co-kitchen-coconut-flour-v1.webp"],
  ["co-kitchen-coconut-milk-master-v1.png", "co-kitchen-coconut-milk-v1.webp"],
  ["co-melt-coconut-mango-master-v1.png", "co-melt-coconut-mango-v1.webp"],
  ["co-botanica-hair-serum-master-v1.png", "co-botanica-hair-serum-v1.webp"],
  ["co-botanica-body-moisturizer-master-v1.png", "co-botanica-body-moisturizer-v1.webp"],
  ["co-botanica-shampoo-master-v1.png", "co-botanica-shampoo-v1.webp"],
  ["co-botanica-face-wash-master-v1.png", "co-botanica-face-wash-v1.webp"],
];

await mkdir(outputDir, { recursive: true });

const results = [];

for (const [sourceName, outputName] of approvedAssets) {
  const source = path.join(sourceDir, sourceName);
  const output = path.join(outputDir, outputName);
  const metadata = await sharp(source).metadata();

  if (metadata.width !== 1080 || metadata.height !== 1080 || !metadata.hasAlpha) {
    throw new Error(`Approved transparent master failed validation: ${sourceName}`);
  }

  await sharp(source)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 })
    .extend({ top: 24, bottom: 24, left: 24, right: 24, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .resize({ height: 800, fit: "inside", withoutEnlargement: true })
    .webp({ lossless: true, effort: 6 })
    .toFile(output);

  const runtime = await sharp(output).metadata();
  results.push({
    source: path.relative(rootDir, source),
    runtime: `/${path.relative(path.join(rootDir, "public"), output)}`,
    width: runtime.width,
    height: runtime.height,
    hasAlpha: runtime.hasAlpha,
  });
}

console.log(JSON.stringify(results, null, 2));
