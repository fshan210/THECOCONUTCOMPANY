# Coconut Scroll Experience

## Placement and ownership

The section is rendered immediately after `PlanetBentoSection` on the homepage. Framer Motion maps section progress to stage copy and frame selection. A canvas draws decoded frames. Scroll World owns the local media pipeline and seam policy. Lenis remains the only page-scroll transport.

## Locked endpoints and generation

- First endpoint: supplied whole green coconut reference.
- Final endpoint: supplied approved .CO bottle reference.
- Intermediate plates: two controlled, locally supplied image-generation results for opening and split/water states.
- Encoding: local Sharp pipeline only; no paid service and no external brand-asset upload.

The final bottle is never regenerated. Frames 15–17 are identical encodes of the approved final artwork. Coconut and bottle silhouettes are never directly crossfaded: a high-opacity water veil and an object-free bridge separate the handoff.

## Output

- Version: v3
- Desktop: 18 AVIF frames at 1440×900 plus JPEG fallback.
- Mobile: 18 AVIF frames at 720×1280 plus JPEG fallback.
- Production manifest: `public/experience/coconut-bottle/v3/manifest.json`
- Rebuild script: `scripts/coconut-scroll/prepare-assets-v3.mjs`

Mobile is a native 9:16 cover, not a desktop crop. The browser loads only the matching source set. The poster and current ±2 frames are decoded initially; further frames accumulate as the visitor scrolls.

## Layout and fallback

The story uses 195svh on mobile and 220svh on desktop with a header-aware sticky editorial card. The dynamic-module fallback reserves those exact heights, removing the previous 105–140svh mismatch. Reduced motion renders the existing static fallback rather than a scrub sequence.

## Reverse behavior

Progress maps directly to `round(progress * 17)`. No autoplay state exists, so reverse scroll requests the same frames in reverse. The nearest decoded frame is retained while an adjacent frame loads, preventing blank flashes.
