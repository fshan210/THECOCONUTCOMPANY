# Image Audit

Date: July 10, 2026

## Summary

- Scanned `129` raster images under `public/assets` and `public/images`.
- Original scanned image weight: approximately **313.50 MB**.
- Generated non-destructive static variants into `public/assets-optimized/` for **73 active image sources** referenced by app pages/data.
- Optimized variant manifest: `lib/generated/optimized-image-manifest.json`.
- Machine-readable inventory: `lib/generated/image-inventory.json`.
- AVIF variant weight across generated mobile/tablet/desktop sizes: **20.44 MB**.
- JPEG fallback variant weight across generated mobile/tablet/desktop sizes: **35.11 MB**.
- Combined generated fallback set: **55.55 MB**.
- Vercel runtime Image Optimization remains disabled through `images.unoptimized: true`; public pages should not emit `/_next/image` URLs.
- The current implementation serves approved originals through responsive static AVIF/JPEG variants where public visual components use `ResponsiveImage`.

## Flag summary

| Flag | Count | Meaning |
| --- | ---: | --- |
| `large-raster-over-500kb` | 115 | Original raster is larger than 500 KB. |
| `png-photo-no-alpha` | 99 | PNG photograph can usually be delivered as AVIF/JPEG. |
| `unused-candidate-static-search` | 56 | Not found through app/data source search; treat as candidate only. |
| `hero-or-editorial-over-800kb` | 49 | Hero/editorial source is larger than 800 KB. |
| `duplicate-hash` | 40 | Exact duplicate exists elsewhere. |
| `wider-than-typical-display-need` | 13 | Source is wider than typical rendered need. |

## Largest original images

| Size | Dimensions | Format | Likely fold | File |
| ---: | ---: | --- | --- | --- |
| 10.06 MB | 3073×3840 | png | below-fold-or-shared | `/assets/home/refined/made-with-care-4k.png` |
| 9.75 MB | 3073×3840 | png | below-fold-or-shared | `/assets/home/refined/recipes-to-inspire-4k.png` |
| 9.23 MB | 2456×3840 | png | below-fold-or-shared | `/assets/home/refined/sustainably-yours-4k.png` |
| 9.12 MB | 3073×3840 | png | below-fold-or-shared | `/assets/home/refined/naturally-hydrating-4k.png` |
| 7.52 MB | 3840×2161 | png | below-fold-or-shared | `/assets/home/refined/planet-editorial-4k.png` |
| 6.41 MB | 2048×2048 | png | below-fold-or-shared | `/assets/shop/products/IndividualProduct_Utensils.png` |
| 5.17 MB | 2048×2048 | png | below-fold-or-shared | `/assets/shop/products/IndividualProduct_Bowls.png` |
| 5.02 MB | 2048×2048 | png | below-fold-or-shared | `/assets/shop/products/IndividualProduct_CoconutSugar.png` |
| 4.73 MB | 2048×2048 | png | below-fold-or-shared | `/assets/shop/products/IndividualProduct_CoconutChips.png` |
| 4.55 MB | 2048×2048 | png | below-fold-or-shared | `/assets/shop/products/IndividualProduct_GiftBox.png` |
| 4.42 MB | 2048×2048 | png | below-fold-or-shared | `/assets/shop/products/IndividualProduct_Soap.png` |
| 4.36 MB | 2048×2048 | png | below-fold-or-shared | `/assets/shop/products/IndividualProduct_CoconutOil.png` |
| 4.23 MB | 2048×2048 | png | below-fold-or-shared | `/assets/shop/products/IndividualProduct_CoconutVinegar.png` |
| 4.11 MB | 2048×2048 | png | below-fold-or-shared | `/assets/shop/products/IndividualProduct_MeltCO.png` |
| 4.03 MB | 2048×2048 | png | below-fold-or-shared | `/assets/shop/products/IndividualProduct_CO-Water.png` |
| 3.93 MB | 2048×2048 | png | below-fold-or-shared | `/assets/shop/products/IndividualProduct_FaceWash.png` |
| 3.86 MB | 2048×2048 | png | below-fold-or-shared | `/assets/shop/products/IndividualProduct_CoconutAminos.png` |
| 3.86 MB | 2048×2048 | png | below-fold-or-shared | `/assets/shop/products/IndividualProduct_HairOil.png` |
| 3.81 MB | 2048×2048 | png | below-fold-or-shared | `/assets/shop/products/IndividualProduct_BodyLotion.png` |
| 3.51 MB | 3024×4032 | jpg | above-or-near-fold | `/assets/founders/refined/afsala-muthali-portrait.jpg` |
| 3.11 MB | 1672×941 | png | below-fold-or-shared | `/assets/sustainability/rc1/carbon-sink-coconut-plantation.png` |
| 3.04 MB | 3024×4032 | jpg | above-or-near-fold | `/assets/founders/refined/fazil-shersha-portrait.jpg` |
| 2.85 MB | 1448×1086 | png | below-fold-or-shared | `/assets/sustainability/refined/raw-materials-farmer.png` |
| 2.79 MB | 1672×941 | png | below-fold-or-shared | `/assets/sustainability/rc1/solar-clean-manufacturing.png` |
| 2.69 MB | 1122×1402 | png | below-fold-or-shared | `/assets/Ecosystem_Assets/coconut oil-flat lay.png` |

