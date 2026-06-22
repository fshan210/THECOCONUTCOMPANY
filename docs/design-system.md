# .CO The Coconut Company Design System

This document is the permanent design-system reference for the .CO The Coconut Company website. It preserves the approved premium FMCG direction so future implementation work can polish and extend the site without drifting into a generic SaaS or template landing page.

## Brand Positioning

.CO should feel like a luxury product catalogue blended with a modern editorial magazine. The visual language is premium, confident, rooted in Kerala, and globally credible.

Design references may include Apple, Aesop, Hartzler Dairy, Minor Figures, Oatly, Refero, Emil Kowalski, Leon's Taste, and Impeccable Design, but the final result must always feel ownable to .CO.

## Core Principles

- Do not redesign approved layouts unless explicitly requested.
- Treat all supplied reference images as one unified design system, not separate page designs.
- Maintain a visual ratio of roughly 70% minimal calm and 30% editorial maximalism.
- Alternate rhythm across sections: calm, bold, calm, product, story, calm.
- Typography is a structural design element, not just labeling.
- Product and ingredient imagery should be the visual hero.
- Motion should add soul without calling attention to itself.
- Avoid dead space; use editorial typography, product details, doodles, badges, story, or micro-copy to make space intentional.

## Color System

Use a warm, premium natural palette:

- Cream backgrounds for the primary canvas.
- Warm beige surfaces for cards and editorial panels.
- Dark brown typography for primary brand voice.
- Muted greens for Kerala, agriculture, freshness, and secondary UI.
- Coconut tones for product warmth.
- Tiny yellow accents only where emphasis is needed.

Do not use gradients, glassmorphism, neon colors, shiny UI effects, or excessive shadows.

## Typography

Typography should feel editorial, bold, and architectural.

Recommended hierarchy:

- Display headlines: oversized, tight line-height, confident letter spacing.
- Section titles: large and editorial, often broken into short stacked words.
- Supporting copy: medium weight, short, and readable.
- Body copy: concise; avoid large text blocks.
- Captions and badges: uppercase or small editorial labels where appropriate.

Approved headline language examples:

- COLD
- COCONUT
- WATER
- REAL
- GOODNESS
- KERALA
- RITUAL
- EVERYDAY
- MADE FOR LIVING

Use local, self-hosted, or existing project-safe fonts only. Do not introduce runtime Google font dependencies that can break builds.

## Grid, Spacing, and Layout

Use a 12-column responsive grid with consistent section rhythm.

- Maximum content width: 1400px.
- Desktop side padding: 80px.
- Tablet side padding: 48px.
- Mobile side padding: 24px.
- Desktop vertical spacing: 120px to 160px.
- Tablet vertical spacing: 80px to 100px.
- Mobile vertical spacing: 56px to 72px.

Cards, bento grids, and media blocks must align to the same spacing system. Avoid accidental overlap, uneven gutters, misaligned edges, and isolated empty areas.

## Radius and Card System

Use one consistent premium radius system:

- 24px for compact cards, controls, and small media shells.
- 32px for standard cards and most image containers.
- 40px for large hero, CTA, and editorial surfaces.

All media cards must use `overflow: hidden`. Avoid sharp corners in premium sections unless an intentionally full-bleed editorial treatment requires it.

## Image System

Images must look like one professionally art-directed campaign.

Priority imagery:

1. Hero bottle
2. Bottle splash
3. Ice cream
4. Village aggregation
5. Kerala farm
6. Founders
7. Farmers
8. Processing
9. Recipes
10. Lifestyle
11. Packaging
12. Coconut, palm, factory, and ingredient scenes

Rules:

- Prefer real project assets before generating or sourcing anything new.
- Use `object-fit: cover` for lifestyle, farm, editorial, story, and recipe photography.
- Use `object-fit: contain` for product packshots and bottle imagery.
- Set deliberate `object-position` values so crops feel intentional.
- No raw image should appear without a rounded branded shell unless it is intentionally full-bleed.
- No stretched images, accidental crops, clipped product labels, or unplanned overlap.
- Product hover states should crossfade or lift cleanly; images must not stack visibly or collide.

## Motion System

Motion should be subtle, premium, and reduced-motion safe.

Use one consistent easing language across the site. Recommended timing:

- Fast interactions: 200ms to 250ms.
- Medium UI transitions: 450ms to 650ms.
- Large reveals: 700ms to 1000ms.

Allowed motion:

- Section reveal on viewport entry.
- Staggered text reveal.
- Image and mask reveal.
- Bottle/product reveal.
- SVG doodle draw.
- Water ripple or liquid path animation.
- Button press and card hover lift.
- Timeline progress.
- Gentle marquee.
- Testimonial sliding cards.
- Sticky dynamic-island header transition.

Do not use heavy particles, random bouncing, constant floating, distracting rotating objects, or simultaneous animation of everything on the page.

Always respect `prefers-reduced-motion`.

## Header Rules

The header is approved and must not be redesigned casually.

