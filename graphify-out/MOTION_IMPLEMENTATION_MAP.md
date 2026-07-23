# Phase 4.3 Motion Implementation Map

Graph source: `graphify . --update --no-viz`, 23 July 2026. Structural and AST extraction completed; the optional Bedrock semantic pass was unavailable because the configured model identifier is not valid in the configured region. This map therefore uses the refreshed structural graph, targeted source inspection, and browser evidence. It is intentionally limited to the motion and interactive paths; the generated graph remains the broader structural source of truth.

## Current architecture

| Responsibility | Runtime owner | Primary files | Notes |
|---|---|---|---|
| Provider and route lifecycle | Framer Motion | `components/motion/MotionProvider.tsx`, `components/motion/RouteTransition.tsx`, `app/template.tsx` | One provider, one keyed App Router template boundary |
| Motion quality | React external store | `lib/motion/quality.ts` | Full, reduced, and minimal tiers; server snapshot is reduced-safe |
| Physics and choreography | Shared tokens | `lib/motion/physics.ts`, `lib/motion/choreography.ts`, `lib/motion/presets.ts` | Single easing/spring source for new Phase 4.3 primitives |
| Smooth-scroll transport | Lenis | `components/providers/LenisProvider.tsx`, `lib/motion/scroll.ts` | Lenis owns transport only; its RAF is integrated with GSAP ticker |
| ScrollTrigger registration | GSAP | `lib/animation/gsap-scrolltrigger.ts` | Registration is idempotent; provider refreshes after route/image changes |
| Component entry/exit | Framer Motion | `components/motion/*Reveal.tsx`, `HoverLift.tsx`, `Magnetic.tsx` | Transform and opacity ownership remains local to each primitive |
| Long-form journey | Framer Motion scroll values | `components/about/JourneyScrollStory.tsx` | Desktop sticky sequence; mobile/reduced mode is linear and unpinned. The sticky owner must not sit below a vertical-overflow clipping ancestor. |
| Coconut scroll story | Framer Motion progress + canvas media | `components/experience/CoconutBottleScroll.tsx`, `CoconutFrameSequence.tsx`, `lib/experience/coconut-scroll-config.ts` | Framer owns scroll progress and editorial state; the canvas owns frame drawing; Scroll World owns media continuity and endpoint locking. |
| Momentum sliders | Smooothy + shared GSAP ticker | `components/sliders/*` | Slider track position only. Nested media owns parallax; magnetic and hover transforms must use separate wrappers. |
| Custom pointer | DOM refs + one pointer listener | `components/motion/CoconutCursor.tsx` | Desktop precise pointers only; native cursor remains authoritative for inputs, the puzzle, reduced motion and coarse pointers. |
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
- `ReferenceAboutPage` currently uses `overflow-hidden` on the route root. That clips horizontal overflow but also creates a non-visible vertical overflow ancestor, preventing the desktop Journey sticky child from sticking. The section still reserves 528vh, which renders as a large dead zone after the first sticky-sized panel.
- The coconut canvas performs discrete nearest-frame drawing and does not blend frames. The visible coconut/bottle double exposure is therefore baked into the v2 frames, not caused by canvas opacity or Framer Motion.
- The homepage dynamic fallback reserves 300/360svh while the loaded coconut section reserves 195/220svh. The mismatch creates a large avoidable layout shift during lazy module resolution.
- `components/motion/Magnetic.tsx` is a minimal hover translation compatibility primitive. It lacks coarse-pointer, reduced-motion, radius, rotation and bounded distance handling required by the current magnetic specification.
- Journal community posts and recipe review rails use separate native/Framer drag implementations. They are the safest initial Smooothy adoption surfaces because they are bounded feature rails, not page-scroll owners.

## Broken execution paths and remediation

