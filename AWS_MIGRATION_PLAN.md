# Future AWS Free-Tier Migration Plan

This plan is for a future migration only. The current fix keeps the site on Vercel while removing Vercel Image Optimization cache-write usage.

## Current measured asset baseline

Before the static responsive image pass, production Lighthouse showed image payloads as high as:

- Homepage mobile: approximately 67.25 MB of image transfer.
- Homepage desktop: approximately 68.87 MB of image transfer.
- Shop mobile: approximately 63.39 MB of image transfer.
- Shop desktop: approximately 64.99 MB of image transfer.
- Journal desktop: approximately 41.54 MB of image transfer.
- Recipes mobile: approximately 22.84 MB of image transfer.
- Founders mobile: approximately 18.02 MB of image transfer.
- Sustainability mobile: approximately 17.05 MB of image transfer.

The local static variant pipeline scanned about 313.50 MB of source imagery and generated static variants for 73 active image sources: about 20.44 MB of AVIF variants plus 35.11 MB of JPEG fallbacks across mobile, tablet, and desktop sizes.

A CDN cannot compensate for unnecessarily large source files. S3 + CloudFront would reduce delivery cost and improve edge caching, but it would still be wasteful if pages directly served multi-megabyte original PNG/JPG files to mobile devices.

## Recommended architecture

### Frontend

- Next.js static export where possible, or a React static build if the app is split later.
- S3 bucket for static frontend files.
- CloudFront CDN in front of S3.
- Route 53 or current DNS provider pointing the production domain to CloudFront.
- No always-on server for the public marketing site.

### Images

- S3 asset bucket for public static image assets.
- CloudFront cache in front of image paths.
- Pre-optimized JPG/WebP/AVIF only.
- No runtime image transformation initially.
- No paid image transformation service until traffic and revenue justify it.
- Continue content-hashed filenames with immutable caching for optimized assets.
- Keep originals archived, but public pages should reference responsive derivatives.

### Backend

- AWS Lambda with Node.js runtime.
- Hono router preferred for simple, fast API routing.
- Lambda Function URL initially instead of API Gateway to reduce moving parts and cost.
- DynamoDB for app data.
- Cognito for authentication.
- SES for transactional emails later.

### Data

Initial DynamoDB tables:

- `users`
- `products`
- `carts`
- `orders`
- `newsletter_leads`
- `discount_claims`
- `cms_content`
- `audit_events`

## Cost controls

- Enable AWS Budgets before launch.
- Enable Free Tier alerts.
- Set CloudWatch log retention to 7 days.
- Avoid NAT Gateway.
- Avoid always-on EC2 servers.
- Avoid RDS initially.
- Avoid ElasticSearch/OpenSearch initially.
- Avoid paid image transformation services initially.
- Keep Lambda memory and timeout conservative.
- Use on-demand DynamoDB first, then revisit if traffic becomes predictable.

## Migration phases

### Phase 1: Static asset readiness

- Keep all images local and pre-optimized.
- Remove unused large exports.
- Generate AVIF/JPG/WebP variants.
- Confirm no app route depends on Vercel-specific image optimization.
- Confirm mobile pages never request desktop hero/card images.

### Phase 2: Static frontend proof

- Test whether the public marketing pages can run as a static output.
- Identify pages that require server behavior.
- Move purely static pages to S3 + CloudFront in a staging domain.

### Phase 3: API extraction

- Move CMS/admin APIs to Lambda with Hono.
- Keep auth and writes behind protected routes.
- Create environment-variable mapping from Vercel/Firebase to AWS.

### Phase 4: Data migration

- Model DynamoDB tables for products, recipes, journal, testimonials, users, carts, orders, newsletter leads, and discount claims.
- Export existing CMS data.
- Import into DynamoDB staging tables.
- Verify fallback content still works.

### Phase 5: Cutover

- Deploy CloudFront production distribution.
- Lower DNS TTL before cutover.
- Switch DNS.
- Monitor 404s, API errors, logs, and billing alarms.

## Rollback plan

1. Keep the Vercel production deployment active during migration.
2. Keep DNS TTL low before launch.
3. If AWS production has issues, point DNS back to Vercel.
4. Keep a frozen static asset backup for the previous release.
5. Preserve data export snapshots before any DynamoDB write migration.

## Expected free-tier limits to watch

AWS free-tier policies can change, so verify before migration. The main practical limits to watch are:

- S3 storage and requests.
- CloudFront data transfer and requests.
- Lambda invocations and GB-seconds.
- DynamoDB read/write request units and storage.
- Cognito monthly active users.
- SES sandbox/production limits.
- CloudWatch log ingestion and retention.

## What could still generate cost

- CloudFront bandwidth above free-tier limits.
- S3 request spikes from unoptimized large assets.
- Lambda loops, retries, or high memory/time settings.
- Excess CloudWatch logs.
- DynamoDB hot partitions or high write spikes.
- SES sending volume.
- DNS hosted zone charges in Route 53.
- Accidental NAT Gateway or always-on compute.

## Recommendation

Do not migrate to AWS until the site has stable launch traffic patterns and the app architecture is fully separated into:

- static public frontend,
- protected CMS/admin APIs,
- ecommerce/cart/order APIs,
- static pre-optimized media pipeline.

For now, keeping Vercel while disabling runtime image optimization is the safest low-cost path.

## Phase 1 backend foundation update

The repository now contains the AWS backend foundation without moving the frontend off Vercel:

- `/backend`: TypeScript Hono Lambda API.
- `/infra`: CDK v2 stack for Cognito, API Gateway HTTP API, Lambda, DynamoDB, logs, alarms.
- `/packages/contracts`: shared Zod contracts.

The backend defaults to `ap-south-1` through `DOTCO_AWS_REGION`.

API Gateway HTTP API was selected for Phase 1 instead of a naked Lambda Function URL because authenticated APIs need safer routing, CORS, observability, and future WAF/authorizer controls. CloudFront can still be added later once the API is stable.

Frontend hosting should remain Vercel until a separate static-export proof confirms that every public route can be served safely without losing approved UI behavior or CMS fallback behavior.
