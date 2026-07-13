# AWS correction execution log

## Scope and safety boundary

This log records the Phase 2 correction from an implicit, wrong-region AWS CLI default to an explicit project profile. It does not contain credentials, session cookies, customer data, or Cognito secrets.

## Preserved baseline

| Item | Recorded value |
| --- | --- |
| Branch | `feature/security-auth-backend-phase-2` |
| Baseline commit | `418c0b1cc3e392de2dd2eeb70cdcb0ed7389cb4e` |
| Rollback tag | `phase2-pre-aws-correction` |
| Canonical account | `574246331930` |
| Canonical DEV region | `ap-south-1` |
| DEV Cognito pool | `ap-south-1_XlJmCJYXS` |
| DEV HTTP API | `evba5qgrqi` |

The pre-existing root `package.json` and `package-lock.json` changes add `aws-cdk`. They were preserved and not staged by this correction. The canonical CDK dependency already exists in `infra/package.json`, so the root addition needs separate review before it is committed.

## Local CLI correction

| Check | Result |
| --- | --- |
| Existing `default` profile | Correct account, implicit `eu-north-1` region |
| Ambient `AWS_REGION` | `eu-north-1` at audit time |
| `dotco-console` profile | Created without replacing `default` |
| `dotco-console` region/output | `ap-south-1` / `json` |
| STS account from `dotco-console` | `574246331930` |
| Canonical user-pool lookup | Passed |
| Canonical HTTP API lookup | Passed |

`dotco-console` reuses the existing local AWS credential source and is stored only in the user-scoped AWS configuration with owner-only permissions. No credential values were logged or committed.

## Deterministic project commands

The repository exposes the following commands. They explicitly pin `AWS_PROFILE=dotco-console` and `AWS_REGION=ap-south-1`; this prevents an inherited terminal region from silently targeting a different AWS region.

```bash
npm run aws:whoami
npm run aws:dev:verify
npm run infra:synth
npm run infra:diff:dev
# Deploy only after a reviewed DEV infrastructure change:
npm run infra:deploy:dev
```

## Vercel Preview correction

The branch-specific Preview environment contained an empty `SERVER_API_BASE_URL` override. It was removed and recreated for Preview only with the canonical DEV API endpoint. The Production scope was not modified. Because Vercel masks sensitive values when downloading some bindings, runtime verification is still required on a fresh Preview deployment.

## Pending gates

1. Verify Vercel Preview and Production bindings without revealing encrypted values.
2. Re-verify the unmanaged `us-east-1` client, then obtain explicit approval before deleting it.
3. Complete real Preview email-verification and authenticated persistence tests.
4. Review a separate production CDK diff and obtain a final production deployment approval.
