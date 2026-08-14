# .CO Design Authority

This file is the canonical visual authority for The Coconut Company website. Reference boards and Canva designs define composition; this document defines how that direction becomes a coherent, accessible web system.

## Brand principles

- Rooted, warm, editorial, and useful. Premium must come from material honesty and restraint, not ornamental luxury.
- Brown is the continuous environmental field; beige carries reading surfaces; green signals cultivation, care, and action.
- Real approved packaging, farms, people, and coconut material always outrank generic or generated imagery.

## Colour and surfaces

- Deep environment brown: `#381408`; primary brown: `#612c17`; lifted brown: `#7b381b`.
- Reading beige: `#f7f2e8`; light ivory: `#fff7e9`; muted ivory: `#f5dbbc`.
- Brand green: `#305a34`; deep green: `#214d2b`.
- Liquid glass is selective: navigation, receipt, selectors, and routine controls only. Brown scenes use warm brown glass; reading scenes use beige glass. Never use cool blue or white Vision Pro styling.
- Gradients must create depth, edge integration, or legibility. Avoid decorative gradient noise and visible hard section seams.

## Typography

- Editorial display: the project editorial serif (`--font-co-editorial` / Cormorant Garamond fallback).
- Interface and body: the project sans (`Inter` fallback).
- Headlines may use italic serif emphasis. Labels use restrained uppercase tracking. Body copy stays compact, plain, and highly legible.

## Layout, spacing, and radii

- Use the existing spacing scale. Major desktop sections breathe; mobile compositions are re-authored rather than scaled down.
- Editorial media and primary glass surfaces use 22–36px radii. Pills are reserved for controls and compact CTAs.
- Keep one primary action per composition. Avoid repetitive card grids when a flowing editorial layout can carry the story.

## Photography and packaging lock

- Only assets marked `approved: true` in `public/brand-reference/asset-manifest.json` may appear in production-facing homepage media.
- Source masters are read-only and live outside deployable runtime media. Runtime derivatives must be deterministic, web-optimised, and resolved through the canonical media URL abstraction.
- Packaging proportions, labels, colour, logos, and printed copy may not be regenerated, approximated, screenshot-extracted, or silently replaced by legacy packs.
- The homepage hero coconut is the approved transparent master. Its orientation, fibres, colour, and proportions are locked. Its shadow is an independent two-layer CSS construction and must never be baked into the coconut.

## Video behaviour

- Video masters remain untouched. Runtime delivery uses the canonical media abstraction with local and Vercel-preview fallback.
- Homepage video is ambient editorial media, not a visible rectangular player. Edge masks must blend into the surrounding brown field.
- Muted autoplay must have a poster; scroll-scrub must use motion values and `requestAnimationFrame`, not continuous React state.
- The scraping film is one event inside the Hero scroll sequence: Hero clears, the film enters full-bleed, playback reaches the safe final frame, that frame holds, and only then may Origin enter.
- Mobile scraping media must be a real portrait runtime derivative from the approved master. When a crop would lose the hands or scraping action, retain a sharp contained source frame over a blurred, darkened enlargement of that same frame. Letterboxed strips and fabricated filler are prohibited.

## Motion and parallax

- `lib/motion/choreography.ts` is the central motion configuration. Do not scatter arbitrary homepage duration, easing, reveal, or parallax values.
- Text reveals use opacity plus restrained vertical movement. Media reveals use opacity plus slight scale or clip. Buttons use 160–220ms transitions.
- No bounce, elastic motion, large zoom, random card rotation, or identical reveals on every label.
- Parallax has three depths only: background `.025–.04`, midground `.06–.09`, foreground `.10–.14`.
- Hero coconut scroll motion is physically paired with its anchored shadow: the coconut rises and rotates while contact and ambient shadows fade, contract, soften, and separate modestly.
- Origin uses one responsive SVG path per viewport. The base and active stroke share the exact same path data, and the moving light is derived from that path geometry. Decorative competing paths are prohibited.

## Homepage continuity and density

