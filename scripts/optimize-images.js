#!/usr/bin/env node

const fs = require("node:fs/promises");
const { existsSync } = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const sharp = require("sharp");

const projectRoot = process.cwd();
const publicRoot = path.join(projectRoot, "public");
const sourceRoots = [path.join(publicRoot, "assets"), path.join(publicRoot, "images")];
const referenceRoots = [
  path.join(projectRoot, "app"),
  path.join(projectRoot, "components"),
  path.join(projectRoot, "data"),
  path.join(projectRoot, "lib")
];
const outputRoot = path.join(publicRoot, "assets-optimized");
const generatedRoot = path.join(projectRoot, "lib", "generated");
const manifestPath = path.join(generatedRoot, "optimized-image-manifest.json");
const inventoryPath = path.join(generatedRoot, "image-inventory.json");
const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".avif", ".webp"]);
const rasterExtensions = new Set([".jpg", ".jpeg", ".png", ".avif", ".webp"]);
const referenceExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".mdx"]);
const minimumBytes = 42 * 1024;
const variantWidths = [
  ["mobile", 828],
  ["tablet", 1280],
  ["desktop", 1920]
];

const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const dryRun = args.has("--dry-run");

function toUnixPath(value) {
  return value.split(path.sep).join("/");
}

function webPath(file) {
  return `/${toUnixPath(path.relative(publicRoot, file))}`;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function walk(directory) {
  if (!existsSync(directory)) return [];
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name === "_optimized" || entry.name === "assets-optimized") continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(fullPath)));
    else if (entry.isFile() && rasterExtensions.has(path.extname(entry.name).toLowerCase())) files.push(fullPath);
  }

  return files;
}

async function walkReferences(directory) {
  if (!existsSync(directory)) return [];
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === ".next") continue;
    const fullPath = path.join(directory, entry.name);
    const relative = toUnixPath(path.relative(projectRoot, fullPath));
    if (relative.startsWith("lib/generated/") || relative === "lib/public-assets.ts") continue;
    if (entry.isDirectory()) files.push(...(await walkReferences(fullPath)));
    else if (entry.isFile() && referenceExtensions.has(path.extname(entry.name).toLowerCase())) files.push(fullPath);
  }

  return files;
}

function slugFor(file) {
  const relative = path.relative(publicRoot, file);
  const parsed = path.parse(relative);
  const safeDir = parsed.dir.replace(/^assets\/?/, "").replace(/^images\/?/, "images/");
  const safeName = parsed.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "-");
  return { safeDir, safeName };
}

function outputPathFor(file, variant, format, hash) {
  const { safeDir, safeName } = slugFor(file);
  const version = hash.slice(0, 10);
  return path.join(outputRoot, safeDir, `${safeName}-${version}-${variant}.${format}`);
}

function recommendedFormat(metadata, ext) {
  if (metadata.hasAlpha || ext === ".png" && metadata.channels === 4) return "avif-with-png-original-fallback";
  if (metadata.width && metadata.width < 700 && ext === ".png") return "png-or-avif";
  return "avif-with-jpeg-fallback";
}

function recommendedWidths(metadata) {
  const width = metadata.width || 0;
  return {
    mobile: Math.min(width || 828, 828),
    tablet: Math.min(width || 1280, 1280),
    desktop: Math.min(width || 1920, 1920)
  };
}

async function fileHash(file) {
  const buffer = await fs.readFile(file);
  return crypto.createHash("sha1").update(buffer).digest("hex");
}

async function loadReferenceIndex() {
  const files = (await Promise.all(referenceRoots.map(walkReferences))).flat();
  const references = [];

  for (const file of files) {
    references.push({
      path: toUnixPath(path.relative(projectRoot, file)),
      text: await fs.readFile(file, "utf8")
    });
  }

  return references;
}

