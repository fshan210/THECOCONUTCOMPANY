# Backend Discovery — .CO The Coconut Company

Date: 2026-07-11  
Branch: `feature/security-auth-backend-phase-1`

## What exists

- Frontend: Next.js `^15.5.19`, React 18, App Router at the repository root.
- Public routes include `/`, `/about`, `/shop`, `/recipes`, `/sustainability`, `/founders`, `/journal`, and `/journal/social-cocreation-hub`.
- Customer/account routes include `/login`, `/register`, `/forgot-password`, `/reset-password`, `/account`, `/profile`, `/orders`, `/wishlist`, and `/saved-recipes`.
- Admin/dashboard routes include `/admin`, `/admin/[module]`, `/admin/login`, `/admin/forgot-password`, plus the configured public admin path from `ADMIN_BASE_PATH` such as `/control-center`.
- Current auth uses Firebase client auth in the existing approved UI and Firebase Admin/REST verification server-side.
- Current customer session cookie is `co_session` by default. It currently stores a Firebase ID token in an HttpOnly cookie through `createFirebaseCustomerSessionCookie`.
- Admin session uses a signed `co-admin-session` cookie and Firestore-backed admin documents.
- Middleware protects configured admin routes and customer protected routes.
- Firebase Admin/Firestore is used for CMS content, admin profiles, customers, logs, newsletter, wishlist, orders, media, and security events.
- `app/api` routes were not found during discovery; the app mainly uses server actions and direct server-side library calls.
- Existing `/backend` was a small Python/FastAPI/Postgres skeleton. It is not connected to the production Next.js app and does not match the requested AWS/Hono/DynamoDB architecture.
- Vercel image optimization is disabled in `next.config.mjs`; static assets are served directly.

## Firestore collections found

`users`, `admins`, `products`, `recipes`, `journal`, `testimonials`, `homepage`, `seo`, `newsletter`, `wishlist`, `savedRecipes`, `orders`, `activityLogs`, `auditLogs`, `securityEvents`, `roles`, `permissions`, `brandAssets`, `settings`, `mediaLibrary`, `contactForms`.

## Existing environment variables

Important current keys include:

- Public site/analytics: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_CLARITY_PROJECT_ID`.
- Firebase web: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`, optional messaging/storage/measurement keys.
- Firebase Admin: `FIREBASE_SERVICE_ACCOUNT_JSON` or `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`.
- Admin/customer sessions: `ADMIN_BASE_PATH`, `ADMIN_EMAIL`, `ADMIN_SESSION_SECRET`, `SESSION_COOKIE_NAME`, `SESSION_MAX_AGE_DAYS`.
- Abuse controls: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`.

New AWS placeholders have been added to `.env.example`; no real secret values are committed.

## What will be retained temporarily

- Existing approved frontend layouts and UI.
- Firebase Authentication and Firestore as the temporary production source of truth until a dev Cognito/DynamoDB migration is verified.
- Existing CMS fallback behavior.
- Existing static asset delivery and Vercel frontend deployment.

## What will be replaced

- Firebase Auth will be replaced by Cognito after a verified dev migration.
- Firestore CMS/customer/commerce collections will be migrated to DynamoDB domain tables.
- Local browser cart/wishlist state will become a server-owned API model.
- The unused Python/Postgres backend skeleton is superseded by the new TypeScript Hono Lambda backend.

## Migration risks

- Unknown amount of real customer/admin/CMS data may exist in Firebase.
- Current customer session stores a raw Firebase ID token in an HttpOnly cookie. It is not in localStorage, but the Phase 1 target is a BFF session envelope, not raw token persistence.
- Running Firebase and Cognito as permanent dual authoritative auth systems would create account divergence.
- Cart, wishlist, discount, and order state currently needs authoritative server-side ownership checks before commerce launch.

## Data migration requirements

- Export Firebase collection counts before cutover.
- Map Firebase UID/email to Cognito `sub` using email as the matching key only after email verification.
- Migrate admin roles to Cognito groups and DynamoDB admin profile records.
- Migrate products/recipes/journal/homepage/SEO/media/testimonials to the content table.
- Migrate carts/wishlists/orders/newsletter/contact submissions to commerce/audit tables.
- Validate record counts and sample field mappings before any production switch.

## Rollback plan

1. Keep the current frontend branch and Firebase config intact until Cognito/DynamoDB dev tests pass.
2. Do not delete Firebase resources in this phase.
3. If AWS dev fails, unset `NEXT_PUBLIC_DOTCO_API_BASE_URL` and keep Firebase-powered production behavior.
4. Keep branch-level rollback available through Git and Vercel deployments.
5. Do not deploy production backend infrastructure until dev diff and behavior are reviewed.
