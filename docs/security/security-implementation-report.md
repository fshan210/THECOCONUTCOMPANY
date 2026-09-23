# Security implementation report

Baseline SHA: `0c864135fa7d0d22cc55fae913ff1b86aab2a6c3`
Implemented and revalidated: 2026-09-24
Production/AWS changes: none.

## Outcome

The local hardening closes the three baseline P1 findings: vulnerable framework patch level, missing-origin CSRF acceptance, and incomplete private-cache response policy. No unresolved P0 or P1 finding remains in the tested source. Deployment and controlled authenticated QA are separate release gates.

## Implemented controls

- Authentication and session: auth responses are private/no-store; logout clears pending verification plus all four possible encrypted session-cookie chunks. The AES-256-GCM code now validates exact decrypted token field types, finite expiry, token size, and optional identity fields before returning a session. Session refreshes are abortable and generation-scoped so a late response cannot restore an earlier browser identity.
- Authorization: customer identity remains server-derived from the verified Cognito access-token `sub`; strict contracts prevent owner/role/system-field mass assignment. Existing cross-customer service tests remain green.
- CSRF/origin: every state-changing `app/api` route requires an exact browser-facing same origin (Origin or strict Referer fallback), rejects `Sec-Fetch-Site: cross-site`, accepts JSON only, and stops reading a streamed body as soon as its byte limit is exceeded. The comparison uses the browser-facing `Host` authority because Next.js may normalize its route URL to an internal host; it never trusts `X-Forwarded-Host`. The Hono layer now rejects a present disallowed Origin instead of merely omitting CORS headers.
- Validation/business logic: cart/saved/auth/newsletter BFF inputs are bounded before Zod parsing. Backend schemas continue to reject negative, zero, fractional, and excessive quantities, unknown fields, invalid IDs, and client price authority.
- Cache isolation: session, auth, cart, saved, newsletter, and their error responses use `private, no-store, max-age=0`, `Pragma: no-cache`, and `Expires: 0`. Hono applies equivalent headers to `/v1/me`, cart, orders, wishlist, and saved domains. Public caching is unchanged.
- Redirects: auth return paths are restricted to explicit same-site routes and reject absolute, protocol-relative, backslash, encoded, double-encoded, JavaScript, and prefix-confusion payloads.
- Headers/CSP: a measured Content-Security-Policy-Report-Only policy maps current script/style/image/media/font/connect/frame sources. Existing nosniff, referrer, permissions, and frame controls remain. HSTS is emitted only in the Vercel Production environment to avoid misleading local/Preview behavior. CSP is intentionally not enforced until violation telemetry/manual QA proves compatibility.
- Logging/errors: sensitive-key redaction covers password/passcode/OTP/token/authorization/cookie/private-key/secret/credential/CSRF/card variants recursively. Unhandled backend errors log request ID and error class without raw provider messages; clients receive generic structured failures.
- Dependencies: Next moved from `^15.5.23` to `^15.5.24` and resolves to 15.5.25; Sharp to `^0.35.4`; Hono to `^4.13.5`; PostCSS is overridden to the root 8.5.28 resolution. Root, backend, infra, and contracts production audits report zero vulnerabilities. No major upgrade was made.
- Abuse controls: newsletter now uses the existing rate-limit facility. Auth already uses it. Backend and memory-fallback rate limiting remain non-distributed and are explicitly deferred infrastructure work.

## Verification evidence

- Security regression suite: 8/8 passed.
- Live local BFF probes: valid Origin reached payload validation (400 for an empty cart body); malicious, spoofed-forwarded, and missing Origin returned 403. All responses had private no-store, CSP Report-Only, and nosniff headers.
- Backend/service suite: 27/27 passed, including customer isolation, price authority, quantity validation, strict profile/preferences, address ownership, idempotency, and structured-log redaction.
- Dependency audits: 0 critical, high, moderate, low, or info findings in all four production dependency trees.
- Secret scan: current tracked tree, credential-like filenames across 206 commits, and git patch history were scanned without printing values. Four key-shaped candidates were classified as incidental byte sequences inside embedded base64 PNG data in SVG assets; credential-text candidates: 0. No secret rotation or history rewrite is indicated by this scan.
- IAM: DynamoDB permissions are action-limited and restricted to exact table/index ARNs; Cognito permission is restricted to `GetUser` on the exact pool ARN.
- XSS/SSRF: JSON-LD uses the existing serializer that escapes script-breaking characters. The only other inline HTML is repository-owned consent bootstrap code. Server fetch hosts come from server configuration or fixed Google endpoints; no browser-controlled fetch target was found.

## Residual risk

- Distributed rate limiting needs an approved managed store or API Gateway/WAF policy. Current per-instance/memory fallback cannot be the sole Production abuse boundary.
- CSP is Report-Only and has no reporting endpoint; enforcement requires browser/telemetry evidence and a separate approval.
- GitHub Actions use mutable major action tags and grant job-level `id-token: write` for an optional DEV check. Pinning SHAs and isolating OIDC are recommended CI hardening, not required to ship this application patch.
- Preview environment binding must be inspected before authenticated customer-data mutation.
- Authenticated two-user deployed IDOR and session-expiry/back-button behavior require controlled QA credentials and user sign-in.

## Infrastructure stop gate

No AWS, Vercel environment, WAF, CloudFront, Cognito, KMS, Secrets Manager, DynamoDB, IAM, or CloudWatch mutation was made. The distributed-limiter decision is deferred for explicit approval.
