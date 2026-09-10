# Commerce Preview validation

Base: `93a01b2dbb2d207e4eff075a0332f131835d15d3`.

Local validation passed: frontend (50), contracts (5), backend (11), infrastructure (3), lint, frontend/backend typecheck, infrastructure synth, production build and diff whitespace check. Production smoke: 6 page routes, 4 infrastructure routes, 144 assets, no failures.

Browser matrix covers 20 routes at 1440, 1280, 768, 430, 390 and 375 pixels: expected HTTP status, single header/footer, no horizontal overflow or page errors. 375 uses reduced motion. Additional real scrolling confirmed lazy editorial images load; captures must wait for images before evaluating visual fidelity.

Twenty desktop/mobile interaction groups cover cart quantity/persistence/removal/empty states, drawer focus trap/Escape/focus return/backdrop, anonymous save redirect and intercepted save failure, search/filter/sort/add-to-cart, help search/FAQ/form validity, cookie preferences, legal anchors and disabled checkout/payment.

Protected baseline comparison: 22 routes at desktop/mobile, 42 of 44 initial screenshots identical. Controlled repeat of Home and Email Verified with settled motion matched exactly at both widths. Account-family comparisons cover anonymous authentication boundaries; no authenticated customer credentials were used.

Caveats: successful order/payment remains deferred as authorized. Authenticated saved-content persistence is not end-to-end verified. No artificial production server failure was induced; error boundary retains the framework reset callback. Contact retains the existing mailto contract, not a message-delivery API. Legal copy and launch policy limitations remain authoritative.

Machine-readable evidence and screenshots are retained outside the source tree in `/private/tmp/co-commerce-qa`. Deployed Preview results and provenance are reported with the PR handoff.
