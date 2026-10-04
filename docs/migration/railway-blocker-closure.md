# Blocker closure — 2026-10-04

Authenticated comparison remains paused. No Production, DNS, environment credentials or AWS infrastructure changes are authorized by this work.

## Frozen benchmark

The 50 original samples remain at `docs/migration/evidence/public-performance-2026-10-04.json` (SHA-256 `8873a04e9bfe2ae6d5952819bfcb0010658fc429f643620a025a52c3369c4a46`). Immutable copies of both stdout logs, the dataset and original harness are in the private QA directory `frozen-public-benchmark-edd9f38`, with a manifest. No benchmark rerun or overwrite occurred.

Tested SHA `edd9f387500a7a0cd547d6f6cbc8c4d81246cfcf`; Railway `45c9a917-55b3-4173-985f-07cc5d6356a0`, Singapore `asia-southeast1-eqsg3a`, https://dotco-next-staging-staging.up.railway.app; Vercel comparison `dpl_FfdCjmjga2Sd6KjqL7Vrfjd1MR9B`, https://my-website-ocsrmx33u-fazil-s-projects1.vercel.app.

Five mobile runs per route: /, /recipes, /journal, /shop, /sustainability. Sequential host batches, not alternating. Original harness is preserved to retain viewport/throttle/version settings. Exact per-run wallclock timestamps were not emitted; log completion mtimes are Railway 2026-10-04 05:29:45Z and Vercel 10:41:26Z. Do not infer exact run starts from these timestamps.

## Asset timeout classification

24 distinct failing URLs across the two historical Railway smoke runs: 4 /_next/static chunks and 20 local public assets. All are on the Railway app host. Zero failing optimizer URLs and zero media-domain URLs in that set. Current image configuration was already globally unoptimized before migration; it was not changed.

[Every URL, response header and curl phase timing](evidence/blocker-asset-probes.json) is preserved. All 24 served HTTP 200. DNS A resolves to 69.46.46.47, with no AAAA record; curl -6 reported an IPv4-mapped ::ffff address, so it does not prove native IPv6 reachability. All one-request, five-sequential, five-concurrent and twenty-concurrent curl HEAD probes succeeded. HTTP/2 direct static serving showed normal content lengths, immutable chunk cache headers and byte-range support.

[Node comparison](evidence/blocker-node-probes.json): Node 24.16.0 fetch passed single, five sequential and five concurrent, with one connection timeout among twenty concurrent. Node HTTPS client passed all groups. The original failure is UND_ERR_CONNECT_TIMEOUT before HTTP response; not an observed 404, image transform error or runtime exception. This bounds the failure to the client-to-edge connection path exercised by Node fetch. The exact transport/network cause is not established, and no universal concurrency threshold is claimed.

A complete Railway smoke at explicit concurrency five passed 6 routes, 4 infrastructure routes and 137 assets. The harness now records selected concurrency and nested connection errors; default remains 12 and no retry masks failures. Curl/HTTPS/browser successes and low-concurrency smoke do not erase the original failures.

Railway logs for 11:28–11:40Z: 101 sampled HTTP rows, statuses 200/304, maximum duration 1468 ms, no upstream errors. No matching runtime reset/timeout/DNS/OOM/restart messages. Four-hour resource samples: CPU maximum 0.01435; memory maximum 0.23844 GB under the 2 GB limit. Sampled logs cannot prove absence of every connection failure or expose client requests that never reached the proxy. Request-concurrency and exact restart counters are not available in these samples.

Docker explicitly copies .next/static and public from builder into runner. New startup assertions verify actual directory entries and representative film/hero file sizes from the deployed runtime filesystem; confirmation awaits the next deployment's logs. No secret or environment dump is added.

## Shared Home film regression

Canonical Vercel Production and Railway staging both displayed the disabled poster fallback. Source and media mapping were identical between Production base 1ade619 and benchmark SHA edd9f38. No last-known-good playback release was established.

A temporary local diagnostic reproduced a React error with target SOURCE, selected desktop video URL and no MediaError on the video element. React's video onError handler incorrectly treated a rejected child source candidate as failure of the whole video, removing a selected playable video. The diagnostic was removed after reproducing the cause.

Small fix: ignore child-source errors and require an actual video MediaError before switching to poster. Deferred loading, source URLs, autoplay, scroll behavior and reduced-motion branch are unchanged. Local UI verified readyState 4, advancing playback, pause and resume. Hosted fix verification remains pending.

The film is bundled in public, not CloudFront: `/assets/video/homepage-v2/co-home-scraping-scroll-desktop-v1.mp4` and mobile portrait variant. Both hosts' direct GET Range bytes=0-1023 returned 206, video/mp4, Accept-Ranges bytes, Content-Range bytes 0-1023/9217095 and 1024-byte payload. Production sends Access-Control-Allow-Origin *, Railway none; these are same-origin app URLs. Local ffprobe confirms H.264/yuv420p, 11 seconds, 9,217,095 bytes. [Direct request evidence](evidence/blocker-film-direct-range.json). This is a direct HTTP trace, not a captured browser-on-Play network trace; that remains unverified.

Original 50-run data records zero initial video transfer. The handler-only fix does not attach sources earlier; new-build transfer verification remains pending.

## Dependency audit

| Package / path | Before → candidate | Class / disposition |
| --- | --- | --- |
| firebase-admin → @fastify/busboy | 3.2.0 → 3.2.2; patched >=3.2.1 | Conservative runtime dependency; patch installed within existing range. Multipart reachability not claimed. |
| firebase → @firebase/firestore → @grpc/grpc-js | 1.9.16 → 1.14.5; patched 1.13.6 or 1.14.5 | Client Firestore browser path does not use Node gRPC; conservative patch of Node variant via narrow override. Admin already used 1.14.5. No Firebase major downgrade. |
| backend → hono | 4.13.5 → 4.13.13; patched >=4.13.7 | Runtime dependency; JSX boundary not imported in backend source. Patch installed; AWS backend not deployed. |
| Tailwind/ESLint → braces | 3.0.3 remains; no patch published | Build/lint only: repository-controlled glob inputs. Seven aggregate root advisories now remain, all this family. No major framework upgrade. |
| aws-cdk-lib → minimatch → brace-expansion | 5.0.9 remains; patched >=5.0.12 | Infrastructure synthesis tool, not Next or Lambda runtime. npm says bundled dependency cannot be fixed automatically. CDK 2.272.0 and override experiment still included 5.0.9; ineffective changes reverted. |

Backend and contracts audits now report zero. Root full audit: seven high aggregate findings from braces. Infra audit: one high bundled brace-expansion finding. CI's actual failing command remains infra audit --omit=dev --audit-level=high; Railway Docker build itself does not run an audit. Existing CI policy was not weakened or changed. No residual has yet been accepted by the user.

Sources: https://github.com/advisories/GHSA-m9gg-hp2v-232j, https://github.com/advisories/GHSA-vfj7-8cjw-p6xm, https://github.com/advisories/GHSA-q2hr-2g5m-vwhr. Full audit outputs are retained in evidence.

## Pending closure

- Confirm deployed runtime asset assertions and patched film behavior on Railway and matching Vercel Preview.
- Verify new-build zero initial transfer and reduced motion.
- Preserve full validation results and exact deployment lineage.
- Resolve or obtain explicit acceptance of non-runtime audit residuals; keep the failing gate visible.
- No authenticated benchmark or new sign-in request until these conditions are stable.
