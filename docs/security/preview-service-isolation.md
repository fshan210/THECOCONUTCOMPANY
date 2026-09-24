# Preview service isolation audit

Audited: 2026-09-24. Candidate: `1e4e09accba7d490da125a240d13510f95ad8f86`; immutable Preview: `dpl_6Qa6BeCBZjRfYPNrKBvi9AHhWDVL`. This is a read-only binding audit. No customer mutation, Vercel configuration change, or AWS mutation was made.

## Decision

**Classification: C — UNSAFE / AMBIGUOUS for authenticated mutation QA.** The current Preview Cognito pool and client match the live DEV stack and differ from the live Production pool/client. This does **not** prove where the Preview BFF sends authenticated customer requests: its `SERVER_API_BASE_URL` is a Vercel Sensitive value, unreadable through the CLI. The Preview Firebase project and admin service-account project are also unreadable. A mere `preview` target or `NEXT_PUBLIC_APP_ENV=dev` label is not a resource binding proof.

Stop authenticated cart, wishlist, saved recipe, account, address, preference, login, and logout QA until the remaining resource identities are attested. Login itself can write rate-limit/security-event state through Firebase Admin, so it is inside this stop boundary. Public read-only QA may continue.

## Service-binding matrix

| Service | Production resource | Preview resource | Same / different | Safe for QA? | Evidence |
| --- | --- | --- | --- | --- | --- |
| Cognito | Live `dotco-production-backend` pool `ap-south-1_Ux3bulrBi`, client ending `c3f`; Vercel Production identifiers present but Sensitive | Pullable Preview identifiers match live `dotco-dev-backend` pool `ap-south-1_XlJmCJYXS` and DEV client ending `l80` | AWS stacks differ; current Preview values match DEV | Identity selection is promising; insufficient for mutation QA while API/Firebase are unknown | Vercel environment list and Preview pull; read-only CloudFormation outputs in account `574246331930`, `ap-south-1` |
| Backend API | Live Production stack output host `pt4om0dz42.execute-api.ap-south-1.amazonaws.com`; Vercel Production `SERVER_API_BASE_URL` is Sensitive | Live DEV stack output host `evba5qgrqi.execute-api.ap-south-1.amazonaws.com`; Preview `SERVER_API_BASE_URL` exists but is Sensitive, so its actual host is unknown | Unknown | **No** | `lib/customer/aws-api.ts` reads `SERVER_API_BASE_URL` directly; Vercel list/pull masks both target values; CloudFormation outputs show possible endpoints, not the Preview binding |
| Customer persistence | Production backend Lambda targets `dotco-production-commerce` | DEV backend Lambda targets `dotco-dev-commerce`; Preview backend target unknown | Unknown | **No** | `infra/lib/dotco-backend-stack.ts` sets Lambda table names by environment; deployed Preview API host is unproven |
| Cart persistence | Production commerce table | DEV commerce table if Preview reaches DEV API; actual target unknown | Unknown | **No** | `lib/customer/aws-api.ts` sends cart calls to `SERVER_API_BASE_URL`; backend repository uses Lambda table configuration |
| Wishlist | Production commerce table | DEV commerce table if Preview reaches DEV API; actual target unknown | Unknown | **No** | Same BFF/API route and table binding |
| Saved recipes | Production commerce table | DEV commerce table if Preview reaches DEV API; actual target unknown | Unknown | **No** | Same BFF/API route and table binding |
| Addresses | Production commerce table | DEV commerce table if Preview reaches DEV API; actual target unknown | Unknown | **No** | Same BFF/API route and table binding |
| Preferences/profile | Production commerce table | DEV commerce table if Preview reaches DEV API; actual target unknown | Unknown | **No** | Same BFF/API route and table binding |
| Catalog | Public data may use API or Firebase content | Preview `DOTCO_USE_API_CONTENT=true`, but API URL is unreadable; Firebase Admin project is unreadable | Unknown source binding | Read-only public page QA only | `lib/content/content-source.ts`; Preview env pull; `lib/backend/server-api-client.ts` |
| Firebase rate limiting/security events | Production `FIREBASE_SERVICE_ACCOUNT_JSON` is Sensitive | Preview service account and public project identifiers are Sensitive; actual project unknown | Unknown | **No login or other write QA** | `lib/security/rate-limit.ts` can write Firestore; `lib/firebase/admin.ts` selects the project from service-account JSON |
| Media/CDN | Public `media.cothecoconutcompany.com` observed on Production Shop | Same public host observed on Preview Shop; bundled media also served from each deployment | Shared public read-only CDN | Yes for read-only visual QA | Rendered Shop HTML on both immutable Preview and canonical Production; `lib/media.ts` |

## Evidence and limits

- Vercel project `my-website` has separate Preview and Production entries for `SERVER_API_BASE_URL`, Cognito identifiers, Firebase project/admin credentials, and media configuration. Separate entries can still contain the same value.
- The Preview pull yielded a DEV Cognito pool/client and `NEXT_PUBLIC_APP_ENV=dev`. It did not yield the Sensitive API or Firebase values. The Production pull likewise masked those values. Temporary pull files were removed without printing values.
- Read-only CloudFormation inspection found both `dotco-dev-backend` and `dotco-production-backend` in `UPDATE_COMPLETE`, with distinct HTTP APIs, Cognito pools/clients, and `dotco-dev-*` versus `dotco-production-*` DynamoDB tables. This proves the resources exist and differ; it does not select the Preview BFF's API host.
- The repository's older `AWS_CORRECTION_EXECUTION_LOG.md` says Preview API configuration was corrected to DEV in July. It explicitly calls for fresh runtime verification. That historical action cannot prove the September immutable deployment's Sensitive value.
- Vercel documents that a Sensitive environment variable is unreadable after creation, including through the dashboard and pull/API surfaces. A resource-owner attestation or safe runtime binding assertion is necessary; masked values cannot be compared.

## Minimum closure evidence

1. A Vercel configuration owner confirms, from the original configuration record or another authorized authoritative source, that **the exact immutable Preview deployment** uses DEV HTTP API `evba5qgrqi` and not Production HTTP API `pt4om0dz42` for `SERVER_API_BASE_URL`.
2. The owner confirms the Preview Firebase Admin service-account project and public Firebase project are non-Production, or explicitly approves their shared, controlled use for QA. No key, token, or service-account JSON should be shared.
3. If either setting is wrong, propose the exact Preview-only Vercel environment correction and fresh deployment for separate approval. Do not create AWS resources or mutate Vercel settings under this audit.
4. Only after the resource identities and customer-data boundary are confirmed, classify as **ISOLATED** or **SHARED BUT CONTROLLED** and begin manual Preview sign-in and authenticated QA. If evidence remains unavailable, retain **UNSAFE / AMBIGUOUS**.

Vercel reference: [Sensitive environment variables](https://vercel.com/docs/environment-variables/sensitive-environment-variables).
