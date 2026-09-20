# SEO route and indexation audit

Baseline: `0136486888cd3f2ef7b412bb9a9933dc161bf349`
Canonical origin: `https://cothecoconutcompany.com`
Audit date: 2026-09-14

## Policy

- Public editorial, product, recipe, company, support, and policy pages are indexable when they contain durable standalone content.
- Account, order, authentication, transactional, search-result, status, offline, error, and administrative pages are `noindex`.
- Indexable pages use an apex HTTPS self-canonical. Query-driven UI state is not a separate canonical document.
- Preview and local/non-production deployments must send `X-Robots-Tag: noindex, nofollow, noarchive` while retaining Production canonicals.
- Only canonical, indexable, 200-status URLs belong in the XML sitemap. API and authenticated routes never belong in a sitemap.
- The site has one English experience. `lang="en-IN"` is accurate; no alternate-language `hreflang` is emitted.

## Route inventory

| Route | Page type | Index? | Follow? | Canonical | Title source | Description source | Schema type | Sitemap? | Notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | ---: | --- |
| `/` | Public home | Yes | Yes | `/` | Homepage CMS/fallback | Homepage CMS/fallback | Organization, WebSite | Yes | One visible H1; global entity schema belongs here. |
| `/about` | Public company | Yes | Yes | `/about` | SEO CMS/fallback | SEO CMS/fallback | BreadcrumbList | Yes | Crawlable links to founders, shop, and sustainability. |
| `/founders` | Public company | Yes | Yes | `/founders` | SEO CMS/fallback | SEO CMS/fallback | Person, BreadcrumbList | Yes | Person facts must remain limited to public page content. |
| `/sustainability` | Public editorial | Yes | Yes | `/sustainability` | SEO CMS/fallback | SEO CMS/fallback | BreadcrumbList | Yes | Metadata must retain the page's modelled/proposed/evidence-pending distinctions. |
| `/shop` | Public collection | Yes | Yes | `/shop` | SEO CMS/fallback | SEO CMS/fallback | CollectionPage/ItemList, BreadcrumbList | Yes | Filter/query UI canonicalizes to the base collection. |
| `/shop/[slug]` | Public product detail | Yes when product exists | Yes | `/shop/{canonical-slug}` | Canonical product content | Canonical product content | Product when price/currency/availability are authoritative; BreadcrumbList | Yes | Unknown slugs return 404/noindex. No ratings, GTIN, MPN, or inventory claims. |
| `/products` | Legacy alias | No document | N/A | Redirects to `/shop` | N/A | N/A | None | No | Permanent one-hop redirect. |
| `/recipes` | Public collection | Yes | Yes | `/recipes` | SEO CMS/fallback | SEO CMS/fallback | CollectionPage/ItemList, BreadcrumbList | Yes | Do not emit every Recipe entity on the listing page. |
| `/recipes/[slug]` | Public recipe detail | Yes when recipe exists | Yes | `/recipes/{canonical-slug}` | Canonical recipe catalog | Canonical recipe catalog | Recipe, BreadcrumbList | Yes | Canonical identity is `components/recipes/recipe-data.ts` via `lib/recipes/canonical.ts`; unknown slugs return 404/noindex. |
| `/journal` | Public editorial collection | Yes | Yes | `/journal` | SEO CMS/fallback | SEO CMS/fallback | CollectionPage, BreadcrumbList | Yes | Stories currently open as `?story=` client dialogs; those query states canonicalize to `/journal` and are not separate article URLs. |
| `/journal?story={slug}` | Journal UI state | No separate document | Yes | `/journal` | Journal index | Journal index | None beyond collection | No | Not a server-addressable detail route; do not advertise hash/query pseudo-articles as Article pages. |
| `/journal/social-cocreation-hub` | Public interactive editorial | Yes | Yes | Same path | Route metadata | Route metadata | BreadcrumbList | Yes | Interactive content is server-addressable and has a visible H1. |
| `/contact` | Public support | Yes | Yes | `/contact` | Route metadata | Route metadata | BreadcrumbList | Yes | Visible support content and crawlable policy/product links. |
| `/support` | Public support | Yes | Yes | `/support` | Launch-page content | Launch-page content | BreadcrumbList; FAQPage only for visible real Q&A | Yes | Durable help surface. |
| `/faqs` | Public support | Yes | Yes | `/faqs` | Launch-page content | Launch-page content | BreadcrumbList; FAQPage | Yes | Visible real questions and answers. |
| `/shipping-returns` | Public support hub | Yes | Yes | `/shipping-returns` | Route metadata | Route metadata | BreadcrumbList | Yes | Existing dedicated alias/hub; link graph should not orphan it. |
| `/shipping-delivery` | Public support | Yes | Yes | Same path | Launch-page content | Launch-page content | BreadcrumbList | Yes | Current launch-readiness guidance, not live-commerce promises. |
| `/returns` | Public support | Yes | Yes | `/returns` | Launch-page content | Launch-page content | BreadcrumbList | Yes | Current policy guidance. |
| `/refund-policy` | Public policy | Yes | Yes | Same path | Launch-page content | Launch-page content | BreadcrumbList | Yes | Current policy guidance. |
| `/legal` | Public policy hub | Yes | Yes | `/legal` | Route metadata | Route metadata | BreadcrumbList | Yes | Existing dedicated hub; crawlable legal tabs. |
| `/privacy-policy` | Public legal | Yes | Yes | Same path | Launch-page content | Launch-page content | BreadcrumbList | Yes | Legal copy is unchanged. |
| `/cookie-policy` | Public legal | Yes | Yes | Same path | Launch-page content | Launch-page content | BreadcrumbList | Yes | Legal copy and consent architecture are unchanged. |
| `/terms-and-conditions` | Public legal | Yes | Yes | Same path | Launch-page content | Launch-page content | BreadcrumbList | Yes | Primary terms URL. |
| `/terms` | Legacy legal alias | No document | N/A | Redirect to `/terms-and-conditions` | N/A | N/A | None | No | Should be a permanent one-hop redirect, not a duplicate indexable page. |
| `/careers` | Public company utility | Yes | Yes | `/careers` | Launch-page content | Launch-page content | BreadcrumbList | Yes | Standalone public content; no invented openings. |
| `/community` | Public editorial utility | Yes | Yes | `/community` | Launch-page content | Launch-page content | BreadcrumbList | Yes | Links to the public co-creation hub. |
| `/our-story` | Legacy company alias | No document | N/A | Redirect to `/about` | N/A | N/A | None | No | Prefer one canonical company-story URL. |
| `/search` and `/search?*` | Public search utility | No | Yes | `/search` | Launch-page content | Launch-page content | None | No | Prevent arbitrary query indexation while retaining crawlable result links. |
| `/track-order` | Transactional utility | No | No | `/track-order` | Launch-page content | Launch-page content | None | No | Not useful without an order context. |
| `/cart` | Transactional utility | No | No | `/cart` | Route metadata | Route metadata | None | No | Cart content is customer/session state. |
| `/checkout` | Transactional utility | No | No | `/checkout` | Launch-page content | Launch-page content | None | No | Payment remains disabled/deferred. |
| `/payment` | Transactional utility | No | No | `/payment` | Route metadata | Route metadata | None | No | Payment remains disabled/deferred. |
| `/login` | Authentication | No | No | `/login` | Route metadata | Route metadata | None | No | Breadcrumb schema is unnecessary on auth pages. |
| `/register` | Authentication | No | No | `/register` | Route metadata | Route metadata | None | No | Customer-registration state. |
| `/forgot-password` | Authentication | No | No | Same path | Route metadata | Route metadata | None | No | Password-reset state. |
| `/reset-password` | Authentication | No | No | Same path | Route metadata | Route metadata | None | No | Password-reset state. |
| `/verify-email` | Authentication | No | No | Same path | Route metadata | Route metadata | None | No | Verification state. |
| `/email-verified` | Authentication status | No | No | Same path | Route metadata | Route metadata | None | No | Account-specific completion state. |
| `/sign-in` | Legacy auth alias | No document | N/A | Redirect to `/login` | N/A | N/A | None | No | Permanent one-hop redirect. |
| `/sign-up` | Legacy auth alias | No document | N/A | Redirect to `/register` | N/A | N/A | None | No | Permanent one-hop redirect. |
| `/account` | Private account | No | No | `/account` | Route metadata | Route metadata | None | No | Middleware-protected. |
| `/account/addresses` | Private account | No | No | Same path | Route metadata | Route metadata | None | No | Customer data. |
| `/account/payments` | Private account | No | No | Same path | Route metadata | Route metadata | None | No | Customer/payment state. |
| `/account/security` | Private account | No | No | Same path | Route metadata | Route metadata | None | No | Customer security state. |
| `/account/empty` | Private account | No | No | Same path | Route metadata | Route metadata | None | No | Account UI state. |
| `/profile` | Private account | No | No | `/profile` | Route metadata | Route metadata | None | No | Middleware-protected. |
| `/wishlist` | Private account | No | No | `/wishlist` | Route metadata | Route metadata | None | No | Customer-specific content. |
| `/saved-recipes` | Private account | No | No | Same path | Route metadata | Route metadata | None | No | Customer-specific content. |
| `/orders` | Private account | No | No | `/orders` | Route metadata | Route metadata | None | No | Customer-specific content. |
| `/orders/history` | Private account | No | No | Same path | Route metadata | Route metadata | None | No | Customer-specific content. |
| `/orders/[orderId]` | Private account detail | No | No | `/orders` | Route metadata | Route metadata | None | No | Never expose order identifiers in metadata or sitemap. |
| `/status/[state]` | Utility status | No | No | None | Static noindex metadata | None | None | No | Only known states render; unknown states return 404. |
| `/offline` | Offline utility | No | No | None | Static noindex metadata | None | None | No | Not a search landing page. |
| `/404` | Explicit error route | No | No | None | Static noindex metadata | None | None | No | Must return actual 404 rather than an indexable soft 404. |
| unmatched public path | Error | No | No | None | Not-found fallback | None | None | No | Middleware rewrites to `/404` with status 404. |
| application error boundary | Error | No | No | None | None | None | None | No | Non-production header protects Preview; server errors must retain error status. |
| configured admin path and `/admin/**` | Private administration | No | No | None | Admin layout | None | None | No | Configured path is rewritten internally; legacy `/admin` redirects. Never list the configured path. |
| `/api/**` and `/_/backend/**` | API | No | No | None | N/A | N/A | None | No | API responses are not HTML documents and are excluded from crawling. |
| `/sitemap.xml` | Discovery endpoint | N/A | N/A | N/A | N/A | N/A | XML sitemap | N/A | Only canonical public URLs; deterministic timestamps only. |
| `/image-sitemap.xml` | Discovery endpoint | N/A | N/A | N/A | N/A | N/A | Image sitemap | N/A | Product and recipe detail URLs only. |
| `/news-sitemap.xml` | Discovery endpoint | N/A | N/A | N/A | N/A | N/A | News sitemap | N/A | Baseline is invalid for dialog/hash stories; remove from robots unless true article URLs exist. |
| `/robots.txt` | Crawl policy endpoint | N/A | N/A | N/A | N/A | N/A | Robots policy | N/A | Sitemap declaration and intentional exclusions only; not a privacy boundary. |
| `/opengraph-image` | Social image endpoint | No document | N/A | N/A | N/A | N/A | Image response | No | Shared approved fallback image. |

