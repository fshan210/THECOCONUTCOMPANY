# Dashboard CMS Operations

## Routes

The default dashboard URL is `/control-center`. `ADMIN_BASE_PATH` or `NEXT_PUBLIC_ADMIN_PATH` can change it.

Managed modules:

- `/control-center/products`
- `/control-center/recipes`
- `/control-center/journal`
- `/control-center/testimonials`
- `/control-center/homepage`
- `/control-center/seo`
- `/control-center/media-library` for the existing local-media metadata workflow

The requested `/admin/...` URLs remain compatibility routes and redirect to the configured protected route.

## Editing content

1. Sign in with an authorized Firebase admin account.
2. Open a managed module.
3. Expand an existing item or **Create new**.
4. Use a stable ID. For products, recipes, and journal posts, keep ID and slug aligned where practical.
5. Fill the visible content and SEO fields.
6. Keep the record as **Draft** until content, claims, images, and metadata are reviewed.
7. Change status to **Published** and save when approved.

Successful saves write to Firestore, create an audit entry, and request cache/path revalidation. The dashboard returns a confirmation message.

## Archive behavior

**Archive as draft** is deliberately safer than hard delete. It changes the dynamic record to draft, records the event, and removes it from the public collection after revalidation. No destructive public delete endpoint exists.

## Product rules

- Price is optional. Currency must be a three-letter code such as `INR`.
- Preview/coming-soon products can remain price-free.
- Product/Offer JSON-LD appears only when a real price is visibly rendered and availability is `in-stock` or `out-of-stock`.
- Never add invented offers, reviews, ratings, stock, nutrition, or claims.
- New product images should use approved local public paths unless the Next.js remote-image allowlist is intentionally configured.
- This phase prepares cart/catalog data; it does not activate payment checkout.

## Recipe and journal rules

- Ingredients and steps are entered one item per line.
- Recipe JSON-LD uses published dashboard data and retains current fallback behavior.
- Journal body content is stored, but the current public site still renders collection cards. Standalone article routes belong in a later phase.

## Homepage rules

- Hero copy, primary/secondary CTAs, trust badges, and featured IDs are managed.
- Trust badges use validated JSON and only the approved `leaf`, `drop`, `cold`, and `palm` icon names.
- Featured IDs/slugs must refer to published records. Missing references fall back to the published collection.
- Layout, animation, typography, and campaign structure are not editable in this phase.

## SEO rules

- Manage title, description, canonical path, Open Graph image, and noindex per path.
- Canonicals must start with `/` and should resolve to the same public page.
- Product records carry their own SEO fields.
- Structured-data overrides can be stored but are not automatically emitted until an allowlisted validator is introduced.

## Read-only mode

If Firebase Admin credentials are unavailable, the CMS shows curated fallback records with a **Read-only fallback** badge and disables save/archive buttons. This is intentional: local files are not treated as a writable production database.

## Current limitations

- No rich-text editor, revisions UI, scheduled publishing, bulk import, or hard delete.
- Media library synchronizes approved local metadata; direct Firebase Storage uploads remain future work.
- No standalone recipe/article detail editor preview.
- No checkout, tax, shipping, inventory reservation, or payment gateway.
- Firestore security, backup, and environment provisioning must be maintained outside the dashboard.
