# Motion Reference Research

Research date: 20 July 2026. Only interaction principles were adopted; no proprietary code, layout, or artwork was copied.

| Reference | Observed principle | Original .CO interpretation | Implementation | Performance effect |
|---|---|---|---|---|
| [Apple HIG: Motion](https://developer.apple.com/design/human-interface-guidelines/motion) | Motion should preserve continuity, clarify state, and respect reduced-motion preferences | Route cover/reveal and product crossfades explain what changed without rearranging the approved design | `MotionProvider`, `RouteTransition`, quality tiers | Mostly transform/opacity; minimal tier removes decorative motion |
| [Motion: scroll animation](https://motion.dev/docs/react-scroll-animations) | Separate scroll-triggered entry from scroll-linked progress; use target-relative progress for parallax | One-time section reveals use `whileInView`; parallax and Journey use `useScroll` | Reveal primitives, `ParallaxLayer`, `JourneyScrollStory` | Pooled observers and bounded motion values; no permanent RAF per section |
| [Motion: reduce bundle size](https://motion.dev/docs/react-reduce-bundle-size) | Tree shaking helps, while LazyMotion can defer feature loading when adopted consistently | Keep imports narrow now; defer a full `LazyMotion` migration until legacy `motion` imports are removed | Recorded as a later bundle task, not mixed into this behavioral release | Avoids a risky partial migration that would duplicate feature loading |
| [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) | Refresh geometry after layout changes and clean triggers when their scope unmounts | Route/image completion refreshes ScrollTrigger; long-form ownership stays explicit | `MotionProvider`, `gsap-scrolltrigger.ts` | Refresh is event-driven, not per-frame |
| [Lenis](https://www.lenis.dev/) | Smooth scrolling should be transport, not a second animation authoring system | Lenis advances scroll and notifies ScrollTrigger; it does not animate components | `LenisProvider`, `lib/motion/scroll.ts` | One managed RAF path with teardown |
| Premium product navigation patterns | Tinted glass succeeds when content remains perceptible and the edge highlight is restrained | Existing Dynamic Island geometry retained; only tint, saturation, edge light and scroll tone were refined | `Navigation.tsx`, global glass tokens | Backdrop filtering limited to the navigation surface |
| Editorial product storytelling | Progress is readable when each scene holds long enough and non-active scenes recede | Six Journey stages receive 88vh of desktop progress each; mobile stays linear | `JourneyScrollStory.tsx` | Desktop-only sticky composition, no mobile wheel hijack |

## Rejected patterns

- No generic Material ripple: the .CO ripple is elliptical, refractive, short-lived, and pointer-origin based.
- No global scroll hijacking or wheel interception.
- No multiple animation engines writing the same transform.
- No long loader delay inserted merely to display animation.
- No broad `will-change` declarations that remain active after animation.

