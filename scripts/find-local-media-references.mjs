import { readFile } from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const sourceFiles = execFileSync("rg", ["--files", "app", "components", "data", "lib"], { cwd: root, encoding: "utf8" })
  .trim()
  .split("\n")
  .filter((file) => /\.(?:css|ts|tsx)$/.test(file) && !file.startsWith("lib/generated/"));

const unsafe = [];
const informational = [];
const localPathPattern = /\/(?:assets(?:-optimized)?|brand-reference|experience|images\/website)\/[A-Za-z0-9_ .()'&+,%@\/-]+\.(?:avif|gif|jpe?g|m4v|mov|mp4|png|svg|webm|webp)/gi;

for (const file of sourceFiles) {
  const source = await readFile(path.join(root, file), "utf8");
  const lines = source.split("\n");
  const importsNextImage = /from\s+["']next\/image["']/.test(source);
  const importsResponsiveImage = /ResponsiveImage/.test(source);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const paths = [...line.matchAll(localPathPattern)].map((match) => match[0]);
    if (paths.length === 0) continue;

    const explicitAdapter = /mediaUrl\s*\(/.test(line);
    const unsafeCss = /url\s*\(/.test(line) || /bg-\[url\(/.test(line);
    const unsafeNativeMedia = /<(?:img|source|video)\b[^>]*(?:src|poster)\s*=\s*["']\//.test(line);
    const unsafeNextImage = importsNextImage && /<Image\b[^>]*src\s*=\s*["']\//.test(line);
    const safeResponsiveImage = importsResponsiveImage && /<Image\b/.test(line);
    const isDefinition = file === "lib/public-assets.ts" || file === "lib/website-assets.ts" || file === "lib/media.ts";

    const entry = { file, line: index + 1, paths };
    if (!explicitAdapter && (unsafeCss || unsafeNativeMedia || unsafeNextImage) && !safeResponsiveImage) unsafe.push(entry);
    else if (!explicitAdapter && !isDefinition) informational.push(entry);
  }
}

const report = {
  checkedAt: new Date().toISOString(),
  filesChecked: sourceFiles.length,
  unsafeCount: unsafe.length,
  unsafe,
  informationalCount: informational.length,
  note: "Informational entries are local identifiers routed through ResponsiveImage or data/config adapters. Unsafe entries bypass the media URL abstraction.",
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (unsafe.length > 0) process.exitCode = 1;
