#!/usr/bin/env node

const baseUrl = new URL(process.argv[2] || process.env.SEO_BASE_URL || "http://127.0.0.1:3000");
const canonicalOrigin = "https://cothecoconutcompany.com";
const expectPreviewNoindex = process.env.EXPECT_PREVIEW_NOINDEX === "1";

const routes = [
  { path: "/", index: true, schemas: ["Organization", "WebSite"], faqCount: 0 },
  { path: "/about", index: true, schemas: ["BreadcrumbList"] },
  { path: "/shop", index: true, schemas: ["BreadcrumbList", "CollectionPage"] },
  { path: "/shop/co-water", index: true, schemas: ["BreadcrumbList"] },
  { path: "/recipes", index: true, schemas: ["BreadcrumbList", "CollectionPage"] },
  { path: "/recipes/tropical-coconut-chia-pudding", index: true, schemas: ["BreadcrumbList", "Recipe"] },
  { path: "/recipes/coconut-basbousa", index: true, schemas: ["BreadcrumbList", "Recipe"] },
  { path: "/sustainability", index: true, schemas: ["BreadcrumbList"] },
  { path: "/journal", index: true, schemas: ["BreadcrumbList", "CollectionPage"] },
  { path: "/journal/social-cocreation-hub", index: true, schemas: ["BreadcrumbList"] },
  { path: "/faqs", index: true, schemas: ["BreadcrumbList", "FAQPage"], faqCount: 3 },
  { path: "/support", index: true, schemas: ["BreadcrumbList", "FAQPage"], faqCount: 6 },
  { path: "/legal", index: true, schemas: ["BreadcrumbList"] },
  { path: "/privacy-policy", index: true, schemas: ["BreadcrumbList"] },
  { path: "/shipping-returns", index: true, schemas: ["BreadcrumbList"] },
  { path: "/search?q=coconut", index: false },
  { path: "/cart", index: false },
  { path: "/login", index: false },
  { path: "/payment", index: false },
  { path: "/account", index: false, redirect: "/login" },
];

function fail(message) {
  throw new Error(message);
}

function tags(html, name) {
  return html.match(new RegExp(`<${name}\\b[^>]*>`, "gi")) || [];
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"));
  return match?.[1];
}

function meta(html, name) {
  const tag = tags(html, "meta").find((candidate) => attribute(candidate, "name")?.toLowerCase() === name.toLowerCase());
  return tag ? attribute(tag, "content") : undefined;
}

function canonical(html) {
  const tag = tags(html, "link").find((candidate) => attribute(candidate, "rel")?.toLowerCase() === "canonical");
  return tag ? attribute(tag, "href") : undefined;
}

function schemaDocuments(html) {
  const documents = [];
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const parsed = JSON.parse(match[1]);
      documents.push(...(Array.isArray(parsed) ? parsed : [parsed]));
    } catch (error) {
      fail(`Invalid JSON-LD: ${error.message}`);
    }
  }
  return documents;
}

function schemaTypes(html) {
  const types = [];
  for (const parsed of schemaDocuments(html)) {
    const visit = (value) => {
      if (!value || typeof value !== "object") return;
      if (typeof value["@type"] === "string") types.push(value["@type"]);
      if (Array.isArray(value)) value.forEach(visit);
      else Object.values(value).forEach(visit);
    };
    visit(parsed);
  }
  return types;
}

function faqEntityCount(html) {
  const faq = schemaDocuments(html).find((document) => document?.["@type"] === "FAQPage");
  return Array.isArray(faq?.mainEntity) ? faq.mainEntity.length : 0;
}

async function request(path) {
  return fetch(new URL(path, baseUrl), {
    redirect: "manual",
    headers: { "user-agent": "Googlebot" },
  });
}

