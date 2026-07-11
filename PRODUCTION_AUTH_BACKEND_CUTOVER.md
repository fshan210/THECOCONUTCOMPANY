# Production auth/backend cutover (not executed)

1. Complete the DEV Cognito signup, verification, reset, logout, session, profile, cart, address, and order-draft tests with disposable users.
2. Audit Firebase data and classify real accounts/orders before any migration approval.
3. Bootstrap and review a separate production CDK environment with PITR, deletion protection, alarms, tags, and approved callback/logout URLs.
4. Seed and verify production content; never overwrite records by email or client-provided IDs.
5. Deploy a Next.js BFF using secure HttpOnly cookies and server-only API calls.
6. Add Vercel Preview variables first, run smoke tests, then schedule a monitored production window.
7. Keep Firebase available during the rollback window. Roll back by restoring the previous Vercel deployment and Firebase auth path; do not delete Firebase until parity and account communication are complete.

Production is explicitly unchanged by Phase 2.
