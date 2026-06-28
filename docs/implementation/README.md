# .CO Premium Implementation Reference Pack

This folder contains the approved visual reference material for the next `.CO | The Coconut Company` website refinement sprint.

The reference board is visual inspiration only. It is here to help future work understand the intended premium direction, motion ambition, rounded surface language, hero polish, and automation themes for the next sprint.

The source of truth remains:

1. [`docs/design-system.md`](../design-system.md)
2. [`docs/website-rules.md`](../website-rules.md)
3. [`docs/design-review.md`](../design-review.md)

If [`premium-reference-board.png`](./premium-reference-board.png) conflicts with the governance docs, the docs win.

Future Codex work must read all four references before coding:

1. [`docs/design-system.md`](../design-system.md)
2. [`docs/website-rules.md`](../website-rules.md)
3. [`docs/design-review.md`](../design-review.md)
4. [`docs/implementation/premium-reference-board.png`](./premium-reference-board.png)

## Implementation Priorities

1. Premium motion and micro-interactions
2. Rounded image/card system
3. Neumorphic/glassmorphic buttons and sticky scrolled header
4. Typography refinement based on brand rules
5. Hero headline and composition polish
6. Grove-to-goodness animated story flow
7. Advanced SEO and indexing readiness
8. Dashboard-to-website real-time content integration

## Current Typography, Motion, And Campaign Implementation

The official `.CO` branding PDF is the authority for identity. The primary type system is self-hosted Roboto Light, Regular, Medium, and Bold. Instrument Serif remains only for selected quotation and signature accents. Both use SIL OFL 1.1 licenses stored beside the font files in `app/fonts/`; there is no runtime font dependency.

- Standard motion uses the existing Framer Motion dependency. No new runtime animation package was added.
- The homepage uses the supplied coconut-to-bottle transition film, cropped to remove unwanted overlays and exported locally as optimized MP4/WebM with a poster fallback under `public/assets/video/`.
- Reduced-motion visitors receive the final still frame rather than autoplay video or scroll travel.
- Recipes use existing campaign assets plus six generated editorial food photographs stored under `public/assets/recipes/generated/`. These cover lunch, dinner, snacks, quick meals, healthy, and seasonal recipe gaps.
- Generated recipe imagery is local, contains no text or logos, and follows the approved cream, earth-brown, and muted-green campaign grade.
- Products browse through `/shop`; `/products` remains only as a compatibility redirect and is excluded from the sitemap.
- Founder profiles show one approved portrait at a time; sustainability and journal use the existing local Kerala, aggregation, processing, and regeneration campaign library.
