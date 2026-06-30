# .CO Stage 1 Design System Foundation

Stage 1 prepares the `.CO The Coconut Company` website for a premium world-class redesign without replacing the current public pages yet.

## Installed foundation

- Next.js 15 with TypeScript.
- Tailwind CSS with `.CO` brand tokens.
- shadcn/ui-compatible setup through `components.json`, `lib/utils.ts`, and `components/ui/button.tsx`.
- Framer Motion and Motion for UI animation patterns.
- GSAP + ScrollTrigger utility setup for future scroll-driven scenes.
- Lenis provider for smooth scrolling, disabled for `prefers-reduced-motion`.
- lucide-react for icons.
- sharp for image optimization.

## Current framework decision

The repository had already advanced to Next.js 16. Stage 1 aligns the app to the requested Next.js 15 line using the latest available Next 15 package and matching `eslint-config-next`.

## References

Primary docs:

- shadcn/ui: <https://ui.shadcn.com/docs>
- Motion: <https://motion.dev/docs>
- GSAP ScrollTrigger: <https://gsap.com/docs/v3/Plugins/ScrollTrigger/>
- Lenis: <https://lenis.dev/>
- Tailwind CSS: <https://tailwindcss.com/docs>
- Next.js: <https://nextjs.org/docs>
- Lucide: <https://lucide.dev>

Inspiration libraries:

- Awwwards: <https://www.awwwards.com>
- Godly: <https://godly.website>
- Land-book: <https://land-book.com>
- Lapa Ninja: <https://www.lapa.ninja>
- Cult UI toolbar expandable: <https://www.cult-ui.com/docs/components/toolbar-expandable>
- React Bits Magic Bento: <https://reactbits.dev/components/magic-bento>

Downloaded local references, not committed:

- `.reference-downloads/shadergradient`
- `.reference-downloads/open-design`

These are reference material only. Do not paste external code into `.CO` without review.

## Visual direction

- Premium coconut FMCG brand from Kerala.
- Calm, editorial, minimal, but rich.
- Minimal sections mixed with selected bento-style moments.
- Glassmorphism for floating cards, popups, and light overlays.
- Neumorphism only for soft product category cards.
- Gradients, masks, blur overlays, and image blending must be restrained.
- Typography stays refined: local Roboto for UI/body and Instrument Serif for emotional accents.

## Token direction

Core palette:

- Cream beige background.
- Earth brown typography.
- Deep leaf green CTA.
- Palm green accent.
- Sun yellow highlight.
- Large rounded corners.
- Soft shadows.
- Premium glass blur.
- Soft neumorphic product category surfaces.

Implementation lives in:

- `styles/brand-tokens.css`
- `app/globals.css`
- `tailwind.config.ts`

## Animation rules

- Lenis smooth scrolling runs globally but respects reduced motion.
- Framer Motion handles popups, hover states, mobile menus, product cards, and tab switching.
- GSAP ScrollTrigger is reserved for counters, scroll reveals, parallax image movement, and pinned product storytelling.
- Motion should feel slow, premium, and controlled.
- Never hide content until animation completes.
- Respect `prefers-reduced-motion`.
- Avoid noisy effects, particles, random bouncing, and unbounded parallax.

## Component foundation

Skeleton components live in `components/foundation/`:

- Header
- Footer
- Button
- GlassCard
- NeumorphicCard
- BentoGrid
- ProductCard
- RecipeCard
- FounderCard
- JournalCard
- CounterStat
- MoreProductsCloud
- MobileDrawer
- SectionHeading
- ImageBlendBlock

These are intentionally not wired into final public pages yet.

## More Products cloud plan

The `MoreProductsCloud` component is ready as a foundation piece for the homepage product category rail.

Future wiring target:

- Place category rail below the hero.
- Include Coconut Water, Coconut Milk, Coconut Oil, Ice Cream, and More Products.
- More Products opens a translucent rounded cloud connected visually to the button.
- Extra cards link to `/shop?product=product-slug`.
- Include Back to Categories and close actions.
- Closing animates the cloud back toward the More Products button.

## Asset pipeline

Use local/project-owned assets first. If new assets are needed, allowed sources are:

- Unsplash.
- Pexels.
- Pixabay.
- Openverse.
- Wikimedia Commons.

Optimization tools:

- `sharp` scripts in the repo.
- Squoosh.
- TinyPNG.

Background removal:

- remove.bg.
- Canva background remover.

Mockups:

- Mockupworld.
- Shots.so.
- Smartmockups free assets.

Every externally sourced asset must be recorded in `docs/assets-sources.md`.

## MCP workflow

Preferred workflow for later stages:

- GitHub MCP: repository checks, branches, commits, PR context.
- Filesystem MCP/local workspace: code and asset organization.
- Playwright MCP: desktop/mobile UI checks, screenshots, popups, and animation QA.
- Context7 MCP: current docs for Next.js, Tailwind, shadcn/ui, Motion, GSAP, and Lenis.
- Figma MCP: use only if design files are provided later.

In this session, GitHub access and local filesystem tooling were available. Context7 and Playwright MCP were not exposed, so their workflow is documented for later use.

