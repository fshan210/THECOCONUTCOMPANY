---
name: frontend-taste
description: |
  Evaluates and directs visual quality for .CO The Coconut Company frontend.
  Use when: approving a design before edits; judging whether a page or component
  reads as world-class; proposing visual direction; auditing composition, typography,
  spacing, or layout quality; evaluating imagery or assets; judging whether motion
  or interaction serves storytelling. Blocks: overriding higher-level project rules,
  generic SaaS aesthetics, AI-slop patterns, neon/cyberpunk/dark-SaaS aesthetics,
  generic glassmorphism without purpose, excessive floating cards, random gradients.
metadata:
  type: project
---

# Frontend Taste — .CO The Coconut Company

## Role

This skill is an evaluator and art-direction assistant. It answers one question:
**"Does this feel world-class?"**

It does not implement. It does not override higher-level project rules.
It defers to the authority hierarchy for every domain rule.

## Authority hierarchy

When a taste judgement conflicts with a more-specific rule from another skill,
the more-specific rule wins. Resolve in this order:

1. `brand-protection` — brand assets, packaging locks, prohibited imagery,
   homepage section sequence, sustainability truth
2. `design-system` — palette, typography, spacing/radii, glass/neumorphism
   conventions, responsive floors, token flow, gradient rules, asset pipeline
3. `motion-architecture` — library assignment, quality tiers, parallax depths,
   choreography values, scroll-scrub policy, header glass
4. `graphify` — architecture understanding when impact is unclear
5. `ui-ux-pro-max` — UX analysis and layout critique
6. `emilkowalski-motion` — micro-interaction refinement
7. `redesign-skill` — redesign workflow and fix prioritization
8. This skill — visual evaluation and art direction only

Reading another skill's lock is mandatory before issuing a taste judgement in
its domain. Do not pass a typography judgement without consulting `design-system`.
Do not pass a brand-surface judgement without consulting `brand-protection`.

## Visual evaluation process

Before approving a design, evaluate in this order.

### 1. First impression

Does it immediately communicate **premium coconut FMCG**?

A world-class .CO page should read as editorial premium — not SaaS, not tech,
not luxury-fashion. Trust before luxury. Kerala origin before abstraction.

Pass only when the first scan communicates the brand's positioning without
a single word being read.

### 2. Composition

Evaluate:

- **Focal point.** The eye should land on one clear moment, not scatter across
  competing shapes.
- **Negative space.** Editorial compositions breathe. Crowded compositions read
  as dashboard.
- **Scale contrast.** Headlines and primary imagery must dominate; supporting
  elements recede.
- **Rhythm.** Repeated structural units should feel intentional, not templated.
- **Visual flow.** The eye should travel in a deliberate path from focal point
  through supporting elements to the CTA or next section.
- **Section transitions.** Hard borders between sections are a regression. The
  homepage sequence locks transitions to colour and media handoffs via the seven
  canonical transition tokens in `design-system`.

### 3. Typography

Evaluate:

- **Hierarchy.** Three clear levels: display, section headline, body. No guessing.
- **Readability.** Body copy within comfortable line length. Editorial quality,
  not display quality, for long-form text.
- **Editorial quality.** Headlines should feel authored — heavy and intentional
  or light and lyrical, not default. The .CO stack (Cormorant Garamond + Inter)
  is locked in `design-system`; do not propose a different font.
- **Line length.** Paragraphs should stay within comfortable reading measure.
- **Contrast.** Text-to-background contrast must meet WCAG AA floors per
  `design-system`.

The .CO typography values (size scale, weight range, tracking bands, line-height
ranges) are locked. Taste judgements refer to those locks, never override them.

### 4. Layout

Prefer:

- **Intentional asymmetry.** Offset margins, mixed aspect ratios, left-aligned
  headers over centred content.
- **Editorial layouts.** Flowing layouts that carry the story. Bento systems
  where structured grouping serves the narrative.
- **Layered depth.** Overlap, negative margins, varying z-space — not flat
  adjacency.
- **Immersive storytelling.** Sections that build on each other, not repeat.

Avoid:

- Generic SaaS dashboards (flat card grids, left sidebars, neutral grey
  backgrounds, pill-heavy UIs, metric tiles).
- Repeated cards as the only feature-row shape.
- Three-column marketing layouts as the default feature row.
- Predictable hero sections (centred headline, generic gradient background,
  two CTAs stacked, no editorial asset).
- AI-looking gradients (purple/blue mesh, oversaturated accents, pure black
  backgrounds with neon glow).

### 5. Brand coherence

Always respect:

- Kerala origin positioning.
- Coconut storytelling — origin, routine, sustainability.
- Premium FMCG positioning — trust before luxury, warmth before exclusivity.
- Approved brand assets — never approve a layout that requires fabricated or
  substituted imagery.

