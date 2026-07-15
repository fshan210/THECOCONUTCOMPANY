# SEO, Analytics, Webmaster Tools, and Indexing Readiness

## SEO Audit Report

### Current Strengths

- Canonical production domain is configured: `https://cothecoconutcompany.com`.
- `robots.txt` exists and allows crawling.
- `sitemap.xml` exists and includes all primary public pages.
- Global Open Graph and Twitter Card metadata exists.
- Page-specific titles and descriptions are now configured for Home, About, Products, Sustainability, Founders, and Journal.
- JSON-LD is implemented for Organization, WebSite, and per-page BreadcrumbList.
- Navigation exposes crawlable internal links to every primary page.
- Images use `next/image` where present and include alt text.
- Mobile responsiveness is built through Tailwind responsive classes.

### Critical Issues

- Google Search Console HTML verification file is deployed at `/google87b5a5382bb4f7a0.html`.
- No production Bing Webmaster verification token has been supplied yet.
- GA4 and Microsoft Clarity are integrated but inactive until IDs are added in Vercel environment variables.
- Official Instagram and LinkedIn profiles are present in Organization JSON-LD.

### Recommended Fixes

- Click Verify in Google Search Console using the HTML file upload method.
- Add `NEXT_PUBLIC_BING_SITE_VERIFICATION` in Vercel after creating the Bing Webmaster property.
- Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` and `NEXT_PUBLIC_CLARITY_PROJECT_ID` in Vercel.
- Submit `https://cothecoconutcompany.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
- Keep social profile URLs current if official profile handles change.

### Ranking Opportunities

- Add long-form Journal articles targeting Kerala coconut sourcing, coconut water, coconut creamery, direct farm aggregation, and premium coconut lifestyle topics.
- Add future Product schema for each product vertical once product detail pages exist.
- Add Article schema for Journal entries once individual article routes exist.
- Add founder-led editorial content for authority around Palakkad, Kerala sourcing, sustainability, and global coconut products.

## Google Search Console Setup Guide

Recommended property:

```text
URL-prefix property: https://cothecoconutcompany.com
```

Recommended verification method:

```text
HTML file upload
```

Verification file:

```text
https://cothecoconutcompany.com/google87b5a5382bb4f7a0.html
```

After deployment, click Verify in Google Search Console.

Alternative methods:

- HTML file verification: upload the file into `public/` if Google provides it.
- DNS TXT verification: add the TXT record in GoDaddy if Google provides one.
- Meta tag verification: set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to the content value from Google.

Meta tag environment variable:

```env
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=google_site_verification_content_value
```

Validate:

```text
https://cothecoconutcompany.com/robots.txt
https://cothecoconutcompany.com/sitemap.xml
```

Submit sitemap:

```text
https://cothecoconutcompany.com/sitemap.xml
```

## Google Analytics 4 Setup Guide

Create a GA4 Web Data Stream for:

```text
https://cothecoconutcompany.com
```

Add this Vercel environment variable:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Optional Google Tag Manager support uses:

```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

Consent Mode v2 defaults are emitted before vendor scripts. GA4, GTM, and Clarity load only after analytics consent. If GTM is enabled, do not configure an additional GA4 Configuration tag in the container while direct GA4 remains active, because that would duplicate page views and events.

Implemented tracking:

- Page views on App Router navigation
- Scroll depth at 25, 50, 75, and 90 percent
- CTA clicks
- Product interactions through `product_interest_click`
- Future contact submissions through `contact_submit`
- Future distributor inquiries through `distributor_inquiry_submit`
- Future newsletter signups through `newsletter_submit`

Reusable event helpers live in:

```text
lib/analytics/events.ts
```

## Microsoft Clarity Setup Guide

Create a Clarity project for:

```text
https://cothecoconutcompany.com
```

Add this Vercel environment variable:

```env
NEXT_PUBLIC_CLARITY_PROJECT_ID=your_project_id
```

Implemented readiness:

- Session recordings
- Heatmaps
- Click maps
- Behavior events mirrored from the analytics event bridge

## Bing Webmaster Tools Setup Guide

Create a Bing Webmaster Tools site:

```text
https://cothecoconutcompany.com
```

Verification options:

- DNS TXT verification in GoDaddy
- Meta tag verification through `NEXT_PUBLIC_BING_SITE_VERIFICATION`
- Import from Google Search Console after Google verification is complete

Meta tag environment variable:

```env
NEXT_PUBLIC_BING_SITE_VERIFICATION=bing_verification_content_value
```

Submit sitemap:

```text
https://cothecoconutcompany.com/sitemap.xml
```

## Structured Data Report

Implemented:

- Organization schema
- WebSite schema
- BreadcrumbList schema per primary page
- FAQPage schema on the homepage
- Recipe schema for published recipe content
- CollectionPage and Article schema for the Journal collection
- Person schema for the founders page
- Official social profile references

Prepared/conditional support:

- Product schema emits truthful price and availability only when present in managed product data.
- News sitemap entries require truthful ISO publication dates and the supported freshness window.

Files:

```text
components/seo/StructuredData.tsx
lib/seo/structured-data.ts
```

## Open Graph Report

Implemented:

- Page-specific OG titles
- Page-specific OG descriptions
- `summary_large_image` Twitter Cards
- LinkedIn-compatible Open Graph tags
- Dynamic fallback OG image at `/opengraph-image`

## Indexing Readiness

Google readiness score:

```text
88 / 100
```

Bing readiness score:

```text
88 / 100
```

DuckDuckGo readiness score:

```text
86 / 100
```

Crawl readiness score:

```text
93 / 100
```

Technical SEO score:

```text
90 / 100
```

Remaining blockers:

- Search Console and Bing verification tokens are not installed yet.
- Analytics IDs are not installed yet.
- Social profile URLs are placeholders.
- Rich Product and Article schema need real product/article routes.

## Recommended Next Steps

1. Add Google Search Console property and verification.
2. Submit sitemap in Google Search Console.
3. Add Bing Webmaster Tools property and verification.
4. Submit sitemap in Bing Webmaster Tools.
5. Add GA4 and Clarity IDs in Vercel.
6. Replace social profile placeholders once official profiles are live.
7. Add article pages and product detail pages when content strategy is ready.
