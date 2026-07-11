# Backend Architecture — Phase 1

## Selected architecture

- Frontend remains the existing Next.js app on Vercel.
- Backend API is a TypeScript Hono app running on AWS Lambda.
- Public API entry uses API Gateway HTTP API in Phase 1.
- Authentication target is Amazon Cognito in `ap-south-1`.
- Database target is DynamoDB on-demand with three domain tables:
  - `dotco-{env}-commerce`
  - `dotco-{env}-content`
  - `dotco-{env}-audit`
- Infrastructure is AWS CDK v2 TypeScript in `/infra`.
- Shared request/response contracts live in `/packages/contracts`.

## Why API Gateway HTTP API was selected

The requested preferred option was CloudFront in front of a Lambda Function URL protected by Origin Access Control where supported. For authenticated APIs, a naked Function URL is not acceptable, and Function URL origin access controls/routing/rate observability are more fragile for this first production security foundation.

API Gateway HTTP API is selected as the safe Phase 1 fallback because it provides:

- stable Lambda proxy routing,
- explicit CORS,
- deployment-stage visibility,
- CloudWatch integration,
- future authorizer/WAF integration path,
- no public naked Function URL.

CloudFront can still be added later for caching or global edge controls once the API contract stabilizes.

## Repository structure

- `/backend`: TypeScript Hono Lambda API foundation.
- `/infra`: AWS CDK v2 stack.
- `/packages/contracts`: shared Zod schemas and API types.
- Root Next.js app is not moved to avoid Vercel deployment risk.

## Runtime

- Lambda runtime: Node.js 22.
- Region: `ap-south-1` by default.
- Architecture: ARM64.
- Dev reserved concurrency: 5.
- Production reserved concurrency: 25.

## Security posture

- No DynamoDB or AWS SDK access from the browser.
- No secrets in `NEXT_PUBLIC_*`.
- Cognito JWTs verified cryptographically with `aws-jwt-verify`.
- Role enforcement is server-side.
- CORS allowlist is explicit.
- API responses use safe envelopes.
- Logs redact sensitive keys.
- DynamoDB IAM excludes `dynamodb:Scan`.

## Current status

This commit establishes the secure foundation and docs. It does not cut production users from Firebase to Cognito yet and does not deploy production AWS resources.

## Dev deployment

Deployed on 2026-07-11 to AWS account `574246331930`, region `ap-south-1`.

- Dev API URL: `https://evba5qgrqi.execute-api.ap-south-1.amazonaws.com/`
- Cognito User Pool ID: `ap-south-1_XlJmCJYXS`
- Cognito App Client ID: `4md7svldn4dndr9gtfijgfl80`
- DynamoDB tables: `dotco-dev-commerce`, `dotco-dev-content`, `dotco-dev-audit`

Smoke tests passed for:

- `GET /v1/health`
- `GET /v1/ready`
- `GET /v1/products?limit=2`
- unauthenticated `GET /v1/me` returns `401`
- CORS preflight rejects `https://evil.example`
- CORS preflight allows `https://cothecoconutcompany.com`

Production API is not deployed.
