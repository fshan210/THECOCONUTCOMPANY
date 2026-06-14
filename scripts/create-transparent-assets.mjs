import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const publicDir = path.join(process.cwd(), "public");
const outputDir = path.join(publicDir, "assets", "transparent");

const candidates = [
  "assets/products/co-water.jpg",
  "assets/products/co-water-reserve.jpg",
  "assets/recipes/mango-coconut-dessert.png",
  "assets/skincare/coconut-care.png",
  "assets/social/founder-journey.png"
];

function outputName(source, ext) {
  return path
    .basename(source)
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") + ext;
}

await mkdir(outputDir, { recursive: true });

const results = [];

for (const relative of candidates) {
  const input = path.join(publicDir, relative);
  const image = sharp(input).rotate().resize({ width: 1200, withoutEnlargement: true }).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  for (let index = 0; index < data.length; index += info.channels) {
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    const brightness = (red + green + blue) / 3;
    const chroma = Math.max(red, green, blue) - Math.min(red, green, blue);

    if (brightness > 232 && chroma < 26) {
      data[index + 3] = Math.max(0, Math.round((255 - brightness) * 3.4));
    }
  }

  const transparent = sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels
    }
  });

  const png = path.join(outputDir, outputName(relative, ".png"));
  const webp = path.join(outputDir, outputName(relative, ".webp"));

  await transparent.clone().png({ compressionLevel: 9 }).toFile(png);
  await transparent.clone().webp({ quality: 88, effort: 5 }).toFile(webp);

  results.push({
    source: relative,
    png: path.relative(publicDir, png),
    webp: path.relative(publicDir, webp)
  });
}

console.log(JSON.stringify(results, null, 2));
