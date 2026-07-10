# Performance Baseline

Date: July 10, 2026

## Testing conditions

- Target: production site at https://cothecoconutcompany.com
- Tool: Lighthouse via local Google Chrome headless
- Categories: Performance only
- Mobile: Lighthouse default mobile throttling
- Desktop: Lighthouse desktop preset
- Vercel Image Optimization status: disabled before this performance pass
- Raw reports: `reports/performance-baseline/*.json`

## Route metrics

| Page / mode | Score | LCP | FCP | CLS | TBT | Speed Index | Total transfer | Image transfer | Image requests |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| about-desktop | 85 | 1.31s | 0.61s | 0.176 | 1ms | 1.94s | 11.91 MB | 11.15 MB | 11 |
| about-mobile | 70 | 9.07s | 1.64s | 0.000 | 53ms | 5.72s | 6.33 MB | 5.54 MB | 8 |
| founders-desktop | 76 | 2.57s | 0.30s | 0.000 | 41ms | 8.28s | 36.27 MB | 35.52 MB | 12 |
| founders-mobile | 65 | 16.84s | 1.28s | 0.000 | 30ms | 11.60s | 18.75 MB | 18.02 MB | 7 |
| home-desktop | 85 | 1.99s | 0.79s | 0.000 | 0ms | 2.29s | 69.67 MB | 68.87 MB | 21 |
| home-mobile | 69 | 7.41s | 1.56s | 0.000 | 44ms | 6.99s | 68.05 MB | 67.25 MB | 20 |
| journal-desktop | 69 | 4.09s | 0.66s | 0.000 | 51ms | 4.69s | 42.31 MB | 41.54 MB | 16 |
| journal-mobile | 76 | 1.62s | 1.54s | 0.000 | 529ms | 14.63s | 25.65 MB | 24.90 MB | 11 |
| journal-social-cocreation-hub-desktop | 91 | 0.64s | 0.56s | 0.000 | 39ms | 3.63s | 20.54 MB | 19.78 MB | 9 |
| journal-social-cocreation-hub-mobile | 89 | 1.81s | 1.81s | 0.000 | 71ms | 10.47s | 20.51 MB | 19.78 MB | 9 |
| recipes-desktop | 79 | 2.50s | 0.76s | 0.000 | 53ms | 2.79s | 25.25 MB | 24.47 MB | 16 |
| recipes-mobile | 67 | 14.12s | 1.45s | 0.066 | 69ms | 7.01s | 23.60 MB | 22.84 MB | 15 |
| shop-desktop | 83 | 1.70s | 0.52s | 0.000 | 2ms | 5.47s | 65.80 MB | 64.99 MB | 19 |
| shop-mobile | 69 | 6.09s | 1.70s | 0.006 | 247ms | 5.09s | 64.18 MB | 63.39 MB | 18 |
| sustainability-desktop | 55 | 7.73s | 7.72s | 0.000 | 0ms | 15.81s | 0.70 MB | 0.66 MB | 19 |
| sustainability-mobile | 72 | 19.56s | 1.18s | 0.009 | 57ms | 4.48s | 17.80 MB | 17.05 MB | 10 |

## Worst LCP pages

| Rank | Page / mode | LCP | Image transfer | Total transfer |
| ---: | --- | ---: | ---: | ---: |
| 1 | sustainability-mobile | 19.56s | 17.05 MB | 17.80 MB |
| 2 | founders-mobile | 16.84s | 18.02 MB | 18.75 MB |
| 3 | recipes-mobile | 14.12s | 22.84 MB | 23.60 MB |
| 4 | about-mobile | 9.07s | 5.54 MB | 6.33 MB |
| 5 | sustainability-desktop | 7.73s | 0.66 MB | 0.70 MB |
| 6 | home-mobile | 7.41s | 67.25 MB | 68.05 MB |
| 7 | shop-mobile | 6.09s | 63.39 MB | 64.18 MB |
| 8 | journal-desktop | 4.09s | 41.54 MB | 42.31 MB |

## Largest 20 transferred assets

| Size | Page / mode | Asset | Type |
| ---: | --- | --- | --- |
| 10.06 MB | home-mobile | `/assets/home/refined/made-with-care-4k.png` | Image |
| 10.06 MB | home-desktop | `/assets/home/refined/made-with-care-4k.png` | Image |
| 10.06 MB | founders-desktop | `/assets/home/refined/made-with-care-4k.png` | Image |
| 10.06 MB | journal-desktop | `/assets/home/refined/made-with-care-4k.png` | Image |
| 9.76 MB | home-desktop | `/assets/home/refined/recipes-to-inspire-4k.png` | Image |
| 9.76 MB | home-mobile | `/assets/home/refined/recipes-to-inspire-4k.png` | Image |
| 9.24 MB | home-desktop | `/assets/home/refined/sustainably-yours-4k.png` | Image |
| 9.24 MB | home-mobile | `/assets/home/refined/sustainably-yours-4k.png` | Image |
| 9.12 MB | journal-desktop | `/assets/home/refined/naturally-hydrating-4k.png` | Image |
| 9.12 MB | founders-desktop | `/assets/home/refined/naturally-hydrating-4k.png` | Image |
| 9.12 MB | founders-mobile | `/assets/home/refined/naturally-hydrating-4k.png` | Image |
| 9.12 MB | journal-social-cocreation-hub-mobile | `/assets/home/refined/naturally-hydrating-4k.png` | Image |
| 9.12 MB | journal-social-cocreation-hub-desktop | `/assets/home/refined/naturally-hydrating-4k.png` | Image |
| 9.12 MB | journal-mobile | `/assets/home/refined/naturally-hydrating-4k.png` | Image |
| 9.12 MB | home-desktop | `/assets/home/refined/naturally-hydrating-4k.png` | Image |
| 9.12 MB | home-mobile | `/assets/home/refined/naturally-hydrating-4k.png` | Image |
| 7.53 MB | home-mobile | `/assets/home/refined/planet-editorial-4k.png` | Image |
| 7.53 MB | home-desktop | `/assets/home/refined/planet-editorial-4k.png` | Image |
| 6.42 MB | shop-desktop | `/assets/shop/products/IndividualProduct_Utensils.png` | Image |
| 6.42 MB | shop-mobile | `/assets/shop/products/IndividualProduct_Utensils.png` | Image |

## Findings

- The highest image payload pages before optimization were homepage (~67-69 MB), shop (~63-65 MB), journal (~20-42 MB), recipes (~23-24 MB), and founders mobile (~18 MB).
- The largest recurring offenders were photographic PNGs: homepage feature cards around 7-10 MB each and shop product renders around 4-6 MB each.
- Mobile was receiving desktop-sized imagery on several routes because static source files were served directly after disabling Vercel runtime image optimization.
- The next pass should keep visuals stable while replacing browser delivery with local responsive AVIF/JPEG variants.
