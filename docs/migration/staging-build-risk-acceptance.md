# Staging build-tool risk acceptance — 2026-10-05

The user explicitly accepted the documented staging build-tool risk on 2026-10-05. This is not a vulnerability fix and does not authorize Production release, AWS deployment, DNS changes, or authenticated benchmarking while the asset gate fails.

## Accepted findings

| Workspace | Installed path | Advisory | Exposure |
| --- | --- | --- | --- |
| Root | Tailwind 3.4.19 → glob tooling → braces 3.0.3 | GHSA-vfj7-8cjw-p6xm (high) | Build-time glob input can exhaust the stack. |
| Infra | aws-cdk-lib 2.265.0 → minimatch 10.2.5 → bundled brace-expansion 5.0.9 | GHSA-q2hr-2g5m-vwhr (moderate); GHSA-qhr7-859c-m2p7 and GHSA-6j4f-fj2g-mc7p (high) | Crafted brace/glob inputs can exhaust CPU or stack during infrastructure tooling execution. Not a website or Lambda runtime package. |

The latest compatible CDK 2.272.0 still bundles 5.0.9, including in a clean install with a scoped override to 5.0.12. No 2.265 patch release exists. The ineffective candidate was isolated outside the repository. Root braces has no compatible patched release; a Tailwind major upgrade is outside this narrow closure.

## Enforced boundary

`scripts/staging-audit-policy.mjs` runs and prints the full npm audit JSON. It accepts only the recorded advisory IDs, exact installed versions and exact dependency paths. Unknown findings, unresolved propagation, critical escalation, audit errors and version/path changes fail closed.

Acceptance is restricted to `codex/railway-runtime-migration` with `APP_DEPLOY_ENV=development` or `staging`. GitHub Actions additionally requires a pull-request event in this repository. Main, push events and Production cannot use the exception. The review expires on **2026-10-19 00:00 UTC**; any extension requires a new explicit decision. A genuinely clean audit passes normally without needing the exception.

The root's previous blanket `|| true` has been replaced with this bounded policy. Backend and contracts retain their unmodified native audit gates. Native `npm audit` still reports the accepted vulnerabilities and exits nonzero; the policy gate can pass while explicitly displaying that residual risk.

## Reproduction

On the migration branch:

```sh
APP_DEPLOY_ENV=development node scripts/staging-audit-policy.mjs root
APP_DEPLOY_ENV=development node scripts/staging-audit-policy.mjs infra
npm --prefix backend audit --omit=dev --audit-level=high
npm --prefix packages/contracts audit --omit=dev --audit-level=high
node --test tests/phase-4-3/staging-audit-policy.test.mjs
```

No dependency or application runtime behavior changes are included in this policy change. Re-evaluate/remove the acceptance when compatible upstream patches become available. Asset TCP failures and the five-run stability requirement remain independent blockers.
