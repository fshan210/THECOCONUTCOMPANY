const { execFileSync } = require("node:child_process");
const { mkdtempSync, readFileSync, rmSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join } = require("node:path");

const baseUrl = (process.env.BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const mode = process.env.PERF_MODE === "desktop" ? "desktop" : "mobile";
const runCount = Number(process.env.PERF_RUNS || 1);
if (!Number.isInteger(runCount) || runCount < 1) throw new Error("PERF_RUNS must be a positive integer");
const routes = (process.env.PERF_ROUTES || "/,/shop,/recipes,/journal,/sustainability,/account,/cart").split(",").map((route) => route.trim()).filter(Boolean);
const chromePath = process.env.CHROME_PATH || (process.platform === "darwin" ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" : undefined);
const outputDir = mkdtempSync(join(tmpdir(), "dotco-performance-"));
const thresholds = {
  cls: Number(process.env.PERF_MAX_CLS || 0.1),
  requests: Number(process.env.PERF_MAX_REQUESTS || 100),
  transferBytes: Number(process.env.PERF_MAX_TRANSFER_BYTES || 25_000_000),
  tbtMs: Number(process.env.PERF_MAX_TBT_MS || 500)
};

const results = [];
let failed = false;
const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

try {
  routes.forEach((route, index) => {
    const routeResults = [];
    for (let run = 1; run <= runCount; run++) {
      const outputPath = join(outputDir, `route-${index}-run-${run}.json`);
      const args = [
        "--yes", "lighthouse@13.5.0", baseUrl + route,
        "--only-categories=performance", "--output=json", "--output-path=" + outputPath,
        "--quiet", "--chrome-flags=--headless --no-sandbox --disable-gpu"
      ];
      if (mode === "desktop") args.push("--preset=desktop");
      else args.push("--screenEmulation.mobile", "--screenEmulation.width=390", "--screenEmulation.height=844", "--screenEmulation.deviceScaleFactor=1");
      if (chromePath) args.push("--chrome-path=" + chromePath);
      execFileSync("npx", args, { stdio: "inherit" });

      const report = JSON.parse(readFileSync(outputPath, "utf8"));
      const audits = report.audits;
      const requests = audits["network-requests"].details.items;
      const transferByType = (type) => requests
        .filter((request) => request.resourceType === type)
        .reduce((total, request) => total + (request.transferSize || 0), 0);
      const apiRequests = requests.filter((request) => {
        try { return new URL(request.url).pathname.startsWith("/api/"); }
        catch { return false; }
      });
      const apiLatencies = apiRequests
        .map((request) => Math.max(0, ((request.networkEndTime || 0) - (request.networkRequestTime || 0)) * 1_000))
        .filter(Number.isFinite);
      const longTasks = audits["long-tasks"]?.details?.items || [];
      const assetTypes = new Set(["Image", "Media", "Script", "Stylesheet", "Font"]);
      const errorResponses = requests.filter((request) => request.statusCode >= 400 && assetTypes.has(request.resourceType));
      const consoleErrors = audits["errors-in-console"]?.details?.items || [];
      const lcpInsight = audits["lcp-breakdown-insight"]?.details?.items || [];
      const lcpNode = lcpInsight.find((item) => item.type === "node");
      const lcpUrl = lcpNode?.snippet?.match(/\bsrc="([^"]+)"/)?.[1] || null;
      const lcpResource = lcpUrl ? requests.find((request) => {
        try { return new URL(request.url).pathname === new URL(lcpUrl, baseUrl).pathname; }
        catch { return false; }
      }) : null;
      const lcpParts = lcpInsight.find((item) => item.type === "table")?.items || [];
      const result = {
        route,
        run,
        mode,
        score: Math.round(report.categories.performance.score * 100),
        ttfbMs: Math.round(audits["server-response-time"].numericValue),
        lcpMs: Math.round(audits["largest-contentful-paint"].numericValue),
        lcpElement: lcpNode?.selector || lcpNode?.nodeLabel || null,
        lcpResource: lcpResource?.url || lcpUrl,
        lcpResourceBytes: lcpResource?.transferSize ?? null,
        lcpRenderDelayMs: Math.round(lcpParts.find((part) => part.subpart === "elementRenderDelay")?.duration ?? 0),
        cls: Number(audits["cumulative-layout-shift"].numericValue.toFixed(3)),
        tbtMs: Math.round(audits["total-blocking-time"].numericValue),
        longTasks: longTasks.length,
        requests: requests.length,
        transferBytes: requests.reduce((total, request) => total + (request.transferSize || 0), 0),
        imageBytes: transferByType("Image"),
        videoBytes: transferByType("Media"),
        scriptBytes: transferByType("Script"),
        apiRequests: apiRequests.length,
        apiAverageMs: apiLatencies.length ? Math.round(apiLatencies.reduce((total, value) => total + value, 0) / apiLatencies.length) : null,
        apiMaxMs: apiLatencies.length ? Math.round(Math.max(...apiLatencies)) : null,
        assetFailures: errorResponses.length,
        consoleErrors: consoleErrors.length
      };
      const violations = [];
      if (result.cls > thresholds.cls) violations.push("CLS");
      if (result.requests > thresholds.requests) violations.push("request count");
      if (result.transferBytes > thresholds.transferBytes) violations.push("transfer bytes");
      if (result.tbtMs > thresholds.tbtMs) violations.push("total blocking time");
      if (result.assetFailures) violations.push("asset failures");
      if (result.consoleErrors) violations.push("console errors");
      if (violations.length) failed = true;
      routeResults.push({ ...result, violations });
      console.log(JSON.stringify({ ...result, violations }));
    }
    results.push({ route, runs: routeResults, medianLcpMs: Math.round(median(routeResults.map((result) => result.lcpMs))), medianTtfbMs: Math.round(median(routeResults.map((result) => result.ttfbMs))) });
  });
  console.log(JSON.stringify({ baseUrl, mode, viewport: mode === "mobile" ? "390x844" : "desktop", runCount, thresholds, routes: results.map(({route, medianLcpMs, medianTtfbMs}) => ({route, medianLcpMs, medianTtfbMs})), failed }, null, 2));
} finally {
  rmSync(outputDir, { recursive: true, force: true });
}

if (failed) process.exitCode = 1;
