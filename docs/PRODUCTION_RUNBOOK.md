# .CO production runbook

## Known-good production

- Canonical domain: `https://cothecoconutcompany.com`
- Deployment branch: `main`
- Frozen visual baseline: `b83631b8c5fe48dbc20e5ae30b8b86a1913e880d`
- Release tag: `v2.2.0-production-baseline`
- Baseline Vercel deployment: `dpl_9QD2cMH3kTSQRqrugpUxdVM2f65G`
- Pre-consolidation recovery tag: `pre-repo-consolidation-20260815`
- Pre-consolidation recovery commit: `2fac3850e10b37b5e518026dfa3a7446ed27207a`

Vercel deploys `main`. Runtime media uses `media.cothecoconutcompany.com/site-media/v1` through CloudFront with a private, versioned S3 origin. `lib/media.ts` is the only URL boundary; an empty `NEXT_PUBLIC_MEDIA_BASE_URL` intentionally falls back to local `public/` assets.

## Normal release

1. Work on a short-lived branch. Do not change the locked visual system without explicit approval.
2. Run `npm ci`, then `npm ci --prefix packages/contracts`, `backend`, and `infra`.
3. Run `npm run typecheck`, `npm run backend:typecheck`, `npm run lint`, `npm test`, and `npm run build`.
4. Start the production build and run `BASE_URL=http://127.0.0.1:3000 npm run smoke:production`.
5. Review the affected desktop, mobile, keyboard, and reduced-motion paths.
6. Merge only after the `validate` check passes. Vercel deploys the resulting `main` commit.
7. Run `npm run smoke:production` against the canonical domain and inspect the exact Vercel deployment.

## Diagnosis

- Application/build: Vercel deployment and function logs; search by deployment and request time.
- Backend: structured JSON logs include `requestId`; no tokens or credentials should be logged.
- Broken media: inspect `lib/media.ts`, the mapping in `migration-reports/mappings/local-to-cloudfront.json`, then use a non-mutating `HEAD` request. The full `npm run media:validate` command rewrites validation reports, so use it only when report changes are intended.
- CDN: confirm status, MIME type, content length, `Cache-Control`, `x-cache`, and the versioned `/site-media/v1` path.
- Admin: unauthenticated `/control-center` must redirect to `/control-center/login`; every privileged server action must call `requireAdminSession`.
- Customer/API: use the public request ID and Vercel/backend logs. Do not print Cognito tokens.

## Recovery scenarios

### A. Bad application commit

Revert the bad commit through a reviewed change. For an urgent code rollback, restore the last known-good source from `v2.2.0-production-baseline`, validate locally, and deploy the new revert commit. Do not rewrite `main` history.

### B. Bad Vercel deployment

Use the Vercel dashboard rollback for the last verified deployment, or `vercel rollback <verified-deployment-url> --yes` after confirming the target. Verify `/`, `/shop`, `/recipes`, videos, and the canonical domain. Record the incident and follow with a source-level revert.

### C. Broken CloudFront media mapping

Do not delete the CloudFront/S3 stack. First determine whether the problem is one key, the hostname, or `NEXT_PUBLIC_MEDIA_BASE_URL`. If CloudFront itself is the fault boundary, rebuild the last known-good application with `NEXT_PUBLIC_MEDIA_BASE_URL` unset so `lib/media.ts` uses the preserved local fallback. Validate before changing any DNS.

### D. Accidentally deleted runtime asset

Resolve the exact versioned S3 key from the canonical mapping, recover the object from S3 version history, and verify its SHA-256, MIME type, length, and immutable cache header. Do not bulk re-upload the library.

### E. Incorrect environment variable

Compare variable names/scopes with `docs/ENVIRONMENT_VARIABLES.md` and Vercel's audit history. Restore only the affected variable in the affected environment, redeploy the last known-good commit, and smoke-test. Never copy Production secrets into Preview output or logs.

### F. Firebase/application-data issue

Stop writes through the affected feature, preserve logs and request IDs, and use `npm run firebase:audit` for read-only diagnosis. `npm run firestore:backup` creates an external backup; `npm run firestore:restore` is destructive and requires an explicit recovery decision, a verified backup identifier, and owner approval. Application rollback does not automatically roll back data.

## Locked systems

Do not casually modify the approved brand/packaging assets, homepage visual architecture, hero-to-scraping transition, Origin journey, receipt/routine interactions, central motion configuration, `lib/media.ts`, CloudFront object layout, production domain, Vercel project linkage, or the single-branch `main` model.

Use `docs/RELEASE_CHECKLIST.md` for every release and `docs/ARCHITECTURE.md` for the current system boundary.
