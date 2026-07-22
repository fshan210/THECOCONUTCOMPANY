# Phase 4.3 Motion Implementation Map

Graph source: `graphify update . --force`, 20 July 2026. The refreshed structural graph contains 2,421 nodes, 4,001 edges, and 215 communities. This map is intentionally limited to the motion and interactive paths; the generated graph remains the broader structural source of truth.

## Current architecture

| Responsibility | Runtime owner | Primary files | Notes |
|---|---|---|---|
| Provider and route lifecycle | Framer Motion | `components/motion/MotionProvider.tsx`, `components/motion/RouteTransition.tsx`, `app/template.tsx` | One provider, one keyed App Router template boundary |
| Motion quality | React external store | `lib/motion/quality.ts` | Full, reduced, and minimal tiers; server snapshot is reduced-safe |
| Physics and choreography | Shared tokens | `lib/motion/physics.ts`, `lib/motion/choreography.ts`, `lib/motion/presets.ts` | Single easing/spring source for new Phase 4.3 primitives |
| Smooth-scroll transport | Lenis | `components/providers/LenisProvider.tsx`, `lib/motion/scroll.ts` | Lenis owns transport only; its RAF is integrated with GSAP ticker |
| ScrollTrigger registration | GSAP | `lib/animation/gsap-scrolltrigger.ts` | Registration is idempotent; provider refreshes after route/image changes |
| Component entry/exit | Framer Motion | `components/motion/*Reveal.tsx`, `HoverLift.tsx`, `Magnetic.tsx` | Transform and opacity ownership remains local to each primitive |
| Long-form journey | Framer Motion scroll values | `components/about/JourneyScrollStory.tsx` | Desktop sticky sequence; mobile/reduced mode is linear and unpinned |
| Puzzle | Framer Motion layout | `components/interactive/BrandSlidingPuzzle/*` | 4x4 desktop and 3x4 mobile, legal-move shuffle, keyboard controls |
| Configurator | React state plus Framer Motion | `components/shop/ProductConfigurator/*` | Data-derived availability, preloaded request-safe media crossfade |
| Cart hydration | React | `lib/cart/cart-context.tsx` | Client storage is read after mount to avoid SSR hydration divergence |
| Diagnostics | Development-only React overlay | `components/motion/MotionDebugOverlay.tsx`, `lib/motion/diagnostics.ts` | Route phase, quality, Lenis, ScrollTrigger and FPS evidence |

## Graph findings

- Motion is a bounded community rooted at `MotionProvider`, `lib/motion/index.ts`, and the reveal primitives rather than a site-wide god node.
- `Navigation`, `JourneyScrollStory`, `BrandSlidingPuzzle`, `ProductConfigurator`, and `CartDrawer` are high-coupling feature boundaries and must not share transform ownership.
- The legacy `lib/motion/easings.ts`, `lib/motion/reduced-motion.ts`, `lib/animation/motion-constants.ts`, `MagneticButton`, `MotionMarquee`, and `ScrollStory` remain referenced by older stable components. They are compatibility paths, not preferred APIs.
- `PremiumMotionSystem` and the previous brand `PageTransition` were dead/conflicting global executors and have been removed.
- App provider order is `CustomerAuthProvider -> CartProvider -> LenisProvider -> MotionProvider`, with `RouteTransition` mounted in `app/template.tsx`. This keeps authentication/cart state persistent while route content remounts.

## Broken execution paths and remediation

| Path | Previous fault | Remediation |
|---|---|---|
| Global reveals | A global observer and local Motion/GSAP components could both write opacity/transform | Removed the global executor; reveal primitives now own their elements |
| Route exit | Decorative transition mounted after navigation and could not cover the old route | Provider intercepts safe internal links, covers, navigates, then reveals |
| Lenis and ScrollTrigger | Independent RAF/update paths could drift | Lenis scroll events call `ScrollTrigger.update`; GSAP ticker drives Lenis RAF |
| Hydration and cart badge | Local storage was read during initial client render but not server render | Cart now hydrates storage after mount and delays persistence until hydrated |
| Puzzle mobile layout | Square 3x3 board did not match the required constrained layout | Engine and renderer now support a rectangular 3x4 grid |
| Scroll measurements | Route/image hydration could leave trigger geometry stale | Provider refreshes ScrollTrigger after route and captured image load events |

## Keep, replace, deprecate

Keep:

- `MotionProvider`, `RouteTransition`, `CoconutLoader`
- `PageReveal`, `SectionReveal`, `TextReveal`, `ImageReveal`, `ParallaxLayer`
- `JourneyScrollStory`, `BrandSlidingPuzzle`, `ProductConfigurator`
- `lib/motion/{physics,choreography,presets,quality,scroll,diagnostics}.ts`

Replace completed:

- old global Web Animations observer -> scoped Motion primitives
- old decorative page transition -> route lifecycle transition
- Pure vs Processed peeler -> brand sliding puzzle
- unsupported impact claims -> CMS-backed operating facts

Deprecated compatibility paths:

- `lib/motion/easings.ts`
- `lib/motion/reduced-motion.ts`
- `lib/animation/motion-constants.ts`
- `components/motion/{MagneticButton,MotionMarquee,ScrollStory}.tsx`

They should be removed only in a later import-migration commit after their consumers are converted and browser-tested.

## Migration order and regression risks

1. Preserve provider order and App Router template ownership.
2. Migrate compatibility consumers one surface at a time to shared physics.
3. Never apply GSAP and Framer Motion transforms to the same element.
4. Refresh ScrollTrigger only after route/image geometry changes.
5. Validate the full/reduced/minimal paths independently.
6. Re-run hydration checks whenever state begins in browser storage.

Main risks: intercepted links that should bypass transitions, sticky journey release on short landscape viewports, stale configurator preload completion during rapid changes, and interactive controls placed inside overflow-hidden animated surfaces.

