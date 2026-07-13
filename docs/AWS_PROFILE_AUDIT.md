# AWS profile audit — 2026-07-13

## Local profiles

| Profile | Account | Principal | Configured region | Authentication type | Assessment |
| --- | --- | --- | --- | --- | --- |
| `default` | `574246331930` | IAM user (name withheld) | `eu-north-1` | Shared credentials file | CONFIRMED expected account |
| `dotco-console` | `574246331930` | Same local credential source | `ap-south-1` | Shared credentials file | Canonical project DEV profile |

`dotco-console` was created on 2026-07-13 without replacing or changing `default`. Its credential file remains owner-readable only. No credential values were printed or committed.

## Environment override

The shell exported `AWS_REGION=eu-north-1`. AWS calls made without an explicit `--region` would therefore target `eu-north-1`, even though the project resources are in `ap-south-1` and a manually created pool is in `us-east-1`.

This is a **confirmed region-default mismatch**, not an account mismatch. Audit calls used `--profile default`, an explicit target region, and removed the environment region override.

## Resource ownership findings

- `ap-south-1_XlJmCJYXS`, app client ending `l80`, API `evba5qgrqi`, the `dotco-dev-api` Lambda, DEV DynamoDB tables, and `dotco-dev-backend` are in account `574246331930` under the `default` profile.
- The same profile can see `us-east-1_JBLn1GpJW`, an empty manually created pool without CloudFormation resources or tags.
- There is no evidence of a second AWS account, alternate local profile, or GitHub OIDC deployment to another account.

## Verification

- `aws sts get-caller-identity --profile dotco-console` returned account `574246331930`.
- `aws configure get region --profile dotco-console` returned `ap-south-1`.
- Canonical Cognito and API Gateway lookups succeeded using this profile.

Project commands must use `npm run aws:whoami`, `npm run aws:dev:verify`, and `npm run infra:diff:dev` rather than relying on an inherited terminal region.