Desktop behavior:

- Header remains accessible on scroll.
- At top, use the normal premium header.
- After scroll threshold, compress into a centered dynamic-island style navigation.
- Preserve logo or .CO mark, nav links, search, cart, and account/menu controls where present.
- Avoid jumping, flicker, aggressive resizing, and layout shift.
- Use high z-index, subtle blur, background, and shadow only as needed for readability.

Mobile behavior:

- Header remains sticky or fixed.
- On scroll, compress into a compact rounded island.
- Keep logo, search, cart, and hamburger visible.
- Do not clip controls or hide menu access.
- Touch targets should be at least 44px to 48px.

## Homepage Structure

The homepage should follow this approved order:

1. Hero
2. Shop / product commercial section
3. Journey timeline
4. Lifestyle grid
5. Ingredient story
6. Recipes
7. Founders or brand story teaser
8. Testimonials
9. Business CTA
10. Footer

Avoid duplicate product and shop sections. `/shop` is the primary purchase-intent destination.

## Hero Rules

The hero should use a deliberate two-column editorial composition on desktop and a carefully stacked premium layout on mobile.

Left side:

- Bold editorial headline such as COLD / COCONUT / WATER.
- Short supporting copy.
- Two clear CTAs.
- Trust badges or cues beneath.

Right side:

- Bottle, coconut, splash, palm, or Kerala badge inside a rounded visual stage.
- No awkward crop, sharp stage edges, accidental overflow, or misaligned product.

Hero motion:

- Line-by-line headline reveal.
- Image mask reveal.
- Product reveal.
- Kerala badge fade.
- Ripple SVG path animation.
- CTA and trust badge stagger.

## Shop and Product Rules

The shop section is the main commercial section.

It should include:

- Large editorial title.
- Category chips or tabs if useful.
- Featured product cards.
- .CO Water.
- MELT.CO.
- Future products as coming soon only when needed.
- CTA to `/shop`.

Product cards must have equal height, consistent padding, rounded media frames, contained packshots, aligned typography, clean gutters, and hover states that do not overlap or crop product images.

If `/products` exists, prefer redirecting it to `/shop` unless there is a strong routing reason to keep it as an educational page.

## Founder Image Rules

Founder photography should be used intentionally and sparingly.

- About pages should not show founder portraits.
- About pages may show farm, coconut, aggregation, processing, brand story, values, and Kerala origin imagery.
- Founders pages should not use founder photos in the hero banner.
- Founder photos should appear only once in the founder profile/card section.
- Founder image cards must be rounded, aligned, and free of duplicates.

## Testimonials

Homepage testimonials should appear near the end of the page before the final CTA or footer.

Use premium sliding cards with a warm cream, brown, and muted green palette. Motion should be elegant, touch-friendly where feasible, keyboard accessible where feasible, and not dependent on a heavy library unless already installed.

Approved starter content:

- “It tastes like real tender coconut, not a packaged drink.” — Early Taster
- “The brand feels premium but still rooted in Kerala.” — Retail Partner
- “Clean, simple, and perfect straight from the fridge.” — Wellness Customer
- “The kind of coconut brand I would expect to see internationally.” — Distributor Feedback

## Doodles and Editorial Details

Use subtle premium SVG doodles to add warmth and story:

- Coconut outline
- Leaf sketch
- Water ripple
- Sun symbol
- Processing arrows
- Ingredient marks
- Palm details

Doodles should be refined, organic, and understated. They must never feel cartoonish, childish, or cluttered.

## Mobile Rules

Mobile is not a compressed desktop layout.

- Use 24px side padding.
- Stack cards naturally.
- Scale typography intentionally.
- Keep buttons at least 48px tall where possible.
- Crop images deliberately.
- Prevent horizontal scrolling.
- Avoid clipped cards, hidden controls, and overlapping content.
- Ensure the mobile menu remains accessible at all times.

Mobile should feel like a premium native brand experience.

## Route QA Checklist

Audit these routes whenever making visual changes:

- `/`
- `/shop`
- `/products`
- `/about`
- `/founders`
- `/journal`
- `/recipes`
- `/sustainability`

Check every route for:

- Sticky/dynamic-island header behavior.
- Mobile menu access.
- No horizontal overflow.
- No broken images.
- No sharp card corners in premium sections.
- No accidental overlap.
- Clean image crop and alignment.
- Consistent typography hierarchy.
- Reduced-motion safety.
- No hydration or console errors.

Recommended breakpoints:

- 1440px desktop
- 1280px laptop
- 1024px tablet
- 768px tablet
- 430px mobile
- 390px mobile
- 375px mobile
- 360px mobile
- 320px mobile

## Required Checks Before Shipping

Run these commands before handing off implementation changes:

```bash
npm run lint
npx tsc --noEmit --incremental false
npm run build
```

Warnings are acceptable only when existing and non-blocking, such as deprecated Next middleware convention or edge runtime static generation behavior warnings.
