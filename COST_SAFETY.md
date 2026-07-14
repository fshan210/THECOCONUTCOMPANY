# Vercel Cost Safety

Date: July 10, 2026

## Current decision

Vercel runtime Image Optimization is disabled in `next.config.mjs`:

```js
images: {
  unoptimized: true
}
```

The site can keep using `next/image` for layout safety, responsive sizing hints, priority loading, and image semantics. With `unoptimized: true`, Next.js should render direct static image URLs instead of Vercel optimizer URLs.

## Why this was needed

The Vercel warning was about Image Optimization cache writes, not necessarily real user growth.

Cache writes can increase because of:

- development and preview deployments,
- many device sizes,
- repeated viewport variants,
- repeated image quality variants,
- build/test traffic,
- bots or repeated QA sessions,
- many large images rendered through `next/image`.

Disabling runtime image optimization prevents new Vercel Image Optimization cache writes from this project.

## Operating rules

- Do not upload massive uncompressed images directly into active page paths.
- Always run `npm run optimize:images` before a planned production deployment that adds or changes many images.
- Prefer local static assets under `public/assets`.
- Avoid remote image URLs for public website content.
- Avoid depending on runtime image transformation.
- Keep hero images compressed but high quality.
- Use correct image dimensions and `sizes` values.
- Remove unused exports after verifying references.
- Use AVIF or high-quality JPG for large photographic assets when quality holds up.
- Keep PNG for transparency or graphic assets that need lossless edges.

## Local optimizer

Run:

```bash
npm run optimize:images
```

The optimizer scans `public/assets`, skips already-small images, and writes generated static variants into:

```txt
public/assets-optimized
```

It does not overwrite approved source imagery. The public visual components now use `components/media/ResponsiveImage.tsx` to serve the generated AVIF/JPEG variants through a native `<picture>` element, while preserving the approved layouts and imagery.

Generated filenames include a source-content hash, for example:

```txt
/assets-optimized/home/refined/made-with-care-4k-d703efc392-mobile.avif
```

Because these files are versioned, `next.config.mjs` applies immutable caching to `/assets-optimized/:path*`:

```txt
Cache-Control: public, max-age=31536000, immutable
```

HTML and app routes do not receive immutable caching.

## Verification checklist

After building or deploying:

1. Open key pages.
2. Inspect rendered image `src` values.
3. Confirm there are no URLs containing `/_next/image`.
4. Confirm images resolve directly from `/assets/...`, `/images/...`, or other static paths.
5. Confirm hero images and product images still appear.

Current verification result:

- Local production build verification passed on July 10, 2026.
- Checked `/`, `/about`, `/shop`, `/recipes`, `/sustainability`, `/founders`, `/journal`, and `/journal/social-cocreation-hub`.
- All checked pages returned HTTP 200 locally.
- No checked page rendered image URLs containing `/_next/image`.
- Rendered public-page images resolve directly from static paths such as `/assets-optimized/...`, `/assets/...`, and `/images/...`.
- Local header check confirmed `/assets-optimized/...` responses include `Cache-Control: public, max-age=31536000, immutable`.
- Local Lighthouse mobile verification for the homepage confirmed mobile selected mobile AVIF variants and did not fetch desktop variants.

## Remaining cost risks

Disabling Vercel Image Optimization stops optimizer cache writes, but it does not remove every possible cost risk.

Remaining risks:

- Static bandwidth can still rise if very large PNG/JPG files are served often.
- Static bandwidth can still rise if approved original images are referenced directly instead of through the optimized variant manifest.
- Preview deployments can still consume build minutes.
- Server-side routes and Firebase-backed admin features can still consume function/runtime usage.
- External analytics and third-party scripts can still add page weight.
- Very large videos can create bandwidth usage if they become high traffic.

## Near-term recommendation

Stay on Vercel for now after this fix. Runtime image optimization remains disabled, and the largest active public-page images now have static responsive AVIF/JPEG delivery. The next practical savings step is interaction-level loading for popups, long sliders, and route-specific animation bundles.

## Backend cost-safety additions

The Phase 1 backend foundation uses low-idle-cost AWS services only:

- API Gateway HTTP API.
- Lambda on ARM64. Reserved concurrency is supported through `DOTCO_LAMBDA_RESERVED_CONCURRENCY`, but is off by default because the current AWS account rejected a dev cap when it would reduce unreserved concurrency below AWS's minimum.
- DynamoDB on-demand tables.
- Cognito user pool.
- CloudWatch logs with explicit retention.

The CDK stack intentionally does not create:

- NAT Gateway,
- EC2,
- ECS services,
- RDS,
- OpenSearch,
- ElastiCache,
- always-on containers.

Production DynamoDB tables use retention/deletion protection and PITR. Dev tables are destroyable to avoid orphaned resources, but dev deploys should still be reviewed with `cdk diff`.

If the AWS account receives higher Lambda concurrency quota, set `DOTCO_LAMBDA_RESERVED_CONCURRENCY` before deployment to cap API blast radius.

This architecture is not guaranteed free. API Gateway requests, Lambda duration, CloudWatch logs, DynamoDB traffic/storage, Cognito MAUs, Route 53, and future WAF/CloudFront usage can still generate costs.

## Production authentication cost gate — 2026-07-14

The reviewed Production stack adds only on-demand/serverless services: Cognito,
API Gateway HTTP API, one ARM64 Lambda, three on-demand DynamoDB tables,
CloudWatch logs and two alarms. It creates no NAT Gateway, EC2, RDS,
OpenSearch, ElastiCache, container service or always-on server.

The AWS account currently has a total Lambda concurrency quota of 10 and all
10 executions must stay unreserved, so a reserved concurrency cap cannot be
configured yet. Do not force a reservation until a quota increase makes it
valid. Use the existing Lambda error/throttle alarms, request-rate limits and
the 10-second timeout as the immediate containment controls.
