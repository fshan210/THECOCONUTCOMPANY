import crypto from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const publicRoot = path.join(root, "public");
const manifestPath = path.join(root, "lib/generated/optimized-image-manifest.json");
const sources = [
  "/images/website/manual/home/hero/CO_WEBSITE_HOME_ECOSYSTEM_HERO_MOBILE_MASTER.webp",
  "/images/website/manual/home/transitions/CO_WEBSITE_TRANSITION_WATER_MOBILE_MASTER.webp",
  "/images/website/manual/products/galleries/CO_WEBSITE_PDP_BOTANICA_FACE_WASH_HERO_DESKTOP_MASTER.webp",
];
const variants = [
  ["mobile", 828, 60, 82],
  ["tablet", 1280, 60, 82],
  ["desktop", 1920, 64, 86],
];

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

for (const source of sources) {
  const input = path.join(publicRoot, source);
  const bytes = await readFile(input);
  const metadata = await sharp(bytes).metadata();
  const hash = crypto.createHash("sha1").update(bytes).digest("hex").slice(0, 10);
  const parsed = path.parse(source.slice(1));
  const safeName = parsed.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "-");
  const outputDirectory = path.join(publicRoot, "assets-optimized", parsed.dir);
  const outputVariants = {};
  await mkdir(outputDirectory, { recursive: true });

  for (const [name, targetWidth, avifQuality, jpgQuality] of variants) {
    const width = Math.min(metadata.width ?? targetWidth, targetWidth);
    const avifName = `${safeName}-${hash}-${name}.avif`;
    const jpgName = `${safeName}-${hash}-${name}.jpg`;
    const avifPath = path.join(outputDirectory, avifName);
    const jpgPath = path.join(outputDirectory, jpgName);
    const image = sharp(bytes).rotate().resize({ width, withoutEnlargement: true });
    await Promise.all([
      image.clone().avif({ quality: avifQuality, effort: 5 }).toFile(avifPath),
      image.clone().jpeg({ quality: jpgQuality, mozjpeg: true, progressive: true }).toFile(jpgPath),
    ]);
    outputVariants[name] = {
      width,
      avif: `/assets-optimized/${parsed.dir}/${avifName}`,
      jpg: `/assets-optimized/${parsed.dir}/${jpgName}`,
      avifBytes: (await stat(avifPath)).size,
      jpgBytes: (await stat(jpgPath)).size,
    };
  }

  manifest[source] = {
    src: source,
    width: metadata.width,
    height: metadata.height,
    originalBytes: bytes.length,
    variants: outputVariants,
    fallback: source,
  };
  console.log(`${source} -> ${outputVariants.mobile.avif}`);
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
