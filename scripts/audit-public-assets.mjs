import { createHash } from "node:crypto";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const publicRoot = path.join(root, "public");
const reportRoot = path.join(root, "migration-reports", "inventory");
const cloudFrontBase = "https://media.cothecoconutcompany.com/site-media/v1";

const textExtensions = new Set([
  ".cjs", ".css", ".html", ".js", ".jsx", ".json", ".less", ".md", ".mdx",
  ".mjs", ".sass", ".scss", ".ts", ".tsx", ".webmanifest", ".xml",
]);
const ignoredDirectories = new Set([
  ".git", ".next", ".vercel", "assets-source", "graphify-out", "migration-reports", "node_modules",
]);
const imageExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"]);
const runtimeLocal = new Set([
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/apple-touch-icon.png",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/favicon.ico",
  "/google87b5a5382bb4f7a0.html",
  "/images/logo.svg",
  "/site.webmanifest",
  "/brand-reference/asset-manifest.json",
]);

const mimeByExtension = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webm": "video/webm",
  ".webmanifest": "application/manifest+json",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
};

async function walk(directory, options = {}) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && options.skipIgnored && ignoredDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await walk(absolute, options));
    else if (entry.isFile()) output.push(absolute);
  }
  return output;
}

function publicUrlFor(absolute) {
  return `/${path.relative(publicRoot, absolute).split(path.sep).join("/")}`;
}

function sourcePathFor(absolute) {
  return path.relative(root, absolute).split(path.sep).join("/");
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function lineNumberAt(text, index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) if (text.charCodeAt(i) === 10) line += 1;
  return line;
}

function allStringPaths(value, output = new Set()) {
  if (typeof value === "string" && value.startsWith("/")) output.add(value);
  else if (Array.isArray(value)) for (const item of value) allStringPaths(item, output);
  else if (value && typeof value === "object") for (const item of Object.values(value)) allStringPaths(item, output);
  return output;
}

