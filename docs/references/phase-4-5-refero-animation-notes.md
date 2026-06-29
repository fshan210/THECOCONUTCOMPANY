# Phase 4.5 Refero Animation Notes

Reference inspected: <https://styles.refero.design/style/5ef5e1ff-3cb3-4383-9f66-26474409d9ae>

Reference identity: Pa'lais design system on Refero Styles.

These notes are inspiration only. No proprietary code, generated components, fonts, token names, or assets should be copied into `.CO`.

## Useful patterns for `.CO`

### Animation rhythm

- Use editorial pacing: reveal one meaningful object at a time instead of animating whole sections simultaneously.
- Keep large transitions slow enough to feel cinematic, roughly `0.8s` to `1.1s`, while buttons and controls remain fast.
- Let product and story media lead the reveal. Text should support the product, not compete with it.
- Prefer scroll-position storytelling for origin/process sections over decorative looping movement.

### Section transitions

- Warm paper-like section surfaces can transition with mask reveals, subtle vertical lift, and minimal scale.
- Keep section rhythm calm → editorial → calm, matching the existing `.CO` design-system ratio of restraint to emphasis.
- Use thin borders or very soft depth to separate content rather than heavy shadows.

### Text reveal style

- The useful pattern is not the Pa'lais font stack; it is the confidence of large editorial type.
- `.CO` should keep Roboto as the primary brand type and reveal headline lines through clean overflow masks.
- Instrument Serif can remain a rare accent for quotes/signatures only.

### Card treatment

- Cards feel strongest when they are simple surfaces carrying strong imagery and short copy.
- Adapt the lightweight, editorial-card idea into `.CO`'s larger radius system: 24px, 32px, and 40px.
- Product cards should remain commercial FMCG tiles, not generic gallery cards.

### Image treatment

- The reference uses strong art direction: product images sit inside composed, intentional panels.
- `.CO` should adapt this as rounded media shells, overflow-hidden crops, product contain behavior, and clean hover crossfades.
- Local coconut, product, farm, recipe, founder, and video assets should be used before sourcing anything new.

### Button treatment

- Pill buttons with restrained press/lift behavior are useful.
- `.CO` should keep existing CTA language and add only subtle depth, label movement, or magnetic behavior where it improves clickability.
- No elastic, bouncy, novelty cursor effects.

### Scroll behavior

- Smooth scroll can help cinematic sections, but must be optional, reduced-motion safe, and disabled on mobile if it causes friction.
- Lenis should be initialized once globally only when a future implementation PR explicitly wires it in.

### Typography behavior

- The reference shows strong contrast between display type, labels, and body text.
- `.CO` should preserve its self-hosted Roboto system while using line breaks, scale, weight, and masks to create drama.
- Avoid copying condensed, script, or decorative typefaces from the reference.

### Spacing and hierarchy

- Generous whitespace works when paired with confident imagery and short editorial copy.
- `.CO` should avoid empty-looking dead zones by placing product facts, origin moments, micro-copy, or subtle linework intentionally.

## What should not be copied

- Pa'lais colors, fonts, brand marks, copy, screenshots, image assets, or code.
- The exact blob shapes, botanical illustrations, or decorative motif language.
- Any Refero-generated design token export as a direct implementation source.
- The smaller 8px card radius; `.CO` already has an approved 24/32/40px radius system.
- Any component or layout pattern that would make `.CO` feel like a different brand.

## What can be adapted safely

- Masked headline reveal logic using `.CO` text, fonts, and easing.
- Paper/editorial surface hierarchy using existing cream, white, brown, palm, and sun tokens.
- Gentle product image reveal, hover crossfade, and contained packshot framing.
- Rounded card shells with thin borders and restrained depth.
- Scroll-progress storytelling for Grove to Goodness.
- Pill CTA press/lift interactions that respect reduced motion.

