# Vercel versus Railway — measurement record

**Current decision: MORE MEASUREMENT.** Both Preview deployments run `edd9f387500a7a0cd547d6f6cbc8c4d81246cfcf`. Railway staging is deployed; Production remains on Vercel. No overall speed or cost winner is established.

- Railway: `45c9a917-55b3-4173-985f-07cc5d6356a0`, Singapore `asia-southeast1-eqsg3a`, https://dotco-next-staging-staging.up.railway.app
- Vercel Preview: `dpl_FfdCjmjga2Sd6KjqL7Vrfjd1MR9B`, `iad1`, https://my-website-ocsrmx33u-fazil-s-projects1.vercel.app

## Public mobile results

Five runs per route per host using the existing `qa:performance` script, identical source and test configuration. These were sequential host batches, not alternating samples; network and time drift limit causal conclusions. Both passed the script's configured gates, which does not mean every individual run met a good Core Web Vitals threshold. All 50 runs recorded zero asset failures and console errors. Initial video transfer was zero in every run. Film Play remains a separate unresolved functional check.

| Route | Railway TTFB median ms | Vercel TTFB median ms | Railway LCP median [min–max] ms | Vercel LCP median [min–max] ms |
| --- | ---: | ---: | ---: | ---: |
| / | 103 | 174 | 2297 [2242–2816] | 3979 [2558–14831] |
| /recipes | 101 | 80 | 1710 [1694–1743] | 1769 [1599–5180] |
| /journal | 105 | 82 | 2162 [2158–2191] | 2089 [1997–5691] |
| /shop | 107 | 78 | 1923 [1896–2066] | 3697 [1807–5771] |
| /sustainability | 134 | 78 | 2753 [1761–2764] | 3020 [1585–7504] |

Vercel median TTFB was lower on four routes; Railway LCP was less variable in these batches. This does not prove that Railway reduces authenticated AWS round-trip latency. Raw per-run metrics, including CLS, TBT, transfer sizes and failures: [performance evidence](evidence/public-performance-2026-10-04.json). Lighthouse raw trace files were removed by the existing script; only its emitted measurements are retained.

## Remaining comparison gates

| Category | Current evidence / gap |
| --- | --- |
| Account, Preferences, Saved ≥15 each | Pending authenticated route timings. Both sessions redirected to login on 2026-10-04; user reauthentication requested. |
| Cart/wishlist/recipes/addresses ≥10 each | Pending matched timings; Railway cart and product save/restore functionally verified earlier. |
| Build | Railway deployment created 18:08:59Z, success 18:12:09Z on Oct 3: ~190 seconds total deployment elapsed, not isolated build duration. Vercel comparable timing pending. |
| Resources | Railway one-hour sample: 61 points, memory mean 0.225399 GB, max 0.225419 GB; CPU mean 0.0000423, max 0.001939. Mostly idle observation; not load capacity evidence. |
| Monthly cost | Actual billing comparison pending. One-hour idle resource data cannot establish monthly cost or Pro savings. |
| Asset smoke | Vercel: 137 assets, zero failures. Railway repeat: 12 connection failures; sampled error was UND_ERR_CONNECT_TIMEOUT. No missing-file HTTP status observed; unresolved. |
| Deployment | Docker image built successfully on Railway; standalone server startup observed. Full deployed-image dependency inventory pending. |
| Operations | One replica, serverless off, CDN off; restart/cache behavior requires additional live proof. |
| DNS / rollback | No DNS edits. GoDaddy records inventoried; separate DNS-host migration and DNS-first rollback are planned. |

## Reproducible comparison protocol

Use exact same Git SHA and safe Preview public configuration, same DEV Cognito account, AWS API and Firebase project. User signs in manually in external Chrome; never collect credentials, cookies or tokens. Record platform deployment IDs, actual runtime region, source SHA, timestamp, browser/device/network and warm/cold status. Alternate hosts to reduce network/time drift. No load test.

For each private route collect target sample counts above, total/median/p75/p95/max and response bytes. Record auth/upstream/BFF durations only when actual server-timing or redacted logs provide them. Browser DNS/TCP/TLS/request/TTFB/transfer phases are optional observed fields, never invented zeroes. Measure route critical path, not only one API call. Restore every reversible cart/saved/preference mutation.

Public runs: same viewport/throttle/browser, five runs per listed route when practical, report medians and spread. Home initial MP4 transfer must be zero; Play, poster and reduced motion are separate functional checks. Current prebuilt images bypass Next optimization on both hosts; optimizer latency N/A, compare delivered asset/cache behavior instead.

Classify Railway as materially faster only with a repeatable meaningful Account median and tail reduction across alternating runs, supported by upstream-phase changes. No winner from one lucky sample. Publish all failures and missing measurements. Confirm Singapore from deployment metadata, one configured replica and CDN off before measuring.

Use Railway actual build/runtime CPU, memory, egress and billing estimate, with observation duration and plan credit treatment. Short samples are insufficient for confident monthly forecasts. A pending estimate is preferable to a fabricated one.
