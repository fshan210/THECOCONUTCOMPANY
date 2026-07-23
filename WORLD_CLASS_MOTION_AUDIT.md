# World-Class Motion Audit

Date: 23 July 2026

## Result

The motion system now has explicit ownership boundaries: Lenis transports page scroll, ScrollTrigger measures scroll scenes, Framer Motion owns React state/transitions, Smooothy owns bounded slider tracks, and the canvas owns coconut frames. No two engines write transforms to the same element.

## Corrected issues

- Removed baked coconut/bottle double exposure by replacing v2 with seam-controlled v3 media.
- Matched lazy fallback and loaded coconut-section heights.
- Restored About Journey sticky behavior by replacing vertical overflow clipping and reducing the oversized 528vh reserve.
- Replaced the Journal rail's duplicate custom RAF with one Smooothy instance on the shared GSAP ticker.
- Added reduced-motion/native-scroll fallbacks, keyboard controls and cleanup.
- Added a desktop-only coconut cursor and bounded magnetic controls without React pointer-state churn.

## Restraint checks

- Parallax is capped at 14px.
- Magnetic movement is capped at 4px at its current use site.
- No decorative particles, animated grids or additional page-scroll engine.
- The puzzle, inputs and coarse-pointer experiences remain native.

## Measurement gate

Local browser QA is complete and recorded in `MOTION_VISUAL_QA.md`, including responsive source selection, forward/reverse scrub, About containment, Journal keyboard navigation, popup scroll locking and clean fresh-tab consoles. The remaining release gate is a Preview deployment smoke test followed by recording the deployed SHA; Safari remains a short manual compatibility check.
