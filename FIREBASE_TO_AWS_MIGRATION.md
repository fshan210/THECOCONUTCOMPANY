# Firebase to AWS Migration

## Source collections

See `BACKEND_DISCOVERY.md` for discovered Firestore collections.

## Migration approach

1. Keep Firebase as temporary source of truth.
2. Deploy AWS dev stack.
3. Export Firebase collection counts and sample records.
4. Build migration scripts with dry-run mode.
5. Import to dev DynamoDB.
6. Verify counts, owner mappings, published content, and admin roles.
7. Run UI/API smoke tests in dev.
8. Freeze Firebase writes briefly for production migration window.
9. Import production data.
10. Switch frontend API base URL/auth config.
11. Monitor and keep Firebase rollback available.

## Field mapping highlights

- Firebase user UID -> Cognito `sub` mapping table by verified email.
- Firestore `admins.role` -> Cognito group + DynamoDB admin profile.
- Products/recipes/journal/homepage/SEO -> `dotco-{env}-content`.
- Newsletter/orders/wishlist/cart/contact -> `dotco-{env}-commerce`.
- Audit/security events -> `dotco-{env}-audit`.

## Decommission criteria

Firebase can only be decommissioned when:

- Cognito signup/login/reset/verification works,
- all CMS writes are DynamoDB-backed,
- account/cart/wishlist/order smoke tests pass,
- migration counts are verified,
- rollback window has closed,
- backups are retained.

Do not delete Firebase resources in Phase 1.
# Phase 2 migration status

The migration remains DEV-only and gated. `npm run firebase:audit` was run against the rotated local service account and found no user, product, content, newsletter, cart, wishlist, or order records. `npm run migrate:firebase:dry-run` and the approved DEV command perform zero writes because there are no authoritative records to transform. Firebase production data has not been changed. The Preview content adapter uses AWS when `DOTCO_USE_API_CONTENT=true`; fallback content remains available if the API fails.
