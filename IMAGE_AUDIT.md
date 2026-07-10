# Image Audit

Date: July 10, 2026

## Summary

- `public/assets` contains 124 raster image files.
- Total raster asset weight under `public/assets`: approximately 307 MB.
- Vercel runtime Image Optimization is now disabled through `images.unoptimized: true`.
- The project still uses `next/image`, but rendered image URLs should resolve directly to static paths such as `/assets/...` and `/images/...`, not `/_next/image`.
- No remote content images are required for the public page designs. External URLs found in the project are analytics, schema/social links, and historical failed-download notes inside `public/assets/ASSET_MANIFEST.json`.

## Largest images

| Size | File |
| ---: | --- |
| 10.06 MB | `public/assets/home/refined/made-with-care-4k.png` |
| 9.75 MB | `public/assets/home/refined/recipes-to-inspire-4k.png` |
| 9.23 MB | `public/assets/home/refined/sustainably-yours-4k.png` |
| 9.12 MB | `public/assets/home/refined/naturally-hydrating-4k.png` |
| 7.52 MB | `public/assets/home/refined/planet-editorial-4k.png` |
| 6.41 MB | `public/assets/shop/products/IndividualProduct_Utensils.png` |
| 5.17 MB | `public/assets/shop/products/IndividualProduct_Bowls.png` |
| 5.02 MB | `public/assets/shop/products/IndividualProduct_CoconutSugar.png` |
| 4.73 MB | `public/assets/shop/products/IndividualProduct_CoconutChips.png` |
| 4.55 MB | `public/assets/shop/products/IndividualProduct_GiftBox.png` |
| 4.42 MB | `public/assets/shop/products/IndividualProduct_Soap.png` |
| 4.36 MB | `public/assets/shop/products/IndividualProduct_CoconutOil.png` |
| 4.23 MB | `public/assets/shop/products/IndividualProduct_CoconutVinegar.png` |
| 4.11 MB | `public/assets/shop/products/IndividualProduct_MeltCO.png` |
| 4.03 MB | `public/assets/shop/products/IndividualProduct_CO-Water.png` |
| 3.93 MB | `public/assets/shop/products/IndividualProduct_FaceWash.png` |
| 3.86 MB | `public/assets/shop/products/IndividualProduct_CoconutAminos.png` |
| 3.86 MB | `public/assets/shop/products/IndividualProduct_HairOil.png` |
| 3.81 MB | `public/assets/shop/products/IndividualProduct_BodyLotion.png` |
| 3.51 MB | `public/assets/founders/refined/afsala-muthali-portrait.jpg` |

## Duplicate image groups

These files have identical hashes and can be consolidated later if references are updated carefully.