| Path | Previous fault | Remediation |
|---|---|---|
| Global reveals | A global observer and local Motion/GSAP components could both write opacity/transform | Removed the global executor; reveal primitives now own their elements |
| Route exit | Decorative transition mounted after navigation and could not cover the old route | Provider intercepts safe internal links, covers, navigates, then reveals |
| Lenis and ScrollTrigger | Independent RAF/update paths could drift | Lenis scroll events call `ScrollTrigger.update`; GSAP ticker drives Lenis RAF |
| Hydration and cart badge | Local storage was read during initial client render but not server render | Cart now hydrates storage after mount and delays persistence until hydrated |
| Puzzle mobile layout | Square 3x3 board did not match the required constrained layout | Engine and renderer now support a rectangular 3x4 grid |
| Scroll measurements | Route/image hydration could leave trigger geometry stale | Provider refreshes ScrollTrigger after route and captured image load events |
| About Journey dead zone | Route root `overflow-hidden` breaks sticky positioning while the Journey section still reserves 528vh | Use horizontal-only clipping, a header-aware sticky top, and an inspectable but shorter desktop scroll range; keep mobile in native document flow |
| Coconut ghost frames | v2 asset generator crossfades unrelated coconut and bottle sources beneath a bright veil | Generate a v3 seam-controlled sequence from locked endpoints and continuity keyframes; never crossfade coconut and bottle silhouettes directly |
| Coconut lazy fallback | Dynamic placeholder height exceeds the loaded section by 105–140svh | Match fallback height exactly to the loaded section and use the same reduced-motion-safe poster treatment |
| Slider RAF ownership | A Smooothy instance can create a second update loop if integrated naively | Register one bound update callback with the existing GSAP ticker and always remove it during cleanup |
| Cursor event pressure | React state on pointermove would rerender the app | Use motion values/refs, one global pointer listener and no per-frame React state |

## Sticky geometry audit: About Journey

- Route: `/about`
- Route file: `app/about/page.tsx`, rendering `components/about/ReferenceAboutPage.tsx`
- Journey owner: `components/about/JourneyScrollStory.tsx`
- Gap-producing element: the desktop Journey `<section>` with inline height `6 * 88vh = 528vh`
- Sticky breaker: the route root's `overflow-hidden`, which computes a non-visible overflow mode for the vertical axis and becomes the sticky containing block
- Visible consequence: roughly 4.28 viewport heights remain after the first viewport-sized Journey panel instead of being consumed by sticky stage progression
- Required scroll distance: yes, deliberate stage reading distance remains necessary; 528vh plus a broken sticky context is not necessary
- Correct fix: change the route root to horizontal-only clipping, use a header-aware sticky top/min-height, and reduce the desktop stage distance to a compact editorial range. Mobile/reduced motion remains unpinned.

## Coconut sequence audit

- v2 frame count: 12 per viewport, AVIF plus JPEG fallback
- Playback: nearest decoded frame on a canvas, capped at 1.5 DPR, no canvas blending
- Defect: frames 4–9 contain bright fog and simultaneous coconut/bottle silhouettes baked by the old asset builder
- Endpoint rule: supplied whole-coconut first frame and approved bottle final frame remain authoritative and are never regenerated
- v3 plan: 18 frames using locked start/final masters, two continuity keyframes for opening/water action, and a high-opacity water veil around a hard silhouette handoff. The final bottle pixels remain sourced only from the approved artwork.

## Integration locations

- Smooothy: `components/sliders/*`, initially on the Journal community rail and one editorial recipe/product rail only after browser validation
- Cursor: provider mounted beside `MotionProvider` content but outside transformed route content; implementation in `components/motion/CoconutCursor.tsx`
- Magnetic: enhanced bounded primitive in `components/motion/Magnetic.tsx`, currently used by Smooothy gallery controls
- Scroll World: `scripts/coconut-scroll/prepare-assets-v3.mjs`, `public/experience/coconut-bottle/v3/*`, `components/experience/*`
- Highest risk: global link interception in `MotionProvider`, sticky containment on `/about`, slider link modifier semantics, and media memory on mobile

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
