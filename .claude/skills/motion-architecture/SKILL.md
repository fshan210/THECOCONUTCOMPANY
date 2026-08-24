---
name: motion-architecture
description: |
  Enforces the .CO The Coconut Company motion system — quality tiers, scroll
  choreography, parallax depths, component primitives, and animation assignment
  rules. Use when: adding or changing scroll-linked behaviour, parallax, page/section
  reveals, route transitions, scroll-scrub playback, header glass, ripples/magnetic/hover
  interactions, or motion-duration/easing values anywhere in the app.
  Reads from: lib/motion/ as the single source of truth. DESIGN.md locks motion values
  that must not be scattered.
metadata:
  type: project
---

# Motion Architecture — .CO The Coconut Company

## Source of truth

`lib/motion/` is the single source of truth for all motion values and policy.
Do not scatter homepage duration, easing, reveal, or parallax values across components.

| Module | Responsibility |
|---|---|
| `lib/motion/physics.ts` | Ease and spring constants |
| `lib/motion/quality.ts` | Device and reduced-motion quality policy |
| `lib/motion/choreography.ts` | Stagger and sequence timing |
| `lib/motion/presets.ts` | Reusable page, section, text, and image states |
| `lib/motion/diagnostics.ts` | Development event/state instrumentation |
| `lib/motion/scroll.ts` | Lenis/GSAP/ScrollTrigger synchronization |
| `lib/motion/reduced-motion.ts` | Reduced-motion policy (see below) |

## Quality tiers (system-wide)

| Tier | Behaviour |
|---|---|
| `full` | Page cover/reveal, text masks, parallax, micro-interactions, glass highlights |
| `reduced` | Shorter distances, no magnetic tracking, limited parallax, meaningful state transitions retained |
| `minimal` | Immediate readable content and essential state feedback only |

Base ease: `[0.16, 1, 0.3, 1]`. All page content has a visible resting state even when
JavaScript is delayed or reduced motion is requested.

## Reduced motion

- `prefers-reduced-motion: reduce` → quality tier `reduced`.
- `save-data` or equivalent connection hint → quality tier `minimal`.
- Disable Lenis smooth scrolling when reduced motion is active.
- Preserve the same information with stable compositions and poster/crossfade states.
- Parallax disabled. Marquees paused. Scroll-scrub → poster/crossfade.
- Decorative motion and imagery must not be required to understand or use the page.

## Motion library assignment (locked)

| Library | Owns | Must not own |
|---|---|---|
| Framer Motion | Popups, hover states, mobile menus, product cards, tab switching, route cover/reveal | Scroll-linked parallax, pinned storytelling |
| GSAP + ScrollTrigger | Counters, scroll reveals, parallax image movement, pinned product storytelling | Route cover, hover micro-interactions |
| Lenis | Smooth scrolling (one RAF loop) | Independent animation timelines |
| split-type | Text splitting for reveals | General DOM splitting |
| jquery.ripples | Branded water-ripple interactions | General effects |
| Smooothy | Secondary smooth-scroll fallback where Lenis is unavailable | Primary smooth scroll |
| Three.js | 3D scenes only (hero orbit, coconut) | UI animation |
| Embla Carousel | Carousel interactions | General slider behaviour |

**Rule**: Lenis is advanced by the GSAP ticker. ScrollTrigger receives each Lenis
update via the `scroll` event. Every listener/ticker callback is removed on unmount.
There is exactly one RAF loop — do not introduce a second.

## Parallax depths (three tiers only)

| Tier | Range | Examples |
|---|---|---|
| Background | 0.025 – 0.04 | Distant layers |
| Midground | 0.06 – 0.09 | Mid scene |
| Foreground | 0.10 – 0.14 | Near layers |

No other parallax values are permitted in production.

## Component primitives (do not duplicate)

- `PageReveal`, `SectionReveal`, `TextReveal`, `ImageReveal`, `StaggeredReveal`
- `ParallaxLayer`
- `WaterRipple`, `Magnetic`, `HoverLift`, `GlassHighlight`
- `CoconutLoader`, `RouteTransition`, `MotionDebugOverlay`

New page/section reveals must compose these primitives, not inline equivalent motion.

## Text and media reveal rules

- Text reveals: opacity + restrained vertical movement only.
- Media reveals: opacity + slight scale or clip only.
- Buttons: 160–220ms transitions.
- No bounce, elastic motion, large zoom, random card rotation, or identical reveals
  on every label.

## Header glass

- Low-opacity cream/green tint.
- `backdrop-filter` blur + saturation.
- One-pixel specular edge.
- Soft shadow.
- Preserves the existing Dynamic Island geometry.
- Content panels including the More Products surface retain their existing transparency;
  do not extend header glass to other surfaces.

## Route transitions

`MotionProvider` (single client-side owner) manages:

- Motion quality (`full` / `reduced` / `minimal`)
- Route phase (`idle` / `covering` / `navigating` / `revealing`)
- Internal navigation cover timing
- Branded pointer/click water ripples
- Optional diagnostics

`RouteTransition` reads that state inside `app/template.tsx`.
The persistent root layout hosts the header, providers, cart, and consent UI without
giving those elements competing transforms.

## Homepage choreography rules (from choreography.ts)

- `route.coverMs: 220` · `route.navigationTimeoutMs: 900` · `route.revealMs: 430`
- `text.wordStagger: 0.045` · `text.lineStagger: 0.075`
- `section.distance: 24` · `section.blur: 8` · `section.viewportAmount: 0.16`
- `homepage.lower.routine.cycleMs: 3300` · `pulseCycleMs: 3400` · `crossfadeSeconds: 0.55`
- `homepage.lower.outsideShelf.cycleMs: 5200` · `transitionSeconds: 1.15`
- Hero coconut: `yVh: -24` · `rotateDeg: 24` · `scale: 0.91`
- Hero coconut is physically paired with its anchored shadow; shadows fade, contract,
  soften, and separate modestly as the coconut rises.
- Origin uses one responsive SVG path per viewport. Base and active stroke share exact
  same path data; moving light derived from path geometry.

## Scroll-scrub and video rules

- Scroll-scrub must use motion values and `requestAnimationFrame`, not continuous
  React state.
- Scraping film sequence (hero scrape thresholds in `choreography.ts`):
  Hero clears → film enters full-bleed → playback reaches safe final frame →
  that frame holds → Origin enters. These thresholds are authored; do not move them
  without DESIGN.md amendment.

## About journey scroll

- Desktop: CSS-sticky progress story.
- Mobile / reduced motion: linear cards.
- Avoid a second transform controller on the same viewport.

## Prohibited motion patterns

- Bounce, elastic motion, large zoom, random card rotation.
- Identical reveals on every label.
- Noisy effects, particles, random bouncing, and unbounded parallax.
- Excessive translucent cards, abrupt content disappearance, hard scene cuts,
  gratuitous parallax.

## Relationship to other skills

- `design-system`: owns palette, typography, tokens, component conventions, and
  responsive/accessibility floors.
- `brand-protection`: owns brand-asset locks, homepage sequence locks, prohibited
  imagery sources, and sustainability truth.
- This skill: owns choreography values, quality-tier behaviour, parallax depths,
  scroll synchronization, and library assignment rules.