## Largest generated AVIF variants

| Size | Variant | Width | File | Source |
| ---: | --- | ---: | --- | --- |
| 385 KB | desktop | 1920 | `/assets-optimized/founders/refined/afsala-muthali-portrait-06b9ae8e98-desktop.avif` | `/assets/founders/refined/afsala-muthali-portrait.jpg` |
| 373 KB | desktop | 1920 | `/assets-optimized/shop/products/IndividualProduct_Utensils-175f3d14f5-desktop.avif` | `/assets/shop/products/IndividualProduct_Utensils.png` |
| 348 KB | desktop | 1920 | `/assets-optimized/about/co-zero-waste-palm-editorial-4k-949b05883f-desktop.avif` | `/assets/about/co-zero-waste-palm-editorial-4k.avif` |
| 331 KB | desktop | 1920 | `/assets-optimized/founders/refined/fazil-shersha-portrait-1860367246-desktop.avif` | `/assets/founders/refined/fazil-shersha-portrait.jpg` |
| 307 KB | desktop | 1672 | `/assets-optimized/sustainability/rc1/carbon-sink-coconut-plantation-7e6a5837ac-desktop.avif` | `/assets/sustainability/rc1/carbon-sink-coconut-plantation.png` |
| 252 KB | desktop | 1920 | `/assets-optimized/home/refined/sustainably-yours-4k-df7122fb43-desktop.avif` | `/assets/home/refined/sustainably-yours-4k.png` |
| 240 KB | desktop | 1448 | `/assets-optimized/sustainability/refined/raw-materials-farmer-23b6f2f48c-desktop.avif` | `/assets/sustainability/refined/raw-materials-farmer.png` |
| 226 KB | desktop | 1672 | `/assets-optimized/sustainability/rc1/solar-clean-manufacturing-2ab52c1af1-desktop.avif` | `/assets/sustainability/rc1/solar-clean-manufacturing.png` |
| 211 KB | desktop | 1920 | `/assets-optimized/shop/products/IndividualProduct_Bowls-f9d43b2763-desktop.avif` | `/assets/shop/products/IndividualProduct_Bowls.png` |
| 196 KB | tablet | 1280 | `/assets-optimized/shop/products/IndividualProduct_Utensils-175f3d14f5-tablet.avif` | `/assets/shop/products/IndividualProduct_Utensils.png` |
| 196 KB | desktop | 1254 | `/assets-optimized/recipes/generated/seasonal-coconut-berry-salad-ed135df1f2-desktop.avif` | `/assets/recipes/generated/seasonal-coconut-berry-salad.jpg` |
| 194 KB | desktop | 1920 | `/assets-optimized/home/refined/made-with-care-4k-d703efc392-desktop.avif` | `/assets/home/refined/made-with-care-4k.png` |
| 189 KB | desktop | 1122 | `/assets-optimized/Ecosystem_Assets/coconut-oil-flat-lay-5269848679-desktop.avif` | `/assets/Ecosystem_Assets/coconut oil-flat lay.png` |
| 187 KB | tablet | 1280 | `/assets-optimized/about/co-zero-waste-palm-editorial-4k-949b05883f-tablet.avif` | `/assets/about/co-zero-waste-palm-editorial-4k.avif` |
| 181 KB | tablet | 1280 | `/assets-optimized/sustainability/rc1/carbon-sink-coconut-plantation-7e6a5837ac-tablet.avif` | `/assets/sustainability/rc1/carbon-sink-coconut-plantation.png` |
| 181 KB | tablet | 1280 | `/assets-optimized/sustainability/refined/raw-materials-farmer-23b6f2f48c-tablet.avif` | `/assets/sustainability/refined/raw-materials-farmer.png` |
| 179 KB | desktop | 1448 | `/assets-optimized/recipes/generated/coconut-lime-rice-bowl-d89bc45fb8-desktop.avif` | `/assets/recipes/generated/coconut-lime-rice-bowl.jpg` |
| 176 KB | desktop | 1920 | `/assets-optimized/shop/products/IndividualProduct_CoconutSugar-788f478a99-desktop.avif` | `/assets/shop/products/IndividualProduct_CoconutSugar.png` |
| 174 KB | tablet | 1254 | `/assets-optimized/recipes/generated/seasonal-coconut-berry-salad-ed135df1f2-tablet.avif` | `/assets/recipes/generated/seasonal-coconut-berry-salad.jpg` |
| 169 KB | tablet | 1122 | `/assets-optimized/Ecosystem_Assets/coconut-oil-flat-lay-5269848679-tablet.avif` | `/assets/Ecosystem_Assets/coconut oil-flat lay.png` |

