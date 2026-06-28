# .CO Website Rules

Strict execution contract for all future AI and code work on `.CO | The Coconut Company`.

This document converts the permanent `.CO` design system into day-to-day implementation rules. It must be read together with [`docs/design-system.md`](./design-system.md) before any website code, content, layout, motion, asset, Git, PR, or deployment change.

These rules are mandatory. Do not treat them as suggestions.

## Authority And Scope

1. [`docs/design-system.md`](./design-system.md) is the single source of truth for the approved premium FMCG brand direction.
2. This file defines the working rules that keep implementation aligned with that design system.
3. [`docs/design-review.md`](./design-review.md) defines the review and QA process before merge or deployment.
4. Existing brand tokens in `styles/brand-tokens.css` are authoritative unless a human explicitly approves a token change.
5. If a requested change conflicts with the design system, pause and resolve the conflict before editing production code.
6. Do not reinterpret the site as a SaaS landing page, startup pitch page, investor deck, consultant portfolio, generic ecommerce template, or experimental redesign.

## Non-Negotiable Design Authority

- The public website must remain premium FMCG, product-led, coconut-first, consumer-friendly, and warm.
- Public pages must use the local `.CO` palette: cream, white, brown, ink, muted, palm, leaf, sun, border, black.
- Do not introduce new brand colors, gradients, glassmorphism, stock imagery, icon systems, or decorative visual languages without explicit approval.
- Do not make "creative" UI changes when the request is deployment, QA, docs, content, or bug-fix only.
- Preserve approved header and footer behavior unless the task explicitly targets them.
- Prefer reusable design-system patterns over page-specific styling.

## Before Editing Code

Before changing React, styles, assets, routes, documentation, or configuration:

- Read [`docs/design-system.md`](./design-system.md).
- Check whether the change affects layout, spacing, typography, imagery, animation, accessibility, QA, or deployment review.
- Identify the route and component scope.
- Confirm local state with `git status --short --branch`.
- Preserve approved header and footer behavior unless the task explicitly targets them.
- Prefer reusable design-system patterns over page-specific styling.

## Allowed Change Categories

Website work should fall into one of these categories:

- Alignment fixes that improve grid, spacing, card rhythm, or image crop.
- Motion refinements that follow the approved subtle motion language.
- Accessibility improvements that do not weaken the visual system.
- Content corrections that preserve the approved brand tone.
- Asset improvements that use the approved image hierarchy and treatment.
- Bug fixes that restore intended behavior without redesigning unrelated areas.
- Documentation changes that keep the design-system files mutually consistent.

## Prohibited Changes Without Explicit Approval

Do not make these changes unless the user explicitly requests them:

- Redesign approved layouts from scratch.
- Replace the premium FMCG/editorial direction with a SaaS or template aesthetic.
- Introduce gradients, glassmorphism, neon colors, heavy shadows, shiny UI effects, or gradient text.
- Add runtime Google font dependencies or other build-fragile external font loading.
- Add heavy animation libraries for simple reveal, marquee, or carousel behavior.
- Add random floating objects, particles, bouncing, decorative parallax, or distracting motion.
- Use sharp corners in premium card and media sections.
- Add raw, unframed images where a rounded media shell is required.
- Duplicate shop and product grids across multiple routes.
- Place founder portraits on the About page or in a Founders hero banner.
- Use external stock images when local assets exist.
- Use fake 3D product/coconut assets.
- Publish investor, export, expansion, medical, or treatment claims.
- Rewrite header or footer during unrelated work.

## Route Ownership Rules

Use these route expectations to prevent duplicated structure:

- `/` is the brand campaign and commercial homepage.
- `/shop` is the primary purchase-intent product listing.
- `/products`, if present, should redirect to `/shop` or act only as education with a clear CTA to `/shop`.
- `/about` should focus on Kerala origin, farms, coconut, aggregation, processing, values, and story.
- `/founders` is the only route where founder portraits should appear, and each founder should appear once in profile cards.
- `/journal`, `/recipes`, and `/sustainability` must share the same typography, card, image, and spacing systems as the rest of the site.

## Header Rules

The header is a protected component.

