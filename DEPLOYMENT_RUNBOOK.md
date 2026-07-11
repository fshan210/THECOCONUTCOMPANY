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
   - Cognito public IDs only where needed.

Current dev outputs from 2026-07-11:

- API URL: `https://evba5qgrqi.execute-api.ap-south-1.amazonaws.com/`
- Cognito User Pool ID: `ap-south-1_XlJmCJYXS`
- Cognito App Client ID: `4md7svldn4dndr9gtfijgfl80`
- Tables: `dotco-dev-commerce`, `dotco-dev-content`, `dotco-dev-audit`

Dev deployment required a one-time CDK bootstrap in `ap-south-1`.

## Production deploy

Production deploy is blocked until dev authentication, authorization, API and migration smoke tests pass.

When approved:

```bash
cd infra
npx cdk diff -c envName=production
npx cdk deploy -c envName=production
```

## Rollback

- Remove `NEXT_PUBLIC_DOTCO_API_BASE_URL` from Vercel to keep Firebase behavior.
- Revert Vercel deployment to previous build.
- CDK production tables use retain/deletion protection.
- Disable API by setting reserved concurrency to zero if emergency containment is needed.

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
