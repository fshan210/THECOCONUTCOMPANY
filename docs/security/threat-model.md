# Security threat model

Baseline SHA: 0c864135fa7d0d22cc55fae913ff1b86aab2a6c3
Audit date: 2026-09-21
Scope: application, same-origin BFF, Cognito session, Hono API, DynamoDB, Vercel, media CDN, and CI/CD.
Production changes: none.

## Security objectives

1. A customer can read or mutate only the data owned by the sub in a verified Cognito access token.
2. Cognito and encrypted session tokens stay server-side and never enter browser JavaScript, URLs, logs, or shared caches.
3. Cookie-authenticated state changes require a trustworthy same-origin browser request.
4. Input is parsed through strict allowlists before it reaches persistence or business logic.
5. Public caching remains effective while customer-specific responses are never shared.
6. Preview and Production remain operationally separated, and this branch makes no infrastructure or Production mutations.

## System and trust boundaries

| Boundary | Trusted material crossing it | Primary controls at baseline | Principal risks |
| --- | --- | --- | --- |
| Browser to Next.js/Vercel | Form input, query/path parameters, encrypted session cookies | HTTPS, HttpOnly cookies, Zod on core APIs, middleware route gates | CSRF, open redirect, XSS, oversized/unknown fields, stale private state |
| Next.js BFF to Cognito | Password, OTP, access/ID/refresh tokens | Server-only SDK, generic client errors, AES-256-GCM sealed cookies | credential/token logging, session fixation, token replay, enumeration |
| Next.js BFF to Hono API | Cognito access token and validated business payload | Server-only bearer token, no-store fetches | bearer leakage, weak origin enforcement, private caching, upstream latency |
| API Gateway/Hono to Cognito verifier | Bearer JWT | API Gateway JWT authorizer and aws-jwt-verify access-token verifier | issuer/audience/token-use misconfiguration |
| Hono to DynamoDB | customer sub, domain records, idempotency state | resource-scoped IAM, keys derived from verified user, conditional writes | IDOR, scans/N+1, mass assignment, cross-tenant key construction |
| Vercel/Next.js to Firebase admin | admin/rate-limit/security-event records | server-only credentials and collection allowlists | PII retention, fallback to per-instance rate limits |
| Browser to media CDN | immutable public image/video requests | private S3 bucket, CloudFront OAC, TLS, versioned path | oversized media, content-type confusion, cache poisoning |
| GitHub Actions to repository/AWS | source, dependency install, optional OIDC | contents read; conditional OIDC role | mutable action tags, job-wide id-token write, supply-chain compromise |
| Preview to external services | Preview requests and configured environment variables | Preview noindex header | accidental Production data mutation if Preview uses Production API/persistence |

## Authentication and session data flow

1. The browser POSTs an allowlisted Cognito action to /api/auth/cognito.
2. The Next.js route calls Cognito server-side; passwords and OTPs are not returned or logged.
3. On login, Cognito tokens are sealed with AES-256-GCM using a fresh 96-bit IV and split across bounded HttpOnly cookies.
4. Server components and BFF routes reassemble and authenticate the cookie, then forward only the access token to the Hono API.
5. The Hono API verifies signature, audience, user pool, and token_use, and derives userId from the verified sub.
6. Logout expires every session-cookie chunk; client providers must reject or abort responses from the previous auth generation.

Baseline strengths:

- no auth token is stored in localStorage or sessionStorage;
- the browser session endpoint returns a reduced profile and no token;
- AES-256-GCM supplies confidentiality and tag authentication with a random IV per seal;
- expired/decryption-failed session cookies return null;
- safeReturnTo accepts only an explicit same-site path allowlist;
- private backend ownership is derived from verified sub, not browser customerId, userId, email, or ownerId fields;
- cart quantities, product identity, availability, and price are server validated/authoritative;
- Zod objects covering profile, address, cart, saved content, newsletter, and order preview are strict.

## Customer data flows and object authorization

| Domain | Browser/BFF entry | Backend entry | Ownership decision | Baseline result |
| --- | --- | --- | --- | --- |
| Cart | /api/customer/cart* | /v1/cart* | verified token sub passed to cart service | server-derived; no browser owner accepted |
| Wishlist/saved content | /api/customer/saved | /v1/wishlist and /v1/saved* | verified token sub prefixes persistence keys | server-derived; no browser owner accepted |
| Profile/preferences | server actions/account render | /v1/me | verified token sub | strict writable-field allowlist |
| Addresses | server actions | /v1/me/addresses* | verified token sub plus validated address ID | lookup/write remains inside customer partition |
| Orders | account render | /v1/orders* | verified token sub plus validated order ID | customer-partition lookup; creation remains deferred |

Automated cross-user tests must still prove that a resource identifier created for User A cannot be read, changed, or deleted with User B's token. No controlled two-user credentials were available during baseline capture, so deployed IDOR proof is a Preview QA gate rather than a baseline claim.

## Threat analysis and baseline findings

