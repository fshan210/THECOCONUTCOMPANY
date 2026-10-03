# Public assets and build context audit

Audit completed on 2026-10-03 before build changes, using the existing `scripts/audit-public-assets.mjs`, generated optimized-image manifest, media-library and brand manifest scanners, `.vercelignore`, and current `lib/media.ts` bundled runtime prefixes.

- Current tracked public tree: **1112 files / 710,312,909 bytes**.
- Literal/manifest scanner references: **858**; no found reference: **254**. Absence of a literal is not proof of non-use: dynamic paths and historic documentation are included in the scanner's scope.
- Existing exact Vercel exclusions matching current files: **798 files / 423,840,066 bytes**.
- Initial Railway runtime public set: **314 files / 286,472,843 bytes**. Retain every file not already excluded by Vercel, including uncertain files.
- No existing exclusion intersects the current `bundledRuntimePrefixes` from `lib/media.ts`.
- Full path, hash, size, reference flag and exclusion status: `railway-public-assets.json`.

## Delivery and safety

`mediaUrl()` leaves current bundled prefixes local and sends other managed media to `https://media.cothecoconutcompany.com/site-media/v1`. That CDN and its objects remain unchanged. The old scanner's A-runtime-remote classification is a historical heuristic; current `lib/media.ts` overrides it for bundled media. Do not offload or delete additional files based on that classification.

Docker will explicitly reproduce the existing public exclusions and exclude local credentials, env files, Git, QA archives, source masters and build output. No tracked assets will be deleted. Recheck packaged public hashes, static links and live smoke after building. Do not run `write-vercel-media-ignore.mjs` blindly: its hard-coded prefix list predates the current broader media allowlist.

`images.unoptimized=true` already exists in the base. `ResponsiveImage` deliberately delivers prebuilt AVIF/JPEG variants, with additional local WebP assets. Railway must preserve this. Runtime optimizer timing is not an applicable before/after metric for current page images; measure real image request timings and content types.

## Largest 100 files

