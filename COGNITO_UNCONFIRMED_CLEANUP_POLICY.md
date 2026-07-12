# Cognito unconfirmed-user retention policy

## Policy

Cognito must retain an `UNCONFIRMED` record while a customer proves ownership of their email. The application never auto-confirms or deletes a user during a normal verification attempt.

- DEV default: review users older than **72 hours**.
- Production recommendation: make the period configurable between **3 and 7 days**.
- Configuration name: `COGNITO_UNCONFIRMED_RETENTION_HOURS`.
- Never delete `CONFIRMED`, `FORCE_CHANGE_PASSWORD`, `RESET_REQUIRED`, or `DISABLED` accounts through this policy.
- Never delete a user with commerce/order records.
- Store a safe audit event containing only user ID hash, age, result, and request ID—never email, code, or tokens.

## Current implementation decision

An automatic EventBridge deletion job is **not enabled** in DEV or Production yet. It would delete identity records and needs a commerce-record check across the source-of-truth data store before it can be safely automated. The current pool has no scheduled cleanup Lambda.

## Future safe job design

1. EventBridge invokes a low-concurrency Lambda once daily.
2. The Lambda paginates `ListUsers`, checks exact `UNCONFIRMED` status and age, then checks the commerce table by Cognito `sub`.
3. Only users older than `COGNITO_UNCONFIRMED_RETENTION_HOURS` with no commerce records may be removed with `AdminDeleteUser`.
4. The job uses a dry-run mode by default and has reserved concurrency of one.
5. Enable Production cleanup only after a written retention review and a successful DEV dry run.

Until then, repeat signup and sign-in follow the safe resend-code route instead of treating stale unconfirmed users as permanent failures.
