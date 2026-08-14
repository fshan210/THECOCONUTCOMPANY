import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const mappingPath = path.join(root, "migration-reports", "mappings", "local-to-cloudfront.json");
const inventoryPath = path.join(root, "migration-reports", "inventory", "public-assets.json");
const reportPath = path.join(root, "migration-reports", "validation", "cloudfront-http-validation.json");
const mapping = JSON.parse(await readFile(mappingPath, "utf8"));
const inventory = JSON.parse(await readFile(inventoryPath, "utf8"));
const byPublicPath = new Map(inventory.assets.map((asset) => [asset.publicPath, asset]));

function normalizeMimeType(value) {
  return value.split(";", 1)[0].trim().toLowerCase();
}

async function validateOne(item) {
  const asset = byPublicPath.get(item.localPath);
  const response = await fetch(item.cloudFrontUrl, { method: "HEAD", redirect: "error" });
  const contentType = response.headers.get("content-type") ?? "";
  const contentLength = Number(response.headers.get("content-length") ?? 0);
  const cacheControl = response.headers.get("cache-control") ?? "";
  const failures = [];
  if (response.status !== 200) failures.push(`status ${response.status}`);
  if (!asset) failures.push("missing inventory row");
  if (asset && contentLength !== asset.byteSize) failures.push(`length ${contentLength}, expected ${asset.byteSize}`);
  if (asset && normalizeMimeType(contentType) !== normalizeMimeType(asset.mimeType)) failures.push(`type ${contentType}, expected ${asset.mimeType}`);
  if (/text\/html/i.test(contentType)) failures.push("unexpected HTML response");
  if (!/max-age=31536000/i.test(cacheControl) || !/immutable/i.test(cacheControl)) failures.push(`cache-control ${cacheControl || "missing"}`);
  return {
    localPath: item.localPath,
    url: item.cloudFrontUrl,
    status: response.status,
    contentType,
    contentLength,
    cacheControl,
    xCache: response.headers.get("x-cache"),
    ok: failures.length === 0,
    failures,
  };
}

async function runPool(items, concurrency) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      try {
        results[index] = await validateOne(items[index]);
      } catch (error) {
        results[index] = { localPath: items[index].localPath, url: items[index].cloudFrontUrl, ok: false, failures: [error instanceof Error ? error.message : String(error)] };
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return results;
}

const startedAt = new Date().toISOString();
const results = await runPool(mapping, 16);
const failures = results.filter((item) => !item.ok);
const report = {
  startedAt,
  completedAt: new Date().toISOString(),
  objectCount: results.length,
  validatedCount: results.length - failures.length,
  failureCount: failures.length,
  failures,
  objects: results,
};
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
await writeFile(mappingPath, `${JSON.stringify(mapping.map((item, index) => ({ ...item, validated: results[index]?.ok === true })), null, 2)}\n`);
process.stdout.write(`${JSON.stringify({ objectCount: report.objectCount, validatedCount: report.validatedCount, failureCount: report.failureCount }, null, 2)}\n`);
if (failures.length > 0) process.exitCode = 1;
