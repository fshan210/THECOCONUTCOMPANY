# SEO, Analytics, and Indexing Actions

Last checked: June 29, 2026

Production property: `https://cothecoconutcompany.com/`

GA4 measurement ID: `G-CNXDJ3EMHQ`

## Automated in this phase

- Confirmed Google Search Console authentication as Fazil Shan (`fshan210@gmail.com`).
- Confirmed the URL-prefix property `https://cothecoconutcompany.com/` is verified and the signed-in account is a verified owner.
- Inspected `https://cothecoconutcompany.com/` in URL Inspection. Google reports **URL is on Google**, **Page is indexed**, HTTPS is valid, and one breadcrumb item is valid.
- Requested indexing for the homepage. Search Console confirmed that the URL was added to the priority crawl queue.
- Confirmed the submitted sitemap at `https://cothecoconutcompany.com/sitemap.xml` had a successful status.
- Resubmitted `sitemap.xml`. Search Console confirmed success on June 29, 2026 and reported 16 discovered pages and 0 discovered videos.
- Checked Page indexing coverage. The report exists, but Google is still processing its data and asks that it be checked again later.
- Opened Bing Webmaster Tools. The browser was not authenticated, so no Bing property verification or sitemap submission was performed.
- Confirmed production `sitemap.xml` and `robots.txt` both return HTTP 200.

## Implemented locally

- GA4 is loaded once globally with `next/script` using `G-CNXDJ3EMHQ`; App Router page views and existing analytics events remain enabled across routes.
- The homepage title is absolute, avoiding a duplicated site-name title template.
- Canonical URLs, Open Graph metadata, and Twitter cards remain centralized through the metadata helper.
- Private account and authentication routes are marked `noindex, nofollow` and excluded from the sitemap.
- `robots.txt` keeps public routes crawlable and disallows private/admin routes.
- `/products` permanently redirects to `/shop` and is excluded from the sitemap.
- Organization and WebSite data are emitted once globally instead of being duplicated by page-level JSON-LD.
- BreadcrumbList is emitted on content routes; Product is emitted on product detail routes; Recipe is emitted for recipe entries; the journal emits CollectionPage and ItemList data.
- LocalBusiness was not added because the site does not publish a customer-facing physical location, opening hours, or local service details. FAQPage was not added because there is no visible FAQ. BlogPosting was not added because journal entries do not yet have individual article URLs and publication metadata.

## Exact URLs

- Property: `https://cothecoconutcompany.com/`
- Homepage inspection: `https://cothecoconutcompany.com/`
- Sitemap submission: `https://cothecoconutcompany.com/sitemap.xml`
- Robots file: `https://cothecoconutcompany.com/robots.txt`
- Google Search Console: `https://search.google.com/search-console`
- Bing Webmaster Tools: `https://www.bing.com/webmasters/`
- GA4 Realtime: `https://analytics.google.com/analytics/web/`

## Google Search Console manual checks

The property, homepage request, and sitemap submission were automated. After deployment:

1. Open Search Console and select `https://cothecoconutcompany.com/`.
2. Open **URL inspection**, enter `https://cothecoconutcompany.com/`, and confirm **URL is on Google**. Use **Test live URL** if the deployed metadata needs immediate validation.
3. Open **Indexing → Pages** and confirm processing has completed. Review indexed and not-indexed reasons.
4. Open **Indexing → Sitemaps** and confirm `/sitemap.xml` remains **Success** and the discovered-page count matches the deployed public sitemap.
5. Request indexing again only if the deployed homepage materially changed and the June 29 request is no longer sufficient. Repeated requests do not improve queue priority.

If property verification ever needs to be restored:

1. Add a URL-prefix property for `https://cothecoconutcompany.com/`.
2. Prefer the existing verified method shown under **Settings → Ownership verification**.
3. For a meta-tag method, set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to Google's verification content value, deploy, then click **Verify**.
4. For DNS verification, add Google's TXT record at the domain DNS provider and wait for propagation before clicking **Verify**.

## Bing Webmaster manual steps

1. Sign in at `https://www.bing.com/webmasters/` with the intended Microsoft account.
2. Add `https://cothecoconutcompany.com/`, or choose **Import from Google Search Console**.
3. If manual verification is required, use the Bing meta-tag content value as `NEXT_PUBLIC_BING_SITE_VERIFICATION`, deploy it, then complete verification. A DNS verification record is also acceptable.
4. Select the verified site and open **Sitemaps**.
5. Submit `https://cothecoconutcompany.com/sitemap.xml`.
6. Confirm the sitemap status is successful and review **URL Inspection** for the homepage.

## GA4 Realtime verification

GA4 browser verification requires the feature branch to be deployed first.

1. Deploy this branch with production analytics enabled.
2. Open GA4 for measurement ID `G-CNXDJ3EMHQ` and choose **Reports → Realtime**.
3. In a separate non-blocked browser session, visit the homepage and navigate to `/shop`, `/recipes`, and one product page.
4. Confirm one active user and `page_view` events for each route.
5. Confirm the page title, page location, and page path values are correct and that page views are not duplicated.

## Post-deployment verification checklist

- [ ] `https://cothecoconutcompany.com/` returns 200 and has one canonical URL.
- [ ] `/shop`, `/about`, `/founders`, `/recipes`, `/journal`, and `/sustainability` return 200.
- [ ] `/products` permanently redirects to `/shop` without a redirect chain.
- [ ] `/robots.txt` returns 200, allows public routes, disallows private routes, and references the production sitemap.
- [ ] `/sitemap.xml` returns 200, contains only canonical public routes, and excludes `/products` and account/authentication routes.
- [ ] Page source contains one GA loader for `G-CNXDJ3EMHQ` and no duplicate Google tag.
- [ ] GA4 Realtime records one page view per route navigation.
- [ ] Search Console continues to show verified ownership and sitemap success.
- [ ] Search Console Page indexing processing completes without unexpected exclusions.
- [ ] Bing ownership is verified and its sitemap status is successful.
- [ ] Rich Results Test recognizes BreadcrumbList, Product, and Recipe data on their applicable routes.
- [ ] Organization and WebSite JSON-LD appear once per document.
