# Production runtime media migration report

Completed 2026-08-05 (Asia/Kolkata).

## 1. Executive summary

The Next.js application remains hosted on Vercel. Approved large runtime media is now delivered from `https://media.cothecoconutcompany.com/site-media/v1/` through CloudFront, backed by a private, versioned S3 bucket using Origin Access Control (OAC). The production application is live at `https://cothecoconutcompany.com` and the immutable Vercel deployment is `https://my-website-lerxgf78w-fazil-s-projects1.vercel.app`.

No runtime or archival media was destructively deleted from the working tree. Deployment reduction was achieved with generated `.vercelignore` exclusions and a clean staged source tree. Inherited uncommitted editorial and asset work was preserved.

## 2. Root cause

Vercel source uploads included the large `public/` media library and archival/source assets. The audited `public/` tree contained 1,131 files and 902,227,021 bytes. This made the deployment source unnecessarily large even though Vercel only needed application code and a small set of local/build-required files.

The solution separates application hosting from media delivery:

- Vercel: Next.js application and intentionally local/build-required files.
- S3: private canonical storage for migrated runtime media.
- CloudFront: public TLS delivery, immutable caching, compression negotiation and the `media.cothecoconutcompany.com` alias.
- `lib/media.ts`: one reversible URL boundary controlled by `NEXT_PUBLIC_MEDIA_BASE_URL`.

## 3. Inventory and classification

| Class | Files | Bytes | Disposition |
| --- | ---: | ---: | --- |
| A - runtime remote | 884 | 687,994,262 | Uploaded and served through CloudFront |
| B - runtime local | 10 | 355,635 | Retained in Vercel deployment |
| C - archive/source | 138 | 139,775,948 | Excluded from Vercel deployment; retained locally |
| D - uncertain | 99 | 74,101,176 | Retained locally and in deployment pending explicit classification |

The audit found 86 exact-duplicate groups covering 247 files, with 112,155,507 bytes of potential later deduplication. No deduplication or visual optimisation was performed during this infrastructure migration.

## 4. Deployment reduction

The before measurement applies the repository's non-media deployment exclusions but includes the media and archive paths that caused the Vercel source problem. The after measurement applies the generated migration exclusions.

| Metric | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| Deployable source bytes | 912,820,816 B (870.5 MiB) | 85,062,586 B (81.1 MiB) | 827,758,230 B / 90.7% |
| Deployable regular files | 1,589 | 568 | 1,021 / 64.3% |
| Vercel archive upload | First direct attempt reported about 1.1 GB | 74.0 MB | Materially lower |
| Vercel extracted files | Not recorded for the failed oversized attempt | 564 | Safely below platform limits |

`public/assets/media-library.generated.json` is intentionally preserved in the Vercel source because the admin code imports it at compile time; its public runtime URL is still available through CloudFront.

## 5. AWS resource inventory and security

- CloudFormation stack: `dotco-production-media` in `ap-south-1`.
- S3 bucket: `dotco-production-media-mediabucketbcbb02ba-0ngfeikilf8b`.
- CloudFront distribution: `E1ZU8IDGDQH877` (`d3rgg9a9eze2z6.cloudfront.net`).
- CloudFront alias: `media.cothecoconutcompany.com`.
- CloudFront status: `Deployed`; HTTP/2 and HTTP/3 enabled; IPv6 enabled; TLS policy minimum 1.2 (2021 policy).
- S3 object count/bytes validated: 884 objects / 687,994,262 bytes.
- S3 Block Public Access: all four controls enabled.
- Object ownership: bucket-owner enforced in IaC.
- Origin access: CloudFront OAC; no public bucket origin.
- Encryption: SSE-S3 (`AES256`).
- Versioning: enabled.
- Retention: bucket and distribution retained by IaC; stack termination protection configured.
- Direct anonymous S3 test: HTTP 403.
- Credential exposure scan: no AWS access-key, secret-key or private-key pattern found in the current diff or non-media source scan.

IaC is in `infra/lib/dotco-media-stack.ts` and is wired through `infra/bin/dotco-backend.ts`. Deployment used the configured AWS identity for CloudFormation, S3, CloudFront, ACM and supporting read operations; DNS was saved in the signed-in GoDaddy account. No credentials were written to the repository.

## 6. DNS and TLS

- GoDaddy CNAME: `media` -> `d3rgg9a9eze2z6.cloudfront.net`.
- Authoritative/recursive DNS verification: CNAME resolves correctly.
- ACM certificate: issued and attached to the distribution.
- HTTPS test: HTTP/2 200 with the correct media MIME type.
- Cache headers: `public, max-age=31536000, immutable`.
- Cold/warm cache check: first request `Miss from cloudfront`; immediate repeat `Hit from cloudfront` with an `Age` header.

