# Production CDK diff review — 2026-07-14

## Scope and execution

Read-only planning was run with the canonical account and region:

```bash
AWS_PROFILE=dotco-console AWS_REGION=ap-south-1 DOTCO_ENV=production npm --prefix infra run synth
cd infra && AWS_PROFILE=dotco-console AWS_REGION=ap-south-1 DOTCO_ENV=production npx cdk diff dotco-production-backend --no-color
```

`dotco-production-backend` does not exist yet. The diff has **one stack with differences**, all additions and no resource modifications or deletions. CDK may publish a synthesized asset to the existing bootstrap bucket while producing a read-only change set; no application stack was deployed.

## Resources proposed for creation

- One Cognito User Pool and one public browser app client without a client secret.
- One API Gateway HTTP API, default stage, Lambda integration, JWT authorizer, protected catch-all route, and explicit public catalog routes.
- One ARM64 Node.js 22 Lambda with a 10-second timeout and a 30-day log group.
- Three on-demand DynamoDB tables: `dotco-production-commerce`, `dotco-production-content`, and `dotco-production-audit`.
- Two CloudWatch alarms: Lambda errors and Lambda throttles.
- Lambda execution role and narrowly scoped DynamoDB/Cognito permissions.

## Security controls confirmed in the synthesized template

| Area | Planned control |
| --- | --- |
| Cognito | Email verification, email-only recovery, user-existence protection, 10-character policy with upper/lower/digit/symbol requirements, public client with no secret |
| Browser destinations | Canonical and `www` production callback/logout origins |
| API | HTTP API JWT authorizer using the pool issuer and public client audience before protected routes invoke Lambda |
| CORS | Only `https://cothecoconutcompany.com` and `https://www.cothecoconutcompany.com`; credentials allowed; no wildcard |
| DynamoDB | On-demand, AWS-managed encryption, PITR, deletion protection, retain removal policy, TTL only through `expiresAt` |
| IAM | No `dynamodb:Scan`; Lambda can access only its domain tables and Cognito `GetUser` |
| Observability | X-Ray active, request IDs, error and throttle alarms, 30-day Lambda logs |
| Tags | `Application=dotco`, `Project=dotco`, `Environment=production`, `CostCenter=dotco-platform`, `ManagedBy=cdk` |

## Diff result

- Resources to modify: **0**
- Resources to delete: **0**
- Unexpected deletions: **none**
- Rollback implication: the tables are retained and deletion-protected; application rollback is a Vercel variable/deployment rollback, not a destructive stack deletion.

## Release prerequisites still pending

1. Final authenticated Preview cart-persistence E2E.
2. Explicit approval for Production AWS and authentication cutover.
3. Set the new Production-only Vercel variables after non-secret stack outputs are available.
4. Confirm initial Cognito default-email launch volume or complete the SES sender setup.
5. Complete the owner-console Free Tier alert and budget-recipient checks.

## Estimated monthly cost

For a controlled launch without payments, WAF, CDN-backed API, or heavy content API traffic: approximately **USD 0–3 at 100 active users** and **USD 2–10 at 1,000 active users**. This is a planning range, not a billing forecast; logs, request volume, data transfer, email and Vercel usage are the main unknowns.

