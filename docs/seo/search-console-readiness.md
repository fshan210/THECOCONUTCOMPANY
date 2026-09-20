# Search Console readiness

## Canonical discovery endpoints

- Canonical property: `https://cothecoconutcompany.com`
- Robots: `https://cothecoconutcompany.com/robots.txt`
- Primary sitemap: `https://cothecoconutcompany.com/sitemap.xml`
- Image sitemap: `https://cothecoconutcompany.com/image-sitemap.xml`

The repository emits only apex HTTPS canonicals. `www` redirects to the apex host, and Vercel Preview deployments send `X-Robots-Tag: noindex, nofollow, noarchive` without changing their canonical links.

## Indexable route classes

- Home, About, Founders, Sustainability
- Shop and published product details
- Recipes and published recipe details
- Journal collection and the public Social Co-Creation Hub
- Contact, Support, FAQs, Careers, and Community
- Current shipping, returns, refund, privacy, cookie, terms, and legal pages

## Noindex route classes

- Login, registration, verification, and password-reset states
- Account, profile, wishlist, saved recipes, order history, and order details
- Cart, checkout, payment, and order tracking
- Site search and arbitrary search queries
- Admin, API, status, offline, not-found, and error surfaces

## Verification status

No Google or Bing verification token is committed. The layout supports `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and `NEXT_PUBLIC_BING_SITE_VERIFICATION`; whether either variable is configured in Production must be confirmed in the deployment environment. Do not add a placeholder token.

## Post-release user actions

1. Add and verify the Domain property for `cothecoconutcompany.com` in Google Search Console, preferably with the DNS record Google supplies.
2. Submit `https://cothecoconutcompany.com/sitemap.xml` after the approved SEO commit reaches Production.
3. Inspect representative Home, Product, Recipe, Journal, Support, and legal URLs using URL Inspection.
4. Confirm excluded/noindex pages appear as intentionally excluded rather than crawled indexable content.
5. Monitor Page Indexing, Core Web Vitals, HTTPS, and enhancement reports after recrawl.
6. If Bing Webmaster Tools is used, verify ownership with the provider-issued token or import the verified Search Console property, then submit the same sitemap.

Search Console submission is intentionally deferred until the user approves the Preview and the exact approved SHA is promoted to Production.
