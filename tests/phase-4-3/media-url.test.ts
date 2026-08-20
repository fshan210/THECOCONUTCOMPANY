import test from "node:test";
import assert from "node:assert/strict";
import { localMediaPath, mapMediaUrls, mediaUrl } from "../../lib/media";

test("media URL abstraction preserves local fallback and maps managed paths", () => {
  const previous = process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
  try {
    delete process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
    assert.equal(mediaUrl("assets/example image.png"), "/assets/example image.png");
    assert.equal(mediaUrl("/images/logo.svg"), "/images/logo.svg");

    process.env.NEXT_PUBLIC_MEDIA_BASE_URL = "https://media.cothecoconutcompany.com/";
    assert.equal(mediaUrl("/assets/example image.png"), "https://media.cothecoconutcompany.com/site-media/v1/assets/example image.png");
    assert.equal(mediaUrl("/assets/products/transparent-current/co-coconut-water-v1.webp"), "/assets/products/transparent-current/co-coconut-water-v1.webp");
    assert.equal(mediaUrl("/assets/video/homepage-v2/co-home-scraping-scroll-desktop-v1.mp4"), "/assets/video/homepage-v2/co-home-scraping-scroll-desktop-v1.mp4");
    assert.equal(mediaUrl("/assets/home/co-hero-coconut-transparent-v1.webp"), "/assets/home/co-hero-coconut-transparent-v1.webp");
    assert.equal(mediaUrl("/assets/about/about-hand-holding-coconut.png"), "/assets/about/about-hand-holding-coconut.png");
    assert.equal(mediaUrl("/assets/about/about-scraped-coconut-split.png"), "/assets/about/about-scraped-coconut-split.png");

    assert.equal(mediaUrl("/images/website/manual/editorial/example.webp"), "https://media.cothecoconutcompany.com/site-media/v1/images/website/manual/editorial/example.webp");
    assert.equal(mediaUrl("https://example.com/image.jpg"), "https://example.com/image.jpg");
    assert.equal(mediaUrl("data:image/png;base64,abc"), "data:image/png;base64,abc");
    assert.equal(localMediaPath("https://media.cothecoconutcompany.com/site-media/v1/assets/example.png"), "/assets/example.png");
    assert.deepEqual(mapMediaUrls({ image: "/assets/example.png", nested: ["/images/logo.svg"] }), {
      image: "https://media.cothecoconutcompany.com/site-media/v1/assets/example.png",
      nested: ["/images/logo.svg"],
    });

    assert.equal(mediaUrl("/images/website/manual/about/journey/origin.webp"), "https://media.cothecoconutcompany.com/site-media/v1/images/website/manual/about/journey/origin.webp");
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
    else process.env.NEXT_PUBLIC_MEDIA_BASE_URL = previous;
  }
});
