import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("Sustainability uses the canonical fixed shell and mobile navigation", async () => {
  const [darkReference, sustainability] = await Promise.all([
    source("../../components/reference/DarkReference.tsx"),
    source("../../components/sustainability/ReferenceSustainabilityPage.tsx"),
  ]);
  const shell = darkReference.slice(darkReference.indexOf("export function DarkShell"), darkReference.indexOf("export function Eyebrow"));
  assert.match(sustainability, /<DarkShell className="rd-sustainability">/);
  assert.match(shell, /<ReferenceHeader \/>/);
  assert.match(shell, /<ReferenceFooter \/>/);
  assert.match(shell, /<MobileBottomNav \/>/);
  assert.doesNotMatch(shell, /<DarkHeader \/>|<DarkFooter \/>/);
});

test("mobile menus retain focus controls and use the dark cinematic palette", async () => {
  const [reference, standard] = await Promise.all([
    source("../../components/home/ReferenceHomePage.tsx"),
    source("../../components/Navigation.tsx"),
  ]);
  for (const menu of [reference, standard]) {
    assert.match(menu, /aria-controls=/);
    assert.match(menu, /event\.key !== "Escape"/);
    assert.match(menu, /\.focus\(\)/);
    assert.match(menu, /bg-\[rgba\(29,14,9,\.97\)\]/);
    assert.match(menu, /\[touch-action:pan-y\]/);
  }
  assert.match(reference, /env\(safe-area-inset-top, 0px\)/);
});

test("mobile bottom navigation reserves safe-area space and 48px touch targets", async () => {
  const [reference, styles] = await Promise.all([
    source("../../components/home/ReferenceHomePage.tsx"),
    source("../../app/globals.css"),
  ]);
  assert.match(reference, /co-mobile-bottom-nav-spacer/);
  assert.match(reference, /min-h-12/);
  assert.match(reference, /env\(safe-area-inset-bottom\)/);
  assert.match(styles, /--co-mobile-content-clearance/);
  assert.match(styles, /\.co-mobile-bottom-nav-spacer \{ height: var\(--co-mobile-content-clearance\)/);
});

test("mobile bundle uses flow layout, two columns, and accessible remove controls", async () => {
  const styles = await source("../../app/globals.css");
  const start = styles.indexOf(".co-shop-ritual { min-height: 0;");
  const mobile = styles.slice(start, styles.indexOf(".co-shop-curated-section", start));
  assert.match(mobile, /\.co-shop-ritual__canvas \{ display: grid; height: auto; aspect-ratio: auto/);
  assert.match(mobile, /\.co-shop-ritual__copy \{ position: relative; top: auto; left: auto/);
  assert.match(mobile, /grid-template-columns: repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(mobile, /\.co-shop-ritual__product button \{[^}]*width: 44px; height: 44px/);
  assert.match(mobile, /\.co-shop-ritual__summary \{ position: relative; top: auto; right: auto/);
  assert.doesNotMatch(mobile, /height: clamp\(900px,246vw,960px\)/);
});

test("Home scrub video defers transfer and has mobile autoplay, manual play, poster, and fallbacks", async () => {
  const home = await source("../../components/home/CinematicHomePage.tsx");
  const scrub = home.slice(home.indexOf("export function HomePinnedScrubVideo"), home.indexOf("function OriginScene"));
  assert.match(scrub, /IntersectionObserver/);
  assert.match(scrub, /preload=\{sourceAttached \? "metadata" : "none"\}/);
  assert.match(scrub, /autoPlay=\{isMobile && sourceAttached && inView\}/);
  assert.match(scrub, /loop=\{isMobile\}/);
  assert.match(scrub, /playsInline/);
  assert.match(scrub, /co-home-scraping-poster-v1\.jpg/);
  assert.match(scrub, /co-home-scraping-scroll-mobile-portrait-v2\.mp4/);
  assert.match(scrub, /onClick=\{togglePlayback\}/);
  assert.match(scrub, /video\.play\(\)\.catch/);
  assert.match(scrub, /setVideoFailed\(true\)/);
  assert.match(scrub, /if \(reducedMotion\)/);
});

test("saved-content client uses the BFF and visibly rolls back failed optimistic mutations", async () => {
  const [hook, route] = await Promise.all([
    source("../../lib/customer/use-saved-content.ts"),
    source("../../app/api/customer/saved/route.ts"),
  ]);
  assert.match(hook, /fetch\("\/api\/customer\/saved"/);
  assert.match(hook, /method: removing \? "DELETE" : "POST"/);
  assert.match(hook, /if \(!response\?\.ok\)/);
  assert.match(hook, /if \(removing\) next\.add\(itemId\); else next\.delete\(itemId\)/);
  assert.match(route, /customerAwsApi<SavedContentRecord>\("v1\/wishlist"\)/);
  assert.match(route, /customerAwsApi<SavedContentRecord>\("v1\/saved"/);
  assert.match(route, /`v1\/saved\/\$\{parsed\.data\.kind\}/);
});

test("commerce QA covers exact mobile heights, geometric overlap, and contact-sheet evidence", async () => {
  const qa = await source("../../scripts/qa-core-commerce.cjs");
  for (const dimensions of ["[430, 932]", "[390, 844]", "[375, 812]"]) assert.ok(qa.includes(dimensions), `missing ${dimensions}`);
  assert.match(qa, /unexpectedOverlaps/);
  assert.match(qa, /getBoundingClientRect\(\)/);
  assert.match(qa, /mobile-corrections-contact-sheet\.jpg/);
  for (const route of ["wishlist", "account", "cart", "search", "faqs"]) assert.match(qa, new RegExp(`\\/${route}`));
});