## Baseline findings

1. `metadataBase` already points at the apex Production origin and `www` already redirects to apex in one hop.
2. The metadata helper emits `en-IN` and `x-default` alternate URLs even though there is no alternate locale. These should be removed.
3. The repository does not currently add an `X-Robots-Tag` guard to Preview/non-production responses.
4. Sitemap entries use `new Date()` for every route on every request, creating unsupported freshness signals.
5. The sitemap omits the real `/legal` and `/shipping-returns` hubs while `/terms` and `/our-story` exist as duplicate launch pages rather than redirects.
6. The news sitemap and Article schema point Journal stories at fragment/query UI states. Journal has no server-addressable detail route, so these are not independent article documents and must not be advertised as such.
7. The Recipes listing emits a Recipe entity for every recipe. Detail pages are the truthful entity pages; the listing should use a collection/ItemList representation.
8. Recipe detail schema currently maps the displayed total time to `prepTime` and adds free-text nutrition labels as `NutritionInformation`. Those fields should be omitted unless the canonical source supplies them explicitly.
9. Unknown dynamic product/recipe/launch slugs return 404, but their metadata fallbacks currently inherit indexable root metadata before `notFound()` resolves.
10. Search results are noindex, but useful result links remain ordinary `href` links. Shop and Journal query UI states need stable base canonicals.
11. Private customer routes already declare noindex and are middleware-protected; they must remain absent from all sitemaps and schema.
12. Primary public pages have visible H1s and crawl-critical top-level navigation uses links. Journal story openers are buttons because they open dialogs, not URLs; they cannot be treated as crawlable article links.
13. The JSON-LD component serializes raw data without escaping `<`, and global entity/navigation schema is emitted on every route, including private and error surfaces. Schema should be page-scoped and safely serialized.
14. The global navigation schema includes `/faqs`, which exists, but page/entity schema and sitemap sources are not yet centrally validated for duplicates, placeholder values, or canonical origin drift.

## Ownership boundaries

- Route metadata: `app/**/page.tsx` through `lib/seo/metadata.ts`.
- Canonical host and title template: `app/layout.tsx` and `lib/seo/metadata.ts`.
- Product identity and commercial facts: `lib/content/server.ts`, `lib/content/fallback-data.ts`, and product content models.
- Recipe identity: `components/recipes/recipe-data.ts` through `lib/recipes/canonical.ts`; no second recipe SEO catalog is permitted.
- Journal content: `getJournalPosts()` and the Journal client reader. There is no canonical journal detail route in this baseline.
- Redirects and response headers: `next.config.mjs`; auth/admin rewrites: `middleware.ts`.
- Sitemap/robots: `app/sitemap.ts`, `app/robots.ts`, and the two XML route handlers.

This audit is the implementation gate. The subsequent change set must not alter visual components, commerce, authentication, persistence, payment, shipping, analytics, or security architecture.