## Largest active source assets with generated variants

These are the largest source assets with responsive variants available. References in the main public reference pages have been routed through `ResponsiveImage`.

| Size | File | Referenced by |
| ---: | --- | --- |
| 10.06 MB | `/assets/home/refined/made-with-care-4k.png` | `components/founders/ReferenceFoundersPage.tsx`<br>`components/home/ReferenceHomePage.tsx`<br>`data/journal.ts` |
| 9.75 MB | `/assets/home/refined/recipes-to-inspire-4k.png` | `components/home/ReferenceHomePage.tsx` |
| 9.23 MB | `/assets/home/refined/sustainably-yours-4k.png` | `components/home/ReferenceHomePage.tsx`<br>`components/sustainability/ReferenceSustainabilityPage.tsx` |
| 9.12 MB | `/assets/home/refined/naturally-hydrating-4k.png` | `components/founders/ReferenceFoundersPage.tsx`<br>`components/home/ReferenceHomePage.tsx`<br>`components/journal/ReferenceJournalPage.tsx`<br>`components/launch/LaunchExperience.tsx`<br>`data/journal.ts` |
| 7.52 MB | `/assets/home/refined/planet-editorial-4k.png` | `components/home/ReferenceHomePage.tsx` |
| 6.41 MB | `/assets/shop/products/IndividualProduct_Utensils.png` | `components/shop/ReferenceShopPage.tsx` |
| 5.17 MB | `/assets/shop/products/IndividualProduct_Bowls.png` | `components/shop/ReferenceShopPage.tsx` |
| 5.02 MB | `/assets/shop/products/IndividualProduct_CoconutSugar.png` | `components/home/ReferenceHomePage.tsx`<br>`components/recipes/recipe-data.ts`<br>`components/shop/ReferenceShopPage.tsx` |
| 4.73 MB | `/assets/shop/products/IndividualProduct_CoconutChips.png` | `components/recipes/recipe-data.ts`<br>`components/shop/ReferenceShopPage.tsx` |
| 4.55 MB | `/assets/shop/products/IndividualProduct_GiftBox.png` | `components/home/ReferenceHomePage.tsx`<br>`components/shop/ReferenceShopPage.tsx` |
| 4.42 MB | `/assets/shop/products/IndividualProduct_Soap.png` | `components/shop/ReferenceShopPage.tsx` |
| 4.36 MB | `/assets/shop/products/IndividualProduct_CoconutOil.png` | `components/home/ReferenceHomePage.tsx`<br>`components/recipes/recipe-data.ts`<br>`components/shop/ReferenceShopPage.tsx` |
| 4.23 MB | `/assets/shop/products/IndividualProduct_CoconutVinegar.png` | `components/shop/ReferenceShopPage.tsx` |
| 4.11 MB | `/assets/shop/products/IndividualProduct_MeltCO.png` | `components/home/ReferenceHomePage.tsx`<br>`components/recipes/recipe-data.ts`<br>`components/shop/ReferenceShopPage.tsx` |
| 4.03 MB | `/assets/shop/products/IndividualProduct_CO-Water.png` | `components/home/ReferenceHomePage.tsx`<br>`components/recipes/recipe-data.ts`<br>`components/shop/ReferenceShopPage.tsx` |
| 3.93 MB | `/assets/shop/products/IndividualProduct_FaceWash.png` | `components/home/ReferenceHomePage.tsx`<br>`components/shop/ReferenceShopPage.tsx` |
| 3.86 MB | `/assets/shop/products/IndividualProduct_CoconutAminos.png` | `components/home/ReferenceHomePage.tsx`<br>`components/recipes/recipe-data.ts`<br>`components/shop/ReferenceShopPage.tsx` |
| 3.86 MB | `/assets/shop/products/IndividualProduct_HairOil.png` | `components/shop/ReferenceShopPage.tsx` |
| 3.81 MB | `/assets/shop/products/IndividualProduct_BodyLotion.png` | `components/home/ReferenceHomePage.tsx`<br>`components/shop/ReferenceShopPage.tsx` |
| 3.51 MB | `/assets/founders/refined/afsala-muthali-portrait.jpg` | `components/founders/ReferenceFoundersPage.tsx` |
| 3.11 MB | `/assets/sustainability/rc1/carbon-sink-coconut-plantation.png` | `components/sustainability/ReferenceSustainabilityPage.tsx` |
| 3.04 MB | `/assets/founders/refined/fazil-shersha-portrait.jpg` | `components/founders/ReferenceFoundersPage.tsx` |
| 2.85 MB | `/assets/sustainability/refined/raw-materials-farmer.png` | `components/founders/ReferenceFoundersPage.tsx`<br>`components/sustainability/ReferenceSustainabilityPage.tsx`<br>`data/journal.ts` |
| 2.79 MB | `/assets/sustainability/rc1/solar-clean-manufacturing.png` | `components/sustainability/ReferenceSustainabilityPage.tsx` |
| 2.69 MB | `/assets/Ecosystem_Assets/coconut oil-flat lay.png` | `data/journal.ts` |

