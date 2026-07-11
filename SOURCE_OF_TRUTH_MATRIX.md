# Source-of-truth matrix

| Domain | Current source | Target source | Transition | Cutover / rollback |
|---|---|---|---|---|
| Identity/authentication | Firebase Auth | Cognito | Disposable-user DEV tests, then reviewed migration | All required Cognito flows pass; rollback to Firebase login |
| User profile | Firestore `users` | DynamoDB commerce | Read-only audit, idempotent DEV migration | Profile parity verified; keep Firebase read fallback during rollback |
| Products/categories/inventory | Local fallback + Firestore CMS | DynamoDB content/commerce | Seed DEV from approved content | Catalog parity and ownership tests pass; fallback remains available |
| Cart/wishlist/addresses | Firebase or local UI state | DynamoDB commerce | Anonymous local cart merge, then authenticated DEV persistence | Repricing and ownership tests pass; local cart remains rollback path |
| Newsletter | Firebase/server action | DynamoDB commerce + email provider later | Dry-run and DEV idempotency tests | Duplicate prevention verified; retain existing endpoint until cutover |
| Discount claims | Firebase/server action | DynamoDB commerce | Eligibility-only DEV endpoint | Conflict tests pass; no redemption until payments exist |
| Recipes/journal/community metadata | Firestore CMS + local fallback | DynamoDB content | Public read adapter with fallback | Content parity verified; Firestore remains temporary |
| Orders | Firebase/none | DynamoDB commerce | Preview and `PENDING_PAYMENT` draft only | No paid status; rollback means disable draft endpoint |
| Admin content | Firestore CMS | DynamoDB content + audit | Dashboard phase after customer cutover | MFA and role review required; Firebase remains admin source meanwhile |
| Audit/security events | Firestore | DynamoDB audit | Aggregate-only DEV verification | Keep Firebase logs until retention parity is approved |

No domain is dual-written in this phase.
