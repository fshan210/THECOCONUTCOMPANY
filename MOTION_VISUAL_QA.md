# Motion Visual QA

Date: 23 July 2026

## Matrix

| Viewport | Home sequence | About Journey | Journal rail | Cursor | Status |
|---|---|---|---|---|---|
| 1440×900 | PASS — desktop source, forward/reverse scrub | PASS — sticky at 88px, 52px hand-off gap | PASS — Smooothy mounted, End/Home reaches 6/1 | PASS — fine-pointer lerp and target states | PASS |
| 1280×720 | PASS — desktop source, 220svh | PASS — desktop containment retained | PASS — bounded track, no overflow | PASS — fine-pointer only | PASS |
| 1024×768 | PASS — desktop source, no crop/download crossover | PASS — desktop containment retained | PASS — bounded track, no overflow | PASS — fine-pointer only | PASS |
| 390×844 | PASS — independent 720×1280 mobile source, forward/reverse scrub | PASS — static 1,197px timeline, zero section gap | PASS — touch-safe horizontal rail | Native by design | PASS |
| 360×800 | PASS — independent mobile source, 195svh | PASS — static timeline, zero overflow | PASS — touch-safe horizontal rail | Native by design | PASS |

## Media review completed

Desktop and mobile v3 contact sheets were inspected before integration. Both show distinct coconut-only opening states, an opaque water bridge, bottle-only resolution and a stable approved final label. Mobile uses its own 9:16 output.

## Recorded acceptance evidence

- The home sequence reached `Whole by nature` → `One continuous flow` → `Made for living`, then returned to `One continuous flow` after reverse scrolling. The renderer requests the current frame plus two neighbours in each direction.
- Responsive `<picture>` selection resolves to `mobile/frame-00.avif` at 390px and `desktop/frame-00.avif` at 1024px, 1280px and 1440px. No `/_next/image` URL or cross-viewport source is selected.
- Reduced motion is implemented as a static poster fallback and the rail becomes native overflow. The source and contract tests cover this branch; the in-app browser does not expose media emulation, so this branch was not visually forced during the browser pass.
- About desktop hands off to Values with 52px of intentional spacing. Mobile hands off with zero synthetic gap and does not use sticky positioning.
- Journal exposes one Smooothy carousel, an accessible live region and keyboard Home/End navigation. The tested live-region result moved from slide 4 to 6 and back to 1.
- The desktop coconut cursor enabled only for `(hover: hover) and (pointer: fine)`, followed a pointer to 720×430 via `translate3d`, and remained native on coarse/mobile viewports.
- More Products locks both document scroll roots, exposes a scrollable dialog (818/1218px desktop and 752/2630px mobile), closes with Escape and restores scrolling. No horizontal overflow was introduced.
- Fresh-tab browser logs were empty on Home, About, Journal and Shop after correcting target-ref hydration and declaring the document's smooth-scroll behaviour.
- Shop renders one header, direct static image URLs, no horizontal overflow and no duplicate persistent transition overlay.

## Limitations

- Safari/WebKit was not available in the current in-app browser, so the release should retain one short Safari smoke test before a production merge.
- The reusable vertical Smooothy wrapper remains intentionally unmounted; no current production surface justifies capturing vertical page gestures.
