# World-Class Motion Audit

## Diagnosis

The previous site did not lack animation declarations. It lacked reliable lifecycle ownership. Several executors could target the same element, route decoration did not own the navigation boundary, and browser-storage state could diverge during hydration. The result was motion that was technically present but visually cancelled, completed too early, or appeared inconsistent.

## Defect table

| Component | Expected motion | Actual result before Phase 4.3 | Root cause | Fix |
|---|---|---|---|---|
| Global page shell | Visible exit, bridge, and entry | Exit was barely or never perceived | Transition did not intercept navigation before unmount | Safe internal clicks now enter covering -> navigating -> revealing phases |
| Global reveals | Progressive section entry | Reveals could complete invisibly or be overwritten | Global observer competed with local Motion/GSAP transforms | Removed global executor; scoped primitives own transform/opacity |
| Header | Liquid tinted glass | Surface read as a milky opaque panel | Tint/blur/shadow recipe obscured the hero | Retained geometry and tuned translucent gradient, saturation, edge light and scroll tone |
| Loader | Recognisable coconut water fill | Abstract beige/white mark | Generic circular treatment and weak liquid cue | Coconut eyes, shell outline, clipped water fill, moving wave and status label |
| Lenis plus ScrollTrigger | Synchronized scroll-linked scenes | Potential timing drift and stale geometry | Independent updates and insufficient post-hydration refresh | GSAP ticker drives Lenis; Lenis updates ScrollTrigger; provider refreshes on route/image changes |
| About Journey | Inspectable staged story | Timeline advanced too quickly | Too little scroll distance and no deliberate active-stage hold | Desktop sticky 88vh per stage; mobile/reduced mode linear |
| Pure vs Processed | Brand interaction | Comparison peeler was no longer wanted | Obsolete interaction model | Replaced with reusable solvable puzzle |
| Mobile puzzle | 3x4 constrained board | 3x3 square | Engine assumed one square size | Rectangular `PuzzleGrid` model and crop calculation |
| Product configurator | No-flash variant transition | Rapid choices risked stale media commits | Image completion was not request-scoped | Incrementing request token and preloaded commit keep latest selection authoritative |
| Cart provider | Stable SSR/client header/cart | React hydration warning in browser | Initial client state read localStorage while server rendered empty state | Storage read moved to mount effect; persistence gated until hydrated |
| Diagnostics | Proof that motion is firing | No consolidated runtime evidence | State lived inside separate libraries | Development panel reports pathname, quality, route phase, Lenis, ScrollTrigger, and FPS |

## Engine ownership

- Framer Motion: state transitions, component entry/exit, layout springs, crossfades.
- GSAP/ScrollTrigger: existing explicit scroll timelines only.
- Lenis: scroll transport only.
- CSS: decorative ripple/wave and static surface styling.
- React: quality selection, route phase, preload sequencing, accessibility announcements.

## Motion tiers

- **Full:** route bridge, layout springs, parallax, sticky Journey, confetti and water ripple.
- **Reduced:** shorter component transitions, linear Journey, no decorative confetti.
- **Minimal:** immediate state/content replacement for Save-Data connections; no parallax.

## Known compatibility debt

Older stable components still import `lib/motion/easings.ts`, `lib/motion/reduced-motion.ts`, and `lib/animation/motion-constants.ts`. They are isolated compatibility paths and were not deleted blindly. A future migration can remove them only after all consumers use the Phase 4.3 tokens and the affected routes are visually reverified.

