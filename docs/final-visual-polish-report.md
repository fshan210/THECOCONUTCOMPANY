# Final visual polish report

## Scope

This pass preserves the approved shop, newsletter, puzzle, ripple exclusions, Dock header, Magic Bento, Outside the Shelf, Journal, existing Day sequence, and CDN media architecture. It refines only the Day sequence's spatial blending, solar treatment, and scene-specific readability.

## Issues resolved

| Area | Issue observed | Fix | Evidence | Status |
| --- | --- | --- | --- | --- |
| Day entry | The environment began after a visible pale band and read as an embedded rectangle. | Moved the Day stage into an 18vh desktop / 14vh compact transition field; added a masked opening-image bleed and dedicated intro readability field. | Local visual capture: Day entry at 1280px and 390px. | PASS |
| Day exit | The sticky stage released while the final state was still dark, exposing a hard transition to Outside the Shelf. | Advance the final photo, moon, and base-colour dissolve so the Day field reaches site ivory before sticky containment releases. | Local visual capture: Day exit at 1280px. | PASS |
| Solar object | Solar geometry had either weak glow or a clipped, flat luminous disc. | Retained the shader sphere; balanced granular emissive surface detail and added three shader corona scales: tight limb, medium halo, broad spill. | Local visual capture: noon at 1280px and 768px. | PASS |
| Day copy | One global treatment did not work over all environments. | Centralized per-scene opacity, brightness, contrast, text tone, scrim, and foreground-shadow controls in `dayMoments`. | Browser-computed copy colours and scene filters. | PASS |
| 18:10 | Environment competed with the Hair Serum media and text was weak. | Set 18:10 environment strength to 0.30, brightness to 0.88, contrast to 0.84; added a feathered dark local field and stronger foreground shadow. | Local visual capture: 1280px and 390px. | PASS |
| Compact celestial scale | Mobile solar object was visually too dominant at 18:10. | Reduced only the compact WebGL solar scale from 0.76 to 0.56. | Local visual capture: 390px. | PASS |

## Browser geometry QA

All checks below used the local production-equivalent application build. No tested page exceeded the viewport width.

| Coverage | Viewports | Result |
| --- | --- | --- |
| Home breakpoint sweep | 320x568, 360x800, 375x812, 390x844, 430x932, 768x1024, 1024x768, 1280x800, 1440x900, 1728x1080, 1920x1080 | PASS: no horizontal overflow; header present at every size. |
| Desktop routes | `/`, `/about`, `/products`, `/shop`, representative Water/Kitchen/BOTANiCA/MELT PDPs, `/recipes`, a recipe, `/sustainability`, `/founders`, `/journal`, a journal article, invalid route | PASS at 1280x800: no horizontal overflow, header and main present. |
| Mobile routes | Same route coverage | PASS at 390x844: no horizontal overflow, header present. |
| Day visual review | Desktop 1280px, tablet 768px, mobile 390px | PASS for entry, noon solar, 18:10 hierarchy, and exit blend. |

## Validation

- `npm run typecheck`
- `npm run lint -- --quiet`
- `npm run test:frontend` (15 passing)
- `git diff --check`
- `npm run build`

## Deployment status

Preview deployment is blocked by Vercel CLI authorization (`Not authorized`). Production has not been deployed.
