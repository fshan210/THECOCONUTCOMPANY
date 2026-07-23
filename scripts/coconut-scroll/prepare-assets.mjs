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
const version = "v2";
const frameCount = 12;
const outputRoot = path.join(root, "public", "experience", "coconut-bottle", version);
const targets = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 720, height: 1280 },
];

async function sha256(filePath) {
  const contents = await readFile(filePath);
  return createHash("sha256").update(contents).digest("hex");
}

async function normalize(sourcePath, target) {
  if (target.name === "mobile") {
    return sharp(sourcePath)
      .resize(target.width, target.height, { fit: "cover", position: "centre" })
      .jpeg({ quality: 90, mozjpeg: true })
      .toBuffer();
  }

  const background = await sharp(sourcePath)
    .resize(target.width, target.height, { fit: "cover" })
    .blur(22)
    .modulate({ brightness: 0.97, saturation: 0.9 })
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();
  const foregroundWidth = Math.round(target.width * 0.62);
  const foreground = await sharp(sourcePath)
    .resize({ width: foregroundWidth })
    .extract({
      left: 0,
      top: Math.max(0, Math.round((((await sharp(sourcePath).resize({ width: foregroundWidth }).metadata()).height ?? target.height) - target.height) / 2)),
      width: foregroundWidth,
      height: target.height,
    })
    .ensureAlpha()
    .composite([{
      input: Buffer.from(`<svg width="${foregroundWidth}" height="${target.height}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="f"><stop offset="0" stop-color="white" stop-opacity="0"/><stop offset=".13" stop-color="white"/><stop offset=".87" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#f)"/></svg>`),
      blend: "dest-in",
    }])
    .png()
    .toBuffer();

  return sharp(background)
    .composite([{ input: foreground, left: Math.round((target.width - foregroundWidth) / 2), top: 0 }])
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();
}

function storyOverlay(target, index) {
  if (index < 2 || index > 10) return null;
  const mobile = target.name === "mobile";
  const cx = target.width / 2;
  const seamY = mobile ? 520 : 303;
  const seamHalf = mobile ? 150 : 238;
  const stream = index >= 4 && index <= 9 ? Math.min(1, (index - 3) / 2, (10 - index) / 2) : 0;
  const streamLength = mobile ? 420 : 330;
  return Buffer.from(`<svg width="${target.width}" height="${target.height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="water" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#ffffff" stop-opacity=".94"/><stop offset=".55" stop-color="#d7ead5" stop-opacity=".72"/><stop offset="1" stop-color="#ffffff" stop-opacity=".08"/></linearGradient>
      <filter id="soft"><feGaussianBlur stdDeviation="${mobile ? 1.8 : 2.4}"/></filter>
    </defs>
    <path d="M ${cx - seamHalf} ${seamY} Q ${cx} ${seamY - (mobile ? 26 : 18)} ${cx + seamHalf} ${seamY}" fill="none" stroke="#274b25" stroke-opacity="${index <= 6 ? Math.min(0.58, (index - 1) * 0.18) : 0}" stroke-width="${mobile ? 3 : 4}" stroke-linecap="round"/>
    <path d="M ${cx} ${seamY - 3} C ${cx - (mobile ? 18 : 12)} ${seamY + streamLength * .28}, ${cx + (mobile ? 13 : 9)} ${seamY + streamLength * .61}, ${cx} ${seamY + streamLength}" fill="none" stroke="url(#water)" stroke-opacity="${stream}" stroke-width="${mobile ? 16 : 18}" stroke-linecap="round" filter="url(#soft)"/>
    <path d="M ${cx} ${seamY} C ${cx + 4} ${seamY + streamLength * .34}, ${cx - 5} ${seamY + streamLength * .66}, ${cx} ${seamY + streamLength}" fill="none" stroke="#fff" stroke-opacity="${stream * .78}" stroke-width="2" stroke-linecap="round"/>
  </svg>`);
}

