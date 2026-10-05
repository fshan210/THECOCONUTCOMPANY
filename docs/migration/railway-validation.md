# Migration validation — work in progress, 2026-10-04

Source base `1ade619d39ad4c96770dceba2c1ca61193b9828b`. All results below are local unless explicitly labeled otherwise. Deployed evidence is recorded separately below; staging readiness remains blocked by unfinished QA and the dependency audit gate.

| Gate | Result |
| --- | --- |
| Root typecheck and lint | PASS |
| Backend/contracts typecheck | PASS |
| Full suite | PASS: 89 frontend, 11 SEO, 7 contracts, 27 backend, 3 infrastructure |
| Security suite | PASS: 8 frontend security and 27 backend tests |
| Infrastructure synth | PASS locally; no deploy or AWS mutation |
| Vercel-compatible build | PASS, output mode unchanged; explicit local development config for credential-free CI |
| Railway standalone build | PASS using Preview public build config only; no Admin/session secrets in build |
| Local standalone startup | PASS, Node standalone server on port 3211; container startup credential gate separately still needs real reviewed runtime configuration |
| Vercel-compatible smoke | 6 routes/4 infrastructure/137 assets; 3 transient CDN fetch failures, all three rechecked 200 |
| Standalone smoke | PASS: 6 routes/4 infrastructure/137 assets, zero failures, filtered retained public package |
| SEO | PASS: 20 routes, 58 sitemap entries, robots 200, missing route 404 on both modes |
| Session coalescing | PASS both modes: overlapping focus/visibility share one request; explicit replacement and stale-response protection pass |
| CSRF live local | Correct cart endpoint: same-origin malformed 400; hostile/missing/spoof-forwarded Origin 403; exact Referer fallback 400; malformed Forwarded does not expand trust; all private,no-store,max-age=0 |
| Responsive / Home film | Deployed verification pending |
| Real controlled DEV auth | Pending reviewed variables, deployment, user manual login |
| Source diff check | PASS at review; repeat before final commit |

The permanent coalescing harness correction from separate PR #55 (`4b4bf77bd2d5409551a7a7b3bfdd906529af1b06`) is ported here as a test-only prerequisite. It handles coexisting desktop/mobile links and deterministic request settlement; no application auth behavior changed by that port.

## Media validation findings

Existing full CDN validator examined 878 mapped objects: 738 passed all checks, 140 reported metadata comparisons. 139 refer to ignored historical source/master files not present in this clean worktree inventory; one generated media-library JSON has different local/CDN length (11,091 versus 11,980). These are not 140 HTTP failures. Preserve the original mapping; the validator's regenerated status flags and detailed report are archived outside Git. Do not upload, delete or regenerate media during migration. The standalone rendered-page smoke passed every one of its 137 asset checks.

## Dependency findings (unchanged lockfiles)

Root production dependency audit: 10 high aggregate package findings, covering three underlying dependency families. Backend: 1 moderate. Infrastructure: 1 high. Contracts: zero. Full security readiness is **NOT PASSED** merely because unit tests pass.

- Firebase Admin depends on `@fastify/busboy` 3.2.0, with multipart DoS advisories; patched 3.2.1 exists. Current standalone tracing did not include this package, but hosted image needs independent inspection.
- Firebase client Firestore contains `@grpc/grpc-js` 1.9.16, while Admin Firestore uses 1.14.5. The reported auth-context and server-error advisories affect versions below 1.13.6. The local traced runtime includes the 1.14.5 Admin copies; do not infer all usage is safe without image verification.
- Tailwind build tooling depends on `braces` 3.0.3. Current advisory lists no patch. Traced runtime did not include braces; build glob inputs are repository-controlled. Do not introduce a Tailwind major upgrade as an automatic audit fix.
- Backend Hono reports a JSX boundary escaping advisory. Backend is external and unchanged; no Hono JSX usage has been asserted safe by this report.
- Infrastructure CDK tree reports brace-expansion recursion/CPU advisories. Existing CI treats this audit as a failing gate; resolve separately or explicitly review before release. No AWS infrastructure deployment is authorized.

