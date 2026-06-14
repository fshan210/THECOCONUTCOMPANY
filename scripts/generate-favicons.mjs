import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const publicDir = path.join(process.cwd(), "public");
const logo = path.join(publicDir, "images", "logo.svg");
const icons = [
  ["favicon-16x16.png", 16],
  ["favicon-32x32.png", 32],
  ["apple-touch-icon.png", 180],
  ["android-chrome-192x192.png", 192],
  ["android-chrome-512x512.png", 512]
];

await mkdir(publicDir, { recursive: true });

for (const [file, size] of icons) {
  await sharp(logo, { density: 512 })
    .resize(size, size, { fit: "contain", background: { r: 255, g: 253, b: 248, alpha: 1 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, file));
}

await sharp(logo, { density: 512 })
  .resize(32, 32, { fit: "contain", background: { r: 255, g: 253, b: 248, alpha: 1 } })
  .toFile(path.join(publicDir, "favicon.ico"));

console.log("Generated favicon package from public/images/logo.svg");
