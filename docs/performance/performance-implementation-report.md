# Performance implementation report

Baseline SHA: `0c864135fa7d0d22cc55fae913ff1b86aab2a6c3`
Implemented: 2026-09-21
Design changes: none.

## Evidence-led changes

The baseline showed image transfer—not JavaScript—as the dominant problem: Home 10.76 MB images, Shop 10.93 MB, and Recipes 19.87 MB on the mobile lab runs. Global Next.js runtime optimization was tested and rejected because cold local transforms increased LCP to 29–39 seconds and produced asset failures. `images.unoptimized` therefore remains enabled.

Instead, sixteen measured oversized PNG references were replaced with static AVIF derivatives while preserving dimensions, crop, layout, motion, and source artwork:

| Surface | Replaced source bytes | AVIF bytes | Reduction |
| --- | ---: | ---: | ---: |
| Home, 3 environment plates | about 5.6 MB | about 232 KB | about 96% |
| Shop, 3 measured backgrounds | about 5.0 MB | about 120 KB | about 98% |
| Recipes, 3 measured curry images | about 6.5 MB | about 380 KB | about 94% |
| Recipes, 7 remaining measured hero, stew, and section plates | about 13.0 MB | about 757 KB | about 94% |

Original files remain in the repository; only the measured render references changed. This makes the change reversible and avoids broad asset churn.

## Data/request changes

- Saved-content reads are coalesced across mounted consumers for the same authenticated owner/generation. Late reads and mutations are ignored after logout or account change.
- Account pages now load only the private domains needed for the active view. Overview retains parallel profile/saved/address/order loading; wishlist/recipe/address/order views avoid unrelated calls. Public catalog/recipe/journal reads are likewise scoped to their consumers.
- Independent requests continue in parallel. No private response was cached to obtain a performance gain.

## Preserved behavior

- First-load architecture, typography, layout, motion, content identity, and routes are unchanged.
- Home video deferral is unchanged; the baseline observed only 524 bytes of media transfer before near-viewport attachment.
- Font configuration and approved weights are unchanged.
- No new global client boundary, third-party script, middleware work, or hydration suppression was added.
- Security takes precedence: all private requests remain no-store, state changes gain Origin/body checks, and session/saved responses gain stale-generation guards.

## Local after measurement

The final candidate build passed the repeatable mobile gate on six routes: CLS <= 0.1, <= 100 requests, <= 25 MB transfer, TBT <= 500 ms, zero asset failures, and zero console errors. The same machine, Chrome/Lighthouse 13.5.0, and patched Next.js runtime were used to build the exact base source in a temporary directory for a more comparable run. Account was unauthenticated and redirected to Login.

| Route | Exact-base LCP | Candidate LCP | Exact-base transfer | Candidate transfer |
| --- | ---: | ---: | ---: | ---: |
| Home | 35.0 s | 20.3 s | 11.66 MB | 6.10 MB |
| Shop | 36.5 s | 6.1 s | 11.82 MB | 6.84 MB |
| Recipes | 5.8 s | 5.9 s | 20.59 MB | 1.95 MB |
| Journal | 9.2 s | 8.0 s | 1.71 MB | 1.76 MB |
| Sustainability | 8.0 s | 8.3 s | 1.70 MB | 1.74 MB |
| Account to Login | 23.1 s | 23.1 s | 4.07 MB | 4.11 MB |

The Home and Shop byte and LCP reductions are material in this lab run. Recipes transfer fell from 20.59 MB on the exact base to 1.95 MB after the second measured image batch; its LCP remained near 5.9 s, so no Recipes LCP improvement is claimed. Sustainability and Account LCP differences are too small to claim as improvements or regressions. The absolute LCP estimates vary greatly from the 2026-09-21 local baseline and from a contemporary Production Home run (14.6 s); no field Core Web Vitals improvement is claimed. Lighthouse identifies the Home hero coconut as LCP and confirms it is eager, high priority, and discoverable in initial HTML. The Recipes LCP node is hero title text, so the remaining delay needs render and font timing analysis rather than more blind image conversion.

## Residual performance risk

- Recipes image transfer is now about 1.16 MB locally, but mobile lab LCP remains about 5.9 s. A focused render and font timing pass is needed before claiming Core Web Vitals compliance.
- Journal, Sustainability, and Cart had 6.3–6.6 second mobile LCP in the older baseline despite modest transfer/TBT; contemporary lab runs of Journal and Sustainability remain slow. Their bottleneck needs route-specific LCP discovery/render-delay profiling. This existing PERF-P1 remains open and prevents a Production-ready claim.
- Local lab results are not field Core Web Vitals. Single-run deltas below roughly 10% are not claimed as improvements.
- Authenticated Account/API latency remains pending controlled immutable-Preview QA.

## Final Gate C follow-up (2026-09-24)

The [route-specific LCP analysis](./lcp-root-cause.md) records three immutable Preview baseline runs per route and a controlled exact-base local comparison. Home's actual LCP resource was the 307 KB hero coconut WebP, already preloaded and high priority. Recipes' actual LCP was an initially transparent hero heading span. Journal's mobile hero image was high priority and its 2.11 s median already met the requested 2.5 s target. No Journal runtime change was made.

| Route | Immutable Preview before median | Exact-base local median | Candidate local median | Local delta | Status |
| --- | ---: | ---: | ---: | ---: | --- |
| Home | 6,360 ms | 10,512 ms | 7,311 ms | −3,201 ms (−30%) | Material local improvement; >3 s residual |
| Recipes | 5,331 ms | 5,695 ms | 4,892 ms | −803 ms (−14%) | Material local improvement; >3 s residual |
| Journal | 2,110 ms | — | — | no change | Baseline median passes |

The two candidate edits are limited to a separate, smaller encoding of the same Home hero artwork and a visible-first Recipes heading animation. The Home original asset remains. No video loading or private-data caching was changed. The updated performance script prints each run's route, run number, TTFB, LCP and candidate element/resource, CLS, TBT, transfer, request count, console errors, and asset failures, then prints route medians; `PERF_RUNS=3` enables a repeated gate.

The authenticated API latency gate remains open until a signed-in session on the **exact final immutable Preview** can be measured. The current agent-visible Chrome session redirected `/account` on `ehjvu0bnw` to Sign In; a different older Preview hostname was signed in. The Mac locked before the provisional older-Preview timing run. Do not substitute the older Preview's numbers for final candidate measurements. No authenticated mutation or duplicate-request claim is made yet.

Production readiness remains **blocked** while Home and Recipes are above 3 s and authenticated latency/final Preview QA are incomplete. Production and `main` are unchanged.