## 7. Repository changes

- Central media URL helper with local fallback: `lib/media.ts`.
- Deep public asset mapping: `lib/public-assets.ts`.
- Responsive/manual asset integration: `lib/website-assets.ts` and `components/media/ResponsiveImage.tsx`.
- Motion/frame URL integration: `lib/experience/coconut-scroll-config.ts`.
- Narrow Next.js remote pattern for `media.cothecoconutcompany.com`.
- Upload, audit, local-reference, CloudFront validation and Vercel-ignore scripts under `scripts/`.
- Environment documentation in `.env.example` and `README.md`.
- Generated exact migration exclusions in `.vercelignore`.
- Rollback instructions in `migration-reports/rollback/ROLLBACK.md`.

## 8. Upload and object validation

- Reconciliation: 884/884 local runtime objects matched S3 by path, length and SHA-256 metadata.
- HTTP validation: 884/884 CloudFront URLs returned HTTP 200 with expected normalized MIME type, exact content length, immutable cache policy and no HTML fallbacks.
- Missing assets: 0.
- Failed validation objects: 0.
- Direct S3 exposure: blocked.

Four multipart PNGs initially lacked expected checksum metadata; their streamed S3 contents matched local SHA-256 exactly, after which metadata was repaired with version-preserving S3 copies.

## 9. Application and route validation

Clean source/build validation:

- TypeScript: passed.
- ESLint: passed.
- Frontend tests: 16/16 passed.
- Local production build: passed, 86 pages.
- Clean staged-source production build: passed, 86 pages.
- Unsafe direct local media scanner: 0 findings.
- `git diff --check`: passed.

Preview:

- URL: `https://my-website-le483ow6w-fazil-s-projects1.vercel.app`.
- Build: ready.
- Desktop/mobile visual captures: passed for home, shop, product, about, sustainability, founders, journal, recipes, contact and the rendered 404 state.
- Broken images: 0.
- Browser console errors: 0.
- Horizontal overflow: 0 on tested routes.
- Managed local media URLs observed in the DOM: 0; the deliberately local site logo remains on Vercel.

Production custom domain routes tested:

- `/`
- `/shop`
- `/shop/co-water`
- `/about`
- `/sustainability`
- `/founders`
- `/journal`
- `/recipes`
- `/contact`
- `/this-route-should-404`

All intended content routes returned HTTP 200, rendered without broken images or console errors, and emitted migrated media URLs from the CloudFront hostname. The unknown route renders the designed not-found state, but the existing catch-all route returns HTTP 200 rather than a 404 status; this is not caused by the media migration and remains a separate SEO correctness issue.

## 10. Immutable and custom-domain production verification

- Immutable production deployment: `https://my-website-lerxgf78w-fazil-s-projects1.vercel.app`.
- Immutable deployment checks: home and `.CO Water` loaded with 0 broken images, 0 managed local-media URLs and 0 console errors.
- Custom domain: `https://cothecoconutcompany.com`.
- Custom-domain checks: all routes listed above passed browser and HTTP checks.
- Canonical redirect: `www.cothecoconutcompany.com` -> apex HTTPS (308).
- HTTP redirect: apex HTTP -> apex HTTPS (308).
- Media hostname: live and validated after production promotion.

The deployed source is the preserved dirty working-tree state based on Git commit `4892acdce7a217f921e4f6400f1bb16eeac9de20`, not a clean commit snapshot. No commit, reset, clean or checkout was performed.

## 11. Visual, packaging, animation and metadata validation

- Visual result: passed at desktop 1440x900 and mobile 390x844 for the tested preview routes; hero, product, editorial and navigation layouts remained intact.
- Packaging: `.CO Water` product imagery displayed the intended water bottle/packaging; no cross-SKU mapping was observed on the representative product and shop routes.
- Animation sequence: v3 manifest has 72 ordered frame outputs (36 desktop, 36 mobile across formats); all 72 frames plus the manifest are mapped and CloudFront-validated (73/73).
- Metadata/social images: home Open Graph image returned PNG/200; representative product and recipe Open Graph/Twitter images use the media hostname and returned PNG/200 with immutable caching.
- Image scanner and browser checks found no missing or HTML-fallback assets.

## 12. Performance comparison

Lighthouse mobile runs used the same production URLs and test tooling. Synthetic LCP is variable, especially on first access to a new CloudFront point of presence, so category score, bytes, request count and cold/warm behaviour are recorded together.

