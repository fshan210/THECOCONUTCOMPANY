# AWS application configuration audit — 2026-07-12

## Repository configuration

| Identifier/config | Location | Status |
| --- | --- | --- |
| DEV Cognito pool `ap-south-1_XlJmCJYXS` | CDK, backend defaults, local/deployment documentation | MATCHES CDK-managed DEV stack |
| DEV app client ending `l80` | CDK, BFF, local/deployment documentation | MATCHES CDK-managed DEV stack |
| DEV API `evba5qgrqi` | backend documentation and server API configuration | MATCHES CDK-managed DEV stack |
| `us-east-1_JBLn1GpJW` | Not referenced by repository configuration | Not application-authoritative |
| `DOTCO_AWS_REGION` | BFF/CDK default is `ap-south-1` | Local shell override is mismatched |
| `COGNITO_APP_CLIENT_ID` | Vercel Development + Preview scope | Present; encrypted value not read |
| `COGNITO_USER_POOL_ID` | Vercel Development + Preview scope | Present; encrypted value not read |
| `COGNITO_SESSION_SECRET` | Vercel Development + Preview scope | Present; secret value not read |
| `SERVER_API_BASE_URL` | Preview + Production scopes | Preview-only binding corrected to the canonical DEV endpoint; Production value remains deliberately uninspected and unchanged |

## Vercel configuration

The repository is linked to the Vercel `my-website` project. The CLI confirms that Cognito identifiers and the BFF session secret exist in Development and Preview. Vercel does not reveal encrypted values through the read-only listing, so the identifier values were intentionally not pulled to disk.

**Production gate:** Production has no Cognito pool/client/session configuration. Its `SERVER_API_BASE_URL` value remains intentionally unexposed and unchanged, so Production must not be used for customer authentication until a separate Production stack and variable plan are approved.

## GitHub Actions / OIDC

- Workflow has `id-token: write` and uses the repository variable `AWS_DEV_ROLE_ARN`.
- The AWS role `dotco-github-actions-dev` exists and is limited to `sts:GetCallerIdentity` by its inline policy.
- This is a safe verification-only DEV role; no deployment permission was found from the read-only audit.

## Local environment files

`.env.local` contains no AWS/Cognito configuration keys. `.env.example` contains placeholders only. No secret value was read or written.

## Customer authentication integration

The customer BFF defaults to `ap-south-1` and expects a server-only Cognito app-client ID and session secret. The active repository code references the CDK-managed DEV identifiers; it does not reference the `us-east-1` pool.
