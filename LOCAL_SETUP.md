# Local Phase 2 setup

Copy `.env.example` to `.env.local` and configure the DEV-only values:

- `SERVER_API_BASE_URL=https://evba5qgrqi.execute-api.ap-south-1.amazonaws.com/`
- `COGNITO_USER_POOL_ID=ap-south-1_XlJmCJYXS`
- `COGNITO_APP_CLIENT_ID=4md7svldn4dndr9gtfijgfl80`
- `COGNITO_SESSION_SECRET` as a local random value
- `DOTCO_USE_API_CONTENT=true` only for DEV API content-read testing

Never put AWS credentials, Cognito tokens, confirmation codes, or session secrets in browser-visible variables. Customer authentication uses the Cognito BFF and encrypted HttpOnly cookies; Firebase remains limited to the separate existing admin/content integration.

## Verification-email testing

1. Start the app and create a disposable DEV account with a password meeting the 10-character Cognito policy.
2. Complete the six-digit code at `/verify-email`; codes are delivered by Cognito's DEV default sender.
3. Test resend at `/verify-email` after the 60-second UI cooldown.
4. Test an unconfirmed sign-in and repeat signup; both should lead to verification rather than a duplicate-account dead end.
5. Never save a code or token in `.env.local`, browser storage, test fixtures, or committed documents.
