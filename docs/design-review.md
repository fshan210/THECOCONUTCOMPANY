# .CO Design Review Checklist

This checklist governs review for visual, motion, content, documentation, and deployment changes on the `.CO` website. It must be used with [`docs/design-system.md`](./design-system.md) and [`docs/website-rules.md`](./website-rules.md). Approval requires every applicable item to be checked or explicitly marked not applicable in the PR notes.

## Review Authority

- [ ] [`docs/design-system.md`](./design-system.md) was treated as the permanent visual system.
- [ ] [`docs/website-rules.md`](./website-rules.md) was treated as the implementation guardrail.
- [ ] This file was used as the final review process before merge or deployment.
- [ ] The PR does not contradict the design system, weaken route structure, reduce accessibility, break mobile, or introduce avoidable layout instability.
- [ ] Any intentional deviation from existing patterns is explained in the PR notes.

## PR Intake

- [ ] The branch is not `main`.
- [ ] The PR description states whether production code, documentation, assets, or configuration changed.
- [ ] The PR links or summarizes the affected routes.
- [ ] The PR explains any intentional deviation from existing patterns.
- [ ] The PR does not include unrelated edits.

## Documentation Governance Review

- [ ] Documentation-only PRs are limited to documentation files.
- [ ] [`docs/design-system.md`](./design-system.md), [`docs/website-rules.md`](./website-rules.md), and this file remain mutually consistent.
- [ ] `website-rules.md` follows and references `design-system.md`.
- [ ] `design-review.md` follows and references `design-system.md`.
- [ ] No documentation creates a second competing source of truth.

## Global Layout

- [ ] The page still feels premium FMCG, product-led, warm, commercial, and not SaaS-like.
- [ ] The layout uses the approved `.CO` palette and existing brand tokens.
- [ ] Main content width respects the `1400px` max-width system.
- [ ] Section spacing feels intentional, not empty or cramped.
- [ ] No content is hidden behind another layer, image, or animation.
- [ ] No horizontal scroll appears at 390px, 768px, 1280px, or 1440px.
- [ ] Page rhythm has clear commercial purpose: product desire, taste, origin, trust, shop, recipe, or brand world.
- [ ] No dead space appears without intentional typography, product, story, doodle, badge, or micro-copy.

## Visual Review

- [ ] Premium FMCG/editorial direction is preserved.
- [ ] The page does not feel like SaaS, a generic ecommerce template, or a disconnected page design.
- [ ] Typography is bold, architectural, and consistent.
- [ ] Instrument Serif is limited to editorial display/story roles; Instrument Sans carries body, product, and interface roles.
- [ ] No runtime font request or synthesized font weight/style was introduced.
- [ ] Spacing follows the approved desktop, tablet, and mobile rhythm.
- [ ] Cards use only the approved 24px, 32px, or 40px radius system.
- [ ] Bento grids have equal gutters, clean alignment, and no accidental gaps.
- [ ] No dead space appears without intentional typography, product, story, doodle, badge, or micro-copy.

## Header And Navigation

- [ ] Header remains sticky or fixed and readable across all public page sections.
- [ ] Header transition is smooth and does not jump, flicker, clip controls, or cause layout shift.
- [ ] Desktop logo, nav links, search, account/login, and cart are visible.
- [ ] Mobile logo, search, cart, and menu are visible and tappable at 390px.
- [ ] Active nav state is correct for the current route.
- [ ] Mobile menu opens, closes, and navigates without clipping or overflow.
- [ ] Admin/control routes still hide public navigation where intended.
- [ ] Header z-index does not cover modals incorrectly or disappear under content.
- [ ] Navigation controls are not clipped by overflow, transforms, z-index, or breakpoints.
- [ ] Touch targets are at least 44px to 48px where possible.

## Hero

- [ ] Hero is product-first and clear above the fold.
- [ ] Hero uses approved local assets, not external or placeholder imagery.
- [ ] Hero headline is readable and does not wrap into an awkward wall of text.
- [ ] Hero copy and CTAs are not buried under imagery.
- [ ] Hero trust badges are compact and legible.
- [ ] Hero motion supports product storytelling and does not feel random.
- [ ] Hero uses the approved staggered headline, image/mask reveal, ripple/path, or product reveal language where applicable.
- [ ] Mobile hero uses reduced/simplified motion and keeps CTAs visible.