function transitionVeil(target, index) {
  if (index < 4 || index > 9) return null;
  const mobile = target.name === "mobile";
  const cx = target.width / 2;
  const cy = mobile ? 650 : 470;
  const opacityByFrame = { 4: 0.78, 5: 1, 6: 1, 7: 0.76, 8: 0.42, 9: 0.12 };
  const opacity = opacityByFrame[index] ?? 0;
  const radiusX = mobile ? 460 : 660;
  const radiusY = mobile ? 700 : 500;
  return Buffer.from(`<svg width="${target.width}" height="${target.height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="veil"><stop offset="0" stop-color="#f8f3e9" stop-opacity="${opacity}"/><stop offset=".58" stop-color="#ead8b8" stop-opacity="${opacity * .96}"/><stop offset="1" stop-color="#d7ead5" stop-opacity="0"/></radialGradient>
      <filter id="water-blur"><feGaussianBlur stdDeviation="${mobile ? 22 : 28}"/></filter>
    </defs>
    <ellipse cx="${cx}" cy="${cy}" rx="${radiusX}" ry="${radiusY}" fill="url(#veil)" filter="url(#water-blur)"/>
    <path d="M ${cx - (mobile ? 76 : 96)} ${cy - radiusY * .54} C ${cx - 24} ${cy - 20}, ${cx + 42} ${cy + radiusY * .2}, ${cx + (mobile ? 66 : 90)} ${cy + radiusY * .68}" fill="none" stroke="#fff" stroke-opacity="${opacity * .78}" stroke-width="${mobile ? 9 : 12}" stroke-linecap="round" filter="url(#water-blur)"/>
  </svg>`);
}

function geometry(target) {
  const mobile = target.name === "mobile";
  return mobile ? {
    floorY: 846,
    patch: { left: 46, top: 270, width: 628, height: 790 },
    sample: { left: 34, top: 270, width: 92, height: 790 },
    coconut: { left: 116, top: 388, width: 492, height: 624 },
    seamLocalY: 132,
    bottle: { left: 142, top: 350, width: 380, height: 690 },
  } : {
    floorY: 640,
    patch: { left: 340, top: 90, width: 760, height: 720 },
    sample: { left: 270, top: 90, width: 120, height: 720 },
    coconut: { left: 450, top: 138, width: 525, height: 598 },
    seamLocalY: 166,
    bottle: { left: 492, top: 122, width: 390, height: 740 },
  };
}

async function maskCrop(source, box, svgBody) {
  const mask = Buffer.from(`<svg width="${box.width}" height="${box.height}" xmlns="http://www.w3.org/2000/svg"><defs><filter id="feather" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="1.4"/></filter></defs><g filter="url(#feather)">${svgBody}</g></svg>`);
  return sharp(source)
    .extract(box)
    .ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

async function greenScreenCrop(source, box, split, seamY) {
  const { data, info } = await sharp(source)
    .extract(box)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const offset = (y * info.width + x) * info.channels;
      const red = data[offset];
      const green = data[offset + 1];
      const blue = data[offset + 2];
      const dominance = green - red * 0.82 - blue * 0.08;
      const chromaAlpha = Math.max(0, Math.min(255, Math.round((dominance - 2) * 10)));
      const splitAlpha = split === "upper"
        ? (y <= seamY + 8 ? 255 : 0)
        : (y >= seamY ? 255 : 0);
      data[offset + 3] = Math.min(chromaAlpha, splitAlpha);
    }
  }

  return sharp(data, { raw: info }).png().toBuffer();
}

