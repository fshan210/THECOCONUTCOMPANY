# Account reference rebuild QA

This change gives the authenticated account group one shared cinematic shell across `/account`, `/orders`, `/orders/history`, `/orders/[orderId]`, `/account/addresses`, `/wishlist`, `/saved-recipes`, `/profile`, `/account/security`, `/account/payments`, and the real empty-account boundary.

The routes continue to use the existing Cognito session, protected-route redirect, customer BFF endpoints, saved-content store, and cart provider. Live API failures render an unavailable state instead of claiming that the account contains zero items. Unsupported payment, device-management, all-device sign-out, and carrier-tracking actions are identified as unavailable rather than simulated.

The account scenes in `public/assets/redesign/account` are deterministic WebP conversions of the eight supplied source backgrounds. Product imagery comes from the repository's approved transparent product assets. Each scene has a provenance sidecar.

## Local verification

The local fixture is isolated from application code and uses `QA-ILLUSTRATIVE-*` order IDs. It exists only to exercise authenticated UI states without production customer data.

1. Start `node scripts/qa-account-fixture.cjs`.
2. Start the built app with the local test session key and `CUSTOMER_API_BASE_URL=http://127.0.0.1:4319`.
3. Run `node scripts/qa-account.cjs`.

The browser suite covers the 11 protected routes at 1440, 1280, 768, 430, 390, and 375 pixels, as well as order filtering and pagination, saved-item persistence, cart integration, profile and legacy address persistence, reusable address CRUD, unavailable-state truthfulness, logout, and protected return-path redirects.
