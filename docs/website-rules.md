# .CO Website Rules

This document converts the permanent `.CO` design system into day-to-day implementation rules. It must be read together with [`docs/design-system.md`](./design-system.md) before any website code, content, layout, motion, or asset change.

## Authority and Scope

1. [`docs/design-system.md`](./design-system.md) is the single source of truth for the approved premium FMCG brand direction.
2. This file defines the working rules that keep implementation aligned with that design system.
3. [`docs/design-review.md`](./design-review.md) defines the review and QA process before merge or deployment.
4. If a requested change conflicts with the design system, pause and resolve the conflict before editing production code.
5. Do not reinterpret the site as a SaaS landing page, generic ecommerce template, or experimental redesign.

## Before Editing Code

Before changing React, styles, assets, routes, or configuration:

- Read [`docs/design-system.md`](./design-system.md).
- Check whether the change affects layout, spacing, typography, imagery, animation, accessibility, QA, or deployment review.
- Identify the route and component scope.
- Preserve approved header and footer behavior unless the task explicitly targets them.
- Prefer reusable design-system patterns over page-specific styling.

## Allowed Change Categories

Website work should fall into one of these categories:

- Alignment fixes that improve grid, spacing, card rhythm, or image crop.
- Motion refinements that follow the approved subtle motion language.
- Accessibility improvements that do not weaken the visual system.
- Content corrections that preserve the approved brand tone.
- Asset improvements that use the approved image hierarchy and treatment.
- Bug fixes that restore intended behavior without redesigning unrelated areas.

## Prohibited Changes Without Explicit Approval

Do not make these changes unless the user explicitly requests them:

- Redesign approved layouts from scratch.
- Replace the premium FMCG/editorial direction with a SaaS or template aesthetic.
- Introduce gradients, glassmorphism, neon colors, heavy shadows, or shiny UI effects.
- Add runtime Google font dependencies or other build-fragile external font loading.
- Add heavy animation libraries for simple reveal, marquee, or carousel behavior.
- Add random floating objects, particles, bouncing, or distracting motion.
- Use sharp corners in premium card and media sections.
- Add raw, unframed images where a rounded media shell is required.
- Duplicate shop and product grids across multiple routes.
- Place founder portraits on the About page or in a Founders hero banner.

## Route Ownership Rules

Use these route expectations to prevent duplicated structure:

- `/` is the brand campaign and commercial homepage.
- `/shop` is the primary purchase-intent product listing.
- `/products`, if present, should redirect to `/shop` or act only as education with a clear CTA to `/shop`.
- `/about` should focus on Kerala origin, farms, coconut, aggregation, processing, values, and story.
- `/founders` is the only route where founder portraits should appear, and each founder should appear once in profile cards.
- `/journal`, `/recipes`, and `/sustainability` must share the same typography, card, image, and spacing systems as the rest of the site.

## Component and Styling Rules

- Use the radius system from [`docs/design-system.md`](./design-system.md): 24px, 32px, or 40px.
- Use shared containers and spacing tokens where available.
- Keep cards equal-height when they appear in a grid or bento system.
- Ensure media wrappers use `overflow: hidden`.
- Use `object-fit: cover` for lifestyle/editorial imagery.
- Use `object-fit: contain` for product packshots.
- Avoid absolute positioning that creates accidental overlap or clipped content.
- Do not hide interactive controls behind breakpoints, z-index layers, transforms, or overflow clipping.

## Header Rules

The header is a protected component.

- Keep it accessible while scrolling.
- Preserve desktop navigation access.
- Preserve mobile logo, search, cart, and hamburger/menu access.
- Keep touch targets at least 44px to 48px where possible.
- Avoid layout shift during sticky or dynamic-island transitions.
- Do not remove account, cart, search, or menu controls to solve spacing issues.

## Motion Rules

Motion must follow the system in [`docs/design-system.md`](./design-system.md):

- Use subtle section reveals, staggered text, image masks, card lift, button press, doodle draw, timeline progress, gentle marquee, and testimonial sliding cards.
- Use consistent durations and easing across the site.
- Respect `prefers-reduced-motion`.
- Do not animate everything at once.
- Do not let motion distract from product, story, or usability.

## Content and Tone Rules

- Keep copy short, confident, and editorial.
- Prefer strong product and origin language over generic marketing claims.
- Use approved headline language such as COLD, COCONUT, WATER, REAL, GOODNESS, KERALA, RITUAL, EVERYDAY, and MADE FOR LIVING.
- Avoid long paragraphs over photography.
- Use image overlays only when readability is excellent.

## Documentation Requirement

When a future implementation changes or extends the visual system, update documentation in the same PR if the rule should become permanent. Documentation changes must remain coherent with [`docs/design-system.md`](./design-system.md) and must be reviewed using [`docs/design-review.md`](./design-review.md).