## Duplicate image groups

These files have identical hashes and can be consolidated later if references are updated carefully.

| Size | Duplicate files |
| ---: | --- |
| 2.45 MB | `/assets/Ecosystem_Assets/Botanica-ingredient Composition.png`<br>`/assets/skincare/Botanica-ingredient Composition.png` |
| 2.42 MB | `/assets/Coconut_Water_Assets/hero composition.png`<br>`/assets/hero/hero composition.png` |
| 2.41 MB | `/assets/Melt_Ice_Cream_Assets/hero Composition.png`<br>`/assets/hero/hero Composition 2.png` |
| 2.39 MB | `/assets/Ecosystem_Assets/BOtanica-Facewash-Flat Lay.png`<br>`/assets/skincare/BOtanica-Facewash-Flat Lay.png` |
| 2.35 MB | `/assets/Ecosystem_Assets/botanica-group ecosystem.png`<br>`/assets/skincare/botanica-group ecosystem.png` |
| 2.32 MB | `/assets/farms/VIllage collection point.png`<br>`/assets/generated/VIllage collection point.png` |
| 2.20 MB | `/assets/Ecosystem_Assets/Botanica-Hero Composition.png`<br>`/assets/hero/Botanica-Hero Composition.png`<br>`/assets/skincare/Botanica-Hero Composition.png` |
| 2.15 MB | `/assets/Ecosystem_Assets/Botanica-Shampoo-Lifestyle Scene.png`<br>`/assets/hero/Botanica-Shampoo-Lifestyle Scene.png`<br>`/assets/products/Botanica-Shampoo-Lifestyle Scene.png`<br>`/assets/skincare/Botanica-Shampoo-Lifestyle Scene.png` |
| 2.14 MB | `/assets/coconut/whole coconut mindset.png`<br>`/assets/farming/whole coconut mindset.png`<br>`/assets/generated/whole coconut mindset.png` |
| 2.13 MB | `/assets/Ecosystem_Assets/Kitchen-oil-hero.png`<br>`/assets/hero/Kitchen-oil-hero.png` |
| 2.13 MB | `/assets/branding/coconut belt-world.png`<br>`/assets/farming/coconut belt-world.png`<br>`/assets/generated/coconut belt-world.png` |
| 2.05 MB | `/assets/Melt_Ice_Cream_Assets/floating packshot.png`<br>`/assets/products/floating packshot.png` |
| 2.05 MB | `/assets/farming/coconut respect.png`<br>`/assets/generated/coconut respect.png` |
| 1.96 MB | `/assets/Ecosystem_Assets/coconut oil individual product-2.png`<br>`/assets/products/coconut oil individual product-2.png` |
| 1.95 MB | `/assets/Ecosystem_Assets/Botanica-Face Wash.png`<br>`/assets/products/Botanica-Face Wash.png`<br>`/assets/skincare/Botanica-Face Wash.png` |