A layout that cannot be built with approved assets is a bad layout, not a
justification for new assets.

## .CO design overrides

These overrides are non-negotiable. They override generic taste rules.

**Never introduce:**

- Neon colours.
- Cyberpunk aesthetics.
- Dark SaaS themes.
- Crypto aesthetics.
- Generic glassmorphism without purpose.
- Excessive floating cards.
- Random gradients (gradients must create depth, edge integration, or legibility
  per `design-system`).

**Glass effects must support:**

- Material realism (warm brown / beige only; cool blue and Vision Pro white
  glass are prohibited per `design-system`).
- Depth (specular edge, soft shadow, saturation shift).
- Premium product presentation.

**Never approve:**

- Layouts that require AI-generated coconut, packaging, farm, or lifestyle
  imagery.
- Layouts that depend on regenerated packaging or screenshot-extracted product
  images.
- Layouts that invent new product identities.
- Layouts that replace existing visual language with generic trends.

## Image and asset judgement

When evaluating generated or proposed imagery:

**Check:**

- Physical realism (lighting, shadow direction, material behaviour).
- Lighting consistency with the surrounding scene.
- Product accuracy (coconut shape, husk texture, labelling).
- Packaging accuracy (approved master proportions, colours, labels — never
  regenerate, never screenshot-extract).
- Believable environments (Kerala coastal morning, green kitchen, night reset
  — the locked routine contexts in `brand-protection`).

**Reject:**

- Impossible physics.
- Altered packaging.
- AI artifacts (distorted product shapes, uncanny hands, warped labels).
- Fake materials (plastic-looking coconut, cartoonish textures).
- Unrealistic shadows (floating product with no contact plane, inconsistent
  light source).

## Interaction judgement

Coordinate with `motion-architecture` and `emilkowalski-motion`.

Do not define animation implementation. Only evaluate:

- **Does the interaction improve storytelling?** Motion that draws attention to
  the right thing, reveals content in narrative sequence, or acknowledges a user
  action passes. Motion that exists because it "looked cool" fails.
- **Does motion have purpose?** Valid purposes: hierarchy, storytelling, feedback,
  state transition. Invalid: novelty.
- **Does it distract?** If the motion draws the eye away from the focal point or
  CTA, it fails.

Motion that is not motivated is a regression regardless of how smooth it is.

## Anti-slop checklist

Before approving any frontend change, verify none of these are present:

- Purple/blue "AI gradient" aesthetic. The .CO palette is brown/green/beige;
  proposals outside those anchors require `DESIGN.md` amendment.
- Three equal card columns as the only feature-row shape. The .CO convention
  prefers editorial flow; bento systems where grouping serves the story.
- Generic glassmorphism on every surface. Glass is selective — navigation,
  receipt, selectors, routine controls only per `design-system`.
- Centred hero with generic gradient background and two stacked CTAs — the
  default AI landing-page shape.
- Oversaturated accent colours. The .CO palette is restrained; keep saturation
  below 80%.
- Pure `#000000` background or pure `#ffffff` surface. Use tinted variants from
  the locked palette.
- Monotonous sans-serif typography with no editorial display font. The .CO
  stack uses Cormorant Garamond for display; its absence is a regression.
- Flat sections with no depth signal. Prefer gradients and layered surfaces per
  `design-system` gradient rules.
- Generic icon sets (Lucide or Feather exclusively, cliché metaphors like
  rocketship for "Launch").
- Fake precise numbers (`99.99%`, `47.2×`) not backed by verified data.
- AI copywriting clichés ("Elevate", "Seamless", "Next-Gen", "Game-changer",
  "Delve", "Tapestry", "In the world of…").
- Exclamation marks in success messages. Be confident, not loud.

## Relationship to other skills

- `brand-protection`: this skill defers all brand-asset, packaging, imagery,
  and section-sequence rules to it. A layout that passes `frontend-taste` but
  fails `brand-protection` is rejected.
- `design-system`: this skill defers all palette, typography, spacing, radii,
  glass, gradient, responsive, and accessibility rules to it. Taste evaluations
  reference locked values, never override them.
- `motion-architecture`: this skill defers all library assignment, quality tier,
  parallax, choreography, and scroll-scrub rules to it. Motion evaluations
  reference locked values, never override them.
- `redesign-skill`: this skill consumes the fix-priority ordering from it. Taste
  is the last gate before a redesign is approved.
- `ui-ux-pro-max`: this skill defers UX analysis and layout critique to it.
  Taste complements UX — a page can be usable and still fail taste, and a page
  can pass taste and still have UX problems.
- `emilkowalski-motion`: this skill defers micro-interaction refinement to it.
  Taste judges whether the micro-interaction serves the story; `emilkowalski-motion`
  decides how it is implemented.
