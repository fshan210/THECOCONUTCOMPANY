# Coconut-to-bottle scroll experience

## Placement

The experience renders immediately after `PlanetBentoSection` on the homepage. It leaves the existing “Good for you, good for the planet.” composition intact.

## Skill-led implementation decision

- UI UX Pro Max: preserves the existing cream, earth and leaf palette; keeps one cinematic focal action; provides a short glass narrative card; uses explicit dimensions, accessible copy and 44px controls.
- Magic UI: contributes only the supporting glass/blur treatment. No particles, marquees, animated grids or decorative effects were added.
- Scroll World: owns the viewport-specific media pipeline, frame-locked endpoints, long pinned scroll range, reversible progress mapping, posters and reduced-motion fallback.

The full Scroll World video workflow would require uploading the references to an external paid generation provider. That conflicts with the task’s safety constraints. The implementation therefore uses Scroll World’s supported still/poster fallback architecture: the two locked source frames are locally composed into versioned desktop and native 9:16 mobile outputs, and Framer Motion maps reversible scroll progress between them. The final bottle image is never transformed internally or regenerated, so its logo, label, cap and kraft tag remain pixel-stable.

## Asset pipeline

Generate assets locally:

```bash
node scripts/coconut-scroll/prepare-assets.mjs \
  "/absolute/path/to/opening.png" \
  "/absolute/path/to/final.png"
```

Validate dimensions and codecs through FFmpeg:

```bash
bash scripts/coconut-scroll/verify-assets.sh
```

Outputs live under `public/experience/coconut-bottle/v1/`. `manifest.json` records source hashes, dimensions, output sizes and output hashes. Changing the look requires a new version directory rather than overwriting the locked endpoints.

## Runtime behavior

- Mobile downloads only the 720×1280 AVIF/JPEG source selected by `<picture>`.
- Desktop downloads only the 1440×900 source.
- Media is lazy decoded because the section is below the fold.
- The pinned section has a deterministic responsive height, including while its code chunk loads.
- Framer Motion supplies `useScroll`, `useTransform`, `useSpring`, `useMotionValueEvent` and `useReducedMotion`.
- Existing Lenis remains the site-wide scroll transport. No competing listener or second scroll engine was added.
- Reduced-motion users receive the final static responsive frame.

## Known limitation

With only the two approved endpoint frames and no external/paid generation, the coconut opening and water transfer are deliberately abstracted as a restrained crown lift, water stream and cross-dissolve. A photoreal frame-by-frame opening would require approved intermediate photography or locally supplied video frames.
