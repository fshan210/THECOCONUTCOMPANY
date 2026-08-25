---
name: emilkowalski-motion
description: |
  Port of Emil Kowalski's motion-design guidance for .CO The Coconut Company.
  Provides micro-interaction taste, timing/easing principles, hover state
  refinement, and intentional page motion. Use AFTER a design artifact
  already exists. Subordinate to motion-architecture.
triggers:
  - "emil kowalski"
  - "motion polish"
  - "micro interaction"
  - "interaction animation"
  - "tasteful animation"
  - "动效润色"
  - "refine transitions"
  - "hover polish"
metadata:
  type: project
  skill_version: "0.1.0-claude"
  source: ".reference-downloads/open-design/skills/emilkowalski-motion/SKILL.md"
  upstream: "https://emilkowal.ski/skill"
---

# Emil Kowalski Motion — .CO The Coconut Company

## Purpose

Adds tasteful micro-interactions, state transitions, and page motion with
product-grade restraint. Use AFTER an interface, component, or section
already exists. The goal is to make the interface feel alive without
turning it into a motion demo.

## Source

Derived from the Open Design emilkowalski-motion skill by Emil Kowalski.

## When to activate

Use when:
- Polishing an existing component, section, or page
- Adding hover / active / focus feedback to controls
- Adding entry reveals for primary content
- Smoothing state transitions
- Adding scroll reveals (only when they help the story)
- Refining transitions between UI states

Do NOT use for:
- Greenfield motion architecture (→ motion-architecture)
- Scroll-linked parallax, pinned storytelling (→ motion-architecture)
- Brand animation, route cover/reveal (→ motion-architecture)
- Motion without an existing artifact to polish
- Motion for motion's sake

## Motion-stack hierarchy

```
brand-protection  >  design-system  >  motion-architecture  >  emilkowalski-motion
```

This block describes only the motion-specific relationship. The full project
authority hierarchy is the canonical 8-tier chain:

1. `brand-protection`
2. `design-system`
3. `motion-architecture`
4. `graphify`
5. `ui-ux-pro-max`
6. `frontend-taste`
7. `emilkowalski-motion` (this skill, tier 7)
8. `redesign-skill`

`emilkowalski-motion` must obey every higher tier, including `frontend-taste`
where visual judgement is involved and all tiers above it.

This skill is subordinate to `motion-architecture`. When timing, easing,
library assignment, or quality-tier guidance conflicts with
`motion-architecture`, defer to `motion-architecture`.

## Project override rules

1. **Motion must support storytelling.** Every animation must have a
   narrative purpose: guide attention, confirm state, reveal structure.
   Movement without meaning is noise.
2. **No animation without purpose.** If removing an animation doesn't
   reduce clarity, the animation is excessive.
3. **Respect reduced motion.** `prefers-reduced-motion: reduce` → honour
   it fully. motion-architecture's reduced-motion policy governs the
   exact behaviour (quality tier `reduced` / `minimal`, Lenis disabled,
   scroll-scrub → poster/crossfade).
4. **Preserve existing GSAP/Framer architecture.** Do not introduce new
   animation libraries. Use Framer Motion for component-state / hover /
   route transitions; use GSAP + ScrollTrigger for sequencing /
   scroll-linked reveals — exactly as motion-architecture prescribes.
5. **Avoid excessive effects.** No custom cursors, noisy particle effects,
   motion that competes with content, or endless decorative loops.

## Motion rules

Quick controls (buttons, links, cards, toggles): **140–220ms**.
Larger page reveals: slower, but must not block reading.

Base ease (from motion-architecture): `cubic-bezier(0.16, 1, 0.3, 1)`.

Additional rules:
- Never animate from `scale(0)`. Start at `scale(0.9)` or higher with
  `opacity: 0`.
- Prefer `transform` and `opacity`. Do NOT animate layout properties
  (`top`, `left`, `width`, `height`).
- One motion language per artifact. Do not mix unrelated easings,
  durations, or physics.
- Stagger only small groups. Long staggered lists feel slow.
- No endless decorative loops unless they communicate status or progress.
- No custom cursors, noisy particles, or motion that competes with content.

## Claude-native workflow

1. **Inspect before adding.** Look at the actual component, section, or
   page before proposing motion. Do not add motion from a brief alone.
2. **Pick the smallest motion set that clarifies state or hierarchy:**
   - entry reveal for primary content
   - hover / active feedback for important controls
   - transition between UI states
   - scroll reveal only when it helps the story
3. **Stay within the project's motion stack:**
   - Framer Motion → popups, hover states, mobile menus, product cards,
     tab switching, route cover/reveal
   - GSAP + ScrollTrigger → counters, scroll reveals, parallax image
     movement, pinned product storytelling
   - Lenis → smooth scrolling (one RAF loop)
   - Never add a new library.
4. **Always clean up.** Observers, timers, and animation instances must
   be cleaned up on unmount.
5. **Add `prefers-reduced-motion` fallbacks** for any automatic or
   scroll-linked motion. Follow motion-architecture's reduced-motion policy.
6. **Keep layout intent intact** unless the user explicitly asks for a
   redesign. Motion enhances; it does not restructure.

## Upstream install path (if user wants full feature set)

If the user wants the full upstream Emil Kowalski motion skill with
additional templates, HTML artifacts, and micro-interaction libraries:

1. Install upstream: https://emilkowal.ski/skill
2. Place the skill files in a skills directory Claude can invoke.
3. Invoke via trigger phrase or direct skill invocation.
4. This .CO skill remains active as the project override layer that
   prevents excessive motion from being applied to .CO surfaces.