async function prepareLayers(opening, final, target) {
  const g = geometry(target);
  const stripWidth = target.name === "mobile" ? 78 : 300;
  const wall = await sharp(opening)
    .extract({ left: 0, top: 0, width: stripWidth, height: g.floorY })
    .resize(target.width, g.floorY, { fit: "fill" })
    .blur(target.name === "mobile" ? 5 : 7)
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();
  const floor = await sharp(opening)
    .extract({ left: 0, top: g.floorY, width: stripWidth, height: target.height - g.floorY })
    .resize(target.width, target.height - g.floorY, { fit: "fill" })
    .blur(target.name === "mobile" ? 2.4 : 3.2)
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();
  const background = await sharp({ create: { width: target.width, height: target.height, channels: 3, background: "#d9b986" } })
    .composite([{ input: wall, left: 0, top: 0 }, { input: floor, left: 0, top: g.floorY }])
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();

  const body = await greenScreenCrop(opening, g.coconut, "lower", g.seamLocalY);
  const crown = await greenScreenCrop(opening, g.coconut, "upper", g.seamLocalY);

  const { width: bw, height: bh } = g.bottle;
  const bottle = await maskCrop(final, g.bottle, `<path d="M ${bw * .28} ${bh * .06} Q ${bw * .5} ${bh * .01} ${bw * .72} ${bh * .06} L ${bw * .78} ${bh * .22} Q ${bw * .85} ${bh * .28} ${bw * .85} ${bh * .42} L ${bw * .85} ${bh * .94} Q ${bw * .5} ${bh} ${bw * .18} ${bh * .94} L ${bw * .18} ${bh * .34} Q ${bw * .2} ${bh * .25} ${bw * .3} ${bh * .2} Z" fill="white"/><path d="M ${bw * .02} ${bh * .22} L ${bw * .48} ${bh * .17} L ${bw * .45} ${bh * .62} L 0 ${bh * .58} Z" fill="white"/>`);
  return { background, body, crown, bottle, geometry: g };
}

async function buildFrame(opening, final, target, _layers, index) {
  if (index === 0 || index === 1) return opening;
  if (index === frameCount - 1) return final;
  const source = index <= 5 ? opening : final;
  const composites = [];
  const overlay = storyOverlay(target, index);
  if (overlay) composites.push({ input: overlay });
  const veil = transitionVeil(target, index);
  if (veil) composites.push({ input: veil });
  return sharp(source).composite(composites).jpeg({ quality: 90, mozjpeg: true }).toBuffer();
}

async function encode(buffer, format) {
  return format === "avif"
    ? sharp(buffer).avif({ quality: 62, effort: 6 }).toBuffer()
    : sharp(buffer).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
}

async function main() {
  const sources = { opening: path.resolve(openingPath), final: path.resolve(finalPath) };
  const manifest = {
    version,
    frameCount,
    generatedAt: new Date().toISOString(),
    generation: "Local Sharp frame sequence; no external provider; finished bottle pixels are sourced only from the approved final artwork",
    sources: {},
    outputs: [],
  };
  for (const [role, sourcePath] of Object.entries(sources)) {
    const metadata = await sharp(sourcePath).metadata();
    manifest.sources[role] = { filename: path.basename(sourcePath), width: metadata.width, height: metadata.height, sha256: await sha256(sourcePath) };
  }

  for (const target of targets) {
    const directory = path.join(outputRoot, target.name);
    await mkdir(directory, { recursive: true });
    const opening = await normalize(sources.opening, target);
    const final = await normalize(sources.final, target);
    const layers = await prepareLayers(opening, final, target);
    for (let index = 0; index < frameCount; index += 1) {
      const raw = await buildFrame(opening, final, target, layers, index);
      for (const format of ["avif", "jpg"]) {
        const data = await encode(raw, format);
        const filename = `frame-${String(index).padStart(2, "0")}.${format}`;
        await writeFile(path.join(directory, filename), data);
        manifest.outputs.push({ viewport: target.name, frame: index, path: `/experience/coconut-bottle/${version}/${target.name}/${filename}`, width: target.width, height: target.height, bytes: data.byteLength, sha256: createHash("sha256").update(data).digest("hex") });
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
