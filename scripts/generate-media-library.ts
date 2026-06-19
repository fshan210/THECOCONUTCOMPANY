import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { extname, join, relative } from "node:path";

const publicRoot = join(process.cwd(), "public");
const assetsRoot = join(publicRoot, "assets");
const categories = ["products", "recipes", "journal", "branding", "hero", "3d", "svg"] as const;

type AssetCategory = (typeof categories)[number];

function titleFromFilename(filename: string) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function typeFromExtension(extension: string) {
  if ([".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(extension)) return "image";
  if (extension === ".svg") return "svg";
  if ([".glb", ".gltf"].includes(extension)) return "3d";
  if ([".mp4", ".webm"].includes(extension)) return "video";
  return "document";
}

function tagsFor(category: AssetCategory, filename: string, type: string) {
  return Array.from(new Set([category, type, ...filename.replace(/\.[^.]+$/, "").split(/[-_\s]+/).filter(Boolean)]));
}

const assets = categories.flatMap((category) => {
  const directory = join(assetsRoot, category);
  if (!existsSync(directory)) mkdirSync(directory, { recursive: true });

  return readdirSync(directory)
    .filter((filename) => !filename.startsWith("."))
    .map((filename) => {
      const absolutePath = join(directory, filename);
      if (!statSync(absolutePath).isFile()) return null;
      const extension = extname(filename).toLowerCase();
      const type = typeFromExtension(extension);
      const path = `/${relative(publicRoot, absolutePath).replace(/\\/g, "/")}`;
      const title = titleFromFilename(filename);

      return {
        id: `${category}-${filename.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}`,
        filename,
        title,
        path,
        category,
        type,
        altText: `${title} for .CO The Coconut Company`,
        tags: tagsFor(category, filename, type),
        thumbnail: type === "image" || type === "svg" ? path : null
      };
    })
    .filter(Boolean);
});

const outputPath = join(assetsRoot, "media-library.generated.json");
writeFileSync(outputPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), assets }, null, 2)}\n`);
console.log(`Generated ${assets.length} local media assets at ${outputPath}`);
