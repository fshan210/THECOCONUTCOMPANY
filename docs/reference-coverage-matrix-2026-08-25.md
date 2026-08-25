# .CO reference coverage matrix

This document maps the approved 25 August 2026 reference set to the production implementation. The screenshots are QA specifications only and are never rendered as page backgrounds.

| Reference | Route/state | Production section | Approved scene assets | Interaction | Responsive treatment | Status |
| --- | --- | --- | --- | --- | --- | --- |
| recepie-1 | `/recipes` | Table hero, category rail, cultural entry | `RECIPIE HERO IMAGE`, `RECIPIE BRINGS CULTURE TOGETHER`, canonical product cutouts | anchors, category selection | reflow + horizontal category scroll | mapped |
| recepie-2 | `/recipes` | Global cuisine stage, Recipe of the Moment | supplied recipe photography, canonical Kitchen cutouts | carousel, save, variation tabs | controlled horizontal scroll | mapped |
| recepie-3 | `/recipes` | Recipe Lab, One Product / Three Worlds | `Kerala Vegetable Stew`, Thai/Brazil recipe images, canonical cutouts | configurator, surprise, save | stacked panels | mapped |
| recepie-4 | `/recipes` | Lifestyle discovery, searchable recipe index | supplied lifestyle and recipe photography | mood selection, search, filters, load more | horizontal discovery + grid reflow | mapped |
| recepie-5 | `/recipes` | Community, passed-around story, newsletter/footer | `GOOD FOOD GET'S PASSED AROUND`, supplied lifestyle photography | carousel, recipe links, subscription | controlled carousel + stacked CTA | mapped |
| sustainablity-1 | `/sustainability` | Pollachi hero, four principles | `COCONUT HERO IMAGE` | trace/follow anchors | hero crop + principle scroll | mapped |
| sustainbality-2 | `/sustainability` | Trace batch, route map, seasonal rhythm | CSS/SVG map and chart | batch lookup, QR boundary | map stacks beneath lookup | mapped |
| sustainbality-3 | `/sustainability` | Whole coconut material flow | `NOTHING WASTED...`, canonical cutouts | methodology disclosure | horizontal flow canvas | mapped |
| sustainablity-4 | `/sustainability` | Safe impact calculator, people | `WHAT DOES YOUR COCONUT LEAVE BEHIND`, `IMPACT SHOULD REACH PEOPLE TOO` | product/quantity selection | stacked calculator | mapped; unverified impact figures suppressed |
| sustainbality-5 | `/sustainability` | Receipts, roadmap, closing | `A BETTER COCONUT SYSTEM STARTS AT THE SOURCE` | evidence/roadmap disclosure | table scroll + stacked roadmap | mapped; unsupported verification claims suppressed |
| journal-1 | `/journal` | Tabletop hero, ticker, Editor's Desk | `STORIES FROM THE COCONUT...`, community scene | anchors, save story | split feature stacks | mapped |
| journal-2 | `/journal` | Editorial index, Field Notes | approved journal/recipe/sustainability scenes | filters, search, sort, carousel | masonry to single column | mapped |
| journal-3 | `/journal` | Ask the Farm, answers, configurator | approved community and recipe scenes | topic form boundary, accordion, configurator | stacked panels | mapped |
| journal-4 | `/journal` | Explainers, community, Husk Stack, day builder | approved lifestyle scenes | carousel, stack, ritual actions | horizontal scroll + columns stack | mapped |
| journal-5 | `/journal` | People, series, Most Read, contribution, archive | approved community/tabletop scenes | search, archive, story actions | portrait rail + stacked cards | mapped |
| popup-cart | global drawer | Cart drawer | canonical product cutouts | focus trap, quantity, save/remove, add-on, close | full-width mobile drawer | mapped |
| cart | `/cart` | Order review | canonical product cutouts, recipe scene | quantity, save/remove, promo boundary, checkout | summary follows lines on mobile | mapped |
| signin-signup | `/login`, `/register` | Editorial authentication shell | approved product/tabletop scene | real Cognito forms | split becomes stacked | mapped |
| profile | `/account`, `/profile` | Continuity hub and settings | canonical product cutouts | real session/account links | dashboard modules stack | mapped |
| wishlist | `/wishlist` | Saved-intent hub | canonical product cutouts | real saved-content and cart actions | product grid reflows | mapped |

## Preservation boundaries

- Existing Cognito actions, customer sessions, cart persistence, content loading, SEO, route structure and saved-content APIs remain authoritative.
- The screenshots contain unsupported environmental and workforce figures. Production UI retains the approved geometry but does not claim those figures as verified facts.
- Reference screenshots remain outside `public/` and are used only for comparison.
