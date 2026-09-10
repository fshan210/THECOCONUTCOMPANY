# Commerce / default surface implementation map

Baseline: 93a01b2dbb2d207e4eff075a0332f131835d15d3. Clean worktree verified before source edits. User authorized preserving disabled checkout/payment and deferring successful-order confirmation after audit.

| Reference | Route / owner | Contract / disposition |
|---|---|---|
| Pop-up cart | Root layout → CartDrawer | Existing CartProvider and co-cart persistence; retain quantity/removal actions; saved POST uses existing BFF |
| Full cart | /cart → CartPage | Same cart, real preview prices, no stock/tax/discount/delivery invention |
| Wishlist | /wishlist → AccountPage → AccountCollections | Protected approved account surface; unchanged |
| Checkout | /checkout → dynamic utility route | Disabled launch state retained; no address collection or submit flow invented |
| Payment | /payment (new explicit route) | Disabled informational surface, no card fields/provider claims |
| Confirmation | No successful-order route | Deferred; backend orders route only returns PENDING_PAYMENT/UNPAID, detail NOT_IMPLEMENTED |
| Search | /search → utility route | Extend local search using existing published content readers; real supported facets only |
| Support/contact | /support, /contact, /faqs | Approved hello@cothecoconutcompany.com; existing mailto form; no fake sent state or live chat |
| Delivery/returns | /shipping-delivery, /returns, /refund-policy; /shipping-returns alias hub | Existing launchPages policy text verbatim; shipping coverage/windows not yet finalized |
| Legal centre | /legal, /privacy-policy, /terms-and-conditions, /terms, /cookie-policy | Existing launchPages documents; no invented dates, PDF, accessibility claims |
| 404 | app/not-found.tsx and /404 | Framework notFound preserved; real recovery links |
| 500 | app/error.tsx | reset callback, no fake notification claim |
| Offline | /offline | Existing route; reload retry; no new service worker |
| More from account | AccountShell tabs / existing profile, payments, security | Overlaps protected surfaces; candidate only; no fake rewards/subscriptions |

## Shared ownership and protected contracts
Root layout retains one CartProvider, CustomerAuthProvider, Navigation and Footer entry point. Target routes reuse ReferenceHeader/ReferenceFooter via these entry points. CartPage removes its duplicate DarkHeader/DarkFooter. Existing approved routes keep their current ownership. Loading / navigation bypass is limited to commerce route transitions. No API, middleware, session, pricing, infra, analytics or consent contracts change.

## Reference / asset decisions
All 12 supplied full-page boards and 15 scene images inspected from conversation. Full-page screenshots are composition references, never runtime UI. hero-2, hero-3, hero-4 are coconut-only environments and suitable for derivatives. Product-bearing scenes (hero, hero-1, hero-5 through hero-9, hero water and three mobile scenes) contain varied packaging: do not use as product truth. Use approved transparentProductAssets for independent products; no label edits, generated substitutes or stretched packaging. shipping.png contains branded packaging and remains reference-only. Derivatives generated from supplied coconut-only sources at desktop/mobile sizes. Mobile recomposes copy above scene rather than squeezing desktop.

## Design plan
Canvas #0A0908, panel #18120D, ivory #F1DECA, muted #BDAB98, copper #B77838, accent #D4A359. Existing Instrument Serif for headings and Roboto for copy. Full-width environmental hero with left editorial copy and right approved cutouts; grouped cart rows, 65/35 summary split; legal sidebar/document split; support FAQ/form with side contact modules. Narrow copper borders and restrained transform/opacity motion, disabled under reduced motion. No new fonts or animation dependencies.
