# Phase 2 implementation plan

## Branch and rollback

- Base branch: `feature/security-auth-backend-phase-1`
- Working branch: `feature/security-auth-backend-phase-2`
- Rollback point: `5c00230` (`fix: exclude backend infra from frontend typecheck`)
- Production remains on the existing Firebase-backed frontend until DEV acceptance is complete.

## Current boundary

The Next.js frontend still uses Firebase Auth/Firestore for customer sessions, admin access, and CMS content. The AWS DEV API is deployed in `ap-south-1` and currently provides typed catalog/content reads plus protected API contracts for profile, cart, wishlist, addresses, discounts, and order drafts. No production AWS deployment or destructive Firebase migration is part of this branch.

## Sequence

1. Verify the DEV CDK stack and security controls.
2. Inventory Firebase code and data read-only.
3. Add a server-only DEV API adapter with fallback behavior.
4. Add Cognito/BFF session endpoints only after the callback and cookie model is tested.
5. Migrate public reads and anonymous cart behavior.
6. Migrate authenticated profile/commerce mutations and run disposable-user E2E tests.
7. Review and approve production cutover separately.

## Affected areas

- Auth UI: `components/auth`, `app/login`, `app/forgot-password`, `app/reset-password`
- Admin auth: `components/admin/AdminForms`, `lib/admin`, `app/admin`
- Firebase CMS/session: `lib/firebase`, `lib/customer`, `lib/content`, `lib/admin/actions`
- AWS API: `backend/src/routes`, `lib/backend`
- Infrastructure: `infra`

## Explicit exclusions

- No production Cognito or API deployment
- No payment provider or paid-order flow
- No deletion of Firebase data
- No public dashboard/API role-assignment endpoint
