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
