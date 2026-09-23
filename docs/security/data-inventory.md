# Security data inventory

Baseline SHA: `0c864135fa7d0d22cc55fae913ff1b86aab2a6c3`
Audit date: 2026-09-21
Production and infrastructure mutations: none.

## Customer and authentication data

| Data | Source | Browser exposure | Server destination | Retention/cache posture | Principal controls |
| --- | --- | --- | --- | --- | --- |
| Password | Customer during login/signup/reset | Submitted over HTTPS to the same-origin BFF; never returned or stored by browser code | Cognito through the server-side SDK | Request lifetime only; private no-store response | bounded JSON, strict Zod action schema, same-origin provenance, rate limit, generic errors, log redaction |
| Confirmation/reset OTP | Customer | Same as password | Cognito through the server-side SDK | Request lifetime only | same-origin provenance, bounded JSON, rate limit, no logging |
| Cognito access/ID/refresh tokens | Cognito | Encrypted only inside HttpOnly cookies; never returned by the session endpoint or placed in Web Storage/URL | Next.js BFF; access token forwarded server-to-server to Hono | Cookie lifetime follows token expiry; private no-store | AES-256-GCM with fresh 96-bit IV, tag verification, strict decrypted-payload validation, `Secure`, `SameSite=Lax`, `Path=/`, split-cookie cleanup |
| Pending verification email/return path | Auth flow | Encrypted HttpOnly cookie | Next.js auth BFF | 30 minutes | AES-256-GCM, safe return-path allowlist, cleared on logout/success |
| Customer profile | Cognito/DynamoDB | Rendered safe fields such as email/name; no bearer token | Hono `/v1/me`, DynamoDB commerce table | Persistent business record; never shared-cache | verified Cognito `sub`, strict writable-field schema, private no-store |
| Addresses | Customer | Account UI/server actions | Hono `/v1/me/addresses*`, DynamoDB commerce table | Persistent until changed/deleted | verified `sub` partition, validated address ID, strict field allowlist, ownership tests |
| Preferences | Customer | Account UI/server actions | Hono `/v1/me`, DynamoDB commerce table | Persistent until changed | verified `sub`, strict supported-fields allowlist |
| Cart | Customer actions plus authoritative catalog | UI state; guest draft remains local | Authenticated cart in Hono/DynamoDB | Guest local storage; authenticated persistent record | trusted `sub`, idempotency keys, quantity/SKU schemas, server prices/status, conditional writes |
| Wishlist/saved content | Customer actions | UI state only | Hono `/v1/wishlist` and `/v1/saved*`, DynamoDB | Persistent until removed | trusted `sub`, kind/ID allowlist, idempotency, stale-response generation guard, private no-store |
| Orders | Backend | Account UI | Hono `/v1/orders*`, DynamoDB | Persistent business record | trusted `sub`; order creation remains deferred |
| Newsletter email/consent | Customer | Submitted to same-origin BFF | Hono newsletter route/DynamoDB content domain | Persistent subscription record | strict schema, same-origin provenance, body limit, abuse limiter, generic failures |
| Request/security diagnostics | Vercel/Lambda/API | request ID may be returned | Structured logs; optional security-event store | Operational retention controlled outside this code pass | credential-key redaction, no provider messages/stacks in client errors, minimized identifiers |

## Public content and media

Products, recipes, journal entries, SEO metadata, and approved media are public data. Versioned static media is intentionally cacheable. Media infrastructure keeps the S3 origin private and serves public objects through CloudFront Origin Access Control. The hardening does not disable public caching or alter content identity.

## Authorization and tenancy

The browser does not choose the customer partition. Next.js forwards the access token server-side, Hono verifies the Cognito signature/audience/token use, and services derive the partition key from the verified `sub`. Browser-supplied `customerId`, `userId`, `email`, or `ownerId` values are not accepted as ownership evidence. Existing automated service tests cover isolation for carts, saved content, addresses, profile/preferences, and customer-keyed records. A controlled two-user deployed test remains a Preview QA gate.

## IAM action/resource/why inventory

| Principal | Actions | Resources | Why |
| --- | --- | --- | --- |
| Backend Lambda role | `BatchGetItem`, `GetItem`, `Query`, `ConditionCheckItem`, `PutItem`, `UpdateItem`, `DeleteItem`, `BatchWriteItem`, `TransactWriteItems`, `DescribeTable` | Exact commerce/content table ARNs and their index ARNs | Customer/content reads, validated writes, transactions, and table health |
| Backend Lambda role | `PutItem`, `UpdateItem`, `DescribeTable` | Exact audit table ARN and indexes | Append/update security and operational audit events |
| Backend Lambda role | `cognito-idp:GetUser` | Exact Cognito user-pool ARN | Resolve trusted customer attributes for authenticated requests |
| GitHub Actions optional OIDC | Repository workflow identity; role permissions live outside this repository | Role named by repository variable | Optional non-mutating DEV identity verification |

No `dynamodb:*` or `Resource: *` policy is present in the audited CDK stack. No IAM change is required or authorized in this pass.

## Preview isolation

Preview is noindex, but repository source cannot prove whether its Vercel environment variables point at Production Cognito/DynamoDB-backed APIs. Before any authenticated Preview mutation, inspect deployment environment bindings. If Preview shares Production persistence, stop customer-data mutation QA and report the binding risk; public route/header/performance checks may continue.
