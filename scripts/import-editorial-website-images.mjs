import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outputRoot = path.join(root, "public/images/website/manual/editorial");

const sources = [
  ["CIRCULAR_MATERIALS", "/Users/fazilshersha/Desktop/Codex Image 3 Aug 2026, 16_07_32.png"],
  ["COMMUNITY_SOURCING", "/Users/fazilshersha/Desktop/Codex Image 3 Aug 2026, 16_07_17.png"],
  ["GROVE_LANDSCAPE", "/Users/fazilshersha/Desktop/Codex Image 3 Aug 2026, 16_06_57.png"],
  ["COASTAL_CLEANUP", "/Users/fazilshersha/Desktop/Codex Image 3 Aug 2026, 16_06_32.png"],
  ["LOWER_IMPACT_PROCESSING", "/Users/fazilshersha/Desktop/Codex Image 3 Aug 2026, 16_06_08.png"],
];

async function render(input, output, width, height, options = {}) {
  let pipeline = sharp(input).rotate().resize({ width, height, fit: "cover", position: options.position ?? "attention" });
  if (options.blur) pipeline = pipeline.blur(options.blur);
  await pipeline.webp({ quality: 88, smartSubsample: true }).toFile(output);
}

await mkdir(outputRoot, { recursive: true });
for (const [name, input] of sources) {
  await render(input, path.join(outputRoot, `CO_WEBSITE_EDITORIAL_${name}_DESKTOP_MASTER.webp`), 1600, 900);
  await render(input, path.join(outputRoot, `CO_WEBSITE_EDITORIAL_${name}_MOBILE_MASTER.webp`), 900, 1125);
}

const grove = sources.find(([name]) => name === "GROVE_LANDSCAPE")[1];
await render(grove, path.join(outputRoot, "CO_WEBSITE_EDITORIAL_GROVE_BLURRED_DESKTOP_MASTER.webp"), 1600, 700, { blur: 14 });
await render(grove, path.join(outputRoot, "CO_WEBSITE_EDITORIAL_GROVE_BLURRED_MOBILE_MASTER.webp"), 900, 1000, { blur: 14 });

const journeyRoot = path.join(root, "public/images/website/manual/about/journey");
await mkdir(journeyRoot, { recursive: true });
await sharp(path.join(journeyRoot, "CO_WEBSITE_ABOUT_JOURNEY_01_COCONUT_ORIGIN_DESKTOP_MASTER.webp.jpg"))
  .rotate()
  .webp({ quality: 90, smartSubsample: true })
  .toFile(path.join(journeyRoot, "CO_WEBSITE_ABOUT_JOURNEY_01_COCONUT_ORIGIN_DESKTOP_MASTER.webp"));
await render(sources.find(([name]) => name === "COMMUNITY_SOURCING")[1], path.join(journeyRoot, "CO_WEBSITE_ABOUT_JOURNEY_05_ROOTED_PARTNERSHIPS_DESKTOP_MASTER.webp"), 1600, 1200);
await render(sources.find(([name]) => name === "COMMUNITY_SOURCING")[1], path.join(journeyRoot, "CO_WEBSITE_ABOUT_JOURNEY_05_ROOTED_PARTNERSHIPS_MOBILE_MASTER.webp"), 900, 1125);
await render(sources.find(([name]) => name === "GROVE_LANDSCAPE")[1], path.join(journeyRoot, "CO_WEBSITE_ABOUT_JOURNEY_06_MADE_FOR_LIVING_DESKTOP_MASTER.webp"), 1600, 1200);
await render(sources.find(([name]) => name === "GROVE_LANDSCAPE")[1], path.join(journeyRoot, "CO_WEBSITE_ABOUT_JOURNEY_06_MADE_FOR_LIVING_MOBILE_MASTER.webp"), 900, 1125);

console.log(`Created ${sources.length * 2 + 6} editorial website derivatives.`);
