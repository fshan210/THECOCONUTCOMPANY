# Phase 1 security verification (DEV)

## Verified from source

- Browser Cognito app client is created without a client secret.
- API authentication verifies Cognito JWTs in Hono and requires access tokens for protected routes.
- Protected API routes derive ownership from the verified Cognito subject; client-supplied user IDs are not accepted by route contracts.
- API CORS has an explicit allowlist and rejects unapproved origins.
- DynamoDB tables use AWS-managed encryption and on-demand billing in the DEV CDK stack.
- No NAT Gateway, EC2, RDS, or always-on container is defined.
- CloudWatch log retention is bounded and application logs do not intentionally include authorization headers or raw request bodies.
- IAM does not grant DynamoDB `Scan` to the Lambda role.

## DEV smoke evidence

- `GET /v1/health`: 200
- `GET /v1/ready`: 200
- `GET /v1/products?limit=2`: 200
- `GET /v1/me` without a token: 401
- Unapproved CORS preflight: 403
- Approved production-origin CORS preflight: 204

## Open verification items

- API Gateway JWT authorizer is not yet attached; Hono remains the enforced application layer for this DEV stack.
- Cognito callback/logout URLs and email verification settings require a console review before browser OAuth is enabled.
- DynamoDB PITR/deletion protection are production cutover requirements, not enabled destructively in DEV.
- The existing Firebase session cookie currently contains a Firebase ID token. It must be replaced by a BFF-issued session envelope before Firebase is retired.
