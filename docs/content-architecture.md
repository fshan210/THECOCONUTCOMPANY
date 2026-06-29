# Content Architecture

## Current system

The Phase 4 content flow is:

`Admin dashboard → protected server action → Firestore → cached content adapter → public website → curated local fallback`

Firebase is the existing application stack and remains the preferred content source. The separate FastAPI/PostgreSQL folder is not connected to the Next.js website and was not introduced into the content path.

## Authentication and authorization

- Admin sign-in uses Firebase email/password and Firebase token verification.
- The session token is stored in an HTTP-only, strict-same-site cookie.
- Middleware protects the configured admin base path, which defaults to `/control-center`.
- `/admin/*` is a compatibility route that redirects/rewrites to the configured base path.
- Every CMS write calls `requireAdminSession()` again and checks the module permission.
- Product writes require `commerce`; recipes, journal, testimonials, and homepage require `content`; SEO requires `seo`.
- Writes create best-effort Firestore audit-log records.
- No public write API was added.
- Production admin auth requires `ADMIN_SESSION_SECRET` or legacy `NEXTAUTH_SECRET` in addition to Firebase Web/Admin credentials.

## Content layer

The implementation lives in `lib/content/`:

- `types.ts`: canonical Product, Recipe, Journal, Testimonial, Homepage, SEO, and Media types.
- `fallback-data.ts`: maps the existing curated catalogue/editorial data into the canonical types.
- `validation.ts`: Zod validation for every Firestore record and every admin write.
- `content-source.ts`: `ContentSource`, `FirestoreContentSource`, and `FallbackContentSource` adapters.
- `server.ts`: cache-aware public getters with fallback and merge behavior.
- `revalidate.ts`: tag/path invalidation after a successful write.
- `actions.ts`: authenticated create/update/publish/archive server actions.

Public callers use:

- `getProducts()` / `getProduct(slug)`
- `getRecipes()`
- `getJournalPosts()`
- `getTestimonials()`
- `getHomepageContent()`
- `getSeoMetadata(path)`

They do not read Firestore directly.

## Firestore collections

- `products`
- `recipes`
- `journal`
- `testimonials`
- `homepage` (`homepage/homepage`)
- `seo`
- Existing `mediaLibrary`, `brandAssets`, `settings`, users, orders, and audit collections remain available.

Document IDs must match the record `id`. Product/recipe/journal slugs use lowercase kebab-case.

## Fallback contract

Firestore is optional for public rendering. If credentials are missing, a read fails, a record fails validation, or a collection has no published records, the site uses the curated content from `lib/catalog.ts`, `lib/content.ts`, and the Phase 4 fallback mappings.

Dynamic documents overlay fallback documents by `id`. A dynamic draft suppresses the matching fallback item, but the system restores the full fallback collection if an entire public collection would otherwise be empty. This prevents blank shop, recipe, journal, or testimonial sections.

## Public integrations

- Homepage: hero copy/CTAs/trust badges, featured products, featured recipes, featured testimonials, and homepage metadata.
- Shop: product listing, categories, product metadata, and cart catalogue.
- Product detail: product copy/assets, optional truthful displayed price, conditional Product/Offer schema, and related products.
- Recipes: listing/search/categories, featured recipe, metadata, and Recipe JSON-LD.
- Journal: listing/categories, metadata, and CollectionPage JSON-LD.
- About, Founders, Sustainability: dashboard SEO metadata with existing copy as fallback.
- Sitemap: published product routes are generated from the content layer.

## Content still intentionally static

- Public layout, header, footer, motion, and design tokens.
- About journey content, founder profiles/images, sustainability body sections, and most fixed campaign imagery.
- Homepage origin/lifestyle/business CTA sections except the managed hero and featured collections.
- Checkout/payment processing; product records are ecommerce-ready but payments are not live.
- Journal and recipes remain collection pages; standalone detail routes are a later phase.
- Structured-data overrides are stored but not automatically rendered. Arbitrary dashboard JSON-LD needs an approval/allowlist layer before it can be safely published.

## Required configuration

Public fallback rendering needs no database variable. Admin writes require either:

- `FIREBASE_SERVICE_ACCOUNT_JSON`, or
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`.

Admin login also needs the existing `NEXT_PUBLIC_FIREBASE_*` web configuration, an active admin record or matching `ADMIN_EMAIL`, and a strong `ADMIN_SESSION_SECRET` or legacy `NEXTAUTH_SECRET`. Never expose Admin SDK credentials to the browser.

## Phase 4.2 Firebase verification

The local production-activation pass verified:

- Firebase project: `cothecoconutcompany`.
- Existing web app ID: `1:551997734422:web:d6712a9d4de027dbc67f37`.
- Firestore: reachable by Firebase Admin SDK.
- Firebase Auth: reachable, with `fshan210@gmail.com` present and email verified.
- Admin SDK: initialized from local service-account credentials without committing or printing secret values.
- Client SDK: initialized from Firebase web config captured from the authenticated Firebase Console.
- Storage: not required. CMS media continues to use existing `/public` asset paths or external image URLs.
- CMS collections: `products`, `recipes`, `journal`, `testimonials`, `homepage`, `seo`, `admins`, `auditLogs`, and `securityEvents` are reachable.

The public website remains fallback-first: if Firestore credentials are missing or a read fails, public pages render curated static content instead of crashing.
