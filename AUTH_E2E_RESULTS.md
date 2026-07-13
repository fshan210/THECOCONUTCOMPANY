# Authentication E2E results — Preview gate

## Automated checks completed

| Check | Status |
| --- | --- |
| Lint and TypeScript | Passed locally |
| BFF origin validation | Implemented and covered by route logic review |
| HttpOnly encrypted session design | Implemented; no Cognito token storage in browser storage |
| Customer Firebase authentication | Not used; Cognito BFF only |
| Cognito pool email auto-verification | Verified through AWS configuration |
| Cognito default email configuration | Verified through AWS configuration |
| DEV API authorization failures | Observed as expected `401` events in CloudWatch |

## Manual Preview gate still required

The following checks require a disposable address that the account owner can receive and a human-entered code. No email address, password, code, token, or cookie is recorded in this document.

1. Create a new Preview account and confirm the native Cognito email arrives.
2. Enter the code on `/verify-email`; verify the success state and secure sign-in redirect.
3. Create a second unconfirmed account, then test repeat signup and unconfirmed sign-in; confirm both lead to resend/verification.
4. Test resend countdown and Cognito throttling.
5. Test forgot-password and reset-password delivery.
6. After confirmed login, verify `co_aws_session` is HttpOnly, Secure over Preview HTTPS, and SameSite=Lax; confirm no token appears in localStorage/sessionStorage.
7. Verify `/v1/me`, account provisioning, cart/wishlist persistence, logout cookie clearing, and protected-route redirects.

## Gate status

**NOT READY FOR PRODUCTION.** Preview must pass the manual email-delivery and confirmed-account flow before a Production review can begin. Production resources, credentials, SES configuration, and deployment remain untouched.
