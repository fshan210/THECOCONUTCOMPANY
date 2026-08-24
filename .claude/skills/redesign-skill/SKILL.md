---
name: redesign-skill
description: |
  Orchestrates incremental redesign of existing .CO The Coconut Company pages and
  components. Use when: improving visual quality, UX, or motion on an existing page
  or component; auditing a page before edits; proposing layout or typography refinements;
  or any task that contains "redesign", "improve UI", or "audit" in a redesign context.
  Blocks: replacing approved brand assets, altering locked packaging, regenerating
  packaging, inventing new product identities, generic SaaS/dashboard aesthetics,
  AI-generated brand imagery, full rewrites of working systems.
metadata:
  type: project
---

# Redesign Skill — .CO The Coconut Company

## Role

This skill orchestrates incremental redesign. It does not replace any existing skill.
It defers to the authority hierarchy for domain rules and contributes only the
redesign workflow: inspection, diagnosis, prioritization, and incremental improvement.

## Authority hierarchy

When a redesign rule conflicts with a more-specific rule from another skill, the
more-specific rule wins. Resolve in this order:

1. `brand-protection` — brand assets, packaging locks, prohibited imagery, homepage
   section sequence, sustainability truth, pre-change gate
2. `design-system` — palette, typography, spacing/radii, glass/neumorphism conventions,
   responsive floors, token flow, gradient rules, asset pipeline
3. `motion-architecture` — library assignment, quality tiers, parallax depths,
   choreography values, scroll-scrub policy, header glass
4. `graphify` — architecture understanding when impact is unclear
5. `ui-ux-pro-max` — UX analysis and layout critique
6. `emilkowalski-motion` — micro-interaction refinement
7. This skill — orchestration workflow and prioritization only

Reading another skill's lock is mandatory before proposing any change in its domain.
Do not propose a typography change without consulting `design-system`. Do not propose
a brand-surface change without consulting `brand-protection`.

## Before redesign

Run every step before proposing or applying changes.

1. **Inspect the current implementation.** Read the page or component code. Identify
   the framework, motion library usage, styling approach, and current layout patterns.
   Understand what already works before judging what does not.
2. **Use Graphify when architecture impact is unclear.** If a proposed change could
   affect page structure, shared components, or the motion choreography, run Graphify
   first. Map the dependency surface before editing.
3. **Identify existing constraints.** Note locked assets (`brand-protection`),
   palette tokens (`design-system`), motion values (`motion-architecture`), and
   UX patterns (`ui-ux-pro-max`) that constrain the solution space.
4. **Identify what must be preserved.** Working systems, approved assets, locked
   homepage section sequence, and Kerala origin positioning are not negotiable.
5. **Define improvement goals in terms of outcomes, not visual trends.** Target
   specific symptoms — "hero typography lacks presence", "section transitions read
   as hard borders" — not generic directions like "make it more premium".

## Redesign audit categories

Apply these categories in priority order (see Fix Priority below). Each category
describes symptoms to look for, not prescriptions that override existing locks.

### Typography

- Browser default or monotonous font stack. The .CO stack is locked
  (`design-system`); do not propose a different font.
- Headlines that do not register at their intended size (poor weight/letter-spacing/
  line-height relationship).
- Body copy that stretches past comfortable reading width.
- Orphaned words on the last line of headlines or paragraphs.
- Numeric data rendered in proportional text where tabular figures would read cleaner.
- All-caps overuse for subheaders. The .CO convention is restrained uppercase tracking
  for labels; prefer sentence case or italic serif emphasis for subheaders.

### Colour and surfaces

- Purple/blue "AI gradient" aesthetic. The .CO palette is brown/green/beige; proposals
  outside those anchors require `DESIGN.md` amendment via `design-system`.
- Pure `#000000` or pure `#ffffff` surfaces where a tinted variant exists.
- Generic `box-shadow`. The .CO convention is tinted shadows matching surface hue.
- Flat sections with no depth signal. Prefer gradients that create edge integration or
  legibility per `design-system` gradient rules.
- Hard section seams. The homepage sequence locks transitions to colour and media
  handoffs via the seven canonical transition tokens (`design-system`).

### Layout

- Three equal card columns as the only feature-row shape. The .CO convention prefers
  flowing editorial layouts; use bento layouts where structured grouping serves the story.
- `height: 100vh` full-screen sections. Replace with `min-height: 100dvh` to prevent
  mobile viewport jumping.
- Buttons not aligned across card groups of varying content length.
- Feature lists starting at inconsistent vertical positions in comparison layouts.
- Insufficient whitespace for editorial compositions. Premium FMCG storytelling
  requires breathing room; dense card grids read as dashboard, not editorial.
- Symmetrical vertical padding that reads optically wrong. Bottom padding typically
  needs to be slightly larger than top padding.
- Uniform border-radius on every element. Vary: tighter on controls, softer on
  containers, per the `design-system` radii rules (22–36px for editorial media and
  primary glass surfaces; pills reserved for controls and compact CTAs).

### Interactivity and states

- No hover / active / pressed feedback on interactive elements.
- Transitions with zero duration or abrupt starts.
- Missing visible focus indicators. WCAG AA-visible focus states are non-negotiable
  per `design-system`.
