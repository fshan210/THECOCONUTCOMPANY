# .CO manual website image contract

This is the handoff contract for manually produced website editorial images. A path being wired does not make its image complete. Approved packaging must be composited from the locked files in `public/brand-reference`; never redraw, retype, stretch, crop through, or generatively alter a package.

Status vocabulary: `existing`, `mapped`, `awaiting manual generation`, `integrated`, `approved`.

## Route audit

| Route | Component / section | Current source and behaviour | Issue / proposed mapping | Manual required |
|---|---|---|---|---|
| `/` | `ReferenceHomePage` / hero | Existing desktop and mobile 16:9 / 3:4 composites; responsive sources, priority | Resolve the manual ecosystem hero first; retain approved composites as fallback | Yes |
| `/` | product-family transitions | Existing 2:1 and 4:5 Origin, Kitchen, BOTANiCA and MELT composites; Water lifestyle fallback | Resolve five manual transition pairs; fixed ratio, lazy, restrained motion | Yes |
| `/shop` | product cards | Legacy single PNGs with cover crop | Approved primary packshots from the manifest; neutral contained presentation | No for nine mapped families |
| `/shop` | Quick View | Previously one image plus unrelated thumbnails | Ordered approved front / three-quarter / back / side / macro / usage / lifestyle gallery | No for available views |
| `/about` | `JourneyScrollStory` | Six existing 4:3 milestone composites repeated on mobile | Resolve six manual desktop/mobile journey pairs, milestone-specific fallbacks | Yes |
| `/about` | sliding puzzle | Legacy campaign/card assets | Nine centred approved product-family derivatives; manual final slots | Yes for final puzzle art |
| `/sustainability` | hero / sourcing | Existing editorial hero and farmer imagery | Dedicated 16:9 / 4:5 manual pairs with no unsupported claims | Yes |
| `/founders` | hero / story | Approved founder composite and process fallback | Dedicated hero pair and story image; never generate founder faces | Yes |
| `/recipes` | hero | Existing semantically correct recipe editorial | Dedicated 16:9 / 3:4 manual pair | Yes |
| `/journal` | cards / article hero | Data-driven editorial imagery | Article-specific card and hero naming contract | Per article |
| `/products` | product families | Existing Water, Kitchen, BOTANiCA and MELT media | Use manifest galleries rather than repeating the homepage hero | No for mapped families |
| `/cart`, account saves | thumbnails | Catalog product image | Same approved primary mapping as Shop | No |

## Required homepage files

| Exact path | Dimensions / ratio | Composition and safe zone | Locked sources | Fallback | Status |
|---|---|---|---|---|---|
| `public/images/website/manual/home/hero/CO_WEBSITE_HOME_ECOSYSTEM_HERO_DESKTOP_MASTER.webp` | 2400×1350, 16:9 | Calm ecosystem, max four products, text-safe left | Water + one Kitchen + BOTANiCA + MELT masters | existing desktop hero | integrated; awaiting manual generation |
| `public/images/website/manual/home/hero/CO_WEBSITE_HOME_ECOSYSTEM_HERO_MOBILE_MASTER.webp` | 1800×2400, 3:4 | Native vertical hierarchy, text-safe upper area | Same locked masters, never a cropped desktop image | existing mobile hero | integrated; awaiting manual generation |
| `public/images/website/manual/home/transitions/CO_WEBSITE_TRANSITION_ORIGIN_{DESKTOP|MOBILE}_MASTER.webp` | 2400×1200 / 1600×2000 | Source → care → modern product; destination side clear | Water packshot | existing Origin pair | integrated; awaiting manual generation |
| `public/images/website/manual/home/transitions/CO_WEBSITE_TRANSITION_WATER_{DESKTOP|MOBILE}_MASTER.webp` | 2400×1200 / 1600×2000 | Everyday clean hydration, text-safe left | Water lifestyle/packshot | approved Water lifestyle | integrated; awaiting manual generation |
| `public/images/website/manual/home/transitions/CO_WEBSITE_TRANSITION_KITCHEN_{DESKTOP|MOBILE}_MASTER.webp` | 2400×1200 / 1600×2000 | Oil, flour and milk on supported surface, text-safe left | Exactly three Kitchen masters | existing Kitchen pair | integrated; awaiting manual generation |
| `public/images/website/manual/home/transitions/CO_WEBSITE_TRANSITION_BOTANICA_{DESKTOP|MOBILE}_MASTER.webp` | 2400×1200 / 1600×2000 | Diffused bathroom light, restrained reflection | Two or three BOTANiCA masters | existing BOTANiCA pair | integrated; awaiting manual generation |
| `public/images/website/manual/home/transitions/CO_WEBSITE_TRANSITION_MELT_{DESKTOP|MOBILE}_MASTER.webp` | 2400×1200 / 1600×2000 | Warm slow-living scene; tub unobscured | MELT tub | existing MELT pair | integrated; awaiting manual generation |

