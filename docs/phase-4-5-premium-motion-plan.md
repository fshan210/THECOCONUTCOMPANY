# Phase 4.5 Premium Motion Plan

This plan prepares the next implementation PR. It does not authorize redesigning the approved `.CO` public UI.

## Current setup status

- Existing motion foundation: `framer-motion`, `MotionSection`, `useCoconutMotionMode()`, reduced-motion CSS, and the coconut-to-bottle local video.
- New approved tooling installed: `gsap`, `lenis`, `split-type`, `embla-carousel-react`, `clsx`, and `tailwind-merge`.
- New setup-only motion utilities were added under `lib/motion/` and `components/motion/`.
- Public routes were not rewired in this setup pass.

## 1. Hero cinematic sequence

Goal: make the homepage hero feel premium and product-led without changing the approved layout.

Planned sequence:

1. Coconut origin cue appears first with subtle mask/lift.
2. Coconut split or coconut-surface visual appears only if licensed/local assets exist.
3. Liquid ripple or line-draw water path connects origin to bottle.
4. Bottle reveal becomes the visual anchor, using local product/video assets.
5. Headline lines reveal through overflow masks.
6. CTA group reveals after headline so the action remains clear.
7. Scroll depth subtly advances supporting visuals on desktop only.

Rules:

- Keep product clarity above all motion ideas.
- Use local assets first.
- No fake 3D, particles, bouncing, or constant floating.
- Reduced-motion state must show all content immediately.
- Mobile must use a shorter sequence with no heavy scroll coupling.

## 2. Grove to Goodness animation

Goal: turn the origin/process story into a controlled scroll narrative.

Planned behavior:

- Draw a thin path as the section enters.
- Activate one stage at a time: Kerala Groves, Care from Farmers, Village Aggregation, Pure Processing, Hygienic Bottling, Goodness to You.
- Reveal each image within a rounded shell.
- Use a progress indicator tied to scroll progress.
- Keep captions short and concrete.

Implementation notes:

- Use `framer-motion` for per-stage reveals.
- Consider `gsap` only if the path/stage timing becomes too complex for Framer Motion.
- Use existing farm, village aggregation, processing, and generated campaign assets.
- Never block reading the story while animation is running.

## 3. Rounded image system enforcement

Goal: make image presentation feel intentionally premium everywhere.

Rules:

- Every meaningful image appears in a rounded shell unless intentionally full-bleed.
- Media wrappers use `overflow-hidden`.
- Product packshots use `object-fit: contain`.
- Lifestyle, farm, journal, and recipe imagery use intentional `object-fit: cover`.
- Object position must be reviewed for important crops.
- Hover zoom should be small and never clip product labels.

Future audit targets:

- Homepage feature and recipe cards.
- Shop cards and product detail image panels.
- Journal thumbnails.
- Sustainability and About story images.

## 4. Shop card polish

Goal: make shop cards more commercial and premium without duplicating product sections.

Planned behavior:

- Card media remains the primary visual.
- Text may sit inside the image only when a gradient/overlay preserves readability.
- CTA should feel embedded and tappable, not floating over product labels.
- Hover image crossfade should be subtle and layout-stable.
- Product packshot labels must remain readable.

Rules:

- `/products` remains a redirect and must not appear in sitemap.
- `/shop` remains the primary product listing.
- Do not invent availability, offers, ratings, or reviews.

## 5. Recipe cards

Goal: make recipes feel clickable, editorial, and SEO-ready.

Planned behavior:

- Recipe cards should be fully clickable.
- Image reveal should be subtle and rounded.
- Category/search behavior should be preserved.
- Add recipe detail route planning before publishing individual recipe pages.
- Prepare structured Recipe schema only when page-level recipe detail data exists.

SEO route plan:

- Keep `/recipes` as the listing.
- Future detail routes should use `/recipes/[slug]`.
- Add each published recipe detail page to sitemap only after the page exists and returns HTTP 200.

## 6. Admin dashboard link audit

Goal: ensure visible admin/dashboard controls are honest.

Rules:

- Every visible button must either work or be disabled with clear setup/status copy.
- No decorative “coming soon” button should look like a completed action.
- Write actions must remain auth-protected.
- No Firebase Storage dependency should be introduced for image management.

Audit targets:

- `/admin`
- `/admin/products`
- `/admin/recipes`
- `/admin/journal`
- `/admin/testimonials`
- `/admin/homepage`
- `/admin/seo`
- Customer/account-related controls if they appear in admin navigation.

## 7. Animation performance rules

Required:

- Respect `prefers-reduced-motion`.
- Simplify or disable heavy motion on mobile.
- Animate transform, opacity, clip-path, masks, and SVG path progress before layout properties.
- Avoid layout shift.
- Keep content visible and accessible even before animation finishes.
- Initialize global scroll tooling once only.
- Do not use heavy canvas/WebGL unless a future task explicitly justifies it.
- No random floating objects, particle systems, heavy blur stacks, or elastic/bouncy motion.

Performance budget:

- Hero motion should not delay LCP content.
- Non-critical animation code should remain isolated from core page rendering where possible.
- Carousel/slider code should load only where used.
- Test with `npm run build` and route QA before merge.

## Next implementation PR checklist

- Wire one motion primitive at a time.
- Verify `/`, `/shop`, `/about`, `/founders`, `/recipes`, `/journal`, and `/sustainability`.
- Verify mobile at 390px and desktop at 1440px.
- Verify reduced-motion mode.
- Confirm no public layout redesign occurred.
- Confirm GA4, sitemap, robots, and structured data are unchanged unless intentionally updated.