| Path | Bytes | Existing Vercel exclusion |
| --- | ---: | --- |
| `public/assets/video/homepage-v2/co-home-farm-1080p-v1.mp4` | 21947094 | no |
| `public/assets/home/refined/made-with-care-4k.png` | 10547185 | yes |
| `public/assets/home/refined/recipes-to-inspire-4k.png` | 10225919 | yes |
| `public/assets/home/refined/sustainably-yours-4k.png` | 9682441 | yes |
| `public/assets/home/refined/naturally-hydrating-4k.png` | 9557821 | yes |
| `public/assets/video/homepage-v2/co-home-scraping-scroll-desktop-v1.mp4` | 9217095 | no |
| `public/assets/home/refined/planet-editorial-4k.png` | 7888101 | yes |
| `public/assets/shop/products/IndividualProduct_Utensils.png` | 6724946 | yes |
| `public/assets/video/homepage-v2/co-home-scraping-1080p-v1.mp4` | 5440224 | no |
| `public/assets/shop/products/IndividualProduct_Bowls.png` | 5425064 | yes |
| `public/assets/shop/products/IndividualProduct_CoconutSugar.png` | 5263542 | yes |
| `public/assets/shop/products/IndividualProduct_CoconutChips.png` | 4963359 | yes |
| `public/assets/shop/products/IndividualProduct_GiftBox.png` | 4773821 | yes |
| `public/assets/shop/products/IndividualProduct_Soap.png` | 4635678 | yes |
| `public/assets/shop/products/IndividualProduct_CoconutOil.png` | 4569549 | yes |
| `public/assets/shop/products/IndividualProduct_CoconutVinegar.png` | 4439374 | yes |
| `public/assets/shop/products/IndividualProduct_MeltCO.png` | 4307924 | yes |
| `public/assets/shop/products/IndividualProduct_CO-Water.png` | 4230180 | yes |
| `public/assets/shop/products/IndividualProduct_FaceWash.png` | 4117952 | yes |
| `public/assets/svg/5.svg` | 4070581 | no |
| `public/assets/shop/products/IndividualProduct_CoconutAminos.png` | 4047886 | yes |
| `public/assets/shop/products/IndividualProduct_HairOil.png` | 4046197 | yes |
| `public/assets/shop/products/IndividualProduct_BodyLotion.png` | 3998320 | yes |
| `public/assets/founders/refined/afsala-muthali-portrait.jpg` | 3677950 | yes |
| `public/assets/SVG Transparent Assets/raw coconut.svg` | 3370867 | yes |
| `public/assets/svg/2.svg` | 3370867 | no |
| `public/assets/sustainability/rc1/carbon-sink-coconut-plantation.png` | 3261964 | yes |
| `public/assets/founders/refined/fazil-shersha-portrait.jpg` | 3183357 | yes |
| `public/assets/video/homepage-v2/co-home-scraping-scroll-mobile-portrait-v2.mp4` | 3163737 | no |
| `public/assets/backgrounds/day-with-co/evening-interior.png` | 3038470 | yes |
| `public/assets/video/homepage-v2/co-home-scraping-scroll-mobile-v1.mp4` | 2997793 | no |
| `public/assets/sustainability/refined/raw-materials-farmer.png` | 2990186 | yes |
| `public/assets/sustainability/rc1/solar-clean-manufacturing.png` | 2927192 | yes |
| `public/assets/redesign/home/cinematic/lifestyle/coconut-flour.png` | 2846120 | no |
| `public/assets/Ecosystem_Assets/coconut oil-flat lay.png` | 2819008 | yes |
| `public/assets/journal/refined/community-coconut-table.png` | 2695942 | yes |
| `public/assets/Ecosystem_Assets/Kitchen-group ecosystem.png` | 2636913 | yes |
| `public/assets/redesign/home/cinematic/lifestyle/shampoo.png` | 2628686 | no |
| `public/assets/redesign/home/cinematic/lifestyle/melt-icecream.png` | 2611216 | no |
| `public/assets/redesign/home/cinematic/lifestyle/moisturizer.png` | 2593553 | no |
| `public/assets/video/shop/coconut-water-flow-desktop-v1.mp4` | 2584812 | no |
| `public/assets/sustainability/rc1/plastic-bales-recycling.png` | 2583636 | yes |
| `public/assets/generated/vap.png` | 2568461 | yes |
| `public/assets/Ecosystem_Assets/Botanica-ingredient Composition.png` | 2563909 | yes |
| `public/assets/skincare/Botanica-ingredient Composition.png` | 2563909 | yes |
| `public/assets/backgrounds/day-with-co/dawn-grove.png` | 2552002 | yes |
| `public/assets/Coconut_Water_Assets/hero composition.png` | 2538724 | yes |
| `public/assets/hero/hero composition.png` | 2538724 | yes |
| `public/assets/sustainability/rc1/clean-ocean-community.png` | 2533153 | yes |
| `public/assets/Coconut_Water_Assets/Flat lay.png` | 2531404 | yes |
| `public/assets/hero/hero Composition 2.png` | 2528757 | yes |
| `public/assets/Melt_Ice_Cream_Assets/hero Composition.png` | 2528757 | yes |
| `public/assets/Melt_Ice_Cream_Assets/flat lay.png` | 2516394 | yes |
| `public/assets/Ecosystem_Assets/BOtanica-Facewash-Flat Lay.png` | 2502949 | yes |
| `public/assets/skincare/BOtanica-Facewash-Flat Lay.png` | 2502949 | yes |
| `public/assets/recipes/coconut coffee chill.png` | 2501229 | yes |
| `public/assets/about/co-zero-waste-coconut-split.png` | 2492013 | yes |
| `public/assets/farms/village aggregation point.png` | 2489431 | yes |
| `public/assets/sustainability/rc1/water-conservation-facility.png` | 2488796 | yes |
| `public/assets/recipes/Coconut smoothie Bowl.png` | 2474915 | yes |
| `public/assets/Ecosystem_Assets/botanica-group ecosystem.png` | 2467649 | yes |
| `public/assets/skincare/botanica-group ecosystem.png` | 2467649 | yes |
| `public/assets/sustainability/rc1/zero-waste-coir-materials.png` | 2464744 | yes |
| `public/assets/Melt_Ice_Cream_Assets/lifestyle Scene.png` | 2454017 | yes |
| `public/assets/SVG Transparent Assets/coconut water-social media.svg` | 2449093 | yes |
| `public/assets/svg/4.svg` | 2449093 | no |
| `public/assets/founders/refined/fazil-afsala-founder-hero.png` | 2437557 | yes |
| `public/assets/redesign/about/founders.png` | 2437557 | no |
| `public/assets/farms/VIllage collection point.png` | 2428830 | yes |
| `public/assets/generated/VIllage collection point.png` | 2428830 | yes |
| `public/assets/Coconut_Water_Assets/ingridient composition.png` | 2415545 | yes |
| `public/assets/redesign/about/locally-rooted-built-to-travel.png` | 2391860 | no |
| `public/assets/redesign/recipes/feeding everyone.png` | 2391343 | no |
| `public/assets/redesign/home/cinematic/lifestyle/hair-serum.png` | 2386811 | no |
| `public/assets/redesign/about/kitchen.png` | 2364420 | no |
| `public/images/website/source-composites/home/transitions/CO_WEBSITE_TRANSITION_ORIGIN_MOBILE_MASTER.png` | 2363342 | yes |
| `public/assets/redesign/recipes/RED THAI COCONUT CURRY.png` | 2328722 | no |
| `public/assets/recipes/coconut mango cooler.png` | 2318360 | yes |
| `public/assets/Ecosystem_Assets/Botanica-Hero Composition.png` | 2305504 | yes |
| `public/assets/hero/Botanica-Hero Composition.png` | 2305504 | yes |
| `public/assets/skincare/Botanica-Hero Composition.png` | 2305504 | yes |
| `public/assets/redesign/journal/STORIES FROM THE COCONUT AND EVERYTHING AROUND IT.png` | 2298604 | no |
| `public/assets/sustainability/refined/plastic-bottles-impact.png` | 2292312 | yes |
| `public/assets/redesign/home/cinematic/lifestyle/coconut-milk.png` | 2289010 | no |
| `public/assets/redesign/home/cinematic/lifestyle/face-wash.png` | 2288301 | no |
| `public/assets/redesign/recipes/RECIPIE BRINGS CULTURE TOGETHER.png` | 2287351 | no |
| `public/assets/redesign/shop/shop-coconut-essentials.png` | 2277402 | no |
| `public/assets/redesign/recipes/BAKED COCONUT DONUTS.png` | 2274937 | no |
| `public/assets/redesign/about/built-by-people.png` | 2270319 | no |
| `public/assets/redesign/recipes/coconut breakfast bowl.png` | 2269951 | no |
| `public/assets/sustainability/rc1/community-empowerment-training.png` | 2266913 | yes |
| `public/assets/Coconut_Water_Assets/floating pack.png` | 2264328 | yes |
| `public/assets/redesign/recipes/Basbousa Recipe Dessert (Middle Eastern Coconut Semolina Cake).png` | 2262722 | no |
| `public/assets/redesign/about/better-use-less-waste.png` | 2259977 | no |
| `public/assets/Ecosystem_Assets/Botanica-Shampoo-Lifestyle Scene.png` | 2251785 | yes |
| `public/assets/hero/Botanica-Shampoo-Lifestyle Scene.png` | 2251785 | yes |
| `public/assets/products/Botanica-Shampoo-Lifestyle Scene.png` | 2251785 | yes |
| `public/assets/skincare/Botanica-Shampoo-Lifestyle Scene.png` | 2251785 | yes |
| `public/assets/coconut/whole coconut mindset.png` | 2247556 | yes |
| `public/assets/farming/whole coconut mindset.png` | 2247556 | yes |
