# .CO Productization Report

Date: 15 July 2026  
Branch: `codex/phase-4-functional-release`  
Production: `https://cothecoconutcompany.com`

Verified Preview: `https://my-website-git-codex-phase-4-functiona-c1ea4a-fazil-s-projects1.vercel.app`

## Release decision

**Status: release candidate — not yet Content & Growth Ready.**

The locked public design was preserved. The implementation in this branch improves the shared motion language, technical SEO, consent-aware analytics, and the existing content adapter without changing the approved page hierarchy, typography, spacing, palette, or responsive composition.

The remaining release blockers are operational or architectural: full S3/CloudFront media authoring, CMS coverage for every requested page section, external Search Console/Bing/analytics confirmation, and measured production Lighthouse/Core Web Vitals evidence.

## Motion system

Completed:

- A single reduced-motion-aware motion quality resolver now keeps mobile motion intentionally simplified instead of disabling it for every mobile visitor.
- Route transitions use a short cream dissolve and restrained palm-leaf wipe within the requested 300–500 ms range.
- The application loading state uses a CSS-only coconut silhouette and coconut-water fill treatment.
- Existing button, card, hero, counter, Lenis, Motion, and GSAP behaviors remain intact.
- `prefers-reduced-motion` disables decorative transition and loading motion.

Not added because the required product flows are not live: checkout-tree progress and recipe-completion progress. Existing empty cart, wishlist, 404, and offline treatments remain the source of truth.

## SEO

Completed:

- Canonical production URLs, page-specific titles/descriptions, Open Graph, Twitter cards, `en-IN`, `hreflang` (`en-IN` and `x-default`), theme color, and manifest metadata.
- Organization, WebSite, BreadcrumbList, FAQPage, Recipe, Article/CollectionPage, and Person JSON-LD where truthful source data exists.
- Product and Recipe builders support brand/category/images, ingredients, times, yield, nutrition, and only emit price/availability data when supplied by real content.
- Dynamic product and recipe URLs are included in the primary sitemap.
- Dedicated image and news sitemap endpoints were added and referenced by `robots.txt`.
- Redirect-only and private routes remain excluded from the sitemap.
- The homepage canonical is the root production URL and it is the primary navigation/home entity.
- Manifest language, direction, categories, scope, and stable application identity are declared.

Local browser evidence:

| Route | HTTP | Canonical | Structured data |
| --- | ---: | --- | --- |
| `/` | 200 | `/` | Organization, WebSite, BreadcrumbList, FAQPage |
| `/shop` | 200 | `/shop` | Organization, WebSite, BreadcrumbList |
| `/recipes` | 200 | `/recipes` | Organization, WebSite, BreadcrumbList, Recipe |
| `/journal` | 200 | `/journal` | Organization, WebSite, BreadcrumbList, CollectionPage, Article |
| `/about` | 200 | `/about` | Organization, WebSite, BreadcrumbList |
| `/founders` | 200 | `/founders` | Organization, WebSite, BreadcrumbList, Person |
| `/sustainability` | 200 | `/sustainability` | Organization, WebSite, BreadcrumbList |

`/robots.txt`, `/sitemap.xml`, `/image-sitemap.xml`, `/news-sitemap.xml`, and `/site.webmanifest` also returned 200 in the production build smoke test.

Remaining SEO validation:

- Validate deployed JSON-LD with Google Rich Results Test and Schema.org Validator.
- Confirm Google Search Console and Bing property ownership, submit the primary/image/news sitemaps, and monitor indexing.
- A news sitemap intentionally remains empty unless an article has a truthful ISO publication date within the supported freshness window.
- Numeric production Lighthouse and field Core Web Vitals were not fabricated; they must be captured after Preview deployment under documented throttling.

## Analytics and consent

Completed:

- Central event bridge in `lib/analytics/events.ts`; feature code does not need scattered vendor calls.
- Consent Mode v2 defaults to denied before analytics scripts execute.
- Cookie-consent changes update analytics/ad consent state.
- GA4, optional GTM, and optional Microsoft Clarity load only after analytics consent.
- Central listeners cover route page views, scroll depth, CTA/link clicks, downloads, outbound links, and classified form attempts.
- Typed event vocabulary includes products, recipes, journal, newsletter, waitlist, auth, account, wishlist, cart, search, community, errors, and performance.

