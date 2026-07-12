# AWS credit and cost-safety report — 2026-07-12

## Access limits

The authenticated IAM session can inspect DEV infrastructure and create AWS Budgets, but Cost Explorer returned `AccessDeniedException`. Credit balance, credit source, credit expiry, account plan type, and month-to-date/forecast spend therefore could not be independently verified from this session.

The approximately USD 120 credit balance is user-reported and remains **unverified**. Confirm its expiry, eligible services, and whether charges can continue after exhaustion in the AWS Billing Console using the account owner.

## Verified current DEV posture

| Control | Status |
| --- | --- |
| Compute | One ARM Lambda, 512 MB, 10-second timeout |
| Log retention | Seven days in DEV; CDK defines 30 days in Production |
| DynamoDB | On-demand billing, AWS-managed encryption |
| NAT gateway | None detected in `ap-south-1` |
| EC2 | No active instances detected in `ap-south-1` |
| RDS/OpenSearch/ElastiCache | Not provisioned by the DEV CDK stack |
| SES production access | Disabled; sandbox only |
| Budget | `dotco-monthly-safety`, USD 10 monthly limit |
| Budget thresholds | USD 1 actual, USD 5 actual, USD 10 forecast, and 50/75/90/100% actual |

Budget notification subscriptions require confirmation by the designated recipient. Check the subscription email and the Budgets console to make sure alerts are active.

## Guardrails in code

- CDK supports an explicit Lambda reserved-concurrency value. The DEV account rejected a reservation of 5 because it must retain at least 10 unreserved executions, so no reservation is currently applied. Do not force this change until the account concurrency quota permits it.
- CDK tags resources with `Project=dotco`, `Environment`, and `CostCenter=dotco-platform`.
- DynamoDB uses on-demand capacity; no NAT gateway, always-on server, or RDS is part of this stack.
- Lambda error and throttle alarms already exist. Cost Anomaly Detection and Free Tier alerts require Billing Console/account-owner confirmation and are not claimed as configured.

## Planning estimates (not a bill forecast)

These are conservative order-of-magnitude ranges for the current serverless design with no payment, WAF, or large media workload. Actual data transfer, Vercel, SES, and third-party service costs are excluded.

| Active users/month | DEV estimate | Production estimate | Primary uncertainty |
| --- | ---: | ---: | --- |
| 100 | USD 0–2 | USD 0–3 | Logs and request volume |
| 1,000 | USD 0–5 | USD 2–10 | DynamoDB reads/writes and API traffic |
| 5,000 | USD 1–15 | USD 8–35 | Requests, data transfer, observability, email |

## Required owner-console actions before Production

1. Enable Cost Explorer for the account and confirm access for the deployment role.
2. Confirm the budget subscription and add Free Tier usage alerts.
3. Confirm the credit balance, expiry, and post-credit billing behaviour.
4. Create Cost Anomaly Detection only after confirming its notification destination and billing policy.
5. Keep CloudWatch logs at 14–30 days in Production and retain the no-NAT/no-always-on-server posture.
