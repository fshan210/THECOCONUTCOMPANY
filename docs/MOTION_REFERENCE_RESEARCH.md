# Motion Reference Research

Date: 23 July 2026

## Decision

.CO uses motion to explain origin, care and product transformation. It does not use motion as decoration. The system therefore keeps the existing Framer Motion, GSAP/ScrollTrigger and Lenis ownership boundaries, and adds Smooothy only to bounded editorial rails.

## Primary references

- [Smooothy extension guide](https://github.com/vallafederico/smooothy/blob/master/docs/extend.md): vertical mode, `parallaxValues`, time-based damping and speed-responsive effects.
- [Motion accessibility guidance](https://motion.dev/docs/react-accessibility): respect the platform reduced-motion preference and replace transform-heavy sequences with immediate content.
- [GSAP ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/): refresh after layout-affecting media and keep one scroll-transport owner.
- The supplied cursor and magnetic tutorials were used for pointer lerp, state targeting and bounded translation principles. Their presentation styles were not copied.

## Applied principles

1. One owner per transform. A Smooothy track owns track translation; nested media owns parallax; a separate wrapper owns magnetism.
2. Editorial restraint. Media parallax is clamped to 14px and magnetic movement to 4–8px.
3. Reversibility. The coconut story maps normalized scroll progress to deterministic frames, so reverse scrolling reverses the same sequence.
4. Input neutrality. Page scrolling remains Lenis-owned. The slider responds to direct drag and explicit controls, not wheel interception.
5. Native escape paths. Reduced motion uses native overflow; coarse pointers and inputs use the native cursor; the puzzle always uses its existing cursor contract.
6. Progressive loading. Only the viewport-specific poster and nearby sequence frames decode initially.

## UI UX Pro Max review

- The coconut story remains a compact editorial insert after PlanetBentoSection, not a fullscreen takeover.
- Text and media have separate hierarchy zones, preserving legibility at 360px and desktop scanning at 1440px.
- Controls retain 44px targets, visible focus and readable status text.
- No new palette, typography or spacing language was introduced.

## Magic UI review

Magic UI is limited to the existing `BlurFade` support treatment in the story panel. It is not the scroll engine and no sparkles, grids, particles or marquees were added.

## Post-implementation design review

The v3 frame sheet has continuous lighting, a concealed silhouette handoff and a locked final bottle. The Journal rail has one logical content set with restrained controls. The custom cursor is small enough not to obscure labels and disappears anywhere the native cursor is required.