Required production configuration:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_GTM_ID` (optional)
- `NEXT_PUBLIC_CLARITY_PROJECT_ID` (optional)
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- `NEXT_PUBLIC_BING_SITE_VERIFICATION`

If GTM is enabled, its container must not install a second GA4 Configuration tag while direct GA4 is active; doing so would duplicate page views and events.

Remaining analytics validation:

- Publish and inspect the GTM container, if used.
- Confirm GA4 DebugView/Realtime events and Clarity sessions after consent on Preview/Production.
- Confirm Google and Bing verification in their authenticated consoles.

## CMS integration

Connected in this branch:

- Homepage: managed hero copy, calls to action, trust badges, featured products, featured recipes, featured testimonials, and SEO metadata with curated fallback.
- Shop: managed product catalogue data overlays the locked reference presentation.
- Journal: managed published entries feed the public article collection.
- Sitemap: published dynamic products and recipes are discovered through the content adapter.
- Existing content getters always fall back to curated local data when Firestore is unavailable or invalid.

Existing dashboard capabilities retained:

- Products, recipes, journal, testimonials, homepage, SEO, and local media metadata.
- Draft/publish/archive-as-draft, validation, protected server actions, audit records, cache tags, and path revalidation.

Not yet connected:

- About body sections, founders, sustainability, FAQ, footer, navigation, cookie copy, community feed, gradients, animation configuration, and video configuration.
- Scheduled publishing, version history, rollback, rich text, and full preview are not present in the existing backend contract.
- Recipe collection/detail content remains partly reference/static and needs a unified editor-backed detail model.

## Image management

Completed delivery safeguards:

- Runtime Vercel Image Optimization remains disabled.
- Public photographs use static AVIF/JPEG responsive variants where available.
- Browser QA confirmed no tested page emitted `/_next/image` URLs.
- Optimized asset paths receive long-lived immutable cache headers.
- Existing originals are preserved to avoid destructive asset changes.

Current media-authoring limitation:

- The dashboard Media Library indexes local public assets and stores metadata in Firestore.
- It does **not** upload/crop/version files in S3, serve them through CloudFront, or issue cache invalidations.
- S3/CloudFront credentials, buckets, distribution, signed upload policy, and least-privilege media API are not present in the current stack. This is a release blocker for the requested production media-management scope.

## Validation results

| Gate | Result |
| --- | --- |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run test` | PASS — contracts 3/3, backend 10/10, infrastructure 2/2 |
| `npm run build` | PASS — Next.js 15.5.19, 76 generated routes |
| Production-build route smoke test | PASS for all primary pages and SEO endpoints |
| Internal-link crawl | PASS — 40 local destinations checked, no 4xx/5xx; protected account and wishlist redirects behaved as expected |
| Canonical/JSON-LD browser audit | PASS for the primary public routes listed above |
| No `/_next/image` on tested routes | PASS |
| Vercel Preview deployment | PASS — primary pages and all SEO endpoints returned 200 |
| GitHub security/backend CI | PASS |
| Playwright E2E | NOT RUN — Playwright is not configured in this repository |
| Lighthouse / Core Web Vitals | NOT MEASURED in this pass |
| External Search Console/Bing validation | MANUAL/EXTERNAL |
| External GA4/GTM/Clarity validation | MANUAL/EXTERNAL |

## Remaining blockers

1. Implement a production S3/CloudFront media service and connect it to the existing protected dashboard.
2. Extend the validated content model/actions and admin routes for About, Founders, Sustainability, FAQ, Footer, Navigation, Community, and global settings.
3. Add version history, scheduled publication, rollback, and preview only after the backend contracts are defined.
4. Capture Preview and Production Lighthouse results and validate accessibility with an automated browser suite.
5. Verify Search Console/Bing properties and GA4/GTM/Clarity in their authenticated consoles.
6. Run full authenticated Preview regression before Production deployment.

Until these gates are complete, deploy this branch to Preview for verification but do not describe the release as Content & Growth Ready.
