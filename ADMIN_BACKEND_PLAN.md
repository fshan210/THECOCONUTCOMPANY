# Admin backend boundary

The existing dashboard remains Firebase-backed in Phase 2. AWS admin endpoints are reserved under `/v1/admin/*` and must require an authenticated Cognito access token plus an approved role. Customer tokens cannot self-assign roles.

Roles: `CONTENT_EDITOR`, `OPERATIONS`, `SUPPORT`, `ADMIN`.

Before dashboard migration:

- require MFA for privileged production users;
- map roles from a trusted Cognito group or server-side profile;
- enforce authorization in API Gateway where compatible, Hono, and DynamoDB conditional writes;
- write an audit event for every privileged mutation;
- never expose service credentials or role-assignment operations to the browser.
