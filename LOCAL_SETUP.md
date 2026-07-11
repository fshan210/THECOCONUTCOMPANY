# Local Phase 2 setup

Copy `.env.example` to `.env.local` and configure the DEV-only values:

- `SERVER_API_BASE_URL=https://evba5qgrqi.execute-api.ap-south-1.amazonaws.com/`
- `COGNITO_USER_POOL_ID=ap-south-1_XlJmCJYXS`
- `COGNITO_APP_CLIENT_ID=4md7svldn4dndr9gtfijgfl80`
- `COGNITO_SESSION_SECRET` as a local random value
- `DOTCO_USE_API_CONTENT=true` only for DEV API content-read testing

Never put AWS credentials or Cognito tokens in browser-visible variables. Production should continue using the existing Firebase path until the cutover checklist is approved.
