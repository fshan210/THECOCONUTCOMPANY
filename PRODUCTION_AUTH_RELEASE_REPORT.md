# Production authentication release report — pending approval

## Status

**Production deployment stopped safely before AWS/authentication cutover.**

The public frontend from `main` is live, but customer authentication is fail-closed because Production does not have a Cognito/API configuration. No Production AWS customer-auth stack exists and no Production customer data has been created.

## Current deployment

- Frontend: `https://cothecoconutcompany.com`
- Main commit: `c853dafcd890fac494ca43fb64d7b97fa69d05fa`
- Rollback tag: `phase3-pre-production-cutover`
- Vercel Production deployment: `dpl_BVsVPT3xjkXskHDG2FJcYB3wgTSQ`
- Production API / Cognito pool / app client: not deployed; identifiers intentionally unavailable.

## Production configuration plan

Set these variables in the **Production scope only after the Production stack deploys successfully**:

| Variable | Scope | Classification |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_ENV=production` | Production | public configuration |
| `NEXT_PUBLIC_SITE_URL=https://cothecoconutcompany.com` | Production | public configuration |
| `DOTCO_AWS_REGION=ap-south-1` | Production | server configuration |
| `SERVER_API_BASE_URL` | Production | server configuration, Production API URL only |
| `COGNITO_USER_POOL_ID` | Production | server configuration |
| `COGNITO_APP_CLIENT_ID` | Production | server configuration, public client identifier but not browser-exposed |
| `COGNITO_SESSION_SECRET` | Production | secret; newly generated, never reused from Preview |
| `DOTCO_USE_API_CONTENT=false` | Production | safe static-content fallback until Production content seeding is tested |

No AWS keys, DynamoDB credentials, Cognito client secret, DEV identifiers, Preview session secret, or token material belongs in Vercel Production.

## Email delivery readiness

The planned Production pool uses Cognito default email for a controlled initial launch. The account has no SES identity in `ap-south-1` and SES production access is not enabled, so `accounts@cothecoconutcompany.com` is not launch-ready as a branded sender. Google sign-in remains visibly disabled and does not invoke Firebase customer auth.

## Content-source decision

**B. Existing static/frontend content.** `DOTCO_USE_API_CONTENT=false` prevents an unseeded Production content table from breaking public pages. Production users, carts, profiles, orders and discount claims will never be copied from DEV.

## Deployment commands after approval

```bash
AWS_PROFILE=dotco-console AWS_REGION=ap-south-1 DOTCO_ENV=production npm --prefix infra run synth
cd infra && AWS_PROFILE=dotco-console AWS_REGION=ap-south-1 DOTCO_ENV=production npx cdk diff dotco-production-backend --no-color
cd infra && AWS_PROFILE=dotco-console AWS_REGION=ap-south-1 DOTCO_ENV=production npx cdk deploy dotco-production-backend
```

After capturing only non-secret outputs, set the Production-scoped Vercel variables, redeploy `main`, then run the documented production smoke test with one disposable Production account. No paid order or payment action is part of that test.