## Unused candidates

Static app/data search did not find direct references to these large files. Do not delete automatically; some can be CMS/future assets or referenced indirectly.

| Size | File |
| ---: | --- |
| 2.45 MB | `/assets/generated/vap.png` |
| 2.45 MB | `/assets/Ecosystem_Assets/Botanica-ingredient Composition.png` |
| 2.45 MB | `/assets/skincare/Botanica-ingredient Composition.png` |
| 2.42 MB | `/assets/Coconut_Water_Assets/hero composition.png` |
| 2.42 MB | `/assets/hero/hero composition.png` |
| 2.41 MB | `/assets/Melt_Ice_Cream_Assets/hero Composition.png` |
| 2.41 MB | `/assets/hero/hero Composition 2.png` |
| 2.37 MB | `/assets/farms/village aggregation point.png` |
| 2.36 MB | `/assets/recipes/Coconut smoothie Bowl.png` |
| 2.35 MB | `/assets/Ecosystem_Assets/botanica-group ecosystem.png` |
| 2.35 MB | `/assets/skincare/botanica-group ecosystem.png` |
| 2.34 MB | `/assets/Melt_Ice_Cream_Assets/lifestyle Scene.png` |
| 2.32 MB | `/assets/farms/VIllage collection point.png` |
| 2.32 MB | `/assets/generated/VIllage collection point.png` |
| 2.30 MB | `/assets/Coconut_Water_Assets/ingridient composition.png` |
| 2.27 MB | `/assets/transparent/mango-coconut-dessert.png` |
| 2.25 MB | `/assets/transparent/coconut-care.png` |
| 2.21 MB | `/assets/recipes/coconut mango cooler.png` |
| 2.20 MB | `/assets/Ecosystem_Assets/Botanica-Hero Composition.png` |
| 2.20 MB | `/assets/hero/Botanica-Hero Composition.png` |
| 2.20 MB | `/assets/skincare/Botanica-Hero Composition.png` |
| 2.16 MB | `/assets/Coconut_Water_Assets/floating pack.png` |
| 2.13 MB | `/assets/Ecosystem_Assets/Kitchen-oil-hero.png` |
| 2.13 MB | `/assets/hero/Kitchen-oil-hero.png` |
| 2.13 MB | `/assets/branding/coconut belt-world.png` |
| 2.13 MB | `/assets/farming/coconut belt-world.png` |
| 2.13 MB | `/assets/generated/coconut belt-world.png` |
| 2.09 MB | `/assets/Melt_Ice_Cream_Assets/ingredient composition.png` |
| 2.06 MB | `/assets/transparent/founder-journey.png` |
| 2.05 MB | `/assets/transparent/co-social-media-pack.png` |

## Page/media findings

- Homepage, shop, recipes, founders, sustainability, journal, and social co-creation pages were the main visual payload drivers before this pass.
- Mobile previously received desktop-sized PNG/JPG originals on several pages after Vercel runtime image optimization was disabled.
- The new `ResponsiveImage` layer emits `<picture>` sources in this order: mobile AVIF, tablet AVIF, desktop AVIF, then JPEG fallback.
- Below-the-fold images default to lazy loading and low fetch priority. LCP/hero images can opt into eager loading through the existing `priority` prop.
- More Products and modal images are still part of the component tree when their components render; a later interaction-only chunk pass can further delay those assets until open without changing visuals.

## Recommended follow-ups

1. Keep running `npm run optimize:images` before deployment whenever new images are added.
2. Consolidate duplicate source folders only after a separate safe reference cleanup.
3. Keep approved source assets as originals, but never reference multi-megabyte PNG photographs directly from public pages.
4. If any future image appears degraded, regenerate just that source asset and rerun the optimizer rather than returning to Vercel runtime optimization.
5. For Phase 2 performance, consider route-level dynamic imports for heavy journal/social interactions and popup-only image loading.
