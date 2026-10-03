# Vercel versus Railway — measurement record

**Current decision: MORE MEASUREMENT.** Railway staging has not yet been deployed. No latency, cost or performance winner is established. Production remains on Vercel.

| Category | Vercel | Railway Singapore | Delta / observation |
| --- | --- | --- | --- |
| Account median/p75/p95/max (≥15) | Pending same-SHA DEV Preview | Pending deployment and manual DEV login | Not measured |
| Preferences (≥15) | Pending | Pending | Not measured |
| Saved (≥15) | Pending | Pending | Not measured |
| Cart/wishlist/recipes/addresses (≥10 each) | Pending | Pending | Not measured |
| Public TTFB | Pending controlled comparison | Pending | Not measured |
| Home/Recipes/Journal/Shop/Sustainability LCP, CLS, TBT | Pending five equivalent mobile runs | Pending | Not measured |
| Build time | Local compatibility build recorded in validation log; not provider duration | Pending real Docker build | Cannot compare local and hosted times |
| CPU/memory/bandwidth | Pending platform reporting | No runtime yet | No estimate from minutes of activity |
| Monthly cost | Pending actual current plan/usage | Pending Railway usage reporting | No claim that Pro is cheaper |
| Deployment ergonomics | Existing integration | Explicit Docker and settings | Railway image not tested yet |
| Rollback complexity | Existing live Production retained | DNS-first rollback planned | DNS cache propagation remains |
| DNS complexity | Current GoDaddy A records | Requires compatible apex flattening | Separate DNS-host migration proposed |
| Operational risk | Existing managed Next runtime | Single-instance self-hosting/cache ownership | Auth, proxy, ISR and restart need live proof |

## Reproducible comparison protocol

Use exact same Git SHA and safe Preview public configuration, same DEV Cognito account, AWS API and Firebase project. User signs in manually in external Chrome; never collect credentials, cookies or tokens. Record platform deployment IDs, actual runtime region, source SHA, timestamp, browser/device/network and warm/cold status. Alternate hosts to reduce network/time drift. No load test.

For each private route collect target sample counts above, total/median/p75/p95/max and response bytes. Record auth/upstream/BFF durations only when actual server-timing or redacted logs provide them. Browser DNS/TCP/TLS/request/TTFB/transfer phases are optional observed fields, never invented zeroes. Measure route critical path, not only one API call. Restore every reversible cart/saved/preference mutation.

Public runs: same viewport/throttle/browser, five runs per listed route when practical, report medians and spread. Home initial MP4 transfer must be zero; Play, poster and reduced motion are separate functional checks. Current prebuilt images bypass Next optimization on both hosts; optimizer latency N/A, compare delivered asset/cache behavior instead.

Classify Railway as materially faster only with a repeatable meaningful Account median and tail reduction across alternating runs, supported by upstream-phase changes. No winner from one lucky sample. Publish all failures and missing measurements. Confirm Singapore from deployment metadata, one configured replica and CDN off before measuring.

Use Railway actual build/runtime CPU, memory, egress and billing estimate, with observation duration and plan credit treatment. Short samples are insufficient for confident monthly forecasts. A pending estimate is preferable to a fabricated one.
