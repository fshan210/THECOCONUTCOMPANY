import { createHash } from "node:crypto";
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const sourceRoot = path.join(root, "public/brand-reference");
const outputRoot = path.join(root, "public/images/website/products");
const manualRoot = path.join(root, "public/images/website/manual");

const products = [
  { id: "water", family: "Coconut Water", name: ".CO Coconut Water", folder: "coconut-water", match: /coconut-water\//i, card: /packshot-front/i },
  { id: "melt", family: "MELT", name: "MELT Coconut Gelato", folder: "melt", match: /melt\//i, card: /packshot-front/i },
  { id: "kitchen-oil", family: ".CO Kitchen", name: ".CO Kitchen Virgin Coconut Oil", folder: "kitchen-oil", match: /kitchen\/coconut-oil\//i, card: /Ecommerce_Primary/i },
  { id: "kitchen-flour", family: ".CO Kitchen", name: ".CO Kitchen Coconut Flour", folder: "kitchen-flour", match: /kitchen\/coconut-flour\//i, card: /Ecommerce_Primary/i },
  { id: "kitchen-milk", family: ".CO Kitchen", name: ".CO Kitchen Coconut Milk", folder: "kitchen-milk", match: /kitchen\/coconut-milk\//i, card: /Ecommerce_Primary/i },
  { id: "botanica-shampoo", family: "BOTANiCA", name: "BOTANiCA Shampoo", folder: "botanica-shampoo", match: /botanica\/shampoo\//i, card: /Product_Detail/i },
  { id: "botanica-face-wash", family: "BOTANiCA", name: "BOTANiCA Face Wash", folder: "botanica-face-wash", match: /botanica\/facewash\//i, card: /Ecommerce_Primary/i },
  { id: "botanica-hair-serum", family: "BOTANiCA", name: "BOTANiCA Hair Serum", folder: "botanica-hair-serum", match: /botanica\/hair-serum\//i, card: /Front_Master/i },
  { id: "botanica-moisturizer", family: "BOTANiCA", name: "BOTANiCA Body Moisturizer", folder: "botanica-moisturizer", match: /botanica\/Moisturiser\//i, card: /Ecommerce_Primary/i },
];

function viewType(file) {
  const rules = [
    [/(ecommerce|primary_packshot)/i, "ecommerce"], [/(three.quarter|angle)/i, "three-quarter"],
    [/_back_|back-master/i, "back"], [/(left.side|left_side)/i, "left-side"], [/(right.side|right_side)/i, "right-side"],
    [/macro/i, "macro"], [/(usage|application|ritual|pour|dispense)/i, "usage"],
    [/(ingredient|benefit|harmony|science)/i, "ingredient-benefit"], [/(lifestyle|campaign|hero|editorial)/i, "lifestyle"],
    [/(front|packaging.design|product.detail)/i, "front"], [/floating/i, "floating"],
  ];
  return rules.find(([pattern]) => pattern.test(file))?.[1] ?? "reference";
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const output = [];
  for (const entry of entries) {
    if (entry.name === ".DS_Store" || entry.name === ".gitkeep") continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await walk(absolute));
    else if (/\.(png|jpe?g|webp|avif)$/i.test(entry.name)) output.push(absolute);
  }
  return output;
}

const files = await walk(sourceRoot);
const inventory = [];
for (const absolute of files) {
  const relative = path.relative(sourceRoot, absolute).split(path.sep).join("/");
  const product = products.find((item) => item.match.test(relative));
  const metadata = await sharp(absolute).metadata();
  const bytes = (await stat(absolute)).size;
  inventory.push({
    id: createHash("sha1").update(relative).digest("hex").slice(0, 12),
    productId: product?.id ?? "unclassified",
    productFamily: product?.family ?? "Brand reference",
    productName: product?.name ?? path.basename(path.dirname(absolute)),
    assetName: path.basename(absolute),
    sourcePath: `/brand-reference/${relative}`,
    format: metadata.format,
    width: metadata.width,
    height: metadata.height,
    aspectRatio: metadata.width && metadata.height ? Number((metadata.width / metadata.height).toFixed(4)) : null,
    orientation: metadata.width && metadata.height ? (metadata.width > metadata.height ? "landscape" : metadata.width < metadata.height ? "portrait" : "square") : "unknown",
    viewType: viewType(relative),
    hasTransparency: Boolean(metadata.hasAlpha),
    bytes,
    approved: true,
    draft: false,
    desktopSuitable: Boolean(metadata.width && metadata.width >= 1200),
    mobileSuitable: Boolean(metadata.height && metadata.height >= 1200),
    safeCropNotes: "Use contain for packaging. Crop editorial/lifestyle references only when all critical branding remains visible.",
    logoVisibilityNotes: "Preserve the leading dot, coconut O emblem, and full approved family wordmark.",
    textVisibilityNotes: "Printed package copy is approved content and must remain readable in gallery views.",
  });
}

await mkdir(outputRoot, { recursive: true });
const websiteProducts = {};
for (const product of products) {
  const assets = inventory.filter((asset) => asset.productId === product.id);
  const ordered = [...assets].sort((a, b) => {
    const order = ["ecommerce", "front", "three-quarter", "back", "left-side", "right-side", "macro", "usage", "ingredient-benefit", "lifestyle", "floating", "reference"];
    return order.indexOf(a.viewType) - order.indexOf(b.viewType);
  });
  const productOutput = path.join(outputRoot, product.folder);
  await mkdir(productOutput, { recursive: true });
  const gallery = [];
  for (let index = 0; index < ordered.length; index += 1) {
    const asset = ordered[index];
    const input = path.join(root, "public", asset.sourcePath);
    const filename = `${String(index + 1).padStart(2, "0")}-${asset.viewType}.webp`;
    const output = path.join(productOutput, filename);
    await sharp(input).rotate().resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true }).webp({ quality: 90, smartSubsample: true }).toFile(output);
    gallery.push({ src: `/images/website/products/${product.folder}/${filename}`, alt: `${asset.viewType.replaceAll("-", " ")} view of ${product.name}.`, view: asset.viewType, width: 1200, height: 1200, source: asset.sourcePath });
  }
  const primaryIndex = ordered.findIndex((asset) => product.card.test(asset.assetName));
  const primary = gallery[Math.max(0, primaryIndex)] ?? gallery[0];
  websiteProducts[product.id] = { name: product.name, family: product.family, primary: primary?.src ?? null, gallery };
}

const manifest = {
  generatedAt: new Date().toISOString(),
  sourceDirectory: "/brand-reference",
  brandLock: "Approved masters are read-only. Only deterministic resized WebP derivatives are produced.",
  totals: { assets: inventory.length, products: products.length, sourceBytes: inventory.reduce((sum, asset) => sum + asset.bytes, 0) },
  assets: inventory,
  websiteProducts,
};

await writeFile(path.join(sourceRoot, "asset-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
const manualFiles = await walk(manualRoot);
const manualAvailability = Object.fromEntries(manualFiles.map((absolute) => [
  `/${path.relative(path.join(root, "public"), absolute).split(path.sep).join("/")}`,
  true,
]));
await mkdir(path.join(root, "lib/generated"), { recursive: true });
await writeFile(path.join(root, "lib/generated/manual-asset-availability.json"), `${JSON.stringify(manualAvailability, null, 2)}\n`);
console.log(`Mapped ${inventory.length} approved masters into ${Object.values(websiteProducts).reduce((sum, product) => sum + product.gallery.length, 0)} website derivatives.`);