async function checkRoute(route) {
  let response = await request(route.path);
  if (route.redirect) {
    if (![301, 302, 307, 308].includes(response.status)) fail(`${route.path}: expected redirect, got ${response.status}`);
    const location = response.headers.get("location");
    if (!location || new URL(location, baseUrl).pathname !== route.redirect) fail(`${route.path}: expected redirect to ${route.redirect}, got ${location}`);
    response = await request(location);
  }
  if (response.status !== 200) fail(`${route.path}: expected 200, got ${response.status}`);
  if (expectPreviewNoindex && !/noindex/i.test(response.headers.get("x-robots-tag") || "")) fail(`${route.path}: Preview response is missing X-Robots-Tag noindex`);

  const html = await response.text();
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const description = meta(html, "description");
  const robots = meta(html, "robots") || "";
  const expectedPath = (route.redirect || route.path.split("?")[0]).replace(/\/$/, "") || "/";
  const expectedCanonical = expectedPath === "/" ? canonicalOrigin : new URL(expectedPath, canonicalOrigin).toString();
  const h1Count = (html.match(/<h1\b/gi) || []).length;

  if (!title) fail(`${route.path}: missing title`);
  if (!description) fail(`${route.path}: missing description`);
  if (canonical(html) !== expectedCanonical) fail(`${route.path}: canonical was ${canonical(html) || "missing"}, expected ${expectedCanonical}`);
  if (route.index && /noindex/i.test(robots)) fail(`${route.path}: unexpectedly noindex`);
  if (!route.index && !/noindex/i.test(robots)) fail(`${route.path}: missing noindex`);
  if (h1Count !== 1) fail(`${route.path}: expected one H1, found ${h1Count}`);

  const presentTypes = schemaTypes(html);
  for (const type of route.schemas || []) {
    if (!presentTypes.includes(type)) fail(`${route.path}: missing ${type} JSON-LD`);
  }
  if (typeof route.faqCount === "number" && faqEntityCount(html) !== route.faqCount) {
    fail(`${route.path}: expected ${route.faqCount} FAQ schema items, found ${faqEntityCount(html)}`);
  }

  return { path: route.path, status: response.status, title, canonical: expectedCanonical, robots, h1Count, schemas: presentTypes };
}

async function checkDiscoveryEndpoints() {
  const sitemapResponse = await request("/sitemap.xml");
  if (sitemapResponse.status !== 200) fail(`/sitemap.xml: ${sitemapResponse.status}`);
  const sitemap = await sitemapResponse.text();
  const urls = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), (match) => match[1]);
  if (!urls.length) fail("sitemap.xml has no URLs");
  if (new Set(urls).size !== urls.length) fail("sitemap.xml contains duplicate URLs");
  if (urls.some((url) => !url.startsWith(`${canonicalOrigin}/`))) fail("sitemap.xml contains a non-canonical host");
  if (urls.some((url) => /\/(account|orders|wishlist|saved-recipes|cart|checkout|payment|login|register|search)(\/|$)/.test(new URL(url).pathname))) fail("sitemap.xml contains a private or noindex URL");

  const robotsResponse = await request("/robots.txt");
  if (robotsResponse.status !== 200) fail(`/robots.txt: ${robotsResponse.status}`);
  const robots = await robotsResponse.text();
  if (!robots.includes(`${canonicalOrigin}/sitemap.xml`)) fail("robots.txt is missing the canonical sitemap");
  if (/Disallow:\s*\/$/m.test(robots)) fail("robots.txt blocks all public content");

  const missingResponse = await request("/__seo-missing-route__");
  if (missingResponse.status !== 404) fail(`missing route returned ${missingResponse.status}, expected 404`);
  if (expectPreviewNoindex && !/noindex/i.test(missingResponse.headers.get("x-robots-tag") || "")) fail("Preview 404 is missing X-Robots-Tag noindex");

  return { sitemapCount: urls.length, robotsStatus: robotsResponse.status, missingStatus: missingResponse.status };
}

(async () => {
  const results = [];
  for (const route of routes) results.push(await checkRoute(route));
  const discovery = await checkDiscoveryEndpoints();
  console.log(JSON.stringify({ baseUrl: baseUrl.toString(), routesChecked: results.length, discovery, routes: results }, null, 2));
})().catch((error) => {
  console.error(`SEO QA failed: ${error.message}`);
  process.exitCode = 1;
});
