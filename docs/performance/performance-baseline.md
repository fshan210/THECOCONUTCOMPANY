# Performance baseline

Baseline SHA: 0c864135fa7d0d22cc55fae913ff1b86aab2a6c3
Captured: 2026-09-21
Production changes: none.

## Method

- Local production build: Next.js 15.5.23, next build followed by next start on loopback.
- Lighthouse 13.5.0, Chrome headless, one run per route. Mobile uses Lighthouse default throttling; desktop uses the desktop preset.
- Production reference: one non-load-test request per route to the canonical site, following redirects.
- These are lab measurements, not field Core Web Vitals. Single-run differences below roughly 10% are not treated as improvements.
- Account baseline is unauthenticated and redirects to Login. Authenticated Account/API latency requires a controlled Preview account and is not claimed here.

## Build and bundle baseline

| Route | First-load JS |
| --- | ---: |
| Home | 232 kB |
| Shop | 262 kB |
| Recipes | 245 kB |
| Journal | 269 kB |
| Sustainability | 248 kB |
| Account | 248 kB |
| Cart | 162 kB |

Shared first-load JS is 102 kB. Middleware is 35.9 kB. No build-time hydration failure was reported.

## Mobile lab baseline

| Route | Score | TTFB | LCP | CLS | TBT | Requests | Transfer | Image bytes | Main-thread work |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | 84 | 168 ms | 4,279 ms | 0.001 | 63 ms | 67 | 11.62 MB | 10.76 MB | 4,458 ms |
| Shop | 78 | 40 ms | 4,882 ms | 0.000 | 203 ms | 68 | 11.82 MB | 10.93 MB | 4,913 ms |
| Recipes | 73 | 158 ms | 13,002 ms | 0.000 | 107 ms | 58 | 20.59 MB | 19.87 MB | 4,440 ms |
| Journal | 76 | 23 ms | 6,469 ms | 0.000 | 82 ms | 52 | 1.71 MB | 0.90 MB | 1,701 ms |
| Sustainability | 76 | 62 ms | 6,383 ms | 0.000 | 84 ms | 55 | 1.69 MB | 0.90 MB | 1,706 ms |
| Cart | 67 | 14 ms | 6,633 ms | 0.000 | 92 ms | 49 | 1.76 MB | 1.04 MB | 3,860 ms |
| Account | not measured authenticated | — | — | — | — | — | — | — | — |

The material PERF-P1 finding is image transfer and LCP, especially Recipes. CLS is already within the preferred target. TBT is modest; JavaScript is not the dominant byte cost.

Largest mobile resources at baseline:

- Home: sustainability-farm.png 2.11 MB, origin-to-everyday.png 1.98 MB, background-2.png 1.74 MB.
- Shop: build your ritual-mobile.png 1.84 MB, backgrounds/6.png 1.69 MB, backgrounds/1.png 1.64 MB.
- Recipes: RED THAI COCONUT CURRY.png 2.33 MB, RECIPIE BRINGS CULTURE TOGETHER.png 2.29 MB, THAILAND GREEN COCONUT CURRY.png 2.20 MB.

## Desktop lab baseline

| Route | Score | TTFB | LCP | CLS | TBT | Requests | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | 98 | 166 ms | 1,014 ms | 0.000 | 0 ms | 74 | 10.59 MB |
| Shop | 76 | 160 ms | 5,701 ms | 0.001 | 0 ms | 72 | 13.58 MB |
| Recipes | 87 | 128 ms | 2,486 ms | 0.000 | 0 ms | 62 | 28.70 MB |
| Journal | 85 | 11 ms | 2,725 ms | 0.000 | 9 ms | 60 | 3.72 MB |
| Sustainability | 99 | 24 ms | 875 ms | 0.000 | 0 ms | 51 | 1.68 MB |
| Account to Login | 79 | 26 ms | 3,907 ms | 0.001 | 0 ms | 53 | 4.21 MB |
| Cart | 96 | 11 ms | 1,430 ms | 0.000 | 0 ms | 51 | 1.77 MB |

## Current Production reference

