# Core commerce backend ownership map

Baseline audited: `origin/main` at `de9df24ab122f7fe709d1e1d3e2a3ec40e9d4b29`.

This document records the pre-repair ownership and the intended authority for the core commerce phase. The approved visual implementation, Cognito authentication, checkout/payment presentation, and route structure are outside the change boundary.

## Ownership summary

| Subsystem | UI owner | Client state owner | API owner | Persistence owner | Authentication | Root cause on the baseline | Intended authority / repair |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Auth | `CustomerAuthForms`, `CustomerAuthProvider`, protected account layouts | `CustomerAuthProvider` mirrors the server session | Next Cognito BFF under `app/api/auth/cognito`; AWS Cognito | Cognito plus encrypted split HttpOnly session cookies | Required for customer data | No commerce defect found. Auth is working and must not be replaced. | Unchanged Cognito/BFF/cookie architecture. Commerce BFFs derive the bearer token only from the server-side session cookie. |
| Cart | Root `CartProvider`; `CartDrawer`, `CartPage`, shop/home/account/search/configurator entry points | `lib/cart/cart-context.tsx` | Unused Hono routes under `backend/src/routes/cart.ts`; no Next cart BFF | Browser `localStorage` key `co-cart`; disconnected DynamoDB `CART` record | Baseline API requires auth; browser cart does not | Frontend never calls the cart API. Client-submitted `unitPrice` controls totals. Server PATCH/DELETE/clear do not persist. Server catalog IDs/prices do not match the UI catalog or configured variants. There is no guest-to-customer merge, idempotency, conflict handling, or customer isolation in browser state. | Guest cart remains a validated browser draft. When signed in, the server/DynamoDB cart is authoritative. A same-origin Next BFF authenticates from HttpOnly cookies, merges the guest cart exactly once, and returns catalog-resolved lines/totals. All signed-in mutations reconcile to the server response. |
| Wishlist / saved products | Shop hearts/quick view and Account Wishlist | Separate `useSavedContent("product")` instances plus local Account collection state | Next `/api/customer/saved` -> Hono `/v1/wishlist` and `/v1/saved` | DynamoDB `WISHLIST.productIds` | Required; unauthenticated UI redirects with return path | Persistence exists, but read-modify-write of the whole wishlist can lose rapid concurrent updates. React pending state is not a synchronous guard. Instances do not broadcast committed state, load errors are silent, and content IDs are not checked against the catalog. | One saved-content API and one browser synchronization channel. Atomic/idempotent server mutations validate product catalog IDs; optimistic state rolls back and reports failure. Account and discovery surfaces consume the same persisted record. |
| Saved recipes | Recipes cards/detail, Journal recipe integrations, Account Saved Recipes | Separate `useSavedContent("recipe")` instances plus local Account collection state | Same saved-content BFF/API as wishlist | DynamoDB `WISHLIST.recipeIds` | Required; unauthenticated UI redirects with return path | Same lost-update and duplicate-request risks as product saves. The API accepts any syntactically valid recipe ID and client instances can remain stale until reload. | Reuse the saved-content service. Constrain saved-content identifiers at the contract boundary, make save/remove idempotent and concurrency-safe, broadcast committed state, preserve auth return paths, and rollback failures. Server-side membership validation against the editorial recipe source remains deferred until that source has a backend-facing contract. |
| Profile | Account/Profile forms and summaries | Server-rendered account data; form transition state | Server actions -> Hono `/v1/me` | DynamoDB `PROFILE` | Verified customer required for mutation | Real persistence exists. Errors are reduced to generic messages; full customer deletion currently deletes only `PROFILE`, not all customer-owned commerce records. | Keep the existing schema/API. Persist supported profile fields only; document unsupported data honestly. Account deletion cleanup beyond the profile is deferred to the hardening phase unless required for data-isolation tests. |
| Addresses | Account Address Book | Server-rendered list plus local edit/delete UI state | Server actions -> Hono `/v1/me/addresses` | DynamoDB items at `PK=USER#<authenticated sub>`, `SK=ADDRESS#<id>` | Verified customer required; user ID never comes from browser | Ownership isolation is structurally correct. Setting a default does not clear another default. PATCH can create a caller-chosen missing ID, DELETE reports success for missing IDs, and writes are not concurrency guarded. | Authenticated partition remains authoritative. Normalize validated fields, enforce at most one default, require an existing resource for edit/delete, and return 404/409 semantics without accepting a browser customer ID. |
| Preferences | Account Preferences | Server-rendered profile plus transient local accessibility controls | `saveAccountPreferences` -> Hono `/v1/me` | DynamoDB `PROFILE` for supported fields | Verified customer required | `preferredCategory`, newsletter and marketing opt-ins, profile address, phone and names are real. Larger text/reduce-toggle-motion are local UI controls only. No schema exists for content/recipe/sustainability/notification preferences or delivery notes. | Persist only fields already supported by `mePatchSchema`; classify all other toggles/preferences as deferred rather than introducing parallel storage. |
| Catalog | Shop/Home/Account/product detail and configurator | Server-fetched `ContentProduct[]` with curated fallback data; configurator has local variant data | Hono `/v1/products`; server pricing service | Curated repository data plus optional content source | Public reads; server authority for commerce mutations | Frontend has nine slug-based products and configured `.CO Water` SKUs/prices in rupees. Backend has four stale product IDs and paise-style prices, while order pricing duplicates another map and turns unknown products into zero-price lines. | A single backend catalog resolves accepted product slug/ID, variant availability, authoritative INR unit amount, and line metadata. Cart and order preview must reject unknown/unavailable items and ignore browser prices. |
| Checkout boundary | Existing Cart/Checkout/Payment surfaces | Cart selection only | Order preview/create routes exist but are not wired to live UI | No real order/payment persistence | Auth currently required by order routes | `/v1/orders` fabricates a pending order ID despite payment and fulfilment being deferred; order pricing uses the stale catalog. | Keep all payment, shipping, fulfilment and real order creation disabled. Cart totals may be server-calculated, but no real order, transaction ID, payment capture or shipment is created in this phase. |

