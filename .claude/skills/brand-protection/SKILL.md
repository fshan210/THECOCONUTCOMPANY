---
name: brand-protection
description: |
  Enforces .CO The Coconut Company brand locks before any visual change ships.
  Use when: editing homepage, section, or component visuals; adding, replacing, or
  sourcing assets; proposing colours, gradients, typography, video behaviour, packaging,
  or parallax changes; touching content that touches approved brand surfaces.
  Blocks: AI-generated brand imagery, regenerated packaging, stale fonts, hard scene
  cuts, unapproved media, cold glass, generic coconut stock, fabricated filler.
metadata:
  type: project
---

# Brand Protection — .CO The Coconut Company

## Purpose

Brand protection is a pre-change gate, not a post-change review. Run these checks
*before* editing files, not after. If a proposed change conflicts with any rule below,
the change must be redesigned or abandoned.

Authority: `DESIGN.md` > `DESIGN_SYSTEM.md` > `lib/motion/` > this skill.

## Approved brand assets

- Only assets with `approved: true` in `public/brand-reference/asset-manifest.json`
  may appear in production-facing homepage media.
- Source masters are read-only, outside deployable runtime media.
- Runtime derivatives must be deterministic, web-optimized, and resolved through the
  canonical media URL abstraction.
- Packaging proportions, labels, colour, logos, and printed copy may not be:
  regenerated, approximated, screenshot-extracted, or silently replaced by legacy packs.

## Locked homepage hero coconut

- The homepage hero coconut is the approved transparent master.
- Its orientation, fibres, colour, and proportions are locked.
- Its shadow is an independent two-layer CSS construction and must never be baked into
  the coconut image.
- Orbit motion is one continuous narrative device; it must reach zero opacity before
  the scraping film becomes visually dominant.

## Media and video rules

- Video masters remain untouched.
- Runtime delivery uses the canonical media abstraction with local and Vercel-preview
  fallback.
- Homepage video is ambient editorial media, not a visible rectangular player.
  Edge masks must blend into the surrounding brown field.
- Muted autoplay must have a poster.
- Scroll-scrub must use motion values and `requestAnimationFrame`, not continuous
  React state.
- The scraping film is one event inside the Hero scroll sequence:
  Hero clears → film enters full-bleed → playback reaches the safe final frame →
  that frame holds → only then may Origin enter.
- Mobile scraping media must be a real portrait runtime derivative from the approved
  master. When a crop would lose hands or scraping action, retain a sharp contained
  source frame over a blurred, darkened enlargement of that same frame.
  Letterboxed strips and fabricated filler are prohibited.
- Sustainability farm film autoplays muted, loops inline, pauses when off-screen,
  becomes its poster under reduced motion. Playback chrome and a visible rectangular
  media boundary are prohibited.

## Routine and origin packaging locks

- Routine backgrounds are product-free and city-specific.
  Current packaging appears only through approved independent DOM cutouts.
- Baked, obsolete, or generated packaging is prohibited.
- Routine environments are assigned by lived context: Kochi coastal morning,
  Bengaluru green kitchen, Dubai night reset. Packshots require a shared contact plane,
  scene-matched shadow, readable labels, and a concise human routine summary.
  Sticker-like or floating compositions are prohibited.
- Origin ends in a grounded everyday still-life: approved transparent packshots sit on
  a visible shared plane with contact shadows, varied scale, and restrained overlap.
  Ungrounded product arrays are prohibited outside selectors and commerce controls.
- Origin has one geometry source per viewport. Its muted base stroke, active stroke,
  and moving light all use the same SVG path data; the light position is derived with
  `getPointAtLength` from the same progress value. Decorative competing paths are
  prohibited.

## Prohibited imagery sources

Do not introduce any of the following as brand visuals:

- AI-generated coconut, packaging, farm, or lifestyle imagery.
- Generated staging passes, Canva thumbnails, preview screenshots used as source layers.
- Legacy or generated packaging fallback when the approved master is missing from view.
- Unsplash / Pexels / Pixabay / Openverse / Wikimedia Commons **for brand surfaces**
  (those sources are permitted only for non-brand texture/background per the
  `design-system` skill; homepage brand surfaces require approved masters).
- Synthetic coconut material, generic tropical still-life, or placeholder product images.

## Section continuity (locked)

The homepage section sequence is locked. Hard borders between major sections are
prohibited; transitions must read as colour and media handoffs.

Hero → scraping film → Origin → Receipt → Steal the Routine → testimonial ribbon →
Outside the Shelf → Recipes → Sustainability → Newsletter → Footer

Key continuity locks:

- Receipt hands directly into Routine.
- Routine cards carry the primary lower-homepage visual weight.
- Testimonial ribbon is a compact bridge, not a card-grid section.
- Outside the Shelf is one asymmetric cinematic reel with a five-position depth system
  (sharp dominant centre, softened near neighbours, distant far frames), 5.2 s cycle,
  pauses for hover / focus / touch / page-visibility / reduced motion.
- Recipes dissolve directly into the farm scene. A flat colour band or empty spacer
  between those sections is a regression.
- Sustainability farm film: see Media and video rules above.
- Lower-page brown space is purposeful and compact. Large empty brown holding areas,
  duplicated product grids, and standalone journal loops between locked sections are
  prohibited.
- The Global .CO Pulse must be truthful. In launch mode it says curated launch routines;
  only a future live mode backed by real anonymised order data may describe live commerce
  activity.

## Newsletter and footer lock

- Newsletter and footer share one deep-cocoa environment.
- Footer IA is locked: Products, Company, Support, Legal plus bottom utility content.
- Social links are shown only when their real destination is configured.

## Sustainability claims

- Currently operate in `simulation` mode for the 10,000-unit launch scenario.
  These are design-stage assumptions, not verified historical reporting.
- The canonical `sustainabilityImpact` object stores mode, basis units, calculation
  assumptions, disclosure, final values, and finite roll states.
- Production replacement requires reviewed source data and a switch to `verified` mode
  with its reporting/source period.
- Counters animate through finite, authored odometer states once per page session and
  then hold. Infinite loops, random increments, simulated live values, and silent CMS
  substitution are prohibited.
- Operating facts such as Phase 1 MOQ, preservative specification, and sourcing estimate
  must not be relabelled as verified impact outcomes.

## Brand-mark rules

- `.CO` and "The Coconut Company" are registered brand marks.
- Approved packaging, approved transparent packshots, and approved lifestyle imagery
  carry these marks through the asset manifest. No mark may be applied to a non-approved
  surface, fabricated source, or generic replacement asset.

## Pre-change gate

Before editing any file that touches brand-visible surfaces:

1. Confirm the change does not alter locked assets, packaging, or fonts.
2. Confirm new content respects the locked homepage section sequence.
3. Confirm no prohibited imagery source is introduced.
4. Confirm the change is additive or corrective in the direction DESIGN.md describes,
   not exploratory.
5. Flag anything outside the rules here for explicit DESIGN.md review before shipping.

## Relationship to other skills

- `design-system`: owns palette, typography, tokens, component conventions, motion
  system boundaries, and responsive/accessibility floors.
- `motion-architecture`: owns choreography values, quality-tier behaviour, parallax
  depths, and scroll synchronization.
- This skill: owns brand-asset locks, packaging/farm/routine/origin locks, prohibited
  imagery sources, continuity of the homepage sequence, and sustainability/Pulse truth.
