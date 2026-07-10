# Performance Results

Date: July 10, 2026

## Testing conditions

- Before values: production Lighthouse baseline from `reports/performance-baseline/*.json`.
- After values: local production build served through `npm start`, measured with Lighthouse from `reports/performance-local-after/*.json`.
- Mobile mode: Lighthouse default mobile throttling.
- Desktop mode: Lighthouse desktop preset.
- Runtime image optimization: disabled through `images.unoptimized: true`.
- Static optimized assets: served from `/assets-optimized/...` via native `<picture>` sources.

## Before / after Lighthouse and payload values

| Page | Before score | After score | Before LCP | After LCP | Before FCP | After FCP | Before CLS | After CLS | Before TBT | After TBT | Before image transfer | After image transfer | Image reduction | After image requests | /_next/image | Mobile/Desktop optimized variants |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| about-desktop | 85 | 98 | 1.31s | 1.11s | 0.61s | 0.49s | 0.176 | 0.001 | 1ms | 0ms | 11.15 MB | 0.70 MB | 10.45 MB | 9 | 0 | 0/8 |
| about-mobile | 70 | 75 | 9.07s | 5.64s | 1.64s | 2.41s | 0.000 | 0.004 | 53ms | 114ms | 5.54 MB | 0.24 MB | 5.30 MB | 6 | 0 | 5/0 |
| founders-desktop | 76 | 98 | 2.57s | 1.14s | 0.30s | 0.45s | 0.000 | 0.000 | 41ms | 0ms | 35.52 MB | 1.73 MB | 33.79 MB | 10 | 0 | 0/9 |
| founders-mobile | 65 | 79 | 16.84s | 5.33s | 1.28s | 1.81s | 0.000 | 0.000 | 30ms | 90ms | 18.02 MB | 0.25 MB | 17.77 MB | 5 | 0 | 4/0 |
| home-desktop | 85 | 97 | 1.99s | 1.23s | 0.79s | 0.57s | 0.000 | 0.000 | 0ms | 0ms | 68.87 MB | 2.28 MB | 66.59 MB | 19 | 0 | 0/18 |
| home-mobile | 69 | 74 | 7.41s | 5.87s | 1.56s | 2.56s | 0.000 | 0.000 | 44ms | 128ms | 67.25 MB | 0.73 MB | 66.52 MB | 18 | 0 | 17/0 |
| journal-desktop | 69 | 97 | 4.09s | 1.26s | 0.66s | 0.53s | 0.000 | 0.000 | 51ms | 0ms | 41.54 MB | 1.77 MB | 39.77 MB | 14 | 0 | 0/13 |
| journal-mobile | 76 | 77 | 1.62s | 5.71s | 1.54s | 1.96s | 0.000 | 0.000 | 529ms | 93ms | 24.90 MB | 0.50 MB | 24.40 MB | 9 | 0 | 8/0 |
| journal-social-cocreation-hub-desktop | 91 | 99 | 0.64s | 0.97s | 0.56s | 0.53s | 0.000 | 0.004 | 39ms | 0ms | 19.78 MB | 0.96 MB | 18.82 MB | 8 | 0 | 0/7 |
| journal-social-cocreation-hub-mobile | 89 | 79 | 1.81s | 5.11s | 1.81s | 1.96s | 0.000 | 0.000 | 71ms | 90ms | 19.78 MB | 0.43 MB | 19.35 MB | 8 | 0 | 7/0 |
| recipes-desktop | 79 | 98 | 2.50s | 1.12s | 0.76s | 0.53s | 0.000 | 0.000 | 53ms | 0ms | 24.47 MB | 1.59 MB | 22.88 MB | 14 | 0 | 0/13 |
| recipes-mobile | 67 | 77 | 14.12s | 5.27s | 1.45s | 2.26s | 0.066 | 0.000 | 69ms | 92ms | 22.84 MB | 0.63 MB | 22.21 MB | 13 | 0 | 12/0 |
| shop-desktop | 83 | 98 | 1.70s | 1.12s | 0.52s | 0.57s | 0.000 | 0.000 | 2ms | 0ms | 64.99 MB | 2.02 MB | 62.97 MB | 17 | 0 | 0/16 |
| shop-mobile | 69 | 76 | 6.09s | 5.71s | 1.70s | 2.41s | 0.006 | 0.009 | 247ms | 91ms | 63.39 MB | 0.55 MB | 62.84 MB | 16 | 0 | 15/0 |
| sustainability-desktop | 55 | 98 | 7.73s | 1.08s | 7.72s | 0.53s | 0.000 | 0.001 | 0ms | 0ms | 0.66 MB | 2.72 MB | -2.06 MB | 18 | 0 | 0/17 |
| sustainability-mobile | 72 | 79 | 19.56s | 5.27s | 1.18s | 1.96s | 0.009 | 0.009 | 57ms | 87ms | 17.05 MB | 0.40 MB | 16.65 MB | 8 | 0 | 7/0 |

## Key payload wins

- Homepage mobile image transfer: **67.25 MB → 0.73 MB**.
- Homepage desktop image transfer: **68.87 MB → 2.28 MB**.
- Shop mobile image transfer: **63.39 MB → 0.55 MB**.
- Shop desktop image transfer: **64.99 MB → 2.02 MB**.
- Recipes mobile image transfer: **22.84 MB → 0.63 MB**.
- Founders mobile image transfer: **18.02 MB → 0.25 MB**.
- Journal desktop image transfer: **41.54 MB → 1.77 MB**.

