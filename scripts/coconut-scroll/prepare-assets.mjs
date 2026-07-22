#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const [, , openingPath, finalPath] = process.argv;

if (!openingPath || !finalPath) {
  console.error("Usage: node scripts/coconut-scroll/prepare-assets.mjs <opening.png> <final.png>");
  process.exit(1);
}

const root = process.cwd();
const version = "v1";
const outputRoot = path.join(root, "public", "experience", "coconut-bottle", version);
const targets = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 720, height: 1280 },
];

async function sha256(filePath) {
  const contents = await readFile(filePath);
  return createHash("sha256").update(contents).digest("hex");
}

async function buildComposition(sourcePath, target, format) {
  const veil = Buffer.from(
    `<svg width="${target.width}" height="${target.height}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="veil" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f7efe0" stop-opacity=".3"/><stop offset=".32" stop-color="#f7efe0" stop-opacity=".04"/><stop offset=".7" stop-color="#f7efe0" stop-opacity=".03"/><stop offset="1" stop-color="#f7efe0" stop-opacity=".28"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#veil)"/></svg>`,
  );

  if (target.name === "mobile") {
    const mobilePipeline = sharp(sourcePath)
      .resize(target.width, target.height, { fit: "cover", position: "centre" })
      .composite([{ input: veil }]);
    if (format === "avif") return mobilePipeline.avif({ quality: 64, effort: 6 }).toBuffer();
    return mobilePipeline.jpeg({ quality: 84, mozjpeg: true }).toBuffer();
  }

  const background = await sharp(sourcePath)
    .resize(target.width, target.height, { fit: "cover" })
    .blur(22)
    .modulate({ brightness: 0.97, saturation: 0.9 })
    .toBuffer();

  const foregroundWidth = Math.round(target.width * 0.62);
  const resizedForeground = await sharp(sourcePath).resize({ width: foregroundWidth }).png().toBuffer();
  const resizedMetadata = await sharp(resizedForeground).metadata();
  const cropTop = Math.max(0, Math.round(((resizedMetadata.height ?? target.height) - target.height) / 2));
  const croppedForeground = await sharp(resizedForeground)
    .extract({ left: 0, top: cropTop, width: foregroundWidth, height: target.height })
    .toBuffer();
  const featherMask = Buffer.from(
    `<svg width="${foregroundWidth}" height="${target.height}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="feather"><stop offset="0" stop-color="white" stop-opacity="0"/><stop offset=".13" stop-color="white"/><stop offset=".87" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#feather)"/></svg>`,
  );
  const foreground = await sharp(croppedForeground)
    .ensureAlpha()
    .composite([{ input: featherMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const pipeline = sharp(background)
    .composite([
      { input: veil },
      { input: foreground, left: Math.round((target.width - foregroundWidth) / 2), top: 0 },
    ]);

  if (format === "avif") return pipeline.avif({ quality: 64, effort: 6 }).toBuffer();
  return pipeline.jpeg({ quality: 84, mozjpeg: true }).toBuffer();
}

async function main() {
  const sources = {
    opening: path.resolve(openingPath),
    final: path.resolve(finalPath),
  };
  const manifest = {
    version,
    generatedAt: new Date().toISOString(),
    generation: "Local Sharp composition; no external provider or generated branding",
    sources: {},
    outputs: [],
  };

  for (const [role, sourcePath] of Object.entries(sources)) {
    const metadata = await sharp(sourcePath).metadata();
    manifest.sources[role] = {
      filename: path.basename(sourcePath),
      width: metadata.width,
      height: metadata.height,
      sha256: await sha256(sourcePath),
    };
  }

  for (const target of targets) {
    const targetDirectory = path.join(outputRoot, target.name);
    await mkdir(targetDirectory, { recursive: true });
    for (const [role, sourcePath] of Object.entries(sources)) {
      for (const format of ["avif", "jpg"]) {
        const filename = `${role}.${format}`;
        const outputPath = path.join(targetDirectory, filename);
        const data = await buildComposition(sourcePath, target, format === "jpg" ? "jpeg" : format);
        await writeFile(outputPath, data);
        manifest.outputs.push({
          role,
          viewport: target.name,
          path: `/experience/coconut-bottle/${version}/${target.name}/${filename}`,
          width: target.width,
          height: target.height,
          bytes: data.byteLength,
          sha256: createHash("sha256").update(data).digest("hex"),
        });
      }
    }
  }

  await writeFile(path.join(outputRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  for (const output of manifest.outputs) {
    console.log(`${output.viewport}/${output.role}: ${(output.bytes / 1024).toFixed(1)} KiB (${output.path})`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