- `components/Navigation.tsx` is a high-trust component. Treat header changes as risky.
- Header must remain sticky or fixed, readable, and visible over every public page section.
- Header may compress into the approved dynamic-island treatment, but it must not jump, flicker, or hide controls.
- Header must preserve active page states for About, Products, Shop, Recipes, Sustainability, Founders, and Journal.
- Header background must stay cream/translucent enough for readability. Do not place transparent dark-on-dark or cream-on-cream navigation over content.
- Preserve desktop navigation access: logo, page links, search/shop access, account/login, and cart.
- Preserve mobile logo, search, cart, and hamburger/menu access without overflow or clipping at 390px width.
- Keep touch targets at least 44px to 48px where possible.
- Mobile menu must close after navigation and must not trap or hide account/cart actions.
- Admin/control routes must continue to hide public navigation where current logic requires it.
- Do not remove account, cart, search, or menu controls to solve spacing issues.
- Do not change header z-index, sticky/fixed behavior, account logic, cart logic, or admin hiding without route QA.

## Footer Rules

- `components/Footer.tsx` is locked unless a requested footer task or compatibility issue requires edits.
- Footer must remain visible at the natural end of the document. No section may overlap, clip, or cover it.
- Footer active link states must continue to reflect the current public route.
- Footer must keep brand summary, navigation, product ecosystem, recipes, newsletter/trade, social links, and legal/account paths.
- Do not redesign footer visual language during page redesign work.
- Footer changes require checking `/`, `/products`, `/shop`, `/recipes`, `/about`, `/sustainability`, `/founders`, and `/journal`.

## Hero Rules

- `components/HeroStoryCanvas.tsx` must remain product-first.
- Hero must communicate: cold coconut water, Kerala source, fridge shelf ritual, and product desirability.
- Hero must use local `publicAssets.water.hero` or other approved local product assets.
- Hero must not use fake 3D, external imagery, random floating fruit, abstract placeholders, or unapproved stock assets.
- Hero headline must be readable above the fold on desktop and mobile.
- Hero copy and CTA must never sit under product imagery or become visually buried.
- Hero visual should use a rounded media stage when not intentionally full-bleed.
- Hero motion must support product storytelling: image mask, clip-path reveal, headline stagger, water/path draw, or product clarity.
- Mobile hero motion must be reduced and must not lag, overflow, or hide CTAs.
- Trust badges in hero must stay compact and legible.

## Component And Styling Rules

- Use the radius system from [`docs/design-system.md`](./design-system.md): 24px, 32px, or 40px.
- Use shared containers and spacing tokens where available.
- Keep cards equal-height when they appear in a grid or bento system.
- Ensure media wrappers use `overflow: hidden`.
- Use `object-fit: cover` for lifestyle/editorial imagery.
- Use `object-fit: contain` for product packshots.
- Avoid absolute positioning that creates accidental overlap or clipped content.
- Do not hide interactive controls behind breakpoints, z-index layers, transforms, or overflow clipping.
- Cards must use thin brand borders and soft depth. Avoid harsh shadows.
- Do not nest cards inside cards.
- Do not pair heavy decorative shadow with a border unless it is already part of a current approved component.
- Doodles must be thin linework and secondary. They must not replace product or campaign imagery.

## Image, Card, And Radius Rules

- Use `components/BrandImage.tsx` for product, campaign, founder, journal, recipe, and origin imagery.
- Every meaningful image must have useful alt text.
- Use `next/image`; do not add raw `<img>` for website imagery unless there is a technical reason.
- Do not show broken image icons, blank image boxes, or generic placeholder panels.
- Do not stretch product images. Product pack labels must remain readable.
- Use `fit="contain"` for product packshots when labels need protection.
- Use `fit="cover"` only when crop is intentional and reviewed.
- Always set image aspect, sizes, fit, and object position intentionally.
- Use approved radii only: `24px`, `32px`, `40px`, or full pill for badges/buttons.

## Shop And Product Rules

