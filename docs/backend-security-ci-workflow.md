# Backend Security CI Workflow

The repository now contains `.github/workflows/backend-security-ci.yml`. The GitHub token has been refreshed with `workflow` scope and the workflow can be pushed.

The workflow runs:


- dependency installation from lockfiles
- frontend lint/typecheck/build
- contracts, backend, and CDK tests
- CDK synth
- informational dependency audit

Production AWS deployment workflows must use GitHub Actions OIDC to assume a deployment role, not long-lived AWS keys. The workflow intentionally does not deploy AWS. OIDC role creation and repository trust policy remain an AWS-account configuration step.
