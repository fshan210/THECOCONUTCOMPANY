# SEO, Analytics, and Indexing Actions

Last checked: June 29, 2026

Property: `https://cothecoconutcompany.com/`

GA4: `G-CNXDJ3EMHQ`

## Automated and confirmed

- Google Search Console authentication was available as Fazil Shan (`fshan210@gmail.com`).
- The URL-prefix property is verified; Search Console states **You are a verified owner**.
- Inspected `/`, `/shop`, `/about`, `/founders`, `/recipes`, `/journal`, and `/sustainability`.
- Confirmed `/`, `/shop`, `/about`, `/journal`, and `/sustainability` are indexed.
- Requested indexing for `/founders`; Google accepted it into the priority crawl queue.
- Requested indexing for `/recipes`; Google accepted it into the priority crawl queue.
- Resubmitted `https://cothecoconutcompany.com/sitemap.xml`.
- Confirmed sitemap **Success**, **13 discovered pages**, and **0 videos** after submission.
- Confirmed Search Console robots status **Valid**.
- Confirmed Breadcrumb enhancement **3 valid / 0 invalid**.
- Checked Page indexing; Google is still processing the report.
- Opened Bing Webmaster Tools; it was signed out, so no Bing property or sitemap change was made.
- Confirmed GA4 Realtime received one active user and the events `page_view`, `session_start`, and `user_engagement`.

## Implementation completed locally

- Removed the root canonical inheritance that made 404 responses claim the homepage canonical.
- Verified every intended canonical target returns 200.
- Kept the sitemap at the correct 13 public canonical URLs and removed false per-build modification timestamps.
- Kept `/products` out of the sitemap and as a permanent redirect to `/shop`.
- Made `/sign-in` and `/sign-up` permanent aliases of their noindex auth destinations.
- Expanded the robots admin rule to cover the complete `/admin` prefix.
- Enriched truthful Organization entity data with founders, Brand, and the public contact-page relationship.
- Removed incomplete Product rich-result markup until truthful Offer or visible review data exists.
- Kept GA4 loaded once globally through the shared Analytics component.

## Sitemap discrepancy explained

Search Console's earlier 16-page count came from a prior sitemap containing the correct current 13 pages plus `/sign-in`, `/sign-up`, and `/account`. The live sitemap had already removed those non-public URLs, but Search Console retained the historical discovered total. Resubmitting the current sitemap refreshed the console to 13. No public URL was missing.

## Exact URLs

- Property: `https://cothecoconutcompany.com/`
- Sitemap: `https://cothecoconutcompany.com/sitemap.xml`
- Robots: `https://cothecoconutcompany.com/robots.txt`
- Priority inspections: `/`, `/shop`, `/about`, `/founders`, `/recipes`, `/journal`, `/sustainability`
- Search Console: `https://search.google.com/search-console`
- Bing Webmaster Tools: `https://www.bing.com/webmasters/`
- GA4 Realtime: `https://analytics.google.com/analytics/web/`

## Google waiting tasks

1. Allow several days for `/founders` and `/recipes` to move through the priority crawl queue; a request is not an indexing guarantee.
2. Open **Indexing → Pages** after processing completes and classify every exclusion.
3. Confirm the sitemap remains **Success** with 13 discovered pages.
4. After deployment, use URL Inspection → **Test live URL** on `/`, `/founders`, and `/recipes` to verify deployed canonicals and schema.
5. Do not submit the same URL repeatedly; repeated requests do not increase priority.

## Bing steps still required

1. Sign in at `https://www.bing.com/webmasters/` with the intended Microsoft account.
2. Choose **Import from Google Search Console** or add `https://cothecoconutcompany.com/` manually.
3. If manual verification is used, publish the provided Bing verification value through `NEXT_PUBLIC_BING_SITE_VERIFICATION`, deploy, and click **Verify**. DNS verification is also valid.
4. Select the verified property, open **Sitemaps**, and submit `https://cothecoconutcompany.com/sitemap.xml`.
5. Confirm success, inspect the homepage, and review crawl/index status.

## GA4 post-deployment check

1. Open GA4 Realtime for `G-CNXDJ3EMHQ`.
2. Visit `/`, `/shop`, `/recipes`, and one product page in a non-blocked browser.
3. Confirm one `page_view` per navigation plus `session_start` and `user_engagement`.
4. Inspect page source and confirm one `googletagmanager.com/gtag/js` loader and one measurement ID.

## Post-deployment checklist

- [ ] Deploy `feature/final-seo-indexing-pass`.
- [ ] Confirm all 13 sitemap URLs return 200 and self-canonical.
- [ ] Confirm a random 404 has no canonical.
- [ ] Confirm `/products` returns one permanent redirect to `/shop`.
- [ ] Confirm `/sign-in` and `/sign-up` return permanent redirects.
- [ ] Confirm robots returns 200, has no public-route disallow, and names the production sitemap.
- [ ] Confirm sitemap returns 200, has 13 URLs, and excludes redirects/private routes.
- [ ] Validate Organization, WebSite, Breadcrumb, Recipe, and CollectionPage JSON-LD.
- [ ] Confirm Product, Article, and FAQ markup remain absent until supported by visible facts/content.
- [ ] Confirm GA4 Realtime events and no duplicate tag.
- [ ] Recheck Google coverage and the two requested URLs.
- [ ] Complete Bing sign-in, verification, and sitemap submission.
