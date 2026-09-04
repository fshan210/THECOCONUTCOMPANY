# Sustainability surface brief

Status: **SHIP** (fresh finish-review disposition, 2026-09-04)  
Surface: `/sustainability`  
Mode: **Persuade through inspectable evidence** — let a customer understand the proposed whole-coconut model, try its reference interactions, and distinguish clearly between ambition, illustration, and verified fact.

## Identity and composition

This is the reference-locked, dark coconut-earth expression of the .CO world. It moves in the five-board order preserved by the implementation: farm hero and four principles; trace demo and seasonal rhythm; whole-coconut material flow; impact calculator and people; evidence register, roadmap, source close, then the shared newsletter. Its memorable moment is the traced reference batch illuminating a Pollachi route and staged journey before the page expands that same evidence logic into material streams and receipts.

The surface refuses a generic sustainability report or isolated dashboard-card layout. Editorial scenes, diagrams, tools, and disclosure copy remain one continuous narrative. The route is capped at 1440px for structured sections, while hero, people, closing, and newsletter imagery create full-width atmospheric transitions.

## Palette and material

- Ground: near-black volcanic cocoa (`#100a06`), with lifted cocoa fields (`#1c1009`, `#160e08`, `#25150c`).
- Primary text: coconut cream (`#ead7bf`); secondary copy: muted husk (`#c4ad92`).
- Signal: source amber (`#d99756`) with brighter focus/active notes (`#efb472`, `#ffbc73`). Green appears only where a material/status distinction needs it.
- Panels use fine amber-brown borders, 14–20px corners, translucent cocoa gradients, and a restrained inset highlight. Media is integrated through warm masks and crops, not framed as unrelated cards.
- Pills belong to actions and segmented controls; circular seals/icons mark origin, principles, steps, and metrics. Transparent product cutouts keep a scene-matched contact shadow.

## Typography

Cormorant Garamond via `--co-font-editorial` owns display headings, expressive italics, stream names, and result numerals. Inter/the shared sans token owns paragraphs, labels, controls, data, evidence status, and disclosures. Hero type scales from `clamp(4rem, 7.3vw, 6.5rem)` to a mobile `clamp(2.8rem, 12.7vw, 4.3rem)`; section headings generally use roughly 2.65–5rem with tight 0.98–1.05 leading. Body copy is compact (about 0.87–1.02rem) with 1.6–1.8 leading. Tracked uppercase micro-labels are permitted only as functional metadata inside the reference surface; the principal storytelling labels are deliberately hidden and this micro-label treatment is not a global pattern to proliferate.

## Responsive composition

- `>=1200px`: asymmetric two-column trace, flow, calculator, people/community, evidence, and roadmap compositions; the hero copy occupies about 63% while the origin seal floats opposite.
- `900–1199px`: reduce gaps and panel padding while retaining the desktop topology.
- `600–899px`: stack major sections; keep the calculator two-column where space permits; collapse community/evidence/roadmap to one column; move supporting content beneath its lead.
- `<600px`: deliberately recompose rather than shrink. Use the portrait hero, a two-up principle grid, single-column flow and calculator, three-up journey steps, stacked evidence rows, and vertical roadmap. Material-flow connectors become a simple amber spine; methodology moves inline; the wide seasonal chart remains horizontally scrollable with an explicit accessible label.
- Preserve zero page-level horizontal overflow, readable source order, 44px minimum interactive targets, responsive image crops, and route-local header/footer touch-target reinforcement.

## Motion architecture

Motion is finite, directional, and evidentiary. The shared easing is `cubic-bezier(.22, 1, .36, 1)`. Hero lines reveal upward once; principles, charts, flows, statistics, evidence rows, and roadmap enter once in reading order. The hero image has one slow 22-second 1.0→1.025 push on larger screens. A valid trace advances seven 200ms phases, draws one route, fills fields, and then clears its timer. Calculator values ease numerically over 650ms; expansions use a short 350ms fade/translate; buttons press to 0.98 scale.

`MotionConfig reducedMotion="user"`, component-level `useReducedMotion`, and the route CSS reduced-motion query remove reveals, route drawing, smooth scrolling, transitions, and hero scale while keeping all content and state available. Mobile disables the hero push. Do not introduce infinite route motion, scroll-measuring handlers, decorative particle loops, or motion that delays access to evidence.

## Interactive states

