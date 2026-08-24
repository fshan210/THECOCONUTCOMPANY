---
name: design-system
description: |
  Enforces the .CO The Coconut Company three-tier token system, colour/typography locks,
  spacing/radii rules, shadcn/ui composition, animation-system boundaries, responsive
  breakpoints, accessibility floors, glass/neumorphism conventions, and the asset
  pipeline. Operates under the authority of DESIGN.md (visual) → DESIGN_SYSTEM.md
  (foundation) → this skill (operational rules).
metadata:
  type: project
---

# Design System — .CO The Coconut Company

## Authority chain (highest → lowest)

1. `DESIGN.md` — canonical visual authority. Conflicting guidance in lower-priority
   sources always defers to DESIGN.md.
2. `DESIGN_SYSTEM.md` — Stage 1 token foundation and framework choices.
3. `lib/motion/` — motion values source of truth. Do not scatter parallax, duration,
   easing, reveal, or stagger values across components.
4. This skill — operational enforcement rules.

## Palette (locked)

- Deep environment brown `#381408` · primary brown `#612c17` · lifted brown `#7b381b`
- Reading beige `#f7f2e8` · light ivory `#fff7e9` · muted ivory `#f5dbbc`
- Brand green `#305a34` · deep green `#214d2b`

These six anchors plus the two ivories are the only background, text, and CTA colours.
New hex values require DESIGN.md amendment.

## Typography (locked)

- Editorial display: `--font-co-editorial` (Cormorant Garamond via `@fontsource/cormorant-garamond`).
  DESIGN_SYSTEM.md still references "Roboto / Instrument Serif" from an earlier draft —
  that text is stale; Cormorant Garamond + Inter is the shipped implementation and
  the source of truth.
- Interface and body: Inter via `@fontsource/inter`.
- Headlines may use italic serif emphasis.
- Labels use restrained uppercase tracking.
- Body stays compact, plain, and highly legible.

## Three-tier token flow

```
Primitive (raw values) → Semantic (named roles) → Component (consumed values)
```

- Primitives live in `styles/brand-tokens.css` and `tailwind.config.ts`.
- Semantic names describe role, not value (`bg-brand`, not `bg-brown-700`).
- Components consume semantic tokens only.
- New components must follow this chain; direct primitive use in JSX is a regression.

## Spacing, layout, and radii

- Use the existing spacing scale defined in `tailwind.config.ts` / `globals.css`.
- Major desktop sections breathe; mobile compositions are re-authored, not scaled.
- Editorial media and primary glass surfaces: 22–36px radii.
- Pills reserved for controls and compact CTAs only.
- One primary action per composition.
- Avoid repetitive card grids when a flowing editorial layout can carry the story.

## Glassmorphism and neumorphism (locked conventions)

- Liquid glass is selective: navigation, receipt, selectors, routine controls only.
- Brown scenes → warm brown glass. Reading scenes → beige glass.
- Never use cool blue or Vision Pro white glass.
- Neumorphism only for soft product category cards.
- Glass surfaces: `backdrop-filter` blur + saturation, one-pixel specular edge, soft shadow.

## Responsive and accessibility floors

- Validate at: 1440+, 1280, 1024, 768, 430, 390px.
- 44px minimum touch targets on interactive elements.
- Visible focus states and full keyboard operability.
- Safe-area spacing on mobile.
- WCAG AA contrast for functional copy and controls.
- Preserve reading order across all breakpoints.

## Reduced motion (system-level)

- Lenis smooth scrolling disabled when `prefers-reduced-motion: reduce`.
- Preserve the same information with stable compositions and poster/crossfade states.
- Decorative motion and imagery must not be required to understand or use the page.

## Component foundation

Skeleton components live in `components/foundation/` and must follow the
Class Variance Authority + `tailwind-merge` composition pattern:

- Header, Footer, Button
- GlassCard, NeumorphicCard
- BentoGrid, ProductCard, RecipeCard, FounderCard, JournalCard
- CounterStat, MoreProductsCloud, MobileDrawer
- SectionHeading, ImageBlendBlock

shadcn/ui primitives under `components/ui/` (`button.tsx` etc.) are the building blocks
for these foundation components. Do not bypass the CVA + `cn()` pattern.

## Named section-handoff transition tokens (CSS variables)

These seven variables are the **only** canonical homepage section-handoff gradients.
New anonymous gradient literals must not compete with them:

- `--transition-origin-receipt`
- `--transition-receipt-routine`
- `--transition-routine-outside`
- `--transition-outside-recipes`
- `--transition-recipes-impact`
- `--transition-impact-newsletter`
- `--transition-newsletter-footer`

## Gradient rules

- Gradients must create depth, edge integration, or legibility.
- Avoid decorative gradient noise and visible hard section seams.

## Asset pipeline

- `public/brand-reference/asset-manifest.json` — canonical source of truth; only
  `approved: true` entries may appear in production-facing homepage media.
- Source masters are read-only and live outside deployable runtime media.
- Runtime derivatives are deterministic, web-optimized, and resolved through the
  canonical media URL abstraction.
- Allowed external sources for new assets (must be recorded in `docs/assets-sources.md`):
  Unsplash, Pexels, Pixabay, Openverse, Wikimedia Commons.
- Optimization: sharp scripts, Squoosh, TinyPNG.
- Background removal: remove.bg, Canva background remover.
- Mockups: Mockupworld, Shots.so, Smartmockups free assets.

## Prohibited patterns

- Competing homepage implementations or version-suffixed component names.
- Direct CDN URL construction outside the media abstraction.
- Legacy or generated packaging fallback, Canva thumbnails, preview screenshots used
  as source layers, or AI substitutions for missing brand assets.
- Excessive translucent cards, abrupt content disappearance, hard scene cuts,
  gratuitous parallax, and production metrics or testimonials that have not been verified.

## Motion boundary

This skill owns system-level animation rules. Scene-specific motion values, quality-tier
behaviour, parallax depths, and scroll choreography belong in the
`motion-architecture` skill. Do not duplicate them here.

## Local references (not committed)

`.reference-downloads/shadergradient` and `.reference-downloads/open-design` are
reference material only. Do not paste external code into `.CO` without review.
