# Migration validation — work in progress, 2026-10-03

Source base `1ade619d39ad4c96770dceba2c1ca61193b9828b`. All results below are local unless explicitly labeled otherwise. **No deployed Railway proof yet.**

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