- Primary/secondary actions: warm pill gradient or translucent cocoa; amber border lift on hover; 2px amber focus ring with 4px offset; pressed scale; disabled controls use reduced opacity and a not-allowed cursor.
- Trace: editable reference code, clear, submit/loading, invalid alert with recovery action, locally decoded QR-image path with unsupported/error statuses, and help focus/scroll. Only `CO-W-2608-0147` resolves.
- Seasonal chart: independent series toggles plus month hover/focus/click selection; pressed state and live textual readout mirror visual state.
- Flow: hover/focus/click selects a material stream; selected connectors and destination borders brighten; each destination exposes an `aria-expanded` methodology panel.
- Calculator: units/batch tabs, product select, bounded quantity stepper (1–999), unit/multipack toggle, calculated/result/error states, and an expandable method note. Unsupported oil and unknown batches fail safely.
- People/evidence/roadmap: region buttons update a status line; community methodology, evidence rows, and roadmap details disclose in place. Preserve `aria-pressed`, `aria-expanded`, `aria-controls`, live/status/alert regions, semantic headings, and informative image alt text.

## Claim-safety rules

1. Treat every batch, journey, seasonal curve, material share, impact coefficient, people statistic, cluster count, evidence status, and roadmap item as reference-board or proposed-model content unless a dated source record and review make it publishable.
2. Keep “reference”, “illustrative”, “modelled”, “unverified”, “not published”, and “publication pending” labels adjacent to the affected output; never hide them in a general footer disclaimer.
3. The calculator is a linear rendering of the supplied board (`0.36 kg` diversion, `0.09 kg` biochar, `0.27 kg CO2e` per reference unit). It is not an LCA, carbon claim, recovery result, or certification.
4. Do not imply live registry coverage: only the supplied demo batch returns data, QR files are decoded locally, the regional map is schematic, and actual operating coverage requires validation.
5. Roadmap columns are planning states, not completion claims. Do not add dates, checked milestones, certifications, audit results, farmer reach, participant counts, or operating-scale claims without approved evidence.
6. Do not replace supplied imagery, logo, or packaging with generated/generic sustainability material, or alter visible pack facts.

## Ownership and source files

The root layout owns the single global `Navigation`, `Footer`, `CartDrawer`, providers, and motion shell. `DarkShell` is only the route wrapper (`rd-page rd-sustainability`) and must not acquire a second header or footer. The Sustainability page owns exactly one `NewsletterSection` at its close.

- Route/SEO: `app/sustainability/page.tsx`
- Composition: `components/sustainability/ReferenceSustainabilityPage.tsx`
- Interactions: `components/sustainability/SustainabilityTrace.tsx`, `SustainabilitySeasonal.tsx`, `SustainabilityFlow.tsx`, `SustainabilityCalculator.tsx`, `SustainabilityEvidence.tsx`
- Route styling: `styles/reference-sustainability.css` (loaded by `app/layout.tsx`)
- Reference model boundary: `lib/sustainability-reference.ts`
- Shared shell/newsletter: `app/layout.tsx`, `components/reference/DarkReference.tsx`, `components/launch/NewsletterSection.tsx`

## Asset provenance

All Sustainability artwork is local and user-supplied. Originals live under `public/assets/redesign/sustainability/`, including the two `NOTHING WASTED...` hero boards, `WHAT DOES YOUR COCONUT LEAVE BEHIND.png`, `IMPACT SHOULD REACH PEOPLE TOO.png`, `A BETTER COCONUT SYSTEM STARTS AT THE SOURCE.png`, `whole-coconut-reference.png`, and `backgrounds/1.png`–`5.png`.

Runtime WebP derivatives live under `public/assets/redesign/sustainability/cinematic/`. `scripts/prepare-sustainability-assets.mjs` performs only resize/WebP conversion and embeds provenance; each derivative has a sibling `.webp.json` sidecar stating its exact original and that no generation, retouching, or packaging change occurred. `/assets/redesign/sustainability/` is protected as a bundled local prefix in `lib/media.ts`. Product cutouts come from the approved `transparentProductAssets` catalogue; the logo remains `/images/logo.svg`. The shared newsletter uses its established local grove/still-life assets.

## QA contract and evidence

Current targeted evidence: `npx tsx --test tests/phase-4-3/sustainability-reference.test.ts` — **6/6 passing on 2026-09-04**. This verifies reference arithmetic and bounds, the single accepted demo batch, locked section order, single newsletter/no local shell, local scene inventory, finite motion, reduced-motion CSS, and claim-safety markers.

Run before handoff:

```sh
npx tsx --test tests/phase-4-3/sustainability-reference.test.ts
npm run typecheck
npm run build
```

Then verify `/sustainability` at 1440px and 390px: hero/action anchors; valid and invalid trace; QR fallback; seasonal toggles and horizontal chart; every flow selection/detail; calculator modes, bounds, unsupported product and result disclosure; region controls; evidence/community/roadmap disclosures; `/about`, `/contact`, `/shop`, `/account/orders`; keyboard focus; reduced motion; and no overflow.

Accepted visual evidence is preserved in `.impeccable/review/sustainability-final/` (hero, trace, seasonal, flow, people, closing, newsletter at desktop/mobile) and `.impeccable/review/sustainability/` (calculator, evidence, materials, and full-page captures). The finish reviewer’s fresh disposition is **SHIP**. These captures are review evidence, not proof of deployment or production release.
