# CLI installation report — 2026-07-12

No system CLI was installed or upgraded during this audit. Existing tooling was verified; project-local CDK synthesis was run from `infra`.

| Tool | Version | Executable/method | Auth status | Action still required |
| --- | --- | --- | --- | --- |
| AWS CLI v2 | 2.35.21 | `/opt/homebrew/bin/aws` | Default profile authenticates to the expected AWS account | Set an explicit project profile/region only after correction approval |
| jq | 1.7.1 | `/usr/bin/jq` | N/A | None |
| GitHub CLI | 2.94.0 | `/opt/homebrew/bin/gh` | Authenticated; repo/workflow scope present | None |
| Vercel CLI | 55.0.0 | `npx --yes vercel` | Authenticated to the linked project | Do not change variables during audit |
| Firebase CLI | 15.23.0 | `npx --yes firebase-tools` | Authenticated; two Firebase projects visible | No Firebase migration in this audit |
| AWS CDK | 2.177.0 | project-local `infra/node_modules/.bin/cdk` | N/A | Use only from `infra` |
| AWS SAM CLI | Not installed | N/A | N/A | Not required; repository uses CDK, not SAM |

## CDK verification

`infra/package.json` already declares `aws-cdk` and `infra/cdk.json` is the only CDK app entrypoint. `npm --prefix infra install --ignore-scripts` and `npm --prefix infra run synth` completed successfully. The audit does not authorize `cdk deploy`.

## Notes

- Vercel and Firebase were intentionally used through `npx`; no global npm install was performed.
- The local command `vercel` and `firebase` are not on `PATH`, but their authenticated `npx` forms work.
- The `infra` install reported one moderate dependency advisory. It is informational and was not auto-fixed during this audit.
