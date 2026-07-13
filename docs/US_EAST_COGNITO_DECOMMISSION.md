# Unmanaged us-east-1 Cognito client decommission record

## Decision

The following Cognito app client is not part of the .CO DEV backend and must never be used for Preview or Production customer authentication:

| Property | Verified value |
| --- | --- |
| AWS account | `574246331930` |
| Region | `us-east-1` |
| User pool | `us-east-1_JBLn1GpJW` (`User pool - dofmky`) |
| App client | `703jebh303d7b0dnlppap6ja5t` (`.cothecoconutcompany`) |
| Users | 0 (no confirmed or unconfirmed users) |
| Tags | None |
| API Gateway / Lambda / DynamoDB / CloudFormation in region | None |
| Repository and GitHub Actions references | None outside this audit documentation |

The app client was created manually on 2026-07-12 and has no CloudFormation/CDK ownership record. A previous read-only inspection exposed its client secret. The secret is intentionally not reproduced here. Treat the client as compromised: do not reuse, rotate, copy, or deploy it.

## Canonical environment safety check

- The canonical DEV client remains `dotco-dev-web` in `ap-south-1`, on user pool `ap-south-1_XlJmCJYXS`.
- Branch Preview Cognito pool and client bindings match the canonical DEV identifiers.
- Production has no Cognito customer-auth variables configured and was not modified.

## Explicit approval required

Deleting an app client is destructive. Do **not** run the following command until the account owner explicitly approves deletion of this exact unmanaged client:

```bash
aws cognito-idp delete-user-pool-client \
  --user-pool-id us-east-1_JBLn1GpJW \
  --client-id 703jebh303d7b0dnlppap6ja5t \
  --region us-east-1 \
  --profile dotco-console
```

## Required post-deletion verification

1. Confirm `describe-user-pool-client` returns `ResourceNotFoundException` for the client.
2. Confirm the empty user pool still exists; deletion of the pool requires a separate approval.
3. Confirm the canonical `ap-south-1` client and Preview configuration remain unchanged.
4. Retain this record and schedule a separate review before deleting the empty pool.