## Image Alignment

- [ ] All image paths resolve locally.
- [ ] All meaningful images use `BrandImage` or `next/image`.
- [ ] Every meaningful image has useful alt text.
- [ ] Product images are not stretched.
- [ ] Product labels are not badly cropped.
- [ ] Founder portraits preserve faces and shoulders.
- [ ] Object fit and object position are intentional for each important image.
- [ ] Hover image swaps do not cause layout shift or visible double-stack overlap.
- [ ] No blank image areas or broken image icons appear.
- [ ] Media shells are rounded and use `overflow: hidden`.
- [ ] Lifestyle, farm, recipe, and editorial images use intentional crops.
- [ ] About pages use farm, coconut, aggregation, processing, values, and origin imagery instead of founder portraits.

## Rounded Corners

- [ ] Cards use approved radii: `24px`, `32px`, or `40px`.
- [ ] Buttons and badges use soft-rounded or pill shapes consistently.
- [ ] Radius values are consistent within each section.
- [ ] No nested card radius creates a card-inside-card visual.
- [ ] Full-bleed hero/page image joins use `rounded-none` only when intentionally flush.

## Shop And Product

- [ ] Shop products map to the correct `lib/catalog.ts` data.
- [ ] Product images map through approved `lib/public-assets.ts` paths.
- [ ] Product cards look like commercial FMCG tiles.
- [ ] Product tile image ratios are consistent and scannable.
- [ ] Product media uses contained framing where labels need protection.
- [ ] Product detail CTAs are visible and tappable.
- [ ] "Save product" and "Early access" flows still work.
- [ ] Benefits, ingredients, usage, and availability copy remain honest.
- [ ] No medical, treatment, investor, export, or expansion claims were introduced.
- [ ] Category and trust badges support shopping decisions rather than cluttering the page.

## About And Founders

- [ ] About journey stages remain in the intended order: Kerala roots, Farmers, Village aggregation, Processing, Bottling, Everyday ritual.
- [ ] Each journey stage uses a relevant local image.
- [ ] About pages use farm, coconut, aggregation, processing, values, and origin imagery instead of founder portraits.
- [ ] Founder images use the approved Fazil and Afsala assets unless a replacement was provided.
- [ ] Founder photos appear only on the Founders page, only in profile cards, and only once per founder.
- [ ] Founder crops preserve faces and do not distort identity.
- [ ] Founder copy stays warm, human, and product-adjacent.
- [ ] About/founder sections do not use investor or global-expansion language.
- [ ] Origin content supports trust without sounding operational or pitch-deck-like.

## Motion

- [ ] Motion has a clear purpose: product storytelling, state feedback, reveal, path progress, or clickability.
- [ ] New motion uses existing easing/timing conventions.
- [ ] Repeated UI interactions remain fast.
- [ ] Content is visible by default and not dependent on animation completion.
- [ ] Reduced-motion mode keeps the experience usable.
- [ ] Mobile motion is reduced and does not cause lag.
- [ ] No bounce/elastic motion was added to premium FMCG surfaces.
- [ ] No random floating objects or decorative parallax was added.
- [ ] Hover effects are subtle and do not shift layout.
- [ ] Marquees, testimonial sliders, ripples, and doodle animations do not distract from content.
- [ ] Section reveals are staggered and not simultaneous across the entire viewport.
- [ ] Editorial headline lines reveal through a clean mask where the pattern is used.
- [ ] Journey stages activate progressively from section scroll progress.
- [ ] Product media parallax stays within the approved desktop limits and is removed for reduced motion.
- [ ] Animated SVG doodles are selective and story-relevant, not repeated decoration.

## Mobile

- [ ] Reviewed at 430px, 390px, 375px, 360px, and 320px when visual changes are significant.
- [ ] Header controls fit on one row.
- [ ] CTAs are at least 44px high and easy to tap.
- [ ] Text does not overflow buttons, cards, or viewport.
- [ ] Product cards stack in a logical order.
- [ ] Hero still feels premium on mobile.
- [ ] Product labels remain visible.
- [ ] Footer remains reachable and is not overlapped.
- [ ] Motion and image loading feel light enough for mobile.
- [ ] Mobile stacking feels intentionally designed.

