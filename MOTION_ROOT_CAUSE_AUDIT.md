# Phase 4.3 Motion Root-Cause Audit

## Outcome

The failure was architectural rather than a missing-animation problem. The repository had several motion executors competing for the same lifecycle and, in places, the same CSS transform.

## Confirmed root causes

| Finding | Runtime effect | Resolution |
|---|---|---|
| Two reduced-motion/quality decision paths | Normal devices could receive inconsistent distances and duration decisions | `MotionProvider` now owns quality; all primitives use `useMotionQuality()` |
| A global Web Animations observer plus component Framer Motion/GSAP reveals | Opacity and transforms could be written twice, finish before view, or be cleared during hydration | Removed `PremiumMotionSystem`; shared reveal primitives now have one transform owner |
| Route decoration mounted after navigation instead of owning the navigation boundary | Exit motion could not be perceived because the old route had already unmounted | `RouteTransition` intercepts safe internal navigation and drives cover, navigating, and reveal phases from `app/template.tsx` |
| Lenis and ScrollTrigger ran on independent clocks | Scrubbed scenes updated late and duplicated listeners after remounts | Lenis now runs from the GSAP ticker and explicitly updates ScrollTrigger with complete cleanup |
| Multiple reveal presets and local constants | Timing, easing, and reduced-motion behavior drifted between pages | Physics, quality, choreography, and presets are centralized under `lib/motion/` |
| Two header implementations used different glass recipes | The same page could look materially different between expanded and compact header states | Both header variants now share the same lower-opacity tinted liquid-glass recipe |
| Global `will-change`/long-running decorative work | Increased compositor memory and off-screen work | Transform hints are scoped to active transitions; decorative motion is quality-gated |

## Removed conflicting paths

- `components/motion/PremiumMotionSystem.tsx`
- `components/brand/PageTransition.tsx`

## Guardrails

- Framer Motion owns React state and component choreography.
- GSAP/ScrollTrigger owns only scroll-bound scrubbed sequences.
- Lenis owns smooth scrolling and is synchronized with the GSAP ticker.
- CSS keyframes are limited to self-contained decorative loader details.
- Reduced motion never leaves content hidden.
- Diagnostic state is opt-in and does not ship a visible production overlay by default.

## Structural evidence

The existing Graphify extraction was current for the starting commit and identified the duplicate motion communities and the shared quality hook as the highest-impact motion node. `graphify-out/` remains an uncommitted local analysis artifact.
