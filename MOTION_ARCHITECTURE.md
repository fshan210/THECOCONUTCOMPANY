# Phase 4.3 Motion Architecture

## Runtime ownership

`MotionProvider` is the single client-side owner of:

- motion quality (`full`, `reduced`, `minimal`)
- route phase (`idle`, `covering`, `navigating`, `revealing`)
- internal navigation cover timing
- branded pointer/click water ripples
- optional diagnostics

`RouteTransition` reads that state inside `app/template.tsx`. The persistent root layout hosts the header, providers, cart and consent UI without giving those elements competing transforms.

## Shared foundation

| Module | Responsibility |
|---|---|
| `lib/motion/physics.ts` | Ease and spring constants |
| `lib/motion/quality.ts` | Device and reduced-motion quality policy |
| `lib/motion/choreography.ts` | Stagger and sequence timing |
| `lib/motion/presets.ts` | Reusable page, section, text, and image states |
| `lib/motion/diagnostics.ts` | Development event/state instrumentation |
| `lib/motion/scroll.ts` | Lenis/GSAP/ScrollTrigger synchronization |

## Component primitives

- `PageReveal`, `SectionReveal`, `TextReveal`, `ImageReveal`, `StaggeredReveal`
- `ParallaxLayer`
- `WaterRipple`, `Magnetic`, `HoverLift`, `GlassHighlight`
- `CoconutLoader`, `RouteTransition`, `MotionDebugOverlay`

## Quality behavior

| Tier | Behavior |
|---|---|
| Full | Page cover/reveal, text masks, parallax, micro-interactions and glass highlights |
| Reduced | Shorter distances, no magnetic tracking, limited parallax, meaningful state transitions retained |
| Minimal | Immediate readable content and essential state feedback only |

The base ease is `[0.16, 1, 0.3, 1]`. All page content has a visible resting state even when JavaScript is delayed or reduced motion is requested.

## Scroll choreography

Lenis is advanced by the GSAP ticker. ScrollTrigger receives each Lenis update and every listener/ticker callback is removed on unmount. The About journey uses a CSS-sticky progress story on desktop and linear cards on mobile/reduced motion, avoiding a second transform controller.

## Header glass

Only the global header recipes changed. Content panels, including the More Products surface, retain their existing transparency. The header uses a low-opacity cream/green tint, `backdrop-filter` blur/saturation, a one-pixel specular edge, and a soft shadow while preserving the existing Dynamic Island geometry.

## Reference basis

Implementation follows the core separation recommended by Motion (React state choreography), GSAP ScrollTrigger (scroll-bound scenes), Lenis (smooth scrolling), and the platform reduced-motion preference. No additional runtime animation library was introduced.
