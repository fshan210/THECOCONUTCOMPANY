# .CO Design Review Checklist

This checklist governs review for visual, motion, content, and deployment changes on the `.CO` website. It must be used with [`docs/design-system.md`](./design-system.md) and [`docs/website-rules.md`](./website-rules.md).

## Review Authority

- [`docs/design-system.md`](./design-system.md) defines the permanent visual system.
- [`docs/website-rules.md`](./website-rules.md) defines implementation guardrails.
- This file defines the review process that determines whether a change is ready to merge or deploy.

A PR is not ready to merge if it contradicts the design system, weakens route structure, reduces accessibility, breaks the mobile experience, or introduces avoidable layout instability.

## PR Intake

For every visual or website PR, confirm:

- The branch is not `main`.
- The PR description states whether production code, documentation, assets, or configuration changed.
- The PR links or summarizes the affected routes.
- The PR explains any intentional deviation from existing patterns.
- The PR does not include unrelated edits.

## Documentation Governance Review

For documentation-only PRs, confirm:

- The changed files are limited to documentation.
- [`docs/design-system.md`](./design-system.md), [`docs/website-rules.md`](./website-rules.md), and this file remain mutually consistent.
- `website-rules.md` follows and references `design-system.md`.
- `design-review.md` follows and references `design-system.md`.
- No documentation creates a second competing source of truth.

## Visual Review

Review each affected route against the design system:

- Premium FMCG/editorial direction is preserved.
- The page does not feel like SaaS, a generic ecommerce template, or a disconnected page design.
- Typography is bold, architectural, and consistent.
- Spacing follows the approved desktop, tablet, and mobile rhythm.
- Cards use only the approved 24px, 32px, or 40px radius system.
- Bento grids have equal gutters, clean alignment, and no accidental gaps.
- No dead space appears without intentional typography, product, story, doodle, badge, or micro-copy.

## Image Review

Confirm all imagery follows [`docs/design-system.md`](./design-system.md):

- Product packshots use contained framing and do not crop labels.
- Lifestyle, farm, recipe, and editorial images use intentional crops.
- Media shells are rounded and use `overflow: hidden`.
- No image stretches, collides, or overlaps accidentally.
- Founder photos appear only on the Founders page, only in profile cards, and only once per founder.
- About pages use farm, coconut, aggregation, processing, values, and origin imagery instead of founder portraits.

## Motion Review

Confirm motion is subtle and accessible:

- Header transition is smooth and does not jump or flicker.
- Hero reveal feels premium without floating objects or particles.
- Section reveals are staggered and not simultaneous across the entire viewport.
- Cards lift or press subtly without disrupting layout.
- Marquees, testimonial sliders, ripples, and doodle animations do not distract from content.
- `prefers-reduced-motion` is respected.

## Header and Navigation Review

Confirm:

- Desktop header remains accessible on scroll.
- Mobile header remains accessible on scroll.
- Logo, search, cart, and menu controls remain visible on mobile.
- Navigation controls are not clipped by overflow, transforms, z-index, or breakpoints.
- Touch targets are at least 44px to 48px where possible.
- Header changes do not cause layout shift.

## Route QA Checklist

Audit these routes when affected by a PR:

- `/`
- `/shop`
- `/products`
- `/about`
- `/founders`
- `/journal`
- `/recipes`
- `/sustainability`

Check each route for:

- No horizontal overflow.
- No broken images.
- No console or hydration errors.
- No accidental overlap.
- No sharp corners in premium sections.
- Clean image crop and alignment.
- Consistent typography hierarchy.
- Accessible controls and focus behavior.
- Mobile stacking that feels intentionally designed.

## Breakpoint Review

Use these breakpoints when visual changes are made:

- 1440px desktop
- 1280px laptop
- 1024px tablet
- 768px tablet
- 430px mobile
- 390px mobile
- 375px mobile
- 360px mobile
- 320px mobile

## Required Checks

Before merge, run the relevant checks for the change type.

For production code changes:

```bash
npm run lint
npx tsc --noEmit --incremental false
npm run build
```

For documentation-only changes:

```bash
git diff --name-only
```

Build warnings are acceptable only when they are existing and non-blocking, such as deprecated Next middleware convention or edge runtime static generation behavior warnings.

## Deployment Review

Before deployment or merge:

- Confirm GitHub checks have completed.
- Confirm the Vercel Preview deployment is available when configured.
- Review the preview at the affected routes and breakpoints.
- Do not merge automatically unless explicitly requested.
- Document any remaining risks in the PR before handoff.
