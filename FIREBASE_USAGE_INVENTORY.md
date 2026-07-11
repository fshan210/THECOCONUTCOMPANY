# Firebase usage inventory

| Area | Files | Read/write | Runtime | Collections / service | Classification | Target |
|---|---|---|---|---|---|---|
| Customer auth | `components/auth/CustomerAuthForms.tsx`, `lib/firebase/client.ts`, `lib/customer/actions.ts` | Auth read/write | Browser + server action | Firebase Auth, `users` | B temporarily retain | Cognito + BFF session |
| Customer session | `lib/customer/auth.ts` | Read | Server | Auth REST, `users` | A replace | Cognito subject + DynamoDB profile |
| Admin auth | `components/admin/AdminForms.tsx`, `lib/admin/actions.ts`, `lib/admin/auth.ts` | Auth + profile/audit writes | Browser + server action | Auth, `admins`, `auditLogs` | D postpone | Cognito groups + audit table |
| CMS reads | `lib/content/content-source.ts`, `lib/content/server.ts` | Read | Server | products, recipes, journal, testimonials, homepage, seo | B temporarily retain | DynamoDB content |
| CMS writes | `lib/content/actions.ts`, `lib/admin/media-actions.ts` | Write/archive | Server | content collections, mediaLibrary | D postpone | Protected admin API + S3 later |
| Security/rate limiting | `lib/security/events.ts`, `lib/security/rate-limit.ts` | Writes/reads | Server | securityEvents | B temporarily retain | DynamoDB audit/controls |
| Analytics | `components/seo/Analytics.tsx`, `lib/firebase/client.ts` | Client telemetry | Browser | Firebase Analytics | C remove as dead if GA4 is authoritative | GA4 only |
| Backup/restore tooling | `scripts/firestore-backup.ts`, `scripts/firestore-restore.ts` | Export/import | Operator CLI | Firestore export | B retain until cutover | Reviewed migration backup |
| Media metadata | `scripts/sync-local-media-library.ts` | Write | Operator CLI | mediaLibrary | D postpone | Local assets, S3 later |

No Firebase occurrence is unclassified. Firebase Storage is not required for the current CMS.
