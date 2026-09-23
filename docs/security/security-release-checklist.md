# Security and performance Preview release checklist

Branch: `codex/security-performance-hardening`
Base: `0c864135fa7d0d22cc55fae913ff1b86aab2a6c3`

## Source and local gates

- [x] Isolated worktree created from the exact Production/main source.
- [x] Canonical `main` checkout remains clean and unchanged.
- [x] Threat model and performance baseline precede implementation.
- [x] No unresolved source-level security P0 or P1 finding. Pre-existing mobile LCP findings remain a performance release gate.
- [x] Same-origin, missing-Origin, malicious-Origin, bounded-body, open-redirect, session-crypto, stale-response, private-cache, and cookie-cleanup regressions are covered.
- [x] Customer identity remains derived from verified Cognito `sub`; service isolation tests pass.
- [x] Production dependency audits are zero for root, backend, infra, and contracts.
- [x] Current-tree and 206-commit secret scans are complete; no credential-text match found.
- [x] IAM and media/CDN source configuration reviewed; no wildcard table access and no infrastructure change applied.
- [x] Typecheck, backend typecheck, lint, full test, security test, SEO QA, performance QA, contract/infra tests, build, smoke, and `git diff --check` passed locally. Final committed SHA and infra synth remain to be recorded.
- [x] Local production server restarted from the final code build; valid, missing, evil, and spoofed-forwarded origin probes repeated.
- [x] Responsive 1440/390 route matrix completed for Home, Shop, Recipes, Sustainability, Journal, Login, Account, Wishlist, Saved Recipes, and Cart; no horizontal overflow or broken loaded images. Protected routes correctly redirected to Login. Mobile navigation opened with expected links.

## Immutable Preview gates

- [ ] Coherent commits pushed to `codex/security-performance-hardening`.
- [ ] PR opened without merging.
- [ ] Git-connected Vercel Preview is `READY` at the exact tested SHA.
- [ ] Immutable deployment URL and deployment ID recorded.
- [ ] Production deployment `dpl_8di1DwrhhGeHh6butKXD1ixFYFYx` and canonical alias remain unchanged.
- [ ] Malicious/missing Origin rejected; valid Origin reaches authentication/validation.
- [ ] Unauthenticated private API rejects access and returns private no-store headers.
- [ ] Invalid payloads, safe redirect fallback, generic errors, response headers, CSP Report-Only, and Preview noindex verified.
- [ ] Preview environment binding reviewed before any customer-data mutation.
- [ ] Controlled user signs in without sharing a password.
- [ ] Login, cart, wishlist, saved recipes, account, addresses, preferences, logout, refresh, back-button, and session-expiry behavior verified.
- [ ] Deployed Home, Shop, Recipes, Journal, Sustainability, and Account measurements captured and compared with Production baseline.

## Stop conditions

Do not promote while any P0/P1, cross-user leakage, CSRF bypass, private-cache leak, auth regression, critical performance regression, CSP breakage, SEO regression, or unexplained visual change remains. Do not merge or deploy Production without explicit approval.
