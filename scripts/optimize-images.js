#!/usr/bin/env node

const fs = require("node:fs/promises");
const { existsSync } = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const projectRoot = process.cwd();
const sourceRoot = path.join(projectRoot, "public", "assets");
const outputRoot = path.join(sourceRoot, "_optimized");
const supportedExtensions = new Set([".jpg", ".jpeg", ".png"]);
const minimumBytes = 180 * 1024;
const minimumDimension = 560;

const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const dryRun = args.has("--dry-run");

function toUnixPath(value) {
  return value.split(path.sep).join("/");
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
    if (entry.name.startsWith(".") || entry.name === "_optimized") continue;

    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    if (entry.isFile() && supportedExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

function outputPathsFor(file) {
  const relative = path.relative(sourceRoot, file);
  const parsed = path.parse(relative);
  const safeName = parsed.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "-");
  const outputDirectory = path.join(outputRoot, parsed.dir);

  return {
    outputDirectory,
    jpg: path.join(outputDirectory, `${safeName}.jpg`),
    webp: path.join(outputDirectory, `${safeName}.webp`),
    avif: path.join(outputDirectory, `${safeName}.avif`)
  };
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

async function optimize(file) {
  const inputStats = await fs.stat(file);
  if (inputStats.size < minimumBytes) return null;

  const image = sharp(file, { animated: false }).rotate();
  const metadata = await image.metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;

  if (Math.max(width, height) < minimumDimension) return null;

  const maxWidth = Math.min(width || 1920, 1920);
  const outputs = outputPathsFor(file);
  const targetPaths = [outputs.jpg, outputs.webp, outputs.avif];

  if (await isCurrent(file, targetPaths)) {
    return {
      source: toUnixPath(path.relative(projectRoot, file)),
      skipped: "current",
      original: inputStats.size,
      outputs: targetPaths.map((target) => toUnixPath(path.relative(projectRoot, target)))
    };
  }

  if (dryRun) {
    return {
      source: toUnixPath(path.relative(projectRoot, file)),
      skipped: "dry-run",
      original: inputStats.size,
      width,
      height,
      outputs: targetPaths.map((target) => toUnixPath(path.relative(projectRoot, target)))
    };
  }

  await fs.mkdir(outputs.outputDirectory, { recursive: true });

  const resized = sharp(file, { animated: false })
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true });

  await Promise.all([
    resized.clone().jpeg({ quality: 84, mozjpeg: true, progressive: true }).toFile(outputs.jpg),
    resized.clone().webp({ quality: 82, effort: 5 }).toFile(outputs.webp),
    resized.clone().avif({ quality: 62, effort: 5 }).toFile(outputs.avif)
  ]);

  const generated = await Promise.all(
    targetPaths.map(async (target) => {
      const stats = await fs.stat(target);
      return {
        path: toUnixPath(path.relative(projectRoot, target)),
        size: stats.size
      };
    })
  );

  return {
    source: toUnixPath(path.relative(projectRoot, file)),
    original: inputStats.size,
    width,
    height,
    generated
  };
}

async function main() {
  const files = await walk(sourceRoot);
  const results = [];

  for (const file of files) {
    const result = await optimize(file);
    if (result) results.push(result);
  }

  const optimized = results.filter((result) => result.generated);
  const skipped = results.filter((result) => result.skipped);
  const originalBytes = optimized.reduce((total, result) => total + result.original, 0);
  const generatedBytes = optimized.reduce(
    (total, result) => total + result.generated.reduce((sum, item) => sum + item.size, 0),
    0
  );

  console.log(`Image scan complete: ${files.length} source images checked.`);
  console.log(`Optimized: ${optimized.length}; skipped/current/dry-run: ${skipped.length}.`);

  if (optimized.length > 0) {
    console.log(`Original optimized-source size: ${formatBytes(originalBytes)}.`);
    console.log(`Generated static variants size: ${formatBytes(generatedBytes)}.`);
  }

  for (const result of results) {
    if (result.generated) {
      const smallest = result.generated.reduce((best, item) => (item.size < best.size ? item : best));
      console.log(`${result.source} ${formatBytes(result.original)} -> best ${formatBytes(smallest.size)} (${smallest.path})`);
    } else {
      console.log(`${result.source} skipped (${result.skipped}).`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