function findUsage(webAssetPath, referenceIndex) {
  const withoutLeadingSlash = webAssetPath.replace(/^\//, "");
  const basename = path.basename(webAssetPath);
  return [
    ...new Set(
      referenceIndex
        .filter((reference) => reference.text.includes(webAssetPath) || reference.text.includes(withoutLeadingSlash) || reference.text.includes(basename))
        .map((reference) => reference.path)
    )
  ].sort();
}

async function isCurrent(source, targets) {
  if (force) return false;
  const sourceStats = await fs.stat(source);
  for (const target of targets) {
    if (!existsSync(target)) return false;
    const targetStats = await fs.stat(target);
    if (targetStats.mtimeMs < sourceStats.mtimeMs) return false;
  }
  return true;
}

async function optimize(file, referenceIndex) {
  const ext = path.extname(file).toLowerCase();
  const stats = await fs.stat(file);
  const metadata = await sharp(file, { animated: false }).metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;
  const hash = await fileHash(file);
  const assetPath = webPath(file);
  const inventory = {
    path: assetPath,
    size: stats.size,
    width,
    height,
    format: ext.replace(".", ""),
    hash,
    duplicateHash: hash,
    recommendedOutputFormat: recommendedFormat(metadata, ext),
    recommendedDesktopWidth: recommendedWidths(metadata).desktop,
    recommendedMobileWidth: recommendedWidths(metadata).mobile,
    likelyFold: /hero|header|banner|above|intro|founder|journal|recipe-of-the-day/i.test(file) ? "above-or-near-fold" : "below-fold-or-shared",
    usedBy: [],
    flags: []
  };

  if (stats.size > 500 * 1024 && [".png", ".jpg", ".jpeg"].includes(ext)) inventory.flags.push("large-raster-over-500kb");
  if (stats.size > 800 * 1024 && /hero|home|about|sustainability|founder|journal|recipes/i.test(file)) inventory.flags.push("hero-or-editorial-over-800kb");
  if (ext === ".png" && !metadata.hasAlpha && stats.size > 250 * 1024) inventory.flags.push("png-photo-no-alpha");
  if (width > 2200) inventory.flags.push("wider-than-typical-display-need");

  inventory.usedBy = findUsage(assetPath, referenceIndex);
  if (!inventory.usedBy.length) inventory.flags.push("unused-candidate-static-search");

  const shouldGenerate =
    inventory.usedBy.length > 0 && supportedExtensions.has(ext) && stats.size >= minimumBytes && Math.max(width, height) >= 420;

  if (!shouldGenerate) return { inventory, manifestEntry: null, skipped: true };

  const variants = {};
  const outputs = [];
  for (const [name, targetWidth] of variantWidths) {
    const outputWidth = Math.min(width || targetWidth, targetWidth);
    const avifPath = outputPathFor(file, name, "avif", hash);
    const jpgPath = outputPathFor(file, name, "jpg", hash);
    outputs.push(avifPath, jpgPath);
    variants[name] = {
      width: outputWidth,
      avif: `/${toUnixPath(path.relative(publicRoot, avifPath))}`,
      jpg: `/${toUnixPath(path.relative(publicRoot, jpgPath))}`
    };
  }

  if (!dryRun && !(await isCurrent(file, outputs))) {
    for (const output of outputs) await fs.mkdir(path.dirname(output), { recursive: true });
    await Promise.all(
      variantWidths.flatMap(([name, targetWidth]) => {
        const outputWidth = Math.min(width || targetWidth, targetWidth);
        const base = sharp(file, { animated: false }).rotate().resize({ width: outputWidth, withoutEnlargement: true });
        return [
          base.clone().avif({ quality: name === "desktop" ? 64 : 60, effort: 5 }).toFile(outputPathFor(file, name, "avif", hash)),
          base.clone().jpeg({ quality: name === "desktop" ? 86 : 82, mozjpeg: true, progressive: true }).toFile(outputPathFor(file, name, "jpg", hash))
        ];
      })
    );
  }

  if (!dryRun) {
    for (const [name] of variantWidths) {
      const avifStats = await fs.stat(outputPathFor(file, name, "avif", hash));
      const jpgStats = await fs.stat(outputPathFor(file, name, "jpg", hash));
      variants[name].avifBytes = avifStats.size;
      variants[name].jpgBytes = jpgStats.size;
    }
  }

  return {
    inventory,
    manifestEntry: {
      src: inventory.path,
      width,
      height,
      originalBytes: stats.size,
      variants,
      fallback: inventory.path
    },
    skipped: false
  };
}

async function main() {
  const files = (await Promise.all(sourceRoots.map(walk))).flat();
  const referenceIndex = await loadReferenceIndex();
  const manifest = {};
  const inventory = [];
  let generatedCount = 0;
  let originalBytes = 0;
  let optimizedBytes = 0;

  for (const file of files) {
    const result = await optimize(file, referenceIndex);
    inventory.push(result.inventory);
    if (result.manifestEntry) {
      manifest[result.manifestEntry.src] = result.manifestEntry;
      generatedCount += 1;
      originalBytes += result.manifestEntry.originalBytes;
      if (!dryRun) {
        optimizedBytes += Object.values(result.manifestEntry.variants).reduce((sum, variant) => sum + variant.avifBytes + variant.jpgBytes, 0);
      }
      console.log(`${result.manifestEntry.src} ${formatBytes(result.manifestEntry.originalBytes)} -> variants ready`);
    }
  }

  const hashGroups = inventory.reduce((groups, item) => {
    groups[item.hash] = groups[item.hash] || [];
    groups[item.hash].push(item.path);
    return groups;
  }, {});

  for (const item of inventory) {
    const group = hashGroups[item.hash] || [];
    if (group.length > 1) item.duplicateGroup = group;
    if (group.length > 1) item.flags.push("duplicate-hash");
  }

  if (!dryRun) {
    await fs.mkdir(generatedRoot, { recursive: true });
    await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    await fs.writeFile(inventoryPath, `${JSON.stringify(inventory, null, 2)}\n`);
  }

  console.log(`Image pipeline complete: ${files.length} images scanned.`);
  console.log(`Variant candidates: ${generatedCount}.`);
  if (!dryRun) {
    console.log(`Original candidate bytes: ${formatBytes(originalBytes)}.`);
    console.log(`Generated variant bytes: ${formatBytes(optimizedBytes)}.`);
    console.log(`Manifest: ${toUnixPath(path.relative(projectRoot, manifestPath))}`);
    console.log(`Inventory: ${toUnixPath(path.relative(projectRoot, inventoryPath))}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