No forced Firebase downgrade or Tailwind major migration was applied. Evidence files are in the private QA archive / local logs; secret values are excluded. Sources: https://github.com/advisories/GHSA-xjh9-v7x6-24jw, https://github.com/advisories/GHSA-x8mw-p69m-v3mx, https://github.com/advisories/GHSA-m9gg-hp2v-232j, https://github.com/advisories/GHSA-f596-whhp-79r4, https://github.com/advisories/GHSA-vfj7-8cjw-p6xm.

## Deployed validation, 2026-10-03–04

Tested source `edd9f387500a7a0cd547d6f6cbc8c4d81246cfcf`; Railway deployment `45c9a917-55b3-4173-985f-07cc5d6356a0`.

| Gate | Observed result |
| --- | --- |
| Real Docker deployment | SUCCESS; Singapore, one replica, port 8080; Next ready in 126 ms in runtime log. |
| Provenance / indexation | Health 200, exact SHA, preview/railway; private no-store; X-Robots-Tag noindex,nofollow,noarchive. |
| Anonymous private endpoints | Session reports signed out; cart and saved return 401 with private no-store. |
| Proxy / CSRF | Same-origin malformed cart POST 400; hostile/missing Origin 403; Referer fallback 400; spoofed forwarded host never expands trust. No relaxation required. |
| Deployed SEO | PASS: 20 routes, 58 sitemap entries; robots 200, missing route 404. |
| Rendered assets | 137 checks in smoke. Initial 16 fetch connection failures; subsequent individual retries returned 200 for all. First smoke was not a clean pass. A second complete run on Oct 4 still had 12 connection failures; a focused retry captured UND_ERR_CONNECT_TIMEOUT during TLS connection establishment. No HTTP missing-asset status was observed. The equivalent Vercel Preview smoke passed 6 routes, 4 infrastructure routes and 137 assets with zero failures. Railway smoke remains unresolved despite all Lighthouse asset checks passing. |
| Session coalescing | PASS permanent mocked-auth harness: one overlapping GET, two explicit replacement GETs, stale response ignored. Does not replace real sign-in QA. |
| Real DEV cart | User signed in; 11 Water → 12 → reload retained 12 → restored 11 → reload retained 11. |
| Product wishlist | Added Coconut Oil → reload retained saved → removed → reload confirmed restored baseline. |
| Recipe save | Unresolved: click followed by unexpected Shop navigation. Recheck whether test recipe was added and restore if necessary. |
| Session continuation Oct 4 | Both hosts redirected to login when opening/refreshing Account. Cause not established; do not label as Railway-specific expiry defect. User sign-in requested again. |
| Public performance | 25 runs each host; both configured gates passed. See comparison and per-run evidence for large individual Vercel outliers. |
| Home film | Initial MP4 transfer zero in all Lighthouse runs. Range request returned 206 and correct MIME. Chrome Play repeatedly fell back to poster on Railway and also on the same-SHA Vercel Preview; playback is NOT PASSED. This is shared behavior, not an established Railway regression. Source uses deferred source elements; the cause has not been isolated. |
| Responsive | Initial 1672 px desktop and 390×844 public Home: no horizontal overflow or broken images; mobile menu/cart opened. Full responsive and physical-device checks pending. |
| CI dependency audit | FAIL at infrastructure audit in run 37143107689. Existing lockfile findings remain; no bypass or forced dependency changes. |

Production DNS, backend, Production credentials and canonical deployment were not modified by staging setup. Addresses/preferences mutation, matched private-route timings, refresh/history/logout sequence, restart/cache testing, complete responsive checks and billing comparison remain unfinished.

Latest platform check on Oct 4: Railway SUCCESS, 1/1 running replica, zero recent failures, zero warnings, no pending changes. Vercel CLI confirmed canonical apex and www remain on Ready Production deployment `dpl_6op6zGUeoFxSHzXEdV9qUCHtRXep`.
