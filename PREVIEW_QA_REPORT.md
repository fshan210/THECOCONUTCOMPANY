# Phase 4.3 Preview QA Report

## Scope

Preview-only release candidate for the motion foundation, tinted global header, coconut loader, About journey/puzzle, CMS-driven counters, and Shop configurator. Production was not modified.

## Local validation

| Check | Result |
|---|---|
| Targeted puzzle/configurator tests | PASS — 6/6 |
| TypeScript | PASS — `tsc --noEmit --incremental false` |
| ESLint | PASS — no warnings or errors |
| Repository test suites | PASS — 18/18 contracts, backend and infrastructure tests |
| Next.js production build | PASS — 86 static/dynamic routes generated |
| Broken-link crawl | Pending Preview |
| Runtime console audit | Pending Preview |
| Accessibility/keyboard audit | Pending Preview |
| Reduced-motion audit | Pending Preview |
| Lighthouse mobile/desktop | Pending Preview |

## Required viewport matrix

- 390px mobile
- 430px mobile
- 768px tablet portrait
- 1024px tablet landscape
- 1440px desktop
- 1920px desktop

## Manual gates

The following must be observed in the deployed Preview before any Production approval:

- route overlay exits and the page never remains hidden
- coconut silhouette and water fill are recognisable
- header text remains readable over light and image-backed heroes
- journey final stage is reachable and desktop sticky behavior releases
- puzzle accepts touch/keyboard legal moves and completion overlay appears
- configurator never blanks during rapid changes
- configured SKU/price/label remain synchronized in cart
- reduced-motion mode exposes all content without pinning or decorative loops
- no console errors, broken routes, or severe performance regression

Preview URL, browser results, Lighthouse scores and screenshots will be added after deployment. Until then this report deliberately does not claim visual acceptance.