No external text is allowed in these editorials. Printed text within the locked pack is valid.

## About journey

Every prefix below takes both `DESKTOP_MASTER.webp` (2000×1500, 4:3) and `MOBILE_MASTER.webp` (1600×2000, 4:5) in `public/images/website/manual/about/journey/`. Component: `components/about/JourneyScrollStory.tsx`.

| Prefix | Real milestone | Fallback | Status |
|---|---|---|---|
| `CO_WEBSITE_ABOUT_JOURNEY_01_it_all_started_` | 2020 — It all started | timeline 01 | integrated; awaiting manual generation |
| `CO_WEBSITE_ABOUT_JOURNEY_02_building_the_foundation_` | 2021 — Building the foundation | timeline 02 | integrated; awaiting manual generation |
| `CO_WEBSITE_ABOUT_JOURNEY_03_first_product_direction_` | 2022 — First product direction | timeline 03 | integrated; awaiting manual generation |
| `CO_WEBSITE_ABOUT_JOURNEY_04_growing_the_ecosystem_` | 2023 — Growing the ecosystem | timeline 04 | integrated; awaiting manual generation |
| `CO_WEBSITE_ABOUT_JOURNEY_05_rooted_partnerships_` | 2024 — Rooted partnerships | timeline 05 | integrated; awaiting manual generation |
| `CO_WEBSITE_ABOUT_JOURNEY_06_made_for_living_` | Next — Made for living | timeline 06 | integrated; awaiting manual generation |

## Remaining contracts

| Path / pattern | Dimensions | Rules | Fallback / status |
|---|---|---|---|
| `manual/sustainability/CO_WEBSITE_SUSTAINABILITY_HERO_{DESKTOP|MOBILE}_MASTER.webp` | 2400×1350 / 1800×2400 | No unsupported impact claim; warm sourcing context | editorial hero; awaiting manual |
| `manual/sustainability/CO_WEBSITE_SUSTAINABILITY_SOURCING_{DESKTOP|MOBILE}_MASTER.webp` | 2400×1200 / 1600×2000 | Human-scale sourcing, no fabricated certification | farmer image; awaiting manual |
| `manual/founders/CO_WEBSITE_FOUNDERS_HERO_{DESKTOP|MOBILE}_MASTER.webp` | 2400×1350 / 1800×2400 | Approved founder photography only | approved founder hero; awaiting manual |
| `manual/founders/CO_WEBSITE_FOUNDERS_STORY_01_MASTER.webp` | 2000×1500 | Approved people or brand process; no invented face | process fallback; awaiting manual |
| `manual/recipes/CO_WEBSITE_RECIPES_HERO_{DESKTOP|MOBILE}_MASTER.webp` | 2400×1350 / 1800×2400 | Recipe and product must match; text-safe left | recipe hero; awaiting manual |
| `manual/journal/CO_WEBSITE_JOURNAL_<ARTICLE_SLUG>_{CARD|HERO}_MASTER.webp` | 1600×1200 / 2400×1350 | One factual story; no unrelated product | relevant data fallback; per article |
| `manual/puzzle/CO_PUZZLE_<PRODUCT>_MASTER.webp` | 1600×1600, 1:1 | One centred product, minimal set, full silhouette | approved contained packshot; awaiting manual |

Puzzle `<PRODUCT>` values: `COCONUT_WATER`, `COCONUT_OIL`, `COCONUT_FLOUR`, `COCONUT_MILK`, `MELT`, `BOTANICA_SHAMPOO`, `BOTANICA_FACE_WASH`, `BOTANICA_HAIR_SERUM`, `BOTANICA_MOISTURIZER`.

## Integration rules

- Resolver priority: manual final → approved website composite → approved lifestyle → approved packshot → neutral CSS placeholder.
- Product galleries always use `object-fit: contain`; zoom never crops printed packaging.
- Only the homepage LCP image is eager/high priority. Transitions, gallery slides and journey media are lazy.
- Desktop and mobile sources are independent. A missing mobile final uses the safest approved fallback.
- After placing a manual file at its exact path, run `npm run assets:map`; component code does not change.
- A manual file becomes `approved` only after packaging fidelity, physical logic, responsive crop and compression QA.
