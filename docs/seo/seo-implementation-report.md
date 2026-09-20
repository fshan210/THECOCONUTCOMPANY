# SEO implementation report

Baseline SHA: `0136486888cd3f2ef7b412bb9a9933dc161bf349`

## Indexation policy

Durable public company, commerce, recipe, editorial, support, and policy documents are indexable. Authentication, customer, order, transactional, search-result, administrative, API, offline, status, and error surfaces are noindex. The complete route matrix is in `docs/seo/seo-route-audit.md`.

## Metadata architecture

`lib/seo/metadata.ts` owns the canonical Production origin, title suffix, canonical normalization, Open Graph, Twitter cards, and explicit robots directives. Public dynamic metadata derives from existing product, recipe, homepage, and SEO content sources. No second recipe identity or metadata catalog was introduced.

The site is English-only. The document retains `lang="en-IN"`; fake alternate-language links were removed. Social URLs and images resolve against the Production `metadataBase`.

## Canonical strategy

Every indexable document emits an apex HTTPS self-canonical under `https://cothecoconutcompany.com`. Query-driven shop, search, and Journal UI states do not create separate canonical documents. `www`, `/products`, `/sign-in`, `/sign-up`, `/terms`, and `/our-story` use one-hop permanent redirects to their canonical routes.

## Preview index safety

When Vercel supplies a non-Production `VERCEL_ENV`, `next.config.mjs` adds `X-Robots-Tag: noindex, nofollow, noarchive` to every response. Preview pages still emit Production canonicals and structured URLs. The exact deployed header remains a Preview QA gate.

## Sitemap and robots

`lib/seo/routes.ts` is the deterministic public-route registry used by `app/sitemap.ts`. It includes published products and recipes, deduplicates URLs, uses the canonical host, excludes all private/utility routes, and does not fabricate `lastModified` values.

`robots.txt` declares the canonical primary and image sitemaps. It excludes API and administrative crawl surfaces. HTML private/utility pages carry noindex metadata; robots.txt is not used as a privacy control. The former news sitemap is no longer advertised because Journal stories are not independent canonical article routes.

## Structured data

- Home: Organization, WebSite, and visible FAQPage content.
- Shop/Recipes: CollectionPage plus linked ItemList entries.
- Product detail: BreadcrumbList; Product is emitted only when the catalog provides an authoritative numeric price, currency, and in-stock/out-of-stock state.
- Recipe detail: BreadcrumbList and Recipe only when the canonical record contains a real image, ingredients, and instruction steps.
- Journal: CollectionPage and BreadcrumbList. Article is intentionally omitted because stories currently open as client-side query/dialog states rather than canonical detail documents.
- Public company/support/legal pages: BreadcrumbList; Support/FAQs also use visible FAQPage content.

All schema IDs and URLs use the canonical Production origin. No ratings, reviews, GTINs, MPNs, nutrition facts, editorial dates, addresses, social accounts, or inventory values are fabricated. JSON-LD serialization escapes script-breaking characters.

## Route noindex coverage

Account and order routes, wishlist, saved recipes, profile, cart, checkout, payment, tracking, search, login, register, verification, reset, status, offline, admin, API, and error routes are excluded from indexation and all sitemaps. Private route coverage is a permanent SEO test.

## Tests and QA

- `npm run test:seo`: metadata, canonical, sitemap, robots, recipe identity/schema, unsupported entity omission, private-route source coverage, Preview header ownership, redirect hygiene, and JSON-LD safety.
- `npm run qa:seo -- <base-url>`: rendered status, title, description, canonical, robots, H1, expected JSON-LD, sitemap, robots.txt, private-route redirects, and actual 404 behavior.
- Set `EXPECT_PREVIEW_NOINDEX=1` when running the crawl QA against an immutable Vercel Preview.

## Known limitations

- Journal entries have no canonical server-rendered detail routes. Query/dialog story states are intentionally canonicalized to `/journal`, omitted from the sitemap, and not marked as Article.
- Ten legacy recipe records currently lack instruction steps. Their pages retain canonical metadata and sitemap discovery, but Recipe JSON-LD is withheld rather than fabricated. Canonical recipes with complete ingredients and steps receive Recipe markup.
- The current catalog uses `preview`/`coming-soon` availability rather than a live authoritative commerce state. Product JSON-LD is withheld until price and availability meet the schema contract.
- Google/Bing verification depends on deployment environment values and user-owned webmaster accounts.
- Security hardening, dependency remediation, payment activation, and shipping activation are explicitly deferred.