| ID | Severity | Threat | Baseline evidence | Required treatment |
| --- | --- | --- | --- | --- |
| SEC-01 | P1 | Critical framework vulnerabilities | npm audit reports Next.js RCE advisories affecting 15.5.23; patched in 15.5.24 | smallest patch update; rebuild and regression test |
| SEC-02 | P1 | CSRF acceptance when Origin is absent | cookie-authenticated BFF mutations return true for missing origin | require valid same-origin Origin, with strict same-origin Referer fallback only; validate fetch metadata/content type |
| SEC-03 | P1 | Customer responses may be cached outside intended private boundary | BFF cart/saved responses lack explicit Cache-Control; backend excludes /v1/wishlist and /v1/saved | add private, no-store, max-age=0 consistently and regression tests |
| SEC-04 | P2 | Disallowed non-preflight Origin reaches Hono routes | CORS middleware emits no allow headers but continues the request | explicitly reject disallowed Origin when present |
| SEC-05 | P2 | Rate limiting is not reliably distributed | Hono uses a process Map; Next auth falls back to memory if Firestore is absent/unavailable | infrastructure stop gate: select managed distributed limiter/API Gateway throttling and fail-mode policy before Production change |
| SEC-06 | P2 | Session parser accepts structurally loose decrypted JSON | only expiresAt is tested after authenticated decrypt | validate exact token/payload types, finite expiry, and bounded fields; fail closed |
| SEC-07 | P2 | Log redaction misses token-shaped keys | backend redaction matches an incomplete exact-key set and lowercases against mixed-case entries | central case-insensitive sensitive-key pattern; do not log unhandled provider messages |
| SEC-08 | P2 | Public newsletter BFF lacks origin/body/rate boundaries | strict payload schema exists, but no origin check or application limiter is applied | apply public-form origin, bounded body, and existing distributed/fallback limiter controls |
| SEC-09 | P2 | Hono patch advisory | Hono 4.13.2 is below patched 4.13.5 | smallest patch update |
| SEC-10 | P2 | Preview could share Production persistence | Preview environment binding is not proven from repository source | verify Vercel Preview environment before authenticated mutation QA; do not test if it targets Production |
| SEC-11 | P3 | CI supply-chain permissions are broader than needed | actions use mutable major tags; validation job grants id-token write for an optional check | pin action SHAs and isolate optional OIDC when governance approves |
| SEC-12 | P3 | CSP is absent | baseline has frame/referrer/permissions/nosniff headers only | deploy a measured Report-Only policy based on actual origins; do not enforce without violation evidence |

## CSRF and origin model

The browser authenticates to the Next.js BFF with cookies, so CORS and SameSite=Lax alone are not the CSRF boundary. Unsafe BFF methods must:

1. accept an exact same-origin Origin; or, for clients that legitimately omit it, an exact same-origin Referer;
2. reject cross-site fetch metadata;
3. accept JSON only for JSON endpoints;
4. reject oversized bodies before parsing and enforce a bounded read for chunked bodies;
5. return a generic 403 with private no-store cache headers.

The expected origin uses the browser-facing `Host` authority and the request URL scheme. Next.js can normalize `request.url` to an internal loopback host; `X-Forwarded-Host` is never accepted as an additional origin. Live local probes verified that a valid Origin reaches payload validation while malicious, spoofed-forwarded, and missing origins receive 403.

The browser never calls bearer-authenticated Hono customer endpoints directly in the intended architecture. Hono CORS is defense in depth and must never use wildcard origin with credentials.

The separate customer, content, security, and admin Server Actions use Next.js 15's built-in Origin-versus-Host CSRF check (confirmed in the installed `action-handler.js`). Customer mutations also require a verified session and strict contract parsing; admin mutations require an authorized admin session. These actions are part of the deployed malicious-Origin QA gate; the custom BFF origin helper does not run for them.

## Cache classification

- Public, immutable: versioned static assets and media.
- Public, revalidatable: public catalog, recipe, journal, sitemap, robots, and SEO HTML where safe.
- Private, never shared: session, cart, wishlist, saved content, profile, preferences, addresses, and orders. These must be dynamic and use Cache-Control: private, no-store, max-age=0.
- Errors from private/auth endpoints inherit the same no-store policy.

## XSS, JSON-LD, redirect, and SSRF review

- React escaping is the default rendering path.
- JSON-LD is the only dynamic dangerouslySetInnerHTML path and escapes angle brackets, ampersands, U+2028, and U+2029, preventing script termination.
- The consent bootstrap inline script is repository-owned static code, not untrusted HTML.
- safeReturnTo rejects external, protocol-relative, and non-allowlisted paths; regression coverage must include encoded and backslash variants.
- Server-side URLs are constructed from environment-owned base URLs and code-owned paths. No user-controlled server-side fetch target was found; SSRF is N/A for current request paths.

## Secrets, IAM, media, and infrastructure

- Tracked-tree scan found only .env.example files; no committed .env, private key, or credential filename.
- Current-tree and 206-commit path/content scans found no credential-text candidate. Four key-shaped matches were classified as incidental byte sequences inside embedded base64 PNG data in SVG assets; no value was printed and no rotation/history rewrite is indicated.
- Lambda DynamoDB IAM is action-limited and resource-limited to the commerce/content tables and indexes; audit-table permissions are separately limited. No dynamodb wildcard or Resource wildcard policy was found.
- S3 public access is blocked; CloudFront uses Origin Access Control, immutable versioned paths, TLS 1.2+, and GET/HEAD only.
- No AWS, Cognito, DynamoDB, WAF, CloudFront, KMS, Secrets Manager, CloudWatch, or Vercel environment mutation is authorized in this pass.

## Preview safety gate

Before authenticated Preview QA, inspect the Git-connected deployment metadata and confirm whether SERVER_API_BASE_URL, Cognito identifiers, Firebase admin credentials, and persistence tables are Preview/dev isolated. If any point to Production, stop before customer-data mutation and report the exact binding risk. Public security/header/performance QA may proceed without customer mutation.
