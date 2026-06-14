import { mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const publicDir = path.join(process.cwd(), "public");
const sourceDirs = [path.join(publicDir, "images"), path.join(publicDir, "assets")];
const outputDir = path.join(publicDir, "optimized");
const allowedExt = new Set([".jpg", ".jpeg", ".png"]);
const widths = [640, 960, 1280, 1920];

async function walk(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir);
  const files = [];

  for (const entry of entries) {
    if (entry.startsWith(".")) continue;
    const fullPath = path.join(dir, entry);
    const stats = await stat(fullPath);
    if (stats.isDirectory()) files.push(...(await walk(fullPath)));
    if (stats.isFile() && allowedExt.has(path.extname(entry).toLowerCase())) files.push(fullPath);
  }

  return files;
}

function slugFor(file) {
  const relative = path.relative(publicDir, file);
  return relative
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function optimize(file) {
  const metadata = await sharp(file).metadata();
  const slug = slugFor(file);
  const baseWidth = metadata.width || 1280;
  const generated = [];

  for (const width of widths.filter((candidate) => candidate <= baseWidth)) {
    const output = path.join(outputDir, `${slug}-${width}.webp`);
    await sharp(file)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(output);
    generated.push(path.relative(publicDir, output));
  }

  const defaultWidth = Math.min(1280, baseWidth);
  const defaultOutput = path.join(outputDir, `${slug}.webp`);
  await sharp(file)
    .rotate()
    .resize({ width: defaultWidth, withoutEnlargement: true })
    .webp({ quality: 84, effort: 5 })
    .toFile(defaultOutput);
  generated.push(path.relative(publicDir, defaultOutput));

  return {
    source: path.relative(publicDir, file),
    width: metadata.width,
    height: metadata.height,
    generated
  };
}

await mkdir(outputDir, { recursive: true });

const files = (await Promise.all(sourceDirs.map(walk))).flat();
const manifest = [];

for (const file of files) {
  manifest.push(await optimize(file));
}

console.log(JSON.stringify(manifest, null, 2));
