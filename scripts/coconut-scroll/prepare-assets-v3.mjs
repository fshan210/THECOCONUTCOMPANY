#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const [, , startPath, openingPath, splitPath, finalPath] = process.argv;

if (![startPath, openingPath, splitPath, finalPath].every(Boolean)) {
  console.error("Usage: node scripts/coconut-scroll/prepare-assets-v3.mjs <start.png> <opening.png> <split.png> <final.png>");
  process.exit(1);
}

const version = "v3";
const frameCount = 18;
const root = process.cwd();
const outputRoot = path.join(root, "public", "experience", "coconut-bottle", version);
const targets = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 720, height: 1280 },
];

const steps = [
  { source: "start", mix: 0 },
  { source: "start", mix: 0 },
  { source: "start", mix: 0 },
  { source: "start-opening", mix: 0.34 },
  { source: "start-opening", mix: 0.7 },
  { source: "opening", mix: 0 },
  { source: "opening", mix: 0 },
  { source: "opening-split", mix: 0.34 },
  { source: "opening-split", mix: 0.7 },
  { source: "split", mix: 0 },
  { source: "split", mix: 0, veil: 0.42 },
  { source: "empty", mix: 0, veil: 0.94 },
  { source: "final", mix: 0, veil: 0.78 },
  { source: "final", mix: 0, veil: 0.46 },
  { source: "final", mix: 0, veil: 0.16 },
  { source: "final", mix: 0 },
  { source: "final", mix: 0 },
  { source: "final", mix: 0 },
];

