# Railway environment resource map

Audited 2026-10-03 before Railway resource creation. AWS identities were read from live Cognito, Lambda and CloudFormation; Preview variable bindings were read with `vercel env pull --environment=preview` into a private local file. GCP project, service account and database metadata were checked read-only. No secret values are in this document.

| Resource | Vercel Production | Vercel Preview | Railway staging | Future Railway Production |
| --- | --- | --- | --- | --- |
| Cognito | `ap-south-1_Ux3bulrBi`, client `701q6ujgrkkbfamgnj0e9mnc3f` — PRODUCTION-ONLY | `ap-south-1_XlJmCJYXS`, client `4md7svldn4dndr9gtfijgfl80` — ISOLATED MUTABLE | Same verified DEV pool/client — ISOLATED MUTABLE | Existing Production pool/client, after approval |
| API Gateway | `pt4om0dz42.execute-api.ap-south-1.amazonaws.com` — PRODUCTION-ONLY | DEV endpoint `evba5qgrqi.execute-api.ap-south-1.amazonaws.com`; historical Preview API variable is Sensitive and unexportable | Verified DEV endpoint — ISOLATED MUTABLE | Existing Production API after approval |
| Lambda | `dotco-production-api`, active, `ap-south-1` | `dotco-dev-api`, active, Node 22, `ap-south-1` | External DEV Lambda; no Railway backend service | External existing Production Lambda |
| Customer persistence | `dotco-production-commerce/content/audit` — PRODUCTION-ONLY | `dotco-dev-commerce/content/audit` — ISOLATED MUTABLE | Same DEV tables through API, no direct table credentials | Existing Production tables through API |
| Firebase Admin | `cothecoconutcompany`; existing deployed key remains masked — PRODUCTION-ONLY | `cothecoconutcompany-preview`; Sensitive credential not exportable | Dedicated Preview service identity only — ISOLATED MUTABLE; separate key approved and created 2026-10-03 | Production credential mapped separately at cutover; never loaded into staging |
| Firebase public Auth | `cothecoconutcompany` — PRODUCTION-ONLY | `cothecoconutcompany-preview`, verified Preview variables | Same Preview public config — ISOLATED MUTABLE | Production public config after approval |
| Firestore | Existing Production project | Preview default Native database `asia-south1`, live verified | Preview only; empty/QA state | Existing Production database |
| Media CDN | `media.cothecoconutcompany.com` — SHARED READ-ONLY | Same public host | Same public host; no uploads/deletion | Same public host |
| Canonical URL | `https://cothecoconutcompany.com` | Canonical stays apex; Preview host noindex | Canonical stays apex; generated Railway host noindex | Existing apex after separately approved DNS cutover |
| Deployment environment | Vercel fallback `production` | Vercel fallback `preview` | Explicit `APP_DEPLOY_ENV=preview` | Explicit `APP_DEPLOY_ENV=production` |
| Host platform | `vercel` | `vercel` | `railway` | `railway` |
| Session/Admin encryption keys | Current Production keys — PRODUCTION-ONLY | Existing Preview customer key; Admin key historically shared across scopes | New staging-only generated keys; do not copy shared Admin key | Map separately and review session continuity at cutover |

The verified Preview service identity is `dotco-preview-admin@cothecoconutcompany-preview.iam.gserviceaccount.com`, enabled. No Production data copying or fake customer addresses is required. No AWS mutation is required.

## Variable transfer gate

Human review must cover each variable name, source and target before setting Railway variables. See `railway-environment-variables.json`. Vercel Sensitive values return placeholders and must never be pasted as real values. The local canonical `.env.local` contains Production Firebase credentials and is explicitly not a Railway staging source.

The inaccessible Preview Firebase Admin credential requires either secure operator entry of the existing Preview key or a new key for the already restricted Preview service identity. Proposed default: a separate Railway key for that same Preview identity, with no new IAM roles. Generate fresh staging-only session keys; transfer directly to Railway without printing them.

## Approved staging transfer

The user approved the variable mapping and creation of a separate key for the existing Preview service account on 2026-10-03. Twenty-five reviewed variables were staged on `dotco-next-staging`; private values were passed directly to Railway and retained only in a mode-600 local operator archive. Production credentials, local AWS credentials, Vercel operator tokens, and analytics identifiers were excluded. The optional public API URL remains absent, matching Vercel Preview; the BFF uses the verified DEV server API URL.
