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
public/assets/_optimized
```

It does not rewrite existing page references automatically. That keeps the live visual design stable. Heavy images should be swapped to optimized variants in a deliberate follow-up pass after visual QA.

## Verification checklist

After building or deploying:

1. Open key pages.
2. Inspect rendered image `src` values.
3. Confirm there are no URLs containing `/_next/image`.
4. Confirm images resolve directly from `/assets/...`, `/images/...`, or other static paths.
5. Confirm hero images and product images still appear.

Current verification result:

- Local production build verification passed on July 10, 2026.
- Checked `/`, `/about`, `/shop`, `/recipes`, `/sustainability`, `/founders`, and `/journal`.
- All checked pages returned HTTP 200 locally.
- No checked page rendered image URLs containing `/_next/image`.
- Rendered images resolved directly from static paths such as `/assets/...` and `/images/...`.

## Remaining cost risks

Disabling Vercel Image Optimization stops optimizer cache writes, but it does not remove every possible cost risk.

Remaining risks:

- Static bandwidth can still rise if very large PNG/JPG files are served often.
- Preview deployments can still consume build minutes.
- Server-side routes and Firebase-backed admin features can still consume function/runtime usage.
- External analytics and third-party scripts can still add page weight.
- Very large videos can create bandwidth usage if they become high traffic.

## Near-term recommendation

Stay on Vercel for now after this fix. The immediate Image Optimization cache-write warning should be addressed by disabling runtime optimization. The next practical savings step is to replace the largest active PNG assets with local AVIF/JPG variants after visual QA.