| Route | HTTP/redirect outcome | TTFB | Total | HTML bytes |
| --- | --- | ---: | ---: | ---: |
| Home | 200 | 1,021 ms | 1,294 ms | 152,337 |
| Shop | 200 | 733 ms | 814 ms | 178,197 |
| Recipes | 200 | 538 ms | 828 ms | 140,531 |
| Journal | 200 | 442 ms | 671 ms | 150,435 |
| Sustainability | 200 | 611 ms | 707 ms | 137,395 |
| Account | 1 redirect to Login | 800 ms | 868 ms | 58,497 |
| Cart | 200 | 466 ms | 517 ms | 63,426 |

This one-shot external timing is a comparison reference only; regional/network variance is substantial.

## Request-path map

| Hot path | Initial requests | Server fetches | Client fetches | Duplicate/waterfall assessment | Cache behavior | Blocking/slowest step | Measured latency |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
| Public page render | route-dependent; 49–68 mobile | content access is in-process for audited pages | router prefetch generates 2–3 small RSC fetches on several routes | no serial public data waterfall found; speculative RSC fetches are small | HTML is dynamic on principal routes; immutable assets cache for one year | oversized initial images dominate Home/Shop/Recipes | local TTFB 14–168 ms; Production 442–1,021 ms |
| Client hydration | included above | 0 | session refresh can occur on focus/visibility | auth provider can refresh repeatedly on focus by design; no hydration warning observed | session fetch is no-store | React/main-thread work, especially media-heavy routes | mobile TBT 63–203 ms |
| Guest cart | 49 total on empty Cart page | 0 customer API calls | localStorage read/write only | no server waterfall | browser-local validated draft | hydration and product imagery | LCP 6,633 ms, 1.76 MB |
| Authenticated cart | not credential-measured | one Hono call per BFF read/mutation; error reconciliation may add GET | initial GET, merge, or mutation | mutation serialization is per line and stale auth generations are aborted | upstream no-store; response headers incomplete at baseline | Lambda/DynamoDB round trip | deployed latency pending controlled Preview QA |
| Wishlist/saved | not credential-measured | one Hono call per BFF request | one GET per mounted saved-content hook plus mutation | multiple same-kind consumers can independently GET full saved content | client fetch no-store; response headers incomplete at baseline | duplicate initial reads | deployed latency pending controlled Preview QA |
| Account | not credential-measured | /v1/me, /v1/wishlist, /v1/me/addresses, /v1/orders start in parallel | none after render unless mutation | no serial waterfall; all four domains load even when a view needs fewer | upstream no-store; wishlist header incomplete | slowest of four parallel calls | deployed latency pending controlled Preview QA |
| Auth | not credential-measured | login uses InitiateAuth then GetUser; other actions one Cognito call | one BFF POST | second login call is required for trusted attributes | should be private/no-store; auth responses lack explicit header | Cognito round trips | deployed latency pending controlled Preview QA |
| Media/video | included in route counts | 0 | image fetches; video source attaches near viewport | no initial giant video transfer observed; Media was 524 bytes on Home | versioned media/assets immutable | PNG transfer dominates; video remains deferred | Home mobile image transfer 10.76 MB |
| Public product/recipe data | included in server render | in-process content reads | no initial data API request | no duplicate remote catalog fetch observed | public content eligible for safe caching | imagery rather than data | see route tables |

## Finding severity

- PERF-P1: Home, Shop, and especially Recipes transfer excessive initial image bytes and miss the 2.5 s mobile LCP target materially.
- PERF-P1: Journal, Sustainability, and Cart mobile LCP are 6.3–6.6 s despite modest transfer/TBT, requiring LCP discovery/render-delay inspection.
- PERF-P2: Account eagerly fetches four customer domains for every account view; route-aware loading could reduce private API work if implemented without visible regressions.
- PERF-P2: each mounted saved-content hook performs an independent full saved-content fetch, creating potential duplicate requests on dense pages.
- PERF-P2: Home/Shop/Recipes ship 232–262 kB first-load JS and 4.4–4.9 s mobile main-thread work, but image transfer is the first target.
- PERF-P3: router prefetches 2–3 small RSC responses during initial lab navigation; bytes are negligible.

## Optimization boundary

No visual redesign, typography, layout hierarchy, motion language, catalog identity, SEO behavior, authentication provider, payment, or shipping behavior may change. Optimizations must preserve current video deferral and cannot trade private cache isolation or validation for speed.
