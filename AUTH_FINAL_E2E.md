# Authentication final E2E — preview release candidate

## Scope

This release changes only the customer authentication experience. It does not
modify AWS infrastructure, Cognito configuration, DynamoDB, Lambda, API
Gateway, or Vercel environment variables.

## Verification flow

- [x] Six one-time-password fields auto-advance and accept a six-digit paste.
- [x] Supplying all six digits automatically submits confirmation.
- [x] Inputs lock while the single confirmation request is pending; the page
  presents `Verifying...` and prevents duplicate submits.
- [x] The manual **Verify email** button has been removed.
- [x] Confirmation success shows an animated checkmark, `Welcome to .CO`, and
  `Your account has been successfully verified.`

## Secure session continuation

Cognito `ConfirmSignUp` confirms an account but does not return a session,
access token, refresh token, or password-equivalent credential. Creating an
authenticated session immediately after confirmation would therefore require
retaining or replaying the original password, or changing Cognito to a custom
or hosted authentication flow. Both are prohibited for this release.

The implemented approved alternative is a one-click **Continue securely**
action. It preserves the verified email and the allowlisted destination, then
opens sign-in with the email prefilled. The customer enters their password once;
the existing BFF then creates the encrypted HttpOnly session cookie. No
password, access token, ID token, or refresh token is stored in localStorage or
sessionStorage.

## Redirect policy

Only these destinations are accepted: `/shop`, `/cart`, `/wishlist`,
`/account`, and `/products`. Any absent, malformed, external, protocol-relative,
or unapproved return path resolves to `/shop`.

`/checkout` is intentionally not accepted: it is not part of the explicit
allowlist and the current site does not provide a live checkout flow.

## Automated checks

Run locally on 2026-07-13:

| Check | Result |
| --- | --- |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run test` | PASS — 13 contract, backend, and infrastructure tests |
| `npm run build` | PASS |
| `git diff --check` | PASS |

## Preview browser checks

Preview: `https://my-website-m5dj2ihkm-fazil-s-projects1.vercel.app`

- [x] `/email-verified?returnTo=/cart` renders the success animation, required
  copy, and a continuation link to `/login?redirect=/cart`.
- [x] `/verify-email?returnTo=/wishlist` renders six OTP inputs, autofocuses the
  first input, states that verification is automatic, and has no **Verify
  email** button.
- [x] The preview has no browser console errors during these checks.
- [x] The existing real Cognito sign-up, email delivery, and account
  confirmation were confirmed before this UX-only release candidate.

## Authenticated browser scenario

The final authenticated cart persistence scenario requires a confirmed
disposable-user password or interactive sign-in by its owner. No account
credential is retained by this release process, and the browser automation
policy does not inspect cookies, localStorage, or sessionStorage directly.

Once a disposable user signs in on the preview, complete this narrow final
check: `/v1/me` succeeds through the BFF; add a product; log out; sign in again;
and confirm the cart persists. The session implementation is already covered by
the existing BFF and backend test suite, but that live customer interaction
remains a release-gate manual check.

## Production-cutover release gate — 2026-07-14

The final Preview authenticated persistence scenario remains pending interactive
password entry by the disposable-account owner. It must prove all of the
following without recording credentials, tokens, cookies, verification codes or
customer identifiers in this document:

- BFF session cookie is named `co_aws_session`, HttpOnly, Secure in Preview,
  SameSite=Lax, and not readable from browser storage.
- `/v1/me` succeeds while signed in and returns 401 after logout.
- A cart item survives logout and the next sign-in.
- Wishlist and profile read/update persist for the signed-in user only.
- Cart-origin login returns to `/cart`; normal login follows its allowlisted
  `/account` or `/shop` destination.
- Desktop and mobile layouts remain unchanged and no customer-auth request is
  sent to Firebase.

This file must not be marked complete until that live test has passed.
