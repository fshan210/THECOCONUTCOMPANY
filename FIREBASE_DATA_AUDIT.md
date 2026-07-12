# Firebase data audit

The audit command is read-only and aggregate-only. It does not print emails, document bodies, tokens, or service-account values.

Run locally with Firebase Admin credentials:

```bash
npm run firebase:audit
```

It reports collection names, document counts, representative field names, timestamp ranges, duplicate-email counts, malformed-record counts, and test/production indicators. If credentials are missing it exits with a setup message and does not fall back to public credentials.

Latest DEV audit result (2026-07-12):

- users: 0
- products, recipes, journal, testimonials, homepage, seo: 0
- newsletter, wishlist, savedRecipes, orders: 0
- admins: 1
- auditLogs: 41
- securityEvents: 25
- mediaLibrary: 23

No user or commerce records were present to migrate. Legacy admin/audit/security/media metadata remains Firebase-owned until the dashboard migration phase. The DEV migration command was run in its gated dry-run mode and performed zero writes.
