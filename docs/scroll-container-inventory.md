# Scroll container inventory (base 9235dc4)

Audited before the shared scroll treatment was added. This covers explicit `overflow: auto/scroll`, Tailwind overflow utilities, and the carousel components in `app`, `components`, and `styles`. Decorative `overflow: hidden/clip` surfaces are clipping boundaries, not scroll containers.

| Owner | Vertical scroll | Horizontal scroll | Treatment |
| --- | --- | --- | --- |
| Document (`html`) | Native page scroll on all routes | None | Shared narrow desktop thumb; native touch and forced-color fallback |
| Home (`CinematicHomePage.tsx`, `CinematicHomePage.module.css`; legacy `ReferenceHomePage` rail styles) | Scroll-driven film and sections use document scroll | Active product scroller, category nav, routine builder, routine cards, review strip and recipe cards; legacy category row, receipt times, routine tabs, testimonial ribbon and Outside the Shelf | Shared native rail style only where `overflow-x:auto` is active; Home choreography untouched |
| Shop (`app/globals.css`, `ReferenceShopPage.tsx`) | Search results, filter sheet, quick view | Proofs, categories, curated products, gallery thumbnails, pairings, active filters | Rails use shared thumb; independent vertical overlays keep body lock |
| Recipes (`reference-recipes.css`, `RecipeExplorer.tsx`) | Document | Categories, culture, world cards, mood grid, community and category tabs | Native rails use shared thumb; no wheel conversion |
| Journal (`reference-journal.css`, `JournalGrid.tsx`, `JournalPrimitives.tsx`) | Modal/story panel | Category tabs; Embla `Rail` uses transformed track and arrow controls | Style native tabs; preserve Embla interaction without pretending it is native overflow |
| Sustainability (`reference-sustainability.css`) | Document/sticky sections | Seasonal chart | Native chart scrollbar; preserve sticky sections |
| Account (`reference-account.css`, `AccountShell.tsx`) | Document and panel content | Account tabs, member nav, product rail | Shared native rail style; existing buttons retained |
| Cart, menus, quick views and launch dialogs (`CartDrawer`, `MobileDrawer`, `Navigation`, `ReferenceHomePage`, `LaunchExperience`, `ReferenceShopPage`) | Independently scrollable locked overlays | None | Existing `useBodyScrollLock` and focus/escape behavior preserved |
| Commerce (`commerce-default.css`) | Quick view and drawer | Commerce tabs | Shared thumb, no changed scroll physics |
| Other utilities (`Lifestyle3DGallery`, `BrandSlidingPuzzle`, `SmooothySlider`, admin) | Admin nav and Smooothy reduced-motion fallback | Gallery cards, puzzle picker, admin tables, Smooothy reduced-motion fallback | Native overflow receives shared visual treatment; transformed Smooothy mode is left alone |

The existing `LenisProvider` intercepted document wheel scrolling on the base branch. No rail uses it for horizontal movement. `MotionProvider` uses it only through the optional document-top helper; GSAP ScrollTrigger already observes native document scroll.
