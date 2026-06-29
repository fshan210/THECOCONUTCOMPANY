# Phase 4.5 Motion Tooling Audit

## Package audit before installation

Already installed before Phase 4.5:

- `framer-motion` — existing site motion and page transitions.
- `lucide-react` — existing icon library.

Missing before Phase 4.5 and approved for installation:

- `gsap`
- `lenis`
- `split-type`
- `embla-carousel-react`
- `clsx`
- `tailwind-merge`

Installed during Phase 4.5:

- `gsap` — future cinematic hero timelines and scroll-linked story scenes.
- `lenis` — future premium smooth scroll, only if reduced-motion and mobile rules allow it.
- `split-type` — future editorial text reveal preparation.
- `embla-carousel-react` — future product, recipe, or testimonial sliders.
- `clsx` — safer conditional class composition.
- `tailwind-merge` — safer Tailwind class conflict resolution.

Not installed:

- UI kits.
- Paid/proprietary packages.
- Copied animation templates.
- Unverified GitHub repos.
- Extra libraries that duplicate existing approved behavior.

## 21st.dev reference audit

21st.dev was inspected as an inspiration directory only. No components were installed or copied.

Useful reference areas:

- Buttons — for premium press, hover, and clarity patterns.
- Cards — for restrained interaction and bento/card organization ideas.
- Carousels — for future testimonial, recipe, or product sliders.
- Scroll Areas — for ideas around controlled long-form movement.
- Texts — for headline and label reveal references.
- Testimonials — for future review/social-proof presentation patterns.
- Heroes — for cinematic composition references only, not layout copying.

No specific 21st.dev component was selected for import in this phase.

Reason:

- The current `.CO` design system already defines the public visual language.
- Blindly importing a community component would risk mismatched typography, spacing, accessibility, and dependency choices.
- The next PR should adapt patterns into existing `.CO` primitives instead of replacing components.

## Utility files created

- `lib/motion/easings.ts`
- `lib/motion/reduced-motion.ts`
- `lib/motion/scroll.ts`
- `components/motion/TextReveal.tsx`
- `components/motion/ImageReveal.tsx`
- `components/motion/ScrollStory.tsx`
- `components/motion/MagneticButton.tsx`
- `components/motion/MotionMarquee.tsx`
- `components/motion/index.ts`

These files are intentionally not wired into public pages yet.

## Future dependency use rules

- Use `framer-motion` for React-native section/card/text/image reveals.
- Use `gsap` only where timeline sequencing or ScrollTrigger-level orchestration is genuinely needed.
- Use `lenis` only once globally, never inside every section.
- Use `split-type` only when CSS/React line-splitting cannot handle a headline cleanly.
- Use `embla-carousel-react` for sliders that require touch, keyboard, and responsive snapping.
- Always support reduced motion and simplified mobile behavior.

