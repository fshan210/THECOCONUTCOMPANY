# Environment resource map

Audited: 2026-09-24. This records resource identities only; no credentials or customer records.

| Resource | Preview / DEV owner | Production owner | Boundary and evidence |
| --- | --- | --- | --- |
| Vercel project | `my-website`, Preview target, branch `codex/security-performance-hardening` | Same project, Production target | Preview and Production have separate Firebase Admin Sensitive entries. Preview updated on 2026-09-24; Production entry last updated on 2026-06-29. |
| Application deployment | Fresh immutable Preview proof pending from final source SHA | `dpl_8di1DwrhhGeHh6butKXD1ixFYFYx` | Vercel Git metadata for Preview; canonical Production alias inspection. |
| Cognito | DEV pool `ap-south-1_XlJmCJYXS`, client `4md7svldn4dndr9gtfijgfl80` | Live Production pool `ap-south-1_Ux3bulrBi`, client `701q6ujgrkkbfamgnj0e9mnc3f` | Preview configuration and live AWS resource identifiers from prior Gate A audit. |
| API Gateway / Lambda | `evba5qgrqi` / `dotco-dev-api` | `pt4om0dz42` / `dotco-production-api` | Public Preview request-to-DEV Lambda correlation from prior audit. |
| Customer persistence | `dotco-dev-commerce`; DEV content/audit tables | `dotco-production-commerce`; Production content/audit tables | Live Lambda configuration from prior audit. |
| Firebase Admin | **`cothecoconutcompany-preview`** / dedicated Preview service identity | Production project `cothecoconutcompany` (number `551997734422`) is verified in Google Cloud; deployed Admin credential remains masked | New Preview function log identifies credential project ID; Production Sensitive value remains unreadable. |
| Firestore | Preview `(default)` database, Native mode, `asia-south1`; no records seeded | Existing `(default)` database in `cothecoconutcompany`, Native mode, `asia-south1`; deployed Admin credential remains masked | Both database metadata inspected read-only. Preview service identity received 404 for a deliberately nonexistent document, proving read access. |
| Firebase public client / Authentication | Preview-only env updated to `cothecoconutcompany-preview`; fresh bundle proof pending | Deployed bundle names `cothecoconutcompany` | Preview Auth is enabled for email/password; no Preview users copied or created. No admin sign-in/reset was attempted. |
| Media/CDN | `media.cothecoconutcompany.com` public read-only host | Same host | Shared read-only media delivery. |

## Dedicated Preview Firebase resources

- Project ID: `cothecoconutcompany-preview`; project name: **The Coconut Company Preview**. Created 2026-09-24 for non-Production security state and optional non-sensitive Preview CMS metadata. Firebase registration completed.
- Firestore: one default Native database in `asia-south1`, matching the application-compatible region and mode. No Production data was copied; no diagnostic document was written. `securityEvents` and rate-limit counter documents are created by the application on legitimate writes.
- Service identity: **DotCo Preview Firebase Admin**. Project-level `roles/datastore.user` permits the current Admin SDK's Firestore document reads and writes without Owner or Editor. The account has no Production project grant. A key was set only as the Vercel Preview `FIREBASE_SERVICE_ACCOUNT_JSON` Sensitive variable, and its local temporary file was removed. No key material is stored in Git or this document.
- Vercel Preview also has non-secret `FIREBASE_PROJECT_ID=cothecoconutcompany-preview`, checked against the service-account project ID at runtime. Development and Production environment entries were not changed.
- Billing remains disabled on the new project. Email/password Auth was enabled without a billing change. No billing account or unrelated paid service was enabled.

## Data scope and remaining gate

Security QA needs an empty writable `securityEvents` collection and no seed data. Public Shop/Recipes/Journal content on Preview uses the DEV API adapter or curated fallback; no Production Firestore CMS collection was copied. Admin accounts, audit logs, CMS collections, and media metadata can remain empty for customer QA.

Preview public Firebase Auth configuration is now separated from Production, but Gate A remains pending until a fresh immutable Preview proves the client bundle and Admin runtime binding. The Production Admin credential value remains masked; Production project ID and number are independently verified in Google Cloud, while Production public binding must be rechecked read-only. See [preview-service-isolation.md](preview-service-isolation.md).