## Accessibility

- [ ] Body text contrast is readable on cream, white, dark, palm, and sun surfaces.
- [ ] Large text contrast is acceptable.
- [ ] Interactive controls have accessible labels.
- [ ] Keyboard focus is visible.
- [ ] Forms retain labels or screen-reader labels.
- [ ] Images have correct alt text or are marked decorative.
- [ ] Active states are not communicated by color alone.
- [ ] `prefers-reduced-motion` is respected.
- [ ] Structured data, metadata, sitemap, robots, analytics, and auth accessibility foundations were not broken.

## Performance

- [ ] Uses local assets and `next/image` for website imagery.
- [ ] No unnecessary canvas, 3D, heavy blur, or large animation library was introduced.
- [ ] Hero priority images are intentional.
- [ ] Non-critical images are not forced priority.
- [ ] Animations prefer transform, opacity, clip-path, masks, or SVG path progress.
- [ ] No layout-thrashing animation was introduced.
- [ ] `npm run build` completes successfully.
- [ ] Existing build warnings are documented if they remain non-blocking.

## Route QA

- [ ] `/` was checked when affected.
- [ ] `/shop` was checked when affected.
- [ ] `/products` was checked when affected.
- [ ] `/about` was checked when affected.
- [ ] `/founders` was checked when affected.
- [ ] `/journal` was checked when affected.
- [ ] `/recipes` was checked when affected.
- [ ] `/sustainability` was checked when affected.
- [ ] No console or hydration errors appear on reviewed routes.

## Breakpoint Review

- [ ] 1440px desktop was checked when affected.
- [ ] 1280px laptop was checked when affected.
- [ ] 1024px tablet was checked when affected.
- [ ] 768px tablet was checked when affected.
- [ ] 430px mobile was checked when affected.
- [ ] 390px mobile was checked when affected.
- [ ] 375px mobile was checked when affected.
- [ ] 360px mobile was checked when affected.
- [ ] 320px mobile was checked when affected.

## Required Checks

- [ ] `npm run lint` passed for production code changes.
- [ ] `npx tsc --noEmit --incremental false` passed for production code changes.
- [ ] `npm run build` passed for production code changes.
- [ ] Documentation-only changes were reviewed with `git diff --name-only`.
- [ ] Existing non-blocking build warnings are documented.

## Git And Deployment

- [ ] `git status --short --branch` was checked before staging.
- [ ] Only files related to the requested scope were staged.
- [ ] No `.env`, `.next`, `node_modules`, tool folders, local configs, screenshots, or debug artifacts were staged.
- [ ] No unrelated user changes were reverted.
- [ ] Deployment, if requested, used the exact intended commit.
- [ ] Production routes returned 200 after deployment.
- [ ] Deployment report includes branch, commit hash, Vercel URL, production URL, checks, and warnings.

## Deployment Review

- [ ] GitHub checks have completed before deployment or merge.
- [ ] The Vercel Preview deployment is available when configured.
- [ ] The preview was reviewed at the affected routes and breakpoints.
- [ ] The PR was not merged automatically unless explicitly requested.
- [ ] Remaining risks are documented in the PR before handoff.

## Final Approval Gate

- [ ] The PR preserves the `.CO` brand identity.
- [ ] The work improves or preserves product desire.
- [ ] The work does not make the site look more generic, SaaS-like, or template-like.
- [ ] Header and footer are unchanged unless explicitly in scope.
- [ ] All public-facing copy is consumer-friendly and accurate.
- [ ] All images are correct, aligned, and intentional.
- [ ] The design works at 1440px, 1280px, 1024px, 768px, 430px, 390px, 375px, 360px, and 320px where affected.
- [ ] A reviewer can explain why every major section exists.
- [ ] A reviewer can confirm no stop condition from `docs/website-rules.md` was ignored.
- [ ] Final approval is withheld until every applicable checklist item is satisfied.
