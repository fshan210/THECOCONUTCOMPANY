# Railway build strategy

Audit decision before implementation: use an explicit multi-stage Dockerfile for the Next.js runtime only. Node 22 matches repository CI and backend runtime support. No local Docker engine was used. The standalone directory was exercised locally; Railway subsequently built and started the real image successfully at commit edd9f387500a7a0cd547d6f6cbc8c4d81246cfcf. Full image-content inspection remains pending.

| Option | Benefit | Limitation for this repository |
| --- | --- | --- |
| Railpack | Automatic Node detection and fewer files | Requires additional packaging control to reproduce the 798 existing public-file exclusions and separate local credentials/source archives |
| Docker | Auditable build context, explicit package layout, non-root runtime, controlled public/static copies | Must maintain the small Dockerfile and validate image startup; selected |

## Implemented layout

1. Dependencies stage copies root package/lock files and local `packages/contracts` dependency before `npm ci`.
2. Builder includes only the filtered source context. `DEPLOY_TARGET=railway` enables `output: standalone`. Declare build ARGs only for public browser configuration and nonsecret deployment/provenance labels. Never declare Admin credentials or session keys as build ARGs.
3. Runner copies `.next/standalone`, `.next/static`, the audited retained `public` set, and the environment/resource startup guard. It contains no `.git`, local `.env`, `.vercel`, QA evidence, source masters, or general source tree. Run as non-root with `NODE_ENV=production`, `HOSTNAME=0.0.0.0`, and Railway's runtime `PORT`.
4. Keep the existing Vercel build path unless `DEPLOY_TARGET=railway`. Verify both paths. Do not change the current image-optimization policy or asset host.
5. Validate configured Preview Firebase and DEV AWS bindings before serving traffic; log only safe commit/environment/platform labels.

## Railway service settings

Project `dotco-web`, environment `staging`, Next service only, Singapore `asia-southeast1-eqsg3a`, one replica, generated service domain, CDN off, no databases, no volumes, no canonical domains. Set a lightweight healthcheck and a bounded restart policy. Keep sleep off during the baseline measurement so cold wakeups do not contaminate origin comparisons.

Current Railway documentation says new services cannot opt into deprecated `railway.json` / `railway.toml` Config as Code. Existing services have a 2026-12-01 cutoff. Use supported service settings and record their inspected values; do not add obsolete configuration just because older examples recommend it. Railway IaC can be evaluated separately if required for reproducible infrastructure management.

References checked 2026-10-03: https://docs.railway.com/guides/nextjs, https://docs.railway.com/builds/dockerfiles, https://docs.railway.com/guides/build-time-vs-runtime-secrets, https://docs.railway.com/config-as-code, https://docs.railway.com/deployments/regions.

## First staging deployment configuration

Project `dotco-web`, service `dotco-next-staging`, environment `staging`. Git source is the migration branch. One Singapore replica (`asia-southeast1-eqsg3a`), 2 vCPU and 2 GB maximum per replica, serverless off, CDN caching off, health `/api/health` with 120-second timeout, on-failure restart limit 3. The generated domain targets PORT 8080. The runtime manifest binds `RAILWAY_GIT_COMMIT_SHA`; no manually maintained release SHA variable is used. Railway now deprecates legacy railway.json/toml for new services, so supported dashboard/API settings are used.
