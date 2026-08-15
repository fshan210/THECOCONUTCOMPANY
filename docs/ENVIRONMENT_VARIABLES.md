# .CO environment variable inventory

Values are managed in Vercel, AWS, Firebase, or the operator's local environment. Never place real values in this file.

## Required server secrets

| Name | Scope | Purpose |
| --- | --- | --- |
| `ADMIN_SESSION_SECRET` | Vercel server | Signs Admin OS CSRF/session-related state. Admin auth fails closed when absent. |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Vercel server | Preferred Firebase Admin credential for Admin OS/CMS/audit/rate limits. |
| `COGNITO_SESSION_SECRET` | Vercel server | Encrypts customer session and pending-verification cookies. |

`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` are an alternative to the single Firebase service-account JSON. Configure one method, not both. `NEXTAUTH_SECRET` is a compatibility fallback for `ADMIN_SESSION_SECRET`, not the preferred production name.

## Required server configuration for active features

| Name | Feature |
| --- | --- |
| `ADMIN_BASE_PATH`, `ADMIN_EMAIL`, `ADMIN_NAME`, `ADMIN_ROLE` | Admin OS path and bootstrap administrator |
| `COGNITO_APP_CLIENT_ID`, `DOTCO_AWS_REGION` | Customer Cognito BFF |
| `SERVER_API_BASE_URL` | Newsletter, customer data, and optional API-backed content |
| `DOTCO_USE_API_CONTENT` | Enables API-backed content reads |
| `SESSION_MAX_AGE_DAYS` | Customer-session policy |

The backend runtime separately uses `APP_ENV`, `AWS_REGION`, `API_ALLOWED_ORIGINS`, `COGNITO_USER_POOL_ID`, `COGNITO_APP_CLIENT_ID`, `COGNITO_ISSUER`, `COGNITO_REQUIRED_TOKEN_USE`, `COMMERCE_TABLE_NAME`, `CONTENT_TABLE_NAME`, `AUDIT_TABLE_NAME`, and optionally `RATE_LIMIT_TABLE_NAME`.

## Required public configuration

These names are intentionally browser-visible and must never contain private keys or server credentials:

- `NEXT_PUBLIC_MEDIA_BASE_URL`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` (optional Firebase capability)
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` (optional Firebase capability)
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (optional analytics capability)

Firebase Web API keys identify a Firebase project; authorization still depends on Firebase rules and server-side admin checks.

## Optional public features

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_CLARITY_PROJECT_ID`
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION`
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` paired with server-only `RECAPTCHA_SECRET_KEY`
- `NEXT_PUBLIC_DOTCO_API_BASE_URL` only for non-secret public API reads
- `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_ENV`

## Development, infrastructure, and migration only

- `AWS_PROFILE`, `AWS_REGION`, `CDK_DEFAULT_ACCOUNT`
- `DOTCO_ENV`, `DOTCO_MEDIA_CERTIFICATE_ARN`, `DOTCO_LAMBDA_RESERVED_CONCURRENCY`
- `DOTCO_MIGRATION_APPROVED`, `FIRESTORE_BACKUP_BUCKET`, `GOOGLE_APPLICATION_CREDENTIALS`
- `GODADDY_API_KEY`, `GODADDY_API_SECRET`, `GODADDY_DOMAIN`
- `PORT`, `NODE_ENV`

`ENABLE_AUTH_BYPASS_FOR_LOCAL_TESTS` is permitted only when backend `APP_ENV=local`; never set it in Preview or Production.

## Legacy or compatibility names

- `NEXT_PUBLIC_ADMIN_PATH`: compatibility fallback; use server-only `ADMIN_BASE_PATH`.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`: legacy account compatibility, not the current Cognito identity source.
- `SESSION_COOKIE_NAME`: documented historical setting; current customer cookie names are code-defined.
- `NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY`: reserved for a future App Check rollout.

Production Vercel scopes were inspected by name only on 2026-08-15. No secret value was exported or printed. Re-run `vercel env ls` before a release that changes an integration.