## Cart entry-point trace

All current add/update/remove paths converge on the single root `CartProvider`; no duplicate React provider was found.

- Shop product cards and quick view: `components/shop/ReferenceShopPage.tsx`.
- Shop bundle builder and curated bundles: `components/shop/ShopBundleBuilder.tsx`.
- Configured `.CO Water` variants: `components/shop/ProductConfigurator/ProductConfigurator.tsx`.
- Product/detail shared button: `components/cart/AddToCartButton.tsx`.
- Home routines and product recommendations: `components/home/ReferenceHomePage.tsx` and `components/home/CinematicHomePage.tsx`.
- Account recommendations and saved products: `components/account/AccountCollections.tsx`.
- Search results: `components/commerce/SearchSurface.tsx`.
- Cart cross-sell/related shop modules: `components/shop/ReferenceShopPage.tsx`.
- Quantity/remove: `components/commerce/CartItems.tsx`.

The root provider is mounted once in `app/layout.tsx`. The failure is therefore an authority/API mismatch, not provider duplication.

## Persistence and legacy paths

- Active backend: TypeScript/Hono Lambda in `backend/src`, API Gateway HTTP API, Cognito authorizer, and DynamoDB tables from `infra/lib/dotco-backend-stack.ts`.
- Active customer bridge: server-only `lib/customer/aws-api.ts`, which forwards the Cognito access token read from the encrypted HttpOnly session.
- Catalog/content fallbacks: `lib/content/fallback-data.ts` and `lib/content/content-source.ts` are curated content fallback paths, not customer-state persistence.
- Local backend tests: `backend/src/services/user-data.ts` uses an in-memory map only when `APP_ENV=local`; deployed environments use DynamoDB.
- Legacy only: `backend/app` is an unused Python/FastAPI/Postgres skeleton and is not an authority for this repair.
- Browser storage: `co-cart` is the only commerce-state localStorage key. Other localStorage uses found are consent/welcome/editorial experience state or QA fixtures, not customer commerce authority.

## Account module classification

| Module | Classification | Evidence / boundary |
| --- | --- | --- |
| Profile identity, phone, preferred category, profile address | REAL + FUNCTIONAL | Read/write through `/v1/me` to DynamoDB. |
| Newsletter and marketing opt-ins | REAL + FUNCTIONAL | Fields exist in `mePatchSchema` and the stored profile. |
| Address book | REAL + FUNCTIONAL after invariant repair | CRUD exists and is scoped by authenticated Cognito subject. |
| Wishlist and saved recipes/content | REAL + FUNCTIONAL after concurrency/synchronization repair | Stored in the DynamoDB wishlist record. |
| Orders list | REAL + READ-ONLY empty boundary | API returns an honest empty list; no live order source exists. |
| Order detail | DEFERRED | API explicitly returns `NOT_IMPLEMENTED`. |
| Payments/cards | DEFERRED | UI states that payment methods are unavailable and stores none. |
| Two-factor setup/device history/remote sign-out | UNSUPPORTED | UI directs the customer to existing recovery/support paths. |
| Rewards, referrals, subscriptions, shipping status, transaction IDs | UNSUPPORTED | No authoritative backend source; must not be fabricated. |
| Larger text/reduce toggle motion | ILLUSTRATIVE local UI preference | Component state only; no backend field exists. |