- Product data lives in `lib/catalog.ts`; image mapping lives in `lib/public-assets.ts`.
- `/shop` is the primary purchase-intent product listing.
- `/products`, if present, should redirect to `/shop` or act only as education with a clear CTA to `/shop`.
- Shop and product pages must preserve clear product hierarchy: category, product name, format, short description, benefits, CTA.
- Product cards must feel like commercial FMCG product tiles, not generic content cards.
- Product card images must use `aspect="product"` and `fit="contain"` unless a specific lifestyle crop is intended.
- Hover image swaps must be subtle: no layout shift, no jump, no label crop, no visible double-stack overlap.
- Shop category cards must link to the correct product/category and use the correct product image.
- Product detail pages must keep "Save product" and "Early access" actions visible and tappable.
- Do not publish medical, treatment, expansion, investor, export, or operational claims.
- Product status and availability copy must remain honest: `coming-soon` or `preview` where applicable.

## Founder Image Rules

- `/founders` is the only route where founder portraits should appear.
- Founder images must use `publicAssets.social.founderFazil` and `publicAssets.social.founderAfsala` unless a human supplies replacements.
- Founder portrait crops must preserve faces and shoulders. Current object positions are intentional.
- Do not use founder photos in the Founders hero banner.
- Founder photos should appear only once in the founder profile/card section.
- Do not use product, lifestyle, or placeholder imagery as founder portraits.
- Do not distort founder images into extreme crops, circles, or novelty frames.
- Founder copy must stay warm, human, and product-adjacent, not celebrity-style or investor-style.
- Founder sections must support trust and origin; they must not overpower product storytelling.

## Typography Rules

- Use self-hosted Instrument Serif for approved editorial display roles and Instrument Sans for body, commerce, navigation, and interface roles.
- Font files and OFL license copies must remain in `app/fonts/`; do not replace them with runtime Google Font requests.
- Use `.co-display-hero`, `.co-display-section`, `.co-h2`, `.co-editorial`, and `.co-editorial-quote` for serif roles.
- Use `.co-impact`, `.font-sans`, and the normal body inheritance for bold product language and interface roles.
- Do not synthesize bold or italic font styles that are not shipped.
- Display text must remain bold, editorial, and consumer-commercial.
- Body text must stay readable at 16-18px with generous line height.
- Display letter spacing must not go tighter than `-0.04em`; current defaults are preferred.
- Use `.co-display-hero`, `.co-display-section`, `.co-h2`, `.co-body`, and `.co-label` where they fit.
- Headings must not overflow at 390px, 768px, 1280px, or 1440px.
- Avoid repeated tiny uppercase eyebrows above every section.
- Avoid pitch-deck language, corporate slogans, and abstract brand claims.
- Keep copy short, confident, and editorial.
- Prefer strong product and origin language over generic marketing claims.
- Prefer concrete consumer language: cold, coconut, fridge shelf, ritual, taste, Kerala, clean, simple, product.
- Use image overlays only when readability is excellent.

## Motion Rules

Motion must follow the system in [`docs/design-system.md`](./design-system.md):

- Motion must have a commercial or usability purpose.
- Use `MotionSection` for standard section/card reveals.
- Use `useCoconutMotionMode()` or `prefers-reduced-motion` handling for new motion.
- Default easing should stay close to `cubic-bezier(0.16, 1, 0.3, 1)`.
- Use motion tokens: fast `0.25s`, medium `0.6s`, slow/story `1.1s`.
- Use subtle section reveals, staggered text, image masks, card lift, button press, doodle draw, timeline progress, gentle marquee, and testimonial sliding cards.
- Hero headline lines must reveal through masks; selected journey stages should activate from shared scroll progress rather than unrelated timers.
- Keep product media parallax under `3.5%` scale and `24px` travel on desktop, and remove it on mobile/reduced motion.
- Use animated doodle path drawing only for selected story accents. Compact trust and utility icons remain static.
- Use consistent durations and easing across the site.
- Frequent UI interactions must be fast. Do not add long animations to header, cart, forms, or navigation.
- Animate transform, opacity, clip-path, masks, and SVG path progress before layout properties.
- Do not animate from `scale(0)`.
- Hover should be subtle: lift, crop zoom, press feedback, underline, or contrast.
- Disable or reduce heavy movement on mobile.
- Never hide content until an animation completes.
- Do not animate everything at once.
- Do not let motion distract from product, story, or usability.
- Ban random floating objects, decorative parallax, bounce/elastic motion, and motion that does not explain product or state.

## Bento And Grid Rules