- Scroll-jumping on anchor navigation. Add `scroll-behavior: smooth` where appropriate.
- Animations using `top`, `left`, `width`, `height` instead of `transform` and `opacity`.
  Use the primitives in `motion-architecture` rather than inline equivalent motion.
- Buttons that link to `#` or have no defined destination.

### Motion

- Linear easing on interactive elements. Use the base ease and duration bands in
  `motion-architecture`.
- Identical reveals on every label. Mix reveals with resting states.
- Noisy effects, particles, random bouncing, unbounded parallax — all prohibited by
  `motion-architecture`.
- Smooth-scroll implementation that is not Lenis (the single RAF loop owner per
  `motion-architecture`).
- Scroll-scrub driven by continuous React state instead of motion values and
  `requestAnimationFrame`.

### Content

- AI copywriting clichés: "Elevate", "Seamless", "Next-Gen", "Game-changer", "Delve",
  "Tapestry", "In the world of…". Write plain, specific language.
- Exclamation marks in success messages. Be confident, not loud.
- Placeholder latin text. Write real draft copy.
- "Oops!" error messages. Be direct.
- Generated, synthetic, or Unsplash/Pexels/Pixabay/Openverse/Wikimedia Commons
  imagery proposed for brand surfaces. Prohibited per `brand-protection`. Those
  sources are permitted only for non-brand texture/background per `design-system`.

## Upgrade techniques

Apply these only when they respect the locks above.

### Typography upgrades

- Variable font animation (weight/width interpolation on scroll or hover), only when
  the existing font supports it and it does not compete with the editorial display
  font's role.
- Outlined-to-fill text transitions on hero or section headers.
- Text mask reveals where editorial typography acts as a window to approved imagery.

### Layout upgrades

- Broken grid / asymmetry that respects the editorial flow. The .CO convention is
  offset margins, mixed aspect ratios, left-aligned headers over centred content —
  not random chaos.
- Whitespace maximization for single-focus editorial moments.
- Parallax card stacks using the three-tier depth system in `motion-architecture`.
- Split-screen scroll for journey pages.

### Motion upgrades

- Staggered entry via the `StaggeredReveal` primitive in `motion-architecture`,
  not bespoke implementations.
- Spring physics for interactive feedback only, not for page content reveals.
- Scroll-driven reveals via `SectionReveal` / `ImageReveal` primitives, not inline
  motion code.
- Smooth scroll via Lenis, disabled under `prefers-reduced-motion: reduce`.

### Surface upgrades

- True glassmorphism per `design-system` conventions (warm brown / beige only, one-pixel
  specular edge, soft shadow). Cool blue / Vision Pro white glass is prohibited.
- Grain and noise overlays using pointer-events-none fixed overlays.
- Coloured shadows tinted to match the surface hue.

## Fix priority

Apply changes in this order for maximum impact with minimum risk:

1. **Colour palette cleanup** — remove clashing, oversaturated, or AI-gradient colours
2. **Typography scale and spacing** — headline presence, body width, line-height
3. **Hover, active, and focus states** — makes the interface feel alive
4. **Layout and grid** — proper grid, max-width, consistent padding, optical alignment
5. **Replace generic components** — swap cliché patterns for .CO editorial alternatives
6. **Add loading, empty, and error states** — makes it feel finished
7. **Motion polish** — staggered reveals, spring feedback, smooth scroll (last because
   it touches the most shared infrastructure)

Font swap is not a step here because the .CO font stack is locked. Any font proposal
requires `DESIGN.md` amendment.

## Rules

- Work with the existing tech stack. Do not migrate frameworks or styling libraries.
- Do not break existing functionality. Test after every change.
- Before importing any new library, check the project's dependency file first.
- If the project uses Tailwind, check the version (v3 vs v4) before modifying config.
- Keep changes reviewable and focused. Small, targeted improvements over big rewrites.
- Never propose replacing approved brand assets or locked packaging with alternatives.
- Never propose full rewrites of working pages. Redesign is incremental improvement.
- Any change to a brand-visible surface must pass the `brand-protection` pre-change gate
  before edits begin.
- Any change to palette, typography, spacing, radii, glass, or responsive behaviour must
  conform to `design-system` locks.
- Any change to scroll-linked behaviour, parallax, or animation values must use the
  primitives and values in `motion-architecture`.

## .CO-specific overrides

These rules are not negotiable and must not be relaxed by any generic redesign pattern.

- Do not redesign approved packaging.
- Do not alter logos.
- Do not invent new product identities.
- Do not replace existing visual language with generic trends.
- Avoid SaaS/dashboard aesthetics (flat card grids, left sidebars, neutral grey
  backgrounds, pill-heavy UIs, metric tiles).
- Preserve premium FMCG editorial feeling: flowing layouts, restrained colour,
  generous whitespace, organic storytelling.
- Prefer gradients and continuous storytelling over disconnected card grids.
- Respect existing coconut-origin storytelling. Kerala origin positioning is locked.
- Avoid AI-generated-looking layouts: symmetrical three-column cards, purple/blue
  gradients, monotonous sans-serif typography, generic icon sets.