| Size | Duplicate files |
| ---: | --- |
| 2.45 MB | `public/assets/Ecosystem_Assets/Botanica-ingredient Composition.png`, `public/assets/skincare/Botanica-ingredient Composition.png` |
| 2.42 MB | `public/assets/Coconut_Water_Assets/hero composition.png`, `public/assets/hero/hero composition.png` |
| 2.41 MB | `public/assets/Melt_Ice_Cream_Assets/hero Composition.png`, `public/assets/hero/hero Composition 2.png` |
| 2.39 MB | `public/assets/Ecosystem_Assets/BOtanica-Facewash-Flat Lay.png`, `public/assets/skincare/BOtanica-Facewash-Flat Lay.png` |
| 2.35 MB | `public/assets/Ecosystem_Assets/botanica-group ecosystem.png`, `public/assets/skincare/botanica-group ecosystem.png` |
| 2.32 MB | `public/assets/farms/VIllage collection point.png`, `public/assets/generated/VIllage collection point.png` |
| 2.20 MB | `public/assets/Ecosystem_Assets/Botanica-Hero Composition.png`, `public/assets/hero/Botanica-Hero Composition.png`, `public/assets/skincare/Botanica-Hero Composition.png` |
| 2.15 MB | `public/assets/Ecosystem_Assets/Botanica-Shampoo-Lifestyle Scene.png`, `public/assets/hero/Botanica-Shampoo-Lifestyle Scene.png`, `public/assets/products/Botanica-Shampoo-Lifestyle Scene.png`, `public/assets/skincare/Botanica-Shampoo-Lifestyle Scene.png` |
| 2.14 MB | `public/assets/coconut/whole coconut mindset.png`, `public/assets/farming/whole coconut mindset.png`, `public/assets/generated/whole coconut mindset.png` |
| 2.13 MB | `public/assets/Ecosystem_Assets/Kitchen-oil-hero.png`, `public/assets/hero/Kitchen-oil-hero.png` |
| 2.13 MB | `public/assets/branding/coconut belt-world.png`, `public/assets/farming/coconut belt-world.png`, `public/assets/generated/coconut belt-world.png` |
| 2.05 MB | `public/assets/Melt_Ice_Cream_Assets/floating packshot.png`, `public/assets/products/floating packshot.png` |
| 2.05 MB | `public/assets/farming/coconut respect.png`, `public/assets/generated/coconut respect.png` |
| 1.96 MB | `public/assets/Ecosystem_Assets/coconut oil individual product-2.png`, `public/assets/products/coconut oil individual product-2.png` |
| 1.95 MB | `public/assets/Ecosystem_Assets/Botanica-Face Wash.png`, `public/assets/products/Botanica-Face Wash.png`, `public/assets/skincare/Botanica-Face Wash.png` |

## Unused candidates

This is a static-text search, so treat it as a candidate list rather than a deletion list. Some assets can be referenced indirectly through generated manifests or future CMS content.

- `public/assets/generated/VIllage collection point.png`
- `public/assets/generated/whole coconut mindset.png`
- `public/assets/generated/coconut belt-world.png`
- `public/assets/generated/coconut respect.png`
- `public/assets/textures/honest-truth-reference.jpg`
- `public/assets/transparent/mango-coconut-dessert.png`
- `public/assets/transparent/co-water-tetra-pack.png`
- `public/assets/transparent/coconut-care.png`
- `public/assets/transparent/co-water.png`
- `public/assets/transparent/co-social-media-pack.png`
- `public/assets/transparent/co-water-reserve.png`
- `public/assets/shop/products/IndividualProduct_Utensils.png`
- `public/assets/shop/products/IndividualProduct_CoconutVinegar.png`
- `public/assets/shop/products/IndividualProduct_CoconutChips.png`
- `public/assets/shop/products/IndividualProduct_Bowls.png`
- `public/assets/shop/products/IndividualProduct_Soap.png`
- `public/assets/shop/products/IndividualProduct_HairOil.png`
- `public/assets/hero/co-home-hero-solid-products.png`

## Pages/components using heavy assets

- Homepage: large refined editorial cards in `public/assets/home/refined`.
- Shop: individual product renders in `public/assets/shop/products`.
- About: zero-waste split and comparison images in `public/assets/about`.
- Recipes: recipe hero and recipe cards in `public/assets/recipes`.
- Sustainability: impact and initiative cards in `public/assets/sustainability`.
- Founders: founder portraits in `public/assets/founders` and social/founder images.
- Journal: community image and social co-creation assets.

## Recommended replacements

1. Keep `images.unoptimized: true` to stop Vercel Image Optimization cache writes.
2. Run `npm run optimize:images` locally before major deployments to create static AVIF/WebP/JPG variants in `public/assets/_optimized`.
3. In a controlled follow-up, update the heaviest page references to those generated static variants:
   - Homepage feature-card PNGs first.
   - Shop product PNGs second.
   - Sustainability impact-card PNGs third.
4. Consolidate duplicate folders only after verifying every referenced path.
5. Avoid adding new remote image URLs unless they are downloaded, optimized, and served as local static assets.
6. Keep hero images visually lossless; use AVIF for large photographic hero/background assets where quality holds up.