- Bento grids must be intentional, aligned, and gap-consistent.
- Use `BentoGrid`, `BentoCard`, and explicit responsive grid columns where possible.
- Do not create dead cells, accidental gaps, or uneven card heights that look unplanned.
- Use 3-5 strong cards instead of many weak cards.
- Every card must serve a purpose: product desire, origin proof, recipe entry, trust cue, shopping action, or brand world.
- Avoid identical repeated icon-card grids except compact trust strips.
- Use 12-column or clear fractional desktop grid logic for major sections.
- On mobile, grids must stack in a deliberate order: headline, copy, CTA, image/product, trust.

## Mobile Rules

- Mobile at 390px is a required design target.
- Header logo, search, cart, and menu must all fit and remain tappable.
- CTAs must be visible and at least 44px high.
- Product labels must not be cropped.
- Text must not overflow cards or viewport.
- Hero must look premium above the fold, not merely "not broken".
- Avoid oversized empty sections and huge vertical padding on mobile.
- Reduce parallax, scroll motion, and heavy image effects on mobile.
- Mobile cards must keep consistent radius, spacing, and image aspect.
- Mobile footer must remain reachable and not be overlapped by transformed sections.

## Accessibility Rules

- Text contrast must meet WCAG contrast expectations: body text 4.5:1, large text 3:1.
- Every meaningful image needs alt text.
- Decorative images or hover swap images must use empty alt and `aria-hidden` where appropriate.
- Interactive controls need clear labels, visible focus, and keyboard access.
- Form inputs need labels or screen-reader labels.
- Do not remove structured data, metadata, sitemap, robots, analytics foundations, or auth-related accessibility patterns.
- Respect reduced motion globally.
- Do not use color alone to communicate active, error, or selected states.

## Anti-Patterns

- Generic SaaS hero layout.
- Investor or expansion language.
- Random decorative animation.
- Broken image fallbacks.
- External stock images when local assets exist.
- Fake 3D product/coconut assets.
- Misaligned bento grids.
- Text hidden by imagery.
- Overlapping images that do not help the story.
- Product labels cropped for aesthetic effect.
- Glassmorphism as default.
- Gradient text.
- Repeated "Section 01" / "Question 05" / numbered scaffolding.
- Large beige empty spaces with no product or story purpose.
- Header/footer rewrites during unrelated work.
- Duplicated shop/product grids across multiple routes.
- Founder portraits on the About page.
- Git commits that include tool folders, `.env`, `.next`, `node_modules`, screenshots, local config, or debug artifacts.

## Git, PR, And Deployment Rules

- Inspect state before edits: `git status --short --branch`.
- Never reset, checkout, or discard local changes without reporting.
- Do not stage with `git add -A` when the tree is mixed.
- Stage only files related to the requested scope.
- Do not commit `.env`, `.next`, `node_modules`, local tool folders, generated debug files, or screenshots unless explicitly requested.
- UI work must pass `npm run lint`, `npx tsc --noEmit --incremental false`, and `npm run build` before deployment.
- Deployment must use the exact intended commit. Verify local `HEAD`, remote `origin/main`, and Vercel deployment URL.
- Do not deploy old `main` when a newer approved branch/commit is the requested source.
- For production deployment, confirm Vercel reports `Ready` and production routes return 200.
- Final deployment reports must include branch, commit hash, checks, deployment URL, production URL, and warnings.

## Documentation Requirement

- When implementation changes or extends the visual system, update documentation in the same PR if the rule should become permanent.
- Documentation changes must remain coherent with [`docs/design-system.md`](./design-system.md) and must be reviewed using [`docs/design-review.md`](./design-review.md).
- Do not create a second competing design source of truth.

## Stop Conditions

Codex must stop and ask before continuing when:

- The requested source commit, branch, patch file, or PR cannot be found.
- Local uncommitted changes look like website design work and the user has not approved stashing or overwriting them.
- A request asks to modify header or footer while also saying they are locked.
- A requested visual change conflicts with `docs/design-system.md`.
- A local asset required by the design is missing and no approved replacement exists.
- A build error requires changing auth, Firebase, dashboard logic, SEO foundations, analytics, sitemap, robots, schema, domain, or deployment configuration.
- A fix would require changing product claims, founder identity, legal wording, or public business positioning.
- Vercel CLI is not logged in or project linkage is ambiguous.
- The deployment commit cannot be proven to include the requested changes.
- The only way forward would be destructive Git commands.