## Mobile variant verification

- Local mobile Lighthouse runs selected mobile optimized variants and did not request desktop optimized variants on the measured public routes.
- Example: homepage mobile requested 17 mobile optimized variants and 0 desktop optimized variants.
- Example: shop mobile requested 15 mobile optimized variants and 0 desktop optimized variants.
- No measured local route used `/_next/image`.

## Largest remaining local transferred assets

| Size | Page | Type | Asset |
| ---: | --- | --- | --- |
| 385 KB | founders-desktop | Image | `/assets-optimized/founders/refined/afsala-muthali-portrait-06b9ae8e98-desktop.avif` |
| 374 KB | shop-desktop | Image | `/assets-optimized/shop/products/IndividualProduct_Utensils-175f3d14f5-desktop.avif` |
| 331 KB | founders-desktop | Image | `/assets-optimized/founders/refined/fazil-shersha-portrait-1860367246-desktop.avif` |
| 307 KB | sustainability-desktop | Image | `/assets-optimized/sustainability/rc1/carbon-sink-coconut-plantation-7e6a5837ac-desktop.avif` |
| 252 KB | home-desktop | Image | `/assets-optimized/home/refined/sustainably-yours-4k-df7122fb43-desktop.avif` |
| 252 KB | sustainability-desktop | Image | `/assets-optimized/home/refined/sustainably-yours-4k-df7122fb43-desktop.avif` |
| 240 KB | founders-desktop | Image | `/assets-optimized/sustainability/refined/raw-materials-farmer-23b6f2f48c-desktop.avif` |
| 240 KB | journal-desktop | Image | `/assets-optimized/sustainability/refined/raw-materials-farmer-23b6f2f48c-desktop.avif` |
| 240 KB | sustainability-desktop | Image | `/assets-optimized/sustainability/refined/raw-materials-farmer-23b6f2f48c-desktop.avif` |
| 227 KB | sustainability-desktop | Image | `/assets-optimized/sustainability/rc1/solar-clean-manufacturing-2ab52c1af1-desktop.avif` |
| 212 KB | shop-desktop | Image | `/assets-optimized/shop/products/IndividualProduct_Bowls-f9d43b2763-desktop.avif` |
| 196 KB | home-desktop | Image | `/assets-optimized/recipes/generated/seasonal-coconut-berry-salad-ed135df1f2-desktop.avif` |
| 196 KB | recipes-desktop | Image | `/assets-optimized/recipes/generated/seasonal-coconut-berry-salad-ed135df1f2-desktop.avif` |
| 196 KB | sustainability-desktop | Image | `/assets-optimized/recipes/generated/seasonal-coconut-berry-salad-ed135df1f2-desktop.avif` |
| 194 KB | founders-desktop | Image | `/assets-optimized/home/refined/made-with-care-4k-d703efc392-desktop.avif` |
| 194 KB | home-desktop | Image | `/assets-optimized/home/refined/made-with-care-4k-d703efc392-desktop.avif` |
| 194 KB | journal-desktop | Image | `/assets-optimized/home/refined/made-with-care-4k-d703efc392-desktop.avif` |
| 189 KB | journal-desktop | Image | `/assets-optimized/Ecosystem_Assets/coconut-oil-flat-lay-5269848679-desktop.avif` |
| 189 KB | journal-social-cocreation-hub-desktop | Image | `/assets-optimized/Ecosystem_Assets/coconut-oil-flat-lay-5269848679-desktop.avif` |
| 179 KB | recipes-desktop | Image | `/assets-optimized/recipes/generated/coconut-lime-rice-bowl-d89bc45fb8-desktop.avif` |
| 177 KB | shop-desktop | Image | `/assets-optimized/shop/products/IndividualProduct_CoconutSugar-788f478a99-desktop.avif` |
| 169 KB | founders-desktop | Image | `/assets-optimized/founders/refined/fazil-afsala-founder-hero-746217688d-desktop.avif` |
| 169 KB | journal-desktop | Image | `/assets-optimized/founders/refined/fazil-afsala-founder-hero-746217688d-desktop.avif` |
| 167 KB | sustainability-desktop | Image | `/assets-optimized/sustainability/rc1/plastic-bales-recycling-30ea88894e-desktop.avif` |
| 167 KB | home-desktop | Image | `/assets-optimized/home/refined/recipes-to-inspire-4k-322b096778-desktop.avif` |

## Remaining blockers

- Throttled mobile LCP is still around 5–6 seconds on several routes even after image bytes dropped sharply. The remaining work is likely render scheduling, route JavaScript, font timing, and above-the-fold animation hydration rather than raw image payload.
- Some interactive media systems still render in the component tree earlier than ideal. A future pass should load popup/modal/long-slider media only when opened or when the section nears the viewport.
- Sustainability desktop baseline had an unusually low image-transfer reading while LCP was very high; the after run is visually more representative and uses optimized assets.
- Production network, CDN cache warmth, geography, and analytics can shift the exact Lighthouse numbers. Production verification should be repeated after deployment and cache warmup.
