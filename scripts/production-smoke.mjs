const baseUrl = (process.env.BASE_URL || "https://cothecoconutcompany.com").replace(/\/$/, "");

const routes = [
  ["/", "Rooted in nature"],
  ["/about", "Rooted in nature"],
  ["/shop", "Good for you"],
  ["/recipes", "Good food"],
  ["/journal", "Real people"],
  ["/sustainability", "Good for you"]
];

const infrastructureRoutes = ["/robots.txt", "/sitemap.xml", "/image-sitemap.xml", "/opengraph-image"];
const checkedAssets = new Set();
const failures = [];

function discoverAssets(html, pageUrl) {
  const values = [];
  const expression = /(?:src|poster|href)=["']([^"']+)["']/gi;
  for (const match of html.matchAll(expression)) {
    const value = match[1];
    if (!value || value.startsWith("data:") || value.startsWith("blob:") || value.startsWith("mailto:") || value.startsWith("#")) continue;
    const asset = new URL(value, pageUrl);
    if (![new URL(baseUrl).host, "media.cothecoconutcompany.com"].includes(asset.host)) continue;
    if (!/\.(?:avif|css|gif|ico|jpe?g|js|mp4|png|svg|webm|webp|woff2?)(?:$|\?)/i.test(asset.href)) continue;
    values.push(asset.href);
  }
  return values;
}

async function request(url, init = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    return await fetch(url, { redirect: "follow", ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function mapWithConcurrency(values, concurrency, callback) {
  const queue = [...values];
  await Promise.all(
    Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
      while (queue.length) {
        const value = queue.shift();
        if (value) await callback(value);
      }
    })
  );
}

for (const [path, marker] of routes) {
  const url = `${baseUrl}${path}`;
  try {
    const response = await request(url);
    const html = await response.text();
    if (!response.ok) failures.push(`${path}: HTTP ${response.status}`);
    if (!html.toLowerCase().includes(marker.toLowerCase())) failures.push(`${path}: missing marker "${marker}"`);
    if (/http:\/\//i.test(html.replace(/http:\/\/www\.w3\.org/gi, ""))) failures.push(`${path}: mixed-content reference found`);
    for (const asset of discoverAssets(html, url)) checkedAssets.add(asset);
  } catch (error) {
    failures.push(`${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

for (const path of infrastructureRoutes) {
  try {
    const response = await request(`${baseUrl}${path}`);
    if (!response.ok) failures.push(`${path}: HTTP ${response.status}`);
  } catch (error) {
    failures.push(`${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

await mapWithConcurrency(checkedAssets, 12, async (asset) => {
  try {
    const response = await request(asset, { method: "HEAD" });
    if (!response.ok) failures.push(`asset ${asset}: HTTP ${response.status}`);
  } catch (error) {
    failures.push(`asset ${asset}: ${error instanceof Error ? error.message : String(error)}`);
  }
});

const report = { baseUrl, routes: routes.length, infrastructureRoutes: infrastructureRoutes.length, assets: checkedAssets.size, failures };
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (failures.length) process.exitCode = 1;