- The locked sequence is Hero → scraping film → Origin → Receipt → Steal the Routine → testimonial ribbon → Outside the Shelf → Recipes → Sustainability → Newsletter → Footer.
- Section changes should read as colour and media handoffs, not rectangular page cuts. Hard borders between major homepage sections are prohibited.
- Receipt hands directly into Routine. Routine cards carry the primary lower-homepage visual weight; the testimonial ribbon is a compact bridge, not a separate card-grid section.
- Outside the Shelf uses one asymmetric cinematic reel: portrait / portrait / dominant landscape / portrait / portrait on desktop, horizontal snap media on mobile.
- Lower-page brown space is purposeful and compact. Large empty brown holding areas, duplicated product grids, and standalone journal loops between locked sections are prohibited.
- The Global .CO Pulse must be truthful. In launch mode it says curated launch routines; only a future live mode backed by real anonymised order data may describe live commerce activity.
- The hero orbit is one continuous narrative device and must reach zero opacity before the scraping film becomes visually dominant.
- Origin ends in a grounded everyday still-life: approved transparent packshots sit on a visible shared plane with contact shadows, varied scale, and restrained overlap. Ungrounded product arrays are prohibited outside selectors and commerce controls.
- Origin has one geometry source per viewport. Its muted base stroke, active stroke, and moving light all use the same SVG path data; the light position is derived with `getPointAtLength` from the same progress value.
- Receipt selection uses a copper/cream glow and a restrained product lift. On mobile, changing the active time automatically centres that selector without moving keyboard focus.
- Routine backgrounds are product-free and city-specific. Current packaging appears only through approved independent DOM cutouts; baked, obsolete, or generated packaging is prohibited.
- Routine environments are assigned by lived context: Kochi coastal morning, Bengaluru green kitchen, and Dubai night reset. Packshots require a shared contact plane, scene-matched shadow, readable labels, and a concise human routine summary; sticker-like or floating compositions are prohibited.
- Outside the Shelf is a transform-based five-position depth system: a sharp dominant centre, softened near neighbours, and more distant far frames. Its 5.2-second launch-mode cycle pauses for hover, keyboard focus, touch interaction, page visibility, and reduced motion.
- Recipes dissolve directly into the farm scene. A flat colour band or empty spacer between those sections is a regression.
- The Sustainability farm film autoplays muted, loops inline, pauses when off-screen, and becomes its poster under reduced motion. Playback chrome and a visible rectangular media boundary are prohibited.

## Named homepage transition tokens

- `--transition-origin-receipt`: grounded Origin still-life into Receipt cocoa.
- `--transition-receipt-routine`: Receipt into the routine canvas.
- `--transition-routine-outside`: routine/testimonial bridge into Outside the Shelf.
- `--transition-outside-recipes`: cinematic lifestyle media into Recipes.
- `--transition-recipes-impact`: Recipes into the farm scene.
- `--transition-impact-newsletter`: farm scene into the newsletter environment.
- `--transition-newsletter-footer`: newsletter still-life into the solid footer resting point.

These variables are the only canonical homepage section-handoff gradients. New anonymous gradient literals must not compete with them.

## Sustainability claims

- Sustainability values currently operate in `simulation` mode for the 10,000-unit launch scenario. They are design-stage assumptions and must not be treated as verified historical reporting.
- The canonical `sustainabilityImpact` object stores the mode, basis units, calculation assumptions, disclosure, final values, and finite roll states. Production replacement requires reviewed source data and a switch to `verified` mode with its reporting/source period.
- The quiet disclosure “10,000-unit launch scenario” remains visible whenever simulation mode is active. Verified mode replaces it with the approved reporting period.
- Counters animate through finite, authored odometer states once per page session and then hold. Infinite loops, random increments, simulated live values, and silent CMS substitution are prohibited.
- Operating facts such as Phase 1 MOQ, preservative specification, and a sourcing estimate must not be relabelled as verified impact outcomes.

## Newsletter and footer lock

- Newsletter and footer share one deep-cocoa environment. The newsletter may use the approved product-free coconut still-life; the footer is the visually quiet resting point and carries no parallax or continuous animation.
- Footer information architecture is locked to Products, Company, Support, and Legal plus bottom utility content. Social links are shown only when their real destination is configured.

## Responsive and accessibility

- Validate at 1440+, 1280, 1024, 768, 430, and 390px. Protect reading order, 44px minimum touch targets, visible focus, keyboard operation, and safe-area spacing.
- Reduced motion disables parallax, continuous marquees, and scroll-scrub playback. Preserve the same information with stable compositions and poster/crossfade states.
- Maintain WCAG AA contrast for functional copy and controls. Decorative motion and imagery must not be required to understand or use the page.

## Prohibited patterns

- Competing homepage implementations or version-suffixed component names.
- Direct CDN URL construction outside the media abstraction.
- Legacy or generated packaging fallback, Canva thumbnails, preview screenshots used as source layers, or AI substitutions for missing brand assets.
- Excessive translucent cards, abrupt content disappearance, hard scene cuts, gratuitous parallax, and production metrics or testimonials that have not been verified.