| Page/run | Performance | LCP | CLS | Transfer | Requests |
| --- | ---: | ---: | ---: | ---: | ---: |
| Home baseline | 0.62 | 10.14 s | 0 | 2.36 MB | 61 |
| Home post-deploy cold | 0.58 | 15.83 s | 0.00013 | 7.15 MB | 60 |
| Home post-deploy warmed | 0.61 | 22.18 s | 0 | 8.14 MB | 61 |
| Product baseline | 0.80 | 4.54 s | 0.00016 | 16.72 MB | 41 |
| Product post-deploy cold | 0.65 | 16.78 s | 0.00016 | 16.73 MB | 41 |
| Product post-deploy warmed | 0.82 | 4.63 s | 0.00016 | 16.73 MB | 41 |

Accessibility stayed at 0.96 home / 1.00 product, SEO stayed at 1.00, and best practices improved to 1.00 home. Product performance recovered to baseline after warming. Home performance score remained essentially baseline, but its transfer weight increased because the deployed inherited editorial state selects three approximately 1.8-2.2 MB mobile master images that were not used by the prior production baseline. That content selection is separate from S3/CloudFront delivery, but it is a real remaining optimisation risk and must not be hidden.

No image recompression, dimension change or format conversion was performed during this migration.

## 13. Rollback

- Previous production deployment: `https://my-website-g0be7dhj5-fazil-s-projects1.vercel.app` (verified HTTP 200 after promotion).
- Rollback source point: commit `4892acdce7a217f921e4f6400f1bb16eeac9de20` plus the documented inherited dirty-tree caveat.
- Fast rollback command: `npx vercel rollback my-website-g0be7dhj5-fazil-s-projects1.vercel.app --yes`.
- Rebuild rollback: remove `NEXT_PUBLIC_MEDIA_BASE_URL`, rebuild the last-known-good source and verify local `/public` media.
- Do not delete the media stack during an application rollback.

Full instructions are in `migration-reports/rollback/ROLLBACK.md`.

## 14. Cost controls and expected drivers

An AWS monthly cost budget named `dotco-monthly-safety` already exists with a USD 10 limit. No duplicate budget was created.

Recurring cost drivers are:

- S3 Standard storage for approximately 0.688 GB plus retained object versions.
- S3 GET/HEAD requests made by CloudFront origin fetches.
- CloudFront viewer requests and regional/international data transfer.
- Optional logs if later enabled.
- Cache invalidations beyond any applicable free allocation.

There is no Route 53 hosted zone for the media alias in this implementation because DNS remains at GoDaddy. No EC2, NAT gateway, load balancer, database, Lambda pipeline, MediaConvert, KMS customer key or WAF resource was created. AWS credits are temporary and no claim is made that delivery remains free after credits expire.

## 15. Remaining items and later optimisations

Completed migration work and later optimisation work are intentionally separated.

Remaining risks/follow-ups:

1. Home mobile transfer weight is approximately 8.1 MB in the warmed Lighthouse run because of inherited editorial master-image selection. Optimise or add responsive derivatives in a separate visual-change-controlled task.
2. Unknown catch-all routes render the not-found design with HTTP 200. Correct this separately with Next.js `notFound()`/route handling and regression-test redirects and content pages.
3. The 99 uncertain assets (74,101,176 bytes) remain retained. Reclassify only after owner review; do not bulk-delete them.
4. The 138 archival/source assets remain local but excluded from Vercel. Move them to an explicit archive tier only after a separate retention decision.
5. CloudFront standard metrics had not populated in the immediate post-deployment query window. Continue AWS/Vercel monitoring after metric delay, especially 4xx/5xx, bytes and cache-hit ratio.
6. The deployment is based on a dirty working tree. Create a reviewed commit after confirming the inherited editorial deletions and untracked assets are intentional.

## 16. Acceptance checklist

- [x] Next.js application remains hosted on Vercel.
- [x] Runtime media is served from `media.cothecoconutcompany.com`.
- [x] Private S3 origin protected by CloudFront OAC.
- [x] S3 Block Public Access enabled.
- [x] Desktop/mobile visual and functional route checks passed.
- [x] Representative approved packaging mapping passed.
- [x] Animation frames mapped, ordered by manifest and fully validated.
- [x] Vercel deployment source materially smaller and safely below file limits.
- [x] Clean staged deployment succeeded without incremental-upload dependency.
- [x] Preview, immutable production and custom domain verified.
- [x] No critical asset, console, metadata or network errors found.
- [x] Tested, documented rollback path and previous production deployment preserved.
- [ ] Home transfer weight/LCP is not an infrastructure blocker, but requires a separate editorial image optimisation task.
- [ ] Catch-all not-found HTTP status requires a separate SEO correctness fix.
