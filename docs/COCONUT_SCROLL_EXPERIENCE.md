# Coconut-to-bottle scroll experience

## Placement and composition

The experience renders immediately after `PlanetBentoSection`. It does not move or replace “Good for you, good for the planet.” Version 2 uses an editorial card rather than a full-screen takeover:

- 195svh mobile and 220svh desktop scroll range.
- Sticky content card with a maximum width of 1200px.
- Native 9:16 mobile media and 16:10 desktop media.
- Narrative copy on the left and the scroll-scrub canvas on the right at desktop widths.

## Skill-led implementation

- **UI UX Pro Max** is the design authority: existing cream, earth and leaf tokens remain unchanged; the story is subordinate to the surrounding homepage; typography, whitespace, 44px controls, explicit media dimensions and reduced-motion behavior are preserved.
- **Magic UI** contributes one restrained reusable `BlurFade` treatment for the section introduction. No particles, marquees, grids, sparkles or decorative motion were added.
- **Scroll World** owns the frame-locked media sequence, poster-first loading, device isolation, reversible scrub, native mobile exports and static fallback.

No reference image is uploaded externally and no paid generation is used. The local Sharp pipeline creates twelve controlled frames per viewport. A dense coconut-water veil fully conceals the endpoint handoff; the client never overlaps the coconut and bottle images, which removes the former ghost bottle. Finished bottle pixels always come directly from the approved final artwork.

## Asset pipeline

Generate locally:

```bash
node scripts/coconut-scroll/prepare-assets.mjs \
  "/absolute/path/to/opening.png" \
  "/absolute/path/to/final.png"
```

Validate dimensions and codecs:

```bash
bash scripts/coconut-scroll/verify-assets.sh
```

Outputs live under `public/experience/coconut-bottle/v2/`. `manifest.json` records source hashes, dimensions, output sizes and hashes. New art direction must use a new version directory rather than silently replacing a locked sequence.

## Runtime behavior

- The responsive poster is visible before JavaScript is ready.
- An IntersectionObserver starts loading only within 600px of the section.
- The browser loads only the chosen desktop or mobile sequence; both sets are never requested together.
- The canvas is capped at 1.5 DPR to control memory, resized without layout shift and updated through one animation-frame queue.
- Framer Motion supplies `useScroll`, `useSpring`, `useTransform`, `useMotionValueEvent` and `useReducedMotion`.
- Existing Lenis remains the single smooth-scroll transport. No parallel scroll engine was added.
- Reverse scrolling selects the same frame index in reverse.
- Reduced-motion users receive the final responsive still in the same editorial layout.

## Known limitation

Two endpoint photographs cannot produce a genuinely photoreal coconut crown separation or liquid fill without either intermediate photography or external generation. The no-credit implementation therefore uses a controlled seam, water flow and fully concealing water veil. It is artifact-free and brand-safe, but approved intermediate source frames would materially improve the physical opening choreography.
