# Railway platform dependency audit

Audit date: 2026-10-03. Completed before application edits. Git was fetched with prune; the canonical worktree was clean. Migration base and live Vercel Production Git SHA: `1ade619d39ad4c96770dceba2c1ca61193b9828b`. Vercel deployment `dpl_6op6zGUeoFxSHzXEdV9qUCHtRXep` is READY, target production, runtime region `iad1`, with apex and www aliases. Production metadata was checked through the Vercel API, not inferred from local Git.

Open PRs: #55 (session QA fix, `4b4bf77bd2d5409551a7a7b3bfdd906529af1b06`) and draft #38 (cart handoff). Existing worktrees: canonical main and final-browser-account-hardening. This migration uses its own managed worktree and branch `codex/railway-runtime-migration` from exact origin/main; neither existing checkout is repurposed.

## Dependency map

| File | Vercel dependency | Current behavior | Railway impact | Required change | Security impact |
| --- | --- | --- | --- | --- | --- |
| `next.config.mjs` | `VERCEL_ENV` | Preview noindex, Production HSTS, public Firebase environment | Missing variable disables intended guards | Canonical `APP_DEPLOY_ENV` resolver with Vercel fallback; target-aware standalone | Fail closed on unknown deployed environment; retain headers |
| `lib/security/environment.ts` | Vercel argument | Missing/unknown environment becomes development | Wrong rate-limit namespace | Delegate to canonical resolver | Never silently mix namespaces |
| `lib/security/events.ts`, `lib/security/rate-limit.ts` | `process.env.VERCEL_ENV` | Security event and counter partitioning | Staging could use wrong namespace | Resolve environment centrally | Preview security state must use Preview Firebase |
| `lib/firebase/admin.ts`, `lib/firebase/auth-rest.ts` | `VERCEL_ENV` | Runtime project ID checks | Missing env bypasses checks | Use resolver; enforce exact project identities | Reject Production projects in staging |
| `lib/firebase/client.ts`, `lib/firebase/admin-project.ts` | Build-time public deployment label | Client/Admin Preview project checks | Wrong build label defeats client check | Inject resolved public label; preserve exact project guard | No Admin secrets in public label |
| `app/page.tsx`, `app/layout.tsx`, `app/api/auth/session/route.ts`, `lib/customer/aws-api.ts`, `lib/security/http.ts` | Vercel Preview test | Non-production timing only | Missing Preview timing; inconsistent classification | Central environment predicate | Keep timings free of tokens and private identifiers |
| `package.json`, `next.config.mjs` | `next build` / `next start` | Next 15.5, no standalone output; local contracts package | Need self-contained Node runtime | Node 22 multi-stage Docker; include contracts at install; bind supplied PORT | Non-root, no source credentials in image |
| `.github/workflows/backend-security-ci.yml` | Local production build without deploy label | Node 22 validation | Fail-closed resolver needs explicit local CI label | Label local validation explicitly; check both targets | CI must not receive Production secrets |
| `vercel.json` | `experimentalServices` with frontend/backend declaration | Platform-specific service routing | Railway does not consume it | Leave Vercel configuration; deploy only root Next runtime | AWS backend is external; do not launch the legacy backend entrypoint |
| `.vercelignore`, `scripts/write-vercel-media-ignore.mjs` | Vercel upload exclusions | Historical media exclusions; inventory input is not tracked | Railway would include the large tracked public tree | Explicit Docker context exclusions based on audited existing list, retaining all current bundled prefixes | Exclude env files, Git, local credentials, QA artifacts |
| `lib/media.ts`, `lib/generated/*`, `public/`, `scripts/audit-public-assets.mjs`, `scripts/validate-media.mjs` | Asset packaging assumptions | Mixed bundled assets and existing CloudFront host | Missing local assets possible if exclusions copied blindly | Reuse scanner/manifests and compare packaged files against runtime prefixes | Shared media is read-only; no uploads or deletion |
| `components/media/ResponsiveImage.tsx`, `next.config.mjs` | Comment references Vercel optimizer cost | `images.unoptimized=true`; prebuilt picture AVIF/JPEG and local WebP | No optimizer conversion should be introduced | Preserve current policy; test actual image delivery | No new optimizer endpoint or remote allowlist |
| `middleware.ts` | Next middleware convention | Protected redirects, admin rewrite, return paths | Must run correctly in standalone | Test Node deployment; no source change unless proven necessary | Preserve protected route boundaries |
| `lib/security/request-integrity.ts` | Proxy-sensitive Host/protocol | Exact Origin/Referer against Host and request URL protocol; ignores forwarded host | Railway protocol normalization must be measured | Test real edge requests, hostile/spoofed headers before any change | No wildcard origins; do not trust client-supplied forwarding |
| `lib/security/request.ts`, Cognito route handlers | `X-Forwarded-For` | First address used for event/rate-limit context | Railway chain may differ | Inspect proxy behavior; do not use for authorization | Spoofing risk must be assessed separately from CSRF |
| `app/api/auth/cognito/*`, `lib/auth/*`, `lib/customer/auth.ts` | Server crypto/cookie runtime | AES-GCM split HttpOnly Secure SameSite=Lax host-only cookies | Works on separate HTTPS staging host | Preserve crypto, expiry and host scope; fresh staging keys | DEV Cognito only; no real-user cookie export |
| `lib/content/server.ts`, `lib/content/revalidate.ts`, `lib/account/actions.ts` | Vercel-managed cache operation | 300s content cache and tag/path revalidation | Cache local to each container | Exactly one replica, document restart and redeploy behavior | Never cache private JSON globally |
| `app/image-sitemap.xml/route.ts`, `app/news-sitemap.xml/route.ts` | Public revalidation | Public sitemap caching | Verify preserved response headers | Keep existing TTLs | Staging noindex at host level |
| `lib/seo/*`, `app/robots.ts` | Canonical host assumption | Fixed apex canonical and sitemaps | Staging must not become indexable duplicate | Keep canonical; explicit Preview noindex | No staging URLs in canonical sitemap |
| `scripts/godaddy-dns-sync.ts` | Hard-coded Vercel A records | `--apply` rewrites apex/www | Could undo future cutover | During staging audit only; retire apply or guard before cutover | Never run apply during this phase |
| QA/release scripts and documentation | Vercel URLs and CLI instructions | Historic evidence, deployment commands, test defaults | Instructions need Railway equivalents | New migration runbook; preserve historic evidence | Do not treat historic IDs as current resources |
| `lib/admin/data.ts`, `components/admin/AdminDashboard.tsx`, `app/admin/login/page.tsx` | Vercel mentions in operator copy | Hosting setup text | Misleading after cutover | Review hosting guidance only if migration requires it | No changes to Admin permission model |

## Searches and negative findings

Searched tracked source/config for VERCEL, VERCEL_ENV, VERCEL_URL, VERCEL_REGION, x-vercel, vercel.json, .vercel, @vercel, Edge Runtime, edge runtime, waitUntil, cron, image optimization, rewrites, redirects, cache, revalidate, and middleware. There are no imported `@vercel` runtime services, explicit application `runtime = "edge"` exports, application `waitUntil` calls, or Vercel cron definitions to migrate. Next middleware support and reverse proxy semantics still require live staging tests.

There is no suitable lightweight Next runtime health endpoint. Add one without external reads, private data or mutations. Expose only health and safe release/environment/platform identifiers.

## Decisions and gates

Only the Next.js runtime moves. Auth/data/media providers stay external. Railway staging uses DEV AWS and Preview Firebase. Region Singapore, one replica, CDN off. No canonical domains, DNS edits, AWS infrastructure mutations, Production secret transfers, merges or Vercel decommissioning are authorized in this phase.

Before transferring variables, present the name/source/target inventory for human review. Before auth testing, the user signs in manually to each staging host. Live DNS export access was obtained via the user's existing Chrome GoDaddy session; records are inventoried separately with private TXT values omitted from Git.
