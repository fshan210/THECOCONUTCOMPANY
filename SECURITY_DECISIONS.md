# Security Decisions

## Authentication source of truth

Target source of truth: Amazon Cognito.

Temporary source of truth: Firebase Auth + Firestore, because the current production UI and CMS already depend on it and production data status is not yet verified.

Decision: do not run Firebase and Cognito as permanent dual auth. Use Firebase temporarily until a dev Cognito migration and account matching plan are verified.

## Session design

Target design:

- Next.js backend-for-frontend session.
- Secure, HttpOnly, SameSite cookies.
- Short access lifetime.
- Server-side refresh handling.
- CSRF protection for cookie-authenticated mutations.
- No raw ID/access tokens in localStorage.
- Tokens never sent to analytics or logs.

Current gap:

- Customer session cookie currently stores the Firebase ID token as an HttpOnly cookie.
- This is safer than localStorage, but not the final target. The cutover must replace this with a signed application session or Cognito-backed BFF session.

## JWT verification

The Hono API verifies Cognito JWTs cryptographically with `aws-jwt-verify` and validates:

- user pool,
- client id,
- token use,
- expiry/signature through Cognito JWKS.

Routes do not trust request-body `userId` values for ownership.

## Authorization groups

Groups:

- `CUSTOMER`
- `SUPPORT`
- `CONTENT_EDITOR`
- `OPERATIONS`
- `ADMIN`

New public signups must always default to `CUSTOMER`. Public input may not assign roles.

## CORS

Allowed origins are environment-specific and explicit. Wildcard origins are not allowed with credentials.

Production default: `https://cothecoconutcompany.com`.

## API entry

API Gateway HTTP API is selected for Phase 1 rather than a naked Function URL. Function URLs may be revisited only behind CloudFront/OAC or equivalent origin protection.

## CDK bootstrap note

The AWS account/region was bootstrapped on 2026-07-11 using CDK's standard bootstrap stack. The application stack itself avoids broad DynamoDB/Cognito permissions, but the bootstrap execution role uses CDK defaults. Before GitHub Actions production deployment, replace long-lived credentials with OIDC-based role assumption and review bootstrap/deploy role permissions.
# Phase 2 implementation status

- AWS DEV API now has a JWT authorizer at API Gateway and Hono remains defense in depth.
- `/api/auth/cognito` uses server-side Cognito commands and an encrypted HttpOnly `co_aws_session` cookie; no token is written to browser storage.
- Existing Firebase admin/CMS flows remain intentionally retained until the audited DEV migration and dashboard cutover are approved.

# Phase 3 production decisions — 2026-07-14

- Production customer authentication is fail-closed until isolated Cognito and
  API variables exist. It must not inherit Preview or DEV values.
- Production browser/API CORS and Cognito callback/logout allowlists contain
  only the canonical and `www` .CO hosts. Wildcards and cross-environment
  origins are excluded.
- Production Cognito is configured as a browser public client with no client
  secret, verified email recovery, and a password policy aligned to the signup
  checklist.
- `COGNITO_SESSION_SECRET` is a Production-only secret generated at cutover;
  it cannot fall back to or reuse the Preview secret.
- GitHub OIDC trust now permits only this repository's pull requests, the
  reviewed feature branch, and `main`; its current DEV role policy remains
  limited to `sts:GetCallerIdentity`. A distinct least-privilege Production
  deployment role is still required before CI/CD deploy automation.
