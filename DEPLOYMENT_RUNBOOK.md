# Deployment Runbook

## Dev deploy

1. Confirm AWS identity and region:
   ```bash
   aws sts get-caller-identity
   export DOTCO_AWS_REGION=ap-south-1
   ```
2. Bootstrap CDK once per account/region:
   ```bash
   cd infra
   npx cdk bootstrap aws://ACCOUNT_ID/ap-south-1
   ```
3. Review synthesized diff:
   ```bash
   npm run synth
   npx cdk diff -c envName=dev
   ```
   Optional, only if the AWS account has enough unreserved Lambda concurrency:
   ```bash
   export DOTCO_LAMBDA_RESERVED_CONCURRENCY=5
   ```
4. Deploy dev only after review:
   ```bash
   npx cdk deploy -c envName=dev
   ```
5. Copy non-secret outputs to Vercel preview/dev env:
   - `NEXT_PUBLIC_DOTCO_API_BASE_URL`
   - `COGNITO_APP_CLIENT_ID`
   - `COGNITO_SESSION_SECRET` (server-only, unique per environment)
   - `DOTCO_AWS_REGION`

Current dev outputs from 2026-07-11:

- API URL: `https://evba5qgrqi.execute-api.ap-south-1.amazonaws.com/`
- Cognito User Pool ID: `ap-south-1_XlJmCJYXS`
- Cognito App Client ID: `4md7svldn4dndr9gtfijgfl80`
- Tables: `dotco-dev-commerce`, `dotco-dev-content`, `dotco-dev-audit`

Dev deployment required a one-time CDK bootstrap in `ap-south-1`.

## Preview authentication gate

Before any Production review, the current Preview must prove:

- Cognito confirmation email delivery and resend delivery.
- Correct unconfirmed signup and sign-in handling.
- Confirmed sign-in, encrypted HttpOnly session cookie, and protected-route redirects.
- Account/cart/wishlist authenticated smoke checks.
- Confirmed budget-alert subscription and Billing Console credit/plan review.

The Cognito default sender is acceptable for DEV only. Google sign-in remains disabled until Cognito federation, a Hosted UI domain, and exact callback URLs are configured.

## Production deploy

Production deploy is blocked until dev authentication, authorization, API and migration smoke tests pass.

When approved:

```bash
cd infra
npx cdk diff -c envName=production
npx cdk deploy -c envName=production
```

## Rollback

- Revert the Vercel Preview deployment to the previous known-good build.
- Restore the preceding Cognito email template only if a tested delivery regression is found.
- Revert Vercel deployment to previous build.
- CDK production tables use retain/deletion protection.
- Do not set reserved concurrency until the AWS account has sufficient unreserved concurrency. Use API/Cognito containment procedures if an emergency response is required.

## Disable compromised user

- Disable user in Cognito.
- Remove privileged group memberships.
- Revoke refresh tokens.
- Write an audit event.
- If still Firebase-backed, disable or suspend the matching Firebase/Firestore user too.

## Rotate secrets

- Rotate Cognito app clients by creating a new client and updating env vars.
- Rotate any SSM/Secrets Manager values.
- Redeploy Lambda.
- Revoke sessions when required.

## Inspect errors safely

- Use CloudWatch Logs Insights with request ID.
- Do not export full logs containing personal data.
- Confirm logs do not contain tokens/cookies/secrets.

## Restore DynamoDB data

- Production PITR must be enabled.
- Restore to a new table.
- Validate records.
- Swap application env/table references only after review.
# Phase 2 deployment status

The GitHub validation workflow is active. The DEV CDK stack was updated with an API Gateway JWT authorizer and deployed successfully. GitHub Actions OIDC now assumes `arn:aws:iam::574246331930:role/dotco-github-actions-dev`, limited to `sts:GetCallerIdentity` and the Phase 2 branch. Production deployment remains intentionally excluded.

# Phase 3 Production cutover — approval required

1. Confirm the rollback tag `phase3-pre-production-cutover` points at the
   reviewed `main` state.
2. Run the Production synth and diff commands in
   `PRODUCTION_CDK_DIFF_REVIEW.md`; stop if the diff contains a modification or
   deletion not reviewed in that document.
3. Deploy `dotco-production-backend` only after explicit approval.
4. Capture only the non-secret stack outputs. Generate a fresh Production
   session secret locally and enter it directly in Vercel's Production scope.
5. Set Production-only variables from `PRODUCTION_AUTH_RELEASE_REPORT.md`.
   Keep `DOTCO_USE_API_CONTENT=false` for the first cutover.
6. Trigger a Vercel deployment from `main`, verify the custom domain, then run
   public and authenticated smoke tests with one disposable Production account.
7. Roll back by removing the Production auth/API bindings and promoting the
   preceding Vercel deployment; do not destroy protected Production tables.

The DEV OIDC identity-check role permits `main` and pull-request jobs. It has
no deployment policy. Provision a separate Production deployment role with a
reviewed trust policy before automating production CDK deployments.
