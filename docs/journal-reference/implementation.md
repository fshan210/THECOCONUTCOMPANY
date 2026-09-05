# Journal cinematic rebuild — review record

Branch: `codex/journal-cinematic-reference-rebuild`

Base: `c5be07531d1d09804982c8f97a15943566c1ff1f`, verified against `origin/main` before creating the clean worktree.

Worktree: `/Users/fazilshersha/Desktop/my-website-journal-cinematic`

## Scope and render ownership

The route and CMS loader remain unchanged. `app/journal/page.tsx` still fetches published content and owns the metadata/structured data. `ReferenceJournalPage` orchestrates the new surface and preserves live stories alongside the clearly marked editorial reference fixtures.

The page reuses `ReferenceHeader` and `ReferenceFooter` from `components/home/ReferenceHomePage.tsx`, and `NewsletterSection`/`NewsletterForm`. No shared component implementation was edited. Journal-scoped styling keeps the header legible after scrolling and uses the approved dark newsletter treatment. The approved `/images/logo.svg` is reused. Cart and account flows are unchanged.

The only shared logic change is an additive bundled-runtime prefix for `/assets/redesign/journal/cinematic/` in `lib/media.ts`. Other media paths retain their original behavior, covered by a regression test.

## Design and asset mapping

Supplied boards journal-1 through journal-5 determine the order, visual hierarchy and proportions. They are reference documents, not flattened page content. Supplied hero photography and all five environmental backgrounds are rendered as separate assets with live HTML content. Existing approved editorial imagery is reused where a standalone photograph from a reference board was unavailable.

Palette: warm black `#0e0b07`, cream `#ead8bd`, muted parchment `#bda98c`, amber `#cf985e`, transparent warm brown panels. Typography: existing Instrument Serif and Roboto. The signature is the photographic notebook hero, followed by a mixed-proportion story grid and tactile story deck.

`assets.json` records source paths, encoded dimensions and sizes. The preparation script resizes/encodes existing files without generative changes, compositing, package alterations or new logos. All 24 desktop/source derivatives total approximately 2.80 MB; hero is 211 KB, with a separate small-screen source. Below-fold photographs load lazily.

## Sections and behavior

| Reference | Implementation | Behavior |
| --- | --- | --- |
| 01 | `JournalOpening` | Supplied desk hero; headline entrance; full-scene camera push; Today rail with drag, arrows and keyboard; editor reader and canonical bookmark |
| 02 | `JournalArchive` | Eight-category filtering; 300 ms search; chronological/alphabetical sorting; per-card Framer Motion layout transitions; complete archive expansion; field-note drag rail |
| 03 | `JournalFarm`, `CoconutConfigurator` | Topic selection, validation and email preparation; single-open FAQ; 120 deterministic selections linked to existing recipes and product routes; explicit guidance for unsupported combinations |
| 04 | `JournalExplainers`, `JournalCommunity`, `RitualPlanner` | Expandable knowledge rows; community rail; draggable/keyboard story deck; morning/afternoon/evening planner with add/remove/save/move and browser persistence |
| 05 | `JournalClosing` | People cards; series-to-grid filtering; curated Most Read; nine-second quote rotator with pause/focus controls; share dialog; archive search; canonical newsletter and footer |

Story links open an accessible Radix dialog with CMS body or local editorial text. `?story=` links can reopen an article directly. No raw CMS HTML is executed. Authenticated bookmarks use the existing saved-content API; guests retain the sign-in redirect.

Planner movement uses a select control on every card, so touch and keyboard users can move items without dragging. Desktop HTML drag and drop is also supported. Planner state is stored only in the browser and validates stored IDs/periods before loading.

## Motion and accessibility

Existing Framer Motion and Embla are reused; no dependency was added. Transform/opacity reveals and card layout transitions, very slow whole-scene hero scale, rail dragging and understated stack movement. No independent animation of flattened faces or photographic objects. Quote rotation pauses on hover/focus and has an explicit pause control.

Reduced motion disables the hero loop, quote autoplay and deck depth, and shortens transitions. Page scrollbar uses thin bronze styling with native browser fallback. Sections have anchor offsets; controls use native labels and pressed/expanded states; dialogs use focus trapping and Escape dismissal.

## Evidence and constraints

Typecheck, lint and the production build pass. The repository suite passes 60 tests (41 frontend, 5 contracts, 11 backend, 3 infrastructure), including four added Journal model tests. The matrix test checks every configurator combination against real recipe routes, assets and product slugs.

Browser acceptance and deployment evidence are recorded separately in `qa-report.json` and the final handoff.

Intentional limits:

- Standalone reference portraits, exact editor photograph, field avatars and some lifestyle photographs were not supplied. Existing imagery fills those slots; approved founder portraits and existing founder copy replace two unavailable reference portraits. This is a close structural/art-direction implementation, not a claim of pixel-identical photo parity.
- Reference names, quotes, field observations and article copy are labelled illustrative. “Most Read” is a curated reference order, not fabricated live analytics.
- Ask the Farm and Share your Story prepare email through the existing contact address. They do not falsely display “sent”; a real submission service does not exist in this baseline.
- Configurator combinations without a tested recipe are explicitly described as related starting points. No invented recipe, processing claim or unlisted sugar product is sold as a confirmed match.
- The canonical header/footer/newsletter retain their approved content and behavior, so their contents intentionally differ from the static boards.
- Production deployment and merging are outside this task.


## Final local acceptance

All six widths passed in Chrome against the production build: 1440, 1280, 768, 430, 390 and 375px. No document-level horizontal overflow or broken images; one canonical header, newsletter and footer at each width. Complete screenshot sets are in `artifacts/journal-reference/` in the clean worktree.

The 23 recorded interaction checks pass, including desktop pointer drag and a 390px touch swipe. A separate console/cart audit found no console errors or warnings, verified the shared cart opens and closes, and found no undersized active Journal controls at 390px. Newsletter success was tested with an intercepted API response; no subscription was created.

Home, About, Shop, Recipes and Sustainability return HTTP 200 with no runtime errors. Their source, shared implementations, backend, dependencies and configuration have a zero-byte diff against the requested base. These checks do not claim a new full visual acceptance of those unchanged pages.

Production build reports Journal route JavaScript at 25.1 KB and first-load JavaScript at 249 KB. This is a build measurement, not a field Core Web Vitals benchmark.
