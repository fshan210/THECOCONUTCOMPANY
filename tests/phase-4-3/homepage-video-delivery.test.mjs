import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const homepageSource = new URL("../../components/home/ReferenceHomePage.tsx", import.meta.url);

test("homepage video delivery stays deferred and selects the mobile source natively", async () => {
  const source = await readFile(homepageSource, "utf8");

  assert.match(source, /layoutProgress < 0\.08/, "scraping video should activate ahead of its visual reveal");
  assert.match(source, /window\.addEventListener\("scroll", activateWithinScrollLead/, "delivery activation must use stable layout scroll instead of a transient motion value");
  assert.match(source, /preload=\{videoDeliveryActive \? "auto" : "none"\}/, "video bodies must not load on initial render");
  assert.match(source, /<source media="\(max-width: 900px\)" src=\{mediaUrl\(homepageVideoAssets\.scraping\.mobile\)\}/, "mobile source selection must happen before the request");
  assert.doesNotMatch(source, /src=\{mediaUrl\(mobileVideo \? homepageVideoAssets\.scraping\.mobile/, "hydration must not request desktop video before switching to mobile");
});

test("farm video bodies are activated near their section instead of at page load", async () => {
  const source = await readFile(homepageSource, "utf8");

  assert.match(source, /rootMargin: "700px 0px"/, "farm media needs a bounded scroll-ahead window");
  assert.doesNotMatch(source, /<video autoPlay muted loop playsInline preload="metadata"/, "farm videos must not autoplay eagerly");
  assert.match(source, /<FarmEnvironmentalMedia \/>/, "sustainability and footer should share the deferred media implementation");
});

test("the mobile receipt selector cannot pull the document away from the hero", async () => {
  const source = await readFile(homepageSource, "utf8");

  assert.match(source, /scroller\.scrollTo\(\{ left:/, "receipt selection should move only its horizontal scroller");
  assert.doesNotMatch(source, /activeButton\?\.scrollIntoView/, "receipt hydration must never scroll the document");
});
