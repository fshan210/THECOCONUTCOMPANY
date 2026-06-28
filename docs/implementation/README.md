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

## Phase 2 Typography And Motion Implementation

The approved editorial identity uses self-hosted Instrument Serif and Instrument Sans from the official Instrument repositories. Both are SIL OFL 1.1 fonts; binaries and license copies are stored in `app/fonts/`.

- Instrument Serif: hero, page, narrative, recipe, journal, founder, and quotation display roles.
- Instrument Sans: body, navigation, buttons, labels, product language, forms, and commerce UI.
- No font package or runtime Google Font dependency is used.
- Standard motion continues to use Framer Motion already present in the project.
- Phase 2 adds masked headline lines, scroll-activated journey stages, selected SVG path drawing, restrained media parallax, and improved press/depth feedback.
- No external photography or product assets were added because the existing campaign library covers the approved sections.