function csvCell(value) {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

const publicFiles = await walk(publicRoot);
const sourceFiles = (await walk(root, { skipIgnored: true })).filter((file) => {
  if (file.startsWith(`${publicRoot}${path.sep}`)) return textExtensions.has(path.extname(file).toLowerCase());
  return textExtensions.has(path.extname(file).toLowerCase());
});

const sourceDocuments = [];
for (const absolute of sourceFiles) {
  try {
    sourceDocuments.push({ absolute, relative: sourcePathFor(absolute), text: await readFile(absolute, "utf8") });
  } catch {
    // Ignore non-text files with misleading extensions.
  }
}

const generatedRuntimePaths = new Set();
try {
  const optimized = JSON.parse(await readFile(path.join(root, "lib", "generated", "optimized-image-manifest.json"), "utf8"));
  for (const candidate of allStringPaths(optimized)) generatedRuntimePaths.add(candidate);
} catch (error) {
  console.warn(`Unable to inspect optimized image manifest: ${error.message}`);
}
try {
  const productManifest = JSON.parse(await readFile(path.join(publicRoot, "brand-reference", "asset-manifest.json"), "utf8"));
  for (const product of Object.values(productManifest.websiteProducts ?? {})) {
    if (typeof product.primary === "string") generatedRuntimePaths.add(product.primary);
    for (const item of product.gallery ?? []) if (typeof item.src === "string") generatedRuntimePaths.add(item.src);
  }
} catch (error) {
  console.warn(`Unable to inspect product asset manifest: ${error.message}`);
}
try {
  const manualAvailability = JSON.parse(await readFile(path.join(root, "lib", "generated", "manual-asset-availability.json"), "utf8"));
  for (const [candidate, available] of Object.entries(manualAvailability)) if (available) generatedRuntimePaths.add(candidate);
} catch (error) {
  console.warn(`Unable to inspect manual asset availability: ${error.message}`);
}

const assets = [];
for (const absolute of publicFiles) {
  const bytes = await readFile(absolute);
  const fileStat = await stat(absolute);
  const publicPath = publicUrlFor(absolute);
  const extension = path.extname(absolute).toLowerCase();
  const references = [];
  for (const document of sourceDocuments) {
    const variants = [publicPath, encodeURI(publicPath), decodeURI(publicPath)];
    const seen = new Set();
    for (const variant of variants) {
      let offset = 0;
      while (variant && (offset = document.text.indexOf(variant, offset)) !== -1) {
        const key = `${document.relative}:${offset}`;
        if (!seen.has(key)) references.push({ file: document.relative, line: lineNumberAt(document.text, offset), kind: "literal" });
        seen.add(key);
        offset += variant.length;
      }
    }
  }

  if (generatedRuntimePaths.has(publicPath)) references.push({ file: "generated-manifest", line: null, kind: "manifest" });

  let width = null;
  let height = null;
  if (imageExtensions.has(extension) && extension !== ".svg") {
    try {
      const metadata = await sharp(bytes, { animated: true }).metadata();
      width = metadata.width ?? null;
      height = metadata.height ?? null;
    } catch {
      // Dimensions remain null and the file is retained for manual review.
    }
  }

  let classification = "D-uncertain";
  let classificationReason = "No proven runtime reference or archive rule";
  if (runtimeLocal.has(publicPath)) {
    classification = "B-runtime-local";
    classificationReason = "Small root/build-time asset with local URL semantics";
  } else if (generatedRuntimePaths.has(publicPath) || references.some((reference) => reference.kind === "literal" && !reference.file.startsWith("scripts/") && !reference.file.startsWith("public/"))) {
    classification = "A-runtime-remote";
    classificationReason = generatedRuntimePaths.has(publicPath) ? "Selected by a runtime asset manifest" : "Referenced by application/runtime content";
  } else if (publicPath.includes("/.DS_Store") || publicPath.endsWith("/.gitkeep") || publicPath.endsWith(".md")) {
    classification = "C-archive-source";
    classificationReason = "Non-runtime repository/source artifact";
  } else if (publicPath.startsWith("/brand-reference/")) {
    classification = "C-archive-source";
    classificationReason = "Unreferenced brand master; excluded from public delivery pending archive handling";
  }

  assets.push({
    relativePath: sourcePathFor(absolute),
    publicPath,
    filename: path.basename(absolute),
    extension: extension.slice(1),
    mimeType: mimeByExtension[extension] ?? "application/octet-stream",
    byteSize: fileStat.size,
    width,
    height,
    sha256: sha256(bytes),
    duplicateGroup: null,
    animationFrame: null,
    derivativeOrMaster: /(?:_MASTER|master)/i.test(path.basename(absolute)) ? "master" : publicPath.startsWith("/assets-optimized/") || /-(?:mobile|tablet|desktop)\.(?:avif|jpe?g|webp)$/i.test(publicPath) ? "web-derivative" : "unspecified",
    referenced: references.length > 0,
    references,
    classification,
    classificationReason,
    mustRemainLocal: classification === "B-runtime-local",
    proposedS3Key: classification === "A-runtime-remote" ? `site-media/v1${publicPath}` : null,
    proposedCloudFrontUrl: classification === "A-runtime-remote" ? `${cloudFrontBase}${publicPath}` : null,
    migrationStatus: classification === "A-runtime-remote" ? "planned" : "not-planned",
  });
}

const hashes = new Map();
for (const asset of assets) {
  const group = hashes.get(asset.sha256) ?? [];
  group.push(asset);
  hashes.set(asset.sha256, group);
}
let duplicateIndex = 0;
for (const group of hashes.values()) {
  if (group.length < 2) continue;
  duplicateIndex += 1;
  for (const asset of group) asset.duplicateGroup = `duplicate-${String(duplicateIndex).padStart(3, "0")}`;
}

assets.sort((a, b) => a.publicPath.localeCompare(b.publicPath));
const classifications = {};
for (const asset of assets) {
  const bucket = classifications[asset.classification] ?? { files: 0, bytes: 0 };
  bucket.files += 1;
  bucket.bytes += asset.byteSize;
  classifications[asset.classification] = bucket;
}
const duplicateGroups = [...hashes.values()].filter((group) => group.length > 1);
const duplicateRecoverableBytes = duplicateGroups.reduce((sum, group) => sum + group.slice(1).reduce((subtotal, asset) => subtotal + asset.byteSize, 0), 0);
const directoryStats = new Map();
for (const asset of assets) {
  const directory = path.posix.dirname(asset.publicPath);
  const value = directoryStats.get(directory) ?? { directory, files: 0, bytes: 0 };
  value.files += 1;
  value.bytes += asset.byteSize;
  directoryStats.set(directory, value);
}

const summary = {
  generatedAt: new Date().toISOString(),
  publicRoot: "public/",
  total: { files: assets.length, bytes: assets.reduce((sum, asset) => sum + asset.byteSize, 0) },
  classifications,
  exactDuplicateGroups: duplicateGroups.length,
  exactDuplicateFiles: duplicateGroups.reduce((sum, group) => sum + group.length, 0),
  exactDuplicateRecoverableBytes: duplicateRecoverableBytes,
  dynamicPatterns: [
    {
      source: "lib/website-assets.ts and lib/generated/manual-asset-availability.json",
      pattern: "/images/website/manual/**/{name}_{DESKTOP|MOBILE}_MASTER.webp",
    },
    {
      source: "components/media/ResponsiveImage.tsx and lib/generated/optimized-image-manifest.json",
      pattern: "/assets source mapped to /assets-optimized responsive variants",
    },
    {
      source: "lib/website-assets.ts and public/brand-reference/asset-manifest.json",
      pattern: "/images/website/products/{product}/{ordinal}-{view}.webp",
    },
  ],
  largestFiles: [...assets].sort((a, b) => b.byteSize - a.byteSize).slice(0, 100).map(({ publicPath, byteSize, classification }) => ({ publicPath, byteSize, classification })),
  directoriesBySize: [...directoryStats.values()].sort((a, b) => b.bytes - a.bytes),
  directoriesByFileCount: [...directoryStats.values()].sort((a, b) => b.files - a.files),
};

await writeFile(path.join(reportRoot, "public-assets.json"), `${JSON.stringify({ summary, assets }, null, 2)}\n`);
const csvHeaders = ["relativePath", "publicPath", "filename", "extension", "mimeType", "byteSize", "width", "height", "sha256", "duplicateGroup", "derivativeOrMaster", "referenced", "references", "classification", "classificationReason", "mustRemainLocal", "proposedS3Key", "proposedCloudFrontUrl", "migrationStatus"];
await writeFile(path.join(reportRoot, "public-assets.csv"), `${csvHeaders.join(",")}\n${assets.map((asset) => csvHeaders.map((header) => csvCell(asset[header])).join(",")).join("\n")}\n`);

const lines = [
  "# Public asset inventory",
  "",
  `Generated: ${summary.generatedAt}`,
  "",
  `- Total: ${summary.total.files.toLocaleString()} files / ${summary.total.bytes.toLocaleString()} bytes`,
  ...Object.entries(classifications).sort().map(([name, value]) => `- ${name}: ${value.files.toLocaleString()} files / ${value.bytes.toLocaleString()} bytes`),
  `- Exact duplicate groups: ${summary.exactDuplicateGroups.toLocaleString()}`,
  `- Exact duplicate files: ${summary.exactDuplicateFiles.toLocaleString()}`,
  `- Exact duplicate recoverable bytes: ${summary.exactDuplicateRecoverableBytes.toLocaleString()}`,
  "",
  "## Dynamic patterns",
  "",
  ...summary.dynamicPatterns.map((item) => `- ${item.pattern} (${item.source})${item.expectedFiles ? ` — ${item.expectedFiles} expected files` : ""}`),
  "",
  "## Largest files",
  "",
  "| Bytes | Classification | Public path |",
  "| ---: | --- | --- |",
  ...summary.largestFiles.map((item) => `| ${item.byteSize.toLocaleString()} | ${item.classification} | \`${item.publicPath}\` |`),
  "",
  "## Directories by size",
  "",
  "| Bytes | Files | Directory |",
  "| ---: | ---: | --- |",
  ...summary.directoriesBySize.map((item) => `| ${item.bytes.toLocaleString()} | ${item.files.toLocaleString()} | \`${item.directory}\` |`),
  "",
  "## Classification caution",
  "",
  "`D-uncertain` assets remain local until their runtime status is resolved. `C-archive-source` assets are not approved for public CloudFront delivery and are not deleted by this audit.",
  "",
];
await writeFile(path.join(reportRoot, "PUBLIC_ASSETS_SUMMARY.md"), lines.join("\n"));

console.log(JSON.stringify(summary, null, 2));
