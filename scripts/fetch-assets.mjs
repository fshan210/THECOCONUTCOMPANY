import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execFile);

const assets = [
  {
    page: "File:Coconut Tree Kappil Beach.jpg",
    target: "public/assets/farming/kerala-coconut-palm.jpg",
    webp: "public/assets/farming/kerala-coconut-palm.webp",
    role: "About journey Kerala origin photography"
  },
  {
    page: "File:Coconut Farms Perumathura.jpg",
    target: "public/assets/farming/coconut-grove.jpg",
    webp: "public/assets/farming/coconut-grove.webp",
    role: "Palm shadow and farming depth"
  },
  {
    page: "File:Copra - coconut oil mill.JPG",
    target: "public/assets/products/copra-processing.jpg",
    webp: "public/assets/products/copra-processing.webp",
    role: "Processing and manufacturing story"
  },
  {
    page: "File:Coconut oil bottle in the background of dried coconuts from Kaleeswari Farm.jpg",
    target: "public/assets/products/coconut-oil.jpg",
    webp: "public/assets/products/coconut-oil.webp",
    role: "Wellness/product ecosystem"
  },
  {
    page: "File:Coconut8020.jpg",
    target: "public/assets/coconut/whole-coconut.jpg",
    webp: "public/assets/coconut/whole-coconut.webp",
    role: "Hero coconut material reference"
  },
  {
    page: "File:Coconut Palm art.jpg",
    target: "public/assets/textures/palm-leaf-shadow.jpg",
    webp: "public/assets/textures/palm-leaf-shadow.webp",
    role: "Organic luxury texture overlay"
  }
];

async function commonsInfo(page) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    prop: "imageinfo",
    iiprop: "url|extmetadata",
    titles: page,
    redirects: "1"
  });
  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`);
  if (!response.ok) throw new Error(`Commons API failed for ${page}`);
  const json = await response.json();
  const pages = Object.values(json.query.pages);
  const imageinfo = pages[0]?.imageinfo?.[0];
  if (!imageinfo?.url) throw new Error(`No image URL for ${page}`);
  return {
    source: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.replaceAll(" ", "_"))}`,
    url: imageinfo.url,
    author: imageinfo.extmetadata?.Artist?.value?.replace(/<[^>]*>/g, "") ?? "Wikimedia Commons contributor",
    license: imageinfo.extmetadata?.LicenseShortName?.value ?? "See source",
    credit: imageinfo.extmetadata?.Credit?.value?.replace(/<[^>]*>/g, "") ?? ""
  };
}

async function download(url, target) {
  await mkdir(dirname(target), { recursive: true });
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed: ${url}`);
  await writeFile(target, Buffer.from(await response.arrayBuffer()));
}

async function convertToWebp(input, output) {
  await mkdir(dirname(output), { recursive: true });
  await exec("sips", ["-s", "format", "webp", "-s", "formatOptions", "82", input, "--out", output]);
}

async function makeVariants(webp) {
  const variants = [640, 1280, 1920];
  for (const width of variants) {
    const output = webp.replace(".webp", `-${width}.webp`);
    await exec("sips", ["-Z", String(width), webp, "--out", output]);
  }
}

const manifest = [];

for (const asset of assets) {
  try {
    const info = await commonsInfo(asset.page);
    if (!existsSync(asset.target)) await download(info.url, asset.target);
    await convertToWebp(asset.target, asset.webp);
    await makeVariants(asset.webp);
    manifest.push({ ...asset, ...info });
  } catch (error) {
    manifest.push({ ...asset, error: error instanceof Error ? error.message : String(error) });
  }
}

await writeFile("public/assets/ASSET_MANIFEST.json", JSON.stringify(manifest, null, 2));
console.log(JSON.stringify(manifest, null, 2));
