import { execFile } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = process.cwd();
const inventoryPath = path.join(root, "migration-reports", "inventory", "public-assets.json");
const outputsPath = path.join(root, "migration-reports", "validation", "cdk-media-outputs.json");
const uploadReportPath = path.join(root, "migration-reports", "validation", "media-upload.json");
const failedReportPath = path.join(root, "migration-reports", "validation", "media-upload-failures.json");
const mappingPath = path.join(root, "migration-reports", "mappings", "local-to-cloudfront.json");
const cacheControl = "public, max-age=31536000, immutable";

const inventory = JSON.parse(await readFile(inventoryPath, "utf8"));
const outputs = JSON.parse(await readFile(outputsPath, "utf8"))["dotco-production-media"];
if (!outputs?.MediaBucketName || !outputs?.MediaDistributionDomainName) {
  throw new Error("Missing deployed media stack outputs");
}

const bucket = outputs.MediaBucketName;
const distributionDomain = outputs.MediaDistributionDomainName;
const planned = inventory.assets.filter((asset) => asset.classification === "A-runtime-remote");

async function aws(args, options = {}) {
  return execFileAsync("aws", args, { cwd: root, maxBuffer: 10 * 1024 * 1024, ...options });
}

async function headObject(key) {
  try {
    const { stdout } = await aws(["s3api", "head-object", "--bucket", bucket, "--key", key, "--checksum-mode", "ENABLED", "--output", "json"]);
    return JSON.parse(stdout);
  } catch (error) {
    const message = `${error.stderr ?? ""}${error.stdout ?? ""}${error.message ?? ""}`;
    if (/Not Found|404|NoSuchKey/i.test(message)) return null;
    throw error;
  }
}

async function uploadOne(asset) {
  const source = path.join(root, asset.relativePath);
  const key = asset.proposedS3Key;
  const existing = await headObject(key);
  const existingHash = existing?.Metadata?.sha256;
  const sourceChecksumBase64 = Buffer.from(asset.sha256, "hex").toString("base64");
  const existingIsIdentical = existing && existing.ContentLength === asset.byteSize && (existingHash === asset.sha256 || existing.ChecksumSHA256 === sourceChecksumBase64);
  if (existing && !existingIsIdentical) {
    throw new Error(`Conflict at ${key}: remote object exists with a different or missing sha256 metadata value`);
  }
  let status = "skipped-identical";
  if (!existing) {
    await aws([
      "s3", "cp", source, `s3://${bucket}/${key}`,
      "--cache-control", cacheControl,
      "--checksum-algorithm", "SHA256",
      "--content-type", asset.mimeType,
      "--metadata", `sha256=${asset.sha256}`,
      "--no-progress",
    ]);
    status = "uploaded";
  }
  const remote = await headObject(key);
  const remoteIsIdentical = remote && remote.ContentLength === asset.byteSize && (remote.Metadata?.sha256 === asset.sha256 || remote.ChecksumSHA256 === sourceChecksumBase64);
  if (!remoteIsIdentical) {
    throw new Error(`Post-upload integrity check failed for ${key}`);
  }
  return {
    sourceLocalPath: asset.relativePath,
    publicPath: asset.publicPath,
    destinationKey: key,
    sourceSha256: asset.sha256,
    destinationChecksumSha256: remote.ChecksumSHA256 ?? null,
    destinationETag: remote.ETag ?? null,
    destinationVersionId: remote.VersionId ?? null,
    contentType: remote.ContentType,
    cacheControl: remote.CacheControl,
    byteSize: remote.ContentLength,
    uploadStatus: status,
    cloudFrontDistributionUrl: `https://${distributionDomain}/${key}`,
    cloudFrontUrl: asset.proposedCloudFrontUrl,
  };
}

async function runPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function runWorker() {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= items.length) return;
      try {
        results[index] = { ok: true, value: await worker(items[index]) };
      } catch (error) {
        results[index] = { ok: false, error: error instanceof Error ? error.message : String(error), asset: items[index].publicPath };
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => runWorker()));
  return results;
}

const startedAt = new Date().toISOString();
const pooled = await runPool(planned, 8, uploadOne);
const uploaded = pooled.filter((item) => item.ok).map((item) => item.value);
const failures = pooled.filter((item) => !item.ok);
const report = {
  startedAt,
  completedAt: new Date().toISOString(),
  objectCount: uploaded.length,
  totalBytes: uploaded.reduce((sum, item) => sum + item.byteSize, 0),
  uploadedCount: uploaded.filter((item) => item.uploadStatus === "uploaded").length,
  skippedIdenticalCount: uploaded.filter((item) => item.uploadStatus === "skipped-identical").length,
  failureCount: failures.length,
  objects: uploaded,
};
await writeFile(uploadReportPath, `${JSON.stringify(report, null, 2)}\n`);
await writeFile(failedReportPath, `${JSON.stringify({ failures }, null, 2)}\n`);
await writeFile(mappingPath, `${JSON.stringify(planned.map((asset) => ({
  localPath: asset.publicPath,
  s3Key: asset.proposedS3Key,
  cloudFrontUrl: asset.proposedCloudFrontUrl,
  sha256: asset.sha256,
  referencesUpdated: [],
  validated: false,
})), null, 2)}\n`);

console.log(JSON.stringify({
  objectCount: report.objectCount,
  totalBytes: report.totalBytes,
  uploadedCount: report.uploadedCount,
  skippedIdenticalCount: report.skippedIdenticalCount,
  failureCount: report.failureCount,
}, null, 2));
if (failures.length > 0) process.exitCode = 1;
