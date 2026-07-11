# .CO Backend API

This directory now contains the Phase 1 TypeScript/Hono backend foundation for AWS Lambda.

The older Python/FastAPI/Postgres skeleton under `backend/app` remains present only as discovered legacy code and is not the target architecture for the .CO production backend.

## Stack

- Hono router
- TypeScript
- AWS Lambda adapter
- AWS SDK v3
- Cognito JWT verification with `aws-jwt-verify`
- Zod validation through `@dotco/contracts`

## Local setup

```bash
npm install --prefix ../packages/contracts
npm install --prefix .
npm run dev
```

Default local URL:

```text
http://localhost:8787/v1/health
```

## Validation

```bash
npm run test
npm run typecheck
npm run build
```

## Important security notes

- Do not expose AWS credentials to the browser.
- Do not trust browser-submitted user IDs, prices, discounts, totals, roles, or payment status.
- Do not persist raw tokens in localStorage.
- Production authenticated routes must use Cognito JWT verification and server-side ownership checks.
