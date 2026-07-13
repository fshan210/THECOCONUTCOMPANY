# AWS configuration audit — 2026-07-13

## Executive conclusion

| Conclusion | Confidence | Evidence |
| --- | --- | --- |
| Browser and AWS CLI refer to the same AWS account: `574246331930` | CONFIRMED | Default CLI STS identity and the user-provided Console account match |
| The apparent mismatch is regional, not cross-account | CONFIRMED | Both user pools are visible through the same authenticated profile in different regions |
| `ap-south-1` is the current application DEV stack | CONFIRMED | CDK stack owns Cognito, client, API Gateway, Lambda, DynamoDB, logs, and tags |
| `us-east-1` is an empty manually created pool | STRONG EVIDENCE | No CloudFormation stacks, API, Lambda, DynamoDB, project tags, or users in that region |
| Preview uses `ap-south-1` Cognito identifiers | CONFIRMED | Branch-scoped Preview Cognito pool/client IDs match the CDK DEV stack |
| Preview API binding | CONFIGURED, runtime verification pending | CLI replaced the empty Preview-only API binding with the canonical DEV endpoint; a fresh Preview request must confirm the deployed runtime |
| Production API target | UNKNOWN | Production values were deliberately not exposed or changed; no Production Cognito variables are configured |

## Confirmed AWS identities

- Browser Console account: `574246331930`, The Coconut Company (user-provided).
- AWS CLI `default` profile: `574246331930`, IAM user name withheld.
- GitHub OIDC DEV role: verification-only identity role; no deploy permission found.

## Profile and region findings

The original `default` profile is configured for `eu-north-1`; the shell also exports `AWS_REGION=eu-north-1`. This default is unrelated to the actual project regions and is unsafe for unqualified AWS commands. The profile itself belongs to the correct account.

On 2026-07-13, a separate local `dotco-console` profile was created with `ap-south-1` and JSON output. It reuses the already configured local credential source, leaves `default` unchanged, and was verified against account `574246331930`. Project npm scripts now explicitly set this profile and region so that inherited terminal environment variables cannot silently retarget a command.

## Resource inventory

### us-east-1

| Service | Inventory | Status |
| --- | --- | --- |
| Cognito | `us-east-1_JBLn1GpJW`, “User pool - dofmky” | Created 2026-07-12; zero users |
| App client | `.cothecoconutcompany`, id ending `ja5t` | Manual/unmanaged; CloudFront callback; client secret was returned by a read-only inspection and must be treated as compromised/unusable |
| API Gateway, Lambda, DynamoDB, CloudFormation, project logs | None found | No application stack |

There are no tags or stack records tying this pool to the project. Do not use its client for the Preview frontend. Do not rotate, delete, or recreate it without separate approval.

### ap-south-1

| Service | Inventory | Status |
| --- | --- | --- |
| Cognito | `ap-south-1_XlJmCJYXS`, `dotco-dev-users` | CDK managed; two `UNCONFIRMED` test users, no personal data listed |
| App client | `dotco-dev-web`, id ending `l80` | CDK managed, public client, no client secret |
| HTTP API | `evba5qgrqi`, `dotco-dev-http-api` | CDK managed |
| Lambda | `dotco-dev-api` | CDK managed, nodejs22, 512 MB |
| DynamoDB | `dotco-dev-audit`, `dotco-dev-commerce`, `dotco-dev-content` | CDK managed, on-demand |
| Stack | `dotco-dev-backend`, plus `CDKToolkit` | UPDATE_COMPLETE |
| Logs | `/aws/lambda/dotco-dev-api` | Seven-day retention |

Project, environment, cost-center, and CloudFormation tags all identify the `ap-south-1` resources as the DEV stack.

## Decision table

| Option | Account/region | Benefits | Risks/migration | Decision |
| --- | --- | --- | --- | --- |
| A. Keep existing ap-south-1 CDK DEV stack | Correct account, `ap-south-1` | Full API/Lambda/DynamoDB/Cognito integration, CDK ownership, lowest disruption | Preserve two unconfirmed test users until verification audit is complete | **Recommended** |
| B. Use us-east-1 manual pool | Correct account, `us-east-1` | Visible in Console | No API/data stack, zero users, client secret exposure, no tags/stack; would require full migration | Reject |
| C. Recreate DEV in ap-south-1 | Correct account, `ap-south-1` | Fresh start | Discards existing test state and risks breaking Preview configuration | Reject unless current stack is irrecoverable |
| D. New evidence-supported option | N/A | N/A | None currently | Not needed |

## Cost and credit read-only result

- Existing budget: `dotco-monthly-safety`, USD 10 monthly with actual/forecast thresholds.
- Cost Explorer returned an approximately zero current-month aggregate for the queried period.
- Credit balance, expiry, account plan, and detailed forecast remain UNKNOWN because Billing Console ownership/credit views are not available from this audit context.
- No unexpected API/Lambda/DynamoDB stack was found in `us-east-1`; the only unexpected resource is the unmanaged Cognito pool.

## Correction status

1. **Completed:** created and verified `dotco-console` for `ap-south-1` without replacing `default`.
2. **Completed, runtime check pending:** verified Preview Cognito pool/client identifiers and configured the Preview-only API endpoint binding. Values and secrets remain masked.
3. **Pending explicit approval:** remove the compromised, unmanaged `us-east-1` app client; do not reuse its secret.
4. **Pending:** complete real Preview email verification with a disposable address against the CDK DEV pool.
5. **Pending separate gate:** prepare, review, and explicitly approve a distinct Production stack. Do not adopt either DEV pool for Production.

## Rollback

The recommended path changes configuration only after review. If a future Vercel correction fails, restore its prior environment value and redeploy the previous Preview build. No user migration or resource deletion is proposed in this audit.

## Exact commands proposed for the next phase

```bash
# Deterministic canonical-DEV checks.
npm run aws:whoami
npm run aws:dev:verify
npm run infra:diff:dev

# Use only after approving the lifecycle action for the unmanaged us-east-1 client.
aws cognito-idp describe-user-pool --region us-east-1 --user-pool-id us-east-1_JBLn1GpJW
```

## Stop gate

No Cognito, Vercel, frontend, backend, IAM, Firebase, or Production resource was changed by this audit. Wait for explicit approval before applying the correction plan.
