# Production merge impact audit — 2026-07-14

## Classification

**B. New frontend deployed but backend integration disabled.**

The `main` merge at `c853dafcd890fac494ca43fb64d7b97fa69d05fa` triggered the current Vercel Production deployment. The custom domain resolves to that deployment, but its customer-authentication configuration is deliberately incomplete.

## Evidence

| Check | Result |
| --- | --- |
| Production deployment | Ready; deployment `dpl_BVsVPT3xjkXskHDG2FJcYB3wgTSQ` |
| Custom domains | `cothecoconutcompany.com` and `www.cothecoconutcompany.com` alias the deployment |
| Public routes | `/`, `/register`, `/login`, `/verify-email`, `/forgot-password`, `/reset-password`, `/cart` return 200; `/account` redirects to login |
| Customer auth | Disabled safely: `/api/auth/cognito` returns the safe configuration error because no Production Cognito app-client binding exists |
| Production Cognito/API variables | No `COGNITO_USER_POOL_ID`, `COGNITO_APP_CLIENT_ID`, `COGNITO_SESSION_SECRET`, `SERVER_API_BASE_URL`, `NEXT_PUBLIC_APP_ENV`, or `DOTCO_USE_API_CONTENT` binding exists in the Production scope |
| DEV-resource exposure | Not found. Production has no Cognito client ID or API base URL that could point to DEV. |
| Firebase/customer fallback | Customer login cannot fall back to Firebase. Legacy Firebase variables remain only for existing protected admin/CMS functionality. |

## Current public behaviour

The registration and login UI is live, but attempts to use it show `Account authentication is not configured.` This is an intentional safe failure in `app/api/auth/cognito/route.ts`, not a server crash and not a connection to DEV customer data.

## Decision

Do not add Production customer-auth variables, deploy a Production stack, or enable public signup until the explicit Production approval gate is passed. No public-auth traffic needs to be disabled further because it is already fail-closed.

