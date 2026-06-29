# Phase 4 CMS Foundation Report

## Outcome

Phase 4 establishes a safe lightweight CMS without redesigning the public website. Firestore is the optional dynamic source, server actions are the only write path, and curated static content remains the permanent availability fallback.

## Architecture found

- Existing Firebase Web/Auth/Admin, Firestore collection constants, admin cookie sessions, RBAC, CSRF/login protection, rate limiting, and audit logs.
- Existing protected dashboard at a configurable base path (default `/control-center`).
- Existing module pages were visual placeholders rather than persistent CMS editors.
- No `app/api` routes and no public content write endpoint.
- Products/recipes in `lib/catalog.ts`, journal in `lib/content.ts`, and homepage testimonials/copy inside components.
- Existing local media manifest and Firestore media metadata synchronization.
- Unconnected FastAPI/PostgreSQL foundation was left untouched.

## Implemented

- Canonical typed models for products, recipes, journal, testimonials, homepage, SEO, and media.
- Firestore and fallback adapters behind one `ContentSource` interface.
- Zod validation on database reads and writes.
- Authenticated create/update/draft/publish/archive server actions with permission checks and audit logs.
- Dashboard editors for products, recipes, journal, testimonials, homepage, and SEO.
- Optional real price/currency/availability fields without activating checkout.
- Homepage, shop, product detail, recipes, journal, cart catalogue, SEO metadata, JSON-LD, and sitemap content-layer integration.
- Five-minute cache plus authenticated on-demand revalidation.
- Safe behavior when Firestore is absent, unavailable, empty, or contains invalid records.

## Dynamic now

- Homepage hero text, CTAs, trust badges, featured products, featured recipes, featured testimonials, and metadata.
- Product catalogue/detail content, categories, cart lookup, product SEO, displayed price, and truthful conditional Product/Offer schema.
- Recipe listing/search/featured content, SEO, and Recipe schema.
- Journal cards/categories, SEO, and CollectionPage data.
- About, Founders, and Sustainability SEO records.
- Published product sitemap routes.

## Still static by design

- Approved public layout, styling, header/footer, typography, motion, and fixed story sections.
- Founder profile content/images and About/Sustainability main body content.
- Checkout and payment processing.
- Recipe and journal detail routes.
- Direct media uploads and arbitrary structured-data publication.

## Quality and security

- Public content never depends on a successful database connection.
- Admin middleware and server-side permission checks protect every write.
- No Firebase Admin secret or other credential is sent to the client.
- No `.env` or secret file is committed.
- No public mutation/revalidation route exists.
- Product rich-result data remains absent unless a real displayed price and factual stock state are provided.
- GA4, robots, canonical helpers, and existing SEO foundations remain intact.

## Verification

- `npm run lint`: PASS
- `npx tsc --noEmit --incremental false`: PASS
- `npm run build`: PASS
- Public routes `/`, `/shop`, `/recipes`, `/journal`, `/about`, `/founders`, and `/sustainability`: HTTP 200
- `/robots.txt` and `/sitemap.xml`: HTTP 200; sitemap contains the expected 13 fallback URLs
- Admin compatibility and configured routes: redirect to protected `/control-center/login` when unauthenticated
- No-database mode: all required public routes render curated content
- Simulated invalid/unavailable Firebase Admin credentials: homepage, shop, recipes, journal, and sitemap still return HTTP 200
- GA4 measurement ID and homepage canonical remain present
- Preview product route emits no Product schema; recipes retain 11 truthful Recipe items

## Recommended Phase 4.5 / Phase 6 work

1. Add revision history, preview URLs, scheduled publishing, and restore controls.
2. Add approved Firebase Storage uploads with MIME/size validation and image metadata.
3. Add standalone `/recipes/[slug]` and `/journal/[slug]` routes with complete editorial models.
4. Add a safe allowlist/validator for structured-data overrides.
5. Add stock/SKU variants, tax/shipping rules, and a payment gateway only after commercial approval.
6. Add automated Firestore backups, emulator integration tests, and monitoring for fallback activation.
7. Replace placeholder dashboard analytics with connected, truthful reporting before operational use.
