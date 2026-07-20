# Phase 4.3 Motion Verification Matrix

Status key: **Automated** means code/runtime assertions passed locally. **Preview pending** is not a claim of visual verification and must be updated after deployment.

| Route | Component | Animation | Trigger | Duration | Quality tiers | Desktop verified | Mobile verified | Notes |
|---|---|---|---|---|---|---|---|---|
| Global | RouteTransition | Liquid cover, coconut loader, route reveal | Internal navigation | 450–650ms plus navigation | full/reduced/minimal | Preview pending | Preview pending | External, modified-click, download, hash-only and target links are not intercepted |
| Global | CoconutLoader | Coconut silhouette with visible water fill | Navigation exceeds loader delay | minimum 420ms | full/reduced/minimal | Preview pending | Preview pending | Text status is exposed to assistive technology |
| Global | ReferenceHeader / Navigation | Dynamic Island glass interpolation | Scroll beyond 80px | spring | full/reduced/minimal | Preview pending | Preview pending | Geometry unchanged; tint/blur recipe unified |
| Global | TextReveal | Word/line blur, opacity and translate | Mount/in-view | 540–780ms | full/reduced/minimal | Automated | Automated | Screen readers receive one unsplit text value |
| Global | SectionReveal | Mask/translate/opacity reveal | Intersection | 620ms | full/reduced/minimal | Automated | Automated | Minimal mode renders immediately |
| About | JourneyScrollStory | Sticky milestone progress and image depth | Scroll through 88vh per stage | scroll-bound | full | Preview pending | n/a | Mobile and reduced mode use linear cards, no pin |
| About | JourneyScrollStory | Linear milestone card reveal | In-view | 420–620ms | reduced/minimal | n/a | Preview pending | Final milestone remains reachable |
| About | BrandSlidingPuzzle | Legal tile layout spring | Click, tap, keyboard button | responsive spring | full/reduced/minimal | Automated | Automated | 4×4 desktop, 3×3 mobile; solvability tests pass |
| About | BrandSlidingPuzzle | Full-image completion and restrained confetti | Solved board | 700–1100ms | full/reduced/minimal | Automated | Automated | Confetti omitted outside full quality |
| Home | ImpactCounters | Truthful value count-up | First intersection | 900ms | full/reduced/minimal | Automated | Automated | CMS/fallback configuration; runs once |
| Shop | ProductConfigurator | Image/copy/price/SKU crossfade | Valid option change after preload | 460ms | full/reduced/minimal | Automated | Automated | Request token prevents stale image commits |
| Global | WaterRipple | Organic water refraction | Primary CTA/pointer activation | 520ms | full/reduced | Preview pending | Preview pending | Not a global Material-style button ripple |
| Global | ParallaxLayer | Small depth translation | Scroll progress | scroll-bound | full/reduced | Preview pending | Preview pending | Capped at subtle distances; disabled in minimal mode |

## Automated assertions

- Puzzle shuffles are solvable and never initially solved (40 samples per board size).
- Legal and illegal move behavior is deterministic.
- Solved-state detection accepts the final legal move.
- All 12 configurator records have unique SKUs, prices, images, and synchronized copy.
- Both 100ml RAW combinations remain unavailable; supported combinations remain selectable.
- TypeScript ensures route/motion quality state and component props remain synchronized.