function hash(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

async function sha256(filePath) {
  return hash(await readFile(filePath));
}

async function normalize(sourcePath, target) {
  if (target.name === "mobile") {
    return sharp(sourcePath)
      .resize(target.width, target.height, { fit: "cover", position: "centre" })
      .png()
      .toBuffer();
  }

  const background = await sharp(sourcePath)
    .resize(target.width, target.height, { fit: "cover", position: "centre" })
    .blur(24)
    .modulate({ brightness: 0.98, saturation: 0.9 })
    .png()
    .toBuffer();
  const foregroundWidth = Math.round(target.width * 0.625);
  const resized = sharp(sourcePath).resize({ width: foregroundWidth });
  const metadata = await resized.metadata();
  const resizedHeight = metadata.height ?? target.height;
  const foreground = await resized
    .extract({ left: 0, top: Math.max(0, Math.round((resizedHeight - target.height) / 2)), width: foregroundWidth, height: target.height })
    .ensureAlpha()
    .composite([{ input: Buffer.from(`<svg width="${foregroundWidth}" height="${target.height}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="edge"><stop stop-color="white" stop-opacity="0"/><stop offset=".09" stop-color="white"/><stop offset=".91" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#edge)"/></svg>`), blend: "dest-in" }])
    .png()
    .toBuffer();

  return sharp(background)
    .composite([{ input: foreground, left: Math.round((target.width - foregroundWidth) / 2), top: 0 }])
    .png()
    .toBuffer();
}

async function emptyScene(sourcePath, target) {
  const metadata = await sharp(sourcePath).metadata();
  const sourceWidth = metadata.width ?? 1024;
  const sourceHeight = metadata.height ?? 1536;
  const strip = await sharp(sourcePath)
    .extract({ left: 0, top: 0, width: Math.max(96, Math.round(sourceWidth * 0.2)), height: sourceHeight })
    .resize(target.width, target.height, { fit: "fill" })
    .blur(target.name === "mobile" ? 18 : 24)
    .modulate({ brightness: 1.08, saturation: 0.72 })
    .png()
    .toBuffer();
  return sharp(strip)
    .composite([{ input: Buffer.from(`<svg width="${target.width}" height="${target.height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f4ead8" fill-opacity=".38"/></svg>`) }])
    .png()
    .toBuffer();
}

async function mix(first, second, opacity) {
  const overlay = await sharp(second)
    .ensureAlpha(opacity)
    .png()
    .toBuffer();
  return sharp(first).composite([{ input: overlay, blend: "over" }]).png().toBuffer();
}

function waterVeil(target, opacity) {
  const centerX = target.width / 2;
  const centerY = target.name === "mobile" ? target.height * 0.54 : target.height * 0.52;
  const rx = target.name === "mobile" ? target.width * 0.8 : target.width * 0.48;
  const ry = target.name === "mobile" ? target.height * 0.7 : target.height * 0.72;
  return Buffer.from(`<svg width="${target.width}" height="${target.height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="wash"><stop offset="0" stop-color="#fffdf8" stop-opacity="${opacity}"/><stop offset=".54" stop-color="#f4ead8" stop-opacity="${opacity * 0.96}"/><stop offset="1" stop-color="#d9ead8" stop-opacity="0"/></radialGradient>
      <linearGradient id="stream" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#fff" stop-opacity="${Math.min(1, opacity + 0.14)}"/><stop offset=".62" stop-color="#d8ece5" stop-opacity="${opacity * 0.8}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <filter id="soft"><feGaussianBlur stdDeviation="${target.name === "mobile" ? 13 : 17}"/></filter>
    </defs>
    <ellipse cx="${centerX}" cy="${centerY}" rx="${rx}" ry="${ry}" fill="url(#wash)" filter="url(#soft)"/>
    <path d="M ${centerX - 24} ${centerY - ry * 0.72} C ${centerX + 18} ${centerY - 70}, ${centerX - 14} ${centerY + 70}, ${centerX + 20} ${centerY + ry * 0.72}" fill="none" stroke="url(#stream)" stroke-width="${target.name === "mobile" ? 38 : 46}" stroke-linecap="round" filter="url(#soft)"/>
    <path d="M ${centerX} ${centerY - ry * 0.8} C ${centerX - 7} ${centerY - 20}, ${centerX + 8} ${centerY + 30}, ${centerX} ${centerY + ry * 0.74}" fill="none" stroke="#fff" stroke-opacity="${opacity * 0.88}" stroke-width="${target.name === "mobile" ? 6 : 8}" stroke-linecap="round"/>
  </svg>`);
}

async function buildFrame(masters, target, step) {
  let frame;
  if (step.source === "start-opening") frame = await mix(masters.start, masters.opening, step.mix);
  else if (step.source === "opening-split") frame = await mix(masters.opening, masters.split, step.mix);
  else frame = masters[step.source];
  if (step.veil) frame = await sharp(frame).composite([{ input: waterVeil(target, step.veil) }]).png().toBuffer();
  return frame;
}

async function encode(buffer, format) {
  return format === "avif"
    ? sharp(buffer).avif({ quality: 65, effort: 6 }).toBuffer()
    : sharp(buffer).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
}

async function main() {
  const sources = {
    start: path.resolve(startPath),
    opening: path.resolve(openingPath),
    split: path.resolve(splitPath),
    final: path.resolve(finalPath),
  };
  const manifest = {
    version,
    frameCount,
    generatedAt: new Date().toISOString(),
    generation: "Scroll World seam-controlled local Sharp pipeline; endpoint artwork locked; two controlled image-generation continuity plates; no paid provider",
    seamPolicy: "Coconut and bottle silhouettes are never directly crossfaded. A near-opaque water veil and object-free bridge separate the handoff.",
    sources: {},
    outputs: [],
  };

  for (const [role, sourcePath] of Object.entries(sources)) {
    const metadata = await sharp(sourcePath).metadata();
    manifest.sources[role] = { filename: path.basename(sourcePath), width: metadata.width, height: metadata.height, sha256: await sha256(sourcePath) };
  }

  await mkdir(outputRoot, { recursive: true });
  for (const target of targets) {
    const directory = path.join(outputRoot, target.name);
    await mkdir(directory, { recursive: true });
    const masters = {
      start: await normalize(sources.start, target),
      opening: await normalize(sources.opening, target),
      split: await normalize(sources.split, target),
      final: await normalize(sources.final, target),
      empty: await emptyScene(sources.start, target),
    };
    for (let index = 0; index < frameCount; index += 1) {
      const raw = await buildFrame(masters, target, steps[index]);
      for (const format of ["avif", "jpg"]) {
        const data = await encode(raw, format);
        const filename = `frame-${String(index).padStart(2, "0")}.${format}`;
        await writeFile(path.join(directory, filename), data);
        manifest.outputs.push({ viewport: target.name, frame: index, path: `/experience/coconut-bottle/${version}/${target.name}/${filename}`, width: target.width, height: target.height, bytes: data.byteLength, sha256: hash(data) });
      }
    }
  }
  await writeFile(path.join(outputRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  for (const viewport of targets.map((target) => target.name)) {
    const outputs = manifest.outputs.filter((item) => item.viewport === viewport);
    console.log(`${viewport}: ${(outputs.reduce((sum, item) => sum + item.bytes, 0) / 1024).toFixed(1)} KiB (${outputs.length} files)`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
