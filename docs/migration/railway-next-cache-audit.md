# Next.js cache and ISR audit

Scope: Next.js 15.5.25 from the locked dependency tree, one Singapore instance, Railway CDN off. This is an implementation inventory; live Railway invalidation is pending deployment and controlled Preview Admin QA.

| Surface | Current contract | Railway treatment / verification |
| --- | --- | --- |
| `lib/content/server.ts` products, recipes, journal, testimonials, homepage, SEO | `unstable_cache`, 300 seconds, `content` and type tags; safe published fallback | Preserve; process/disk cache is local to this instance. Verify a controlled Preview edit and revalidation before/after restart. |
| `lib/content/revalidate.ts`, content actions | `revalidateTag` and `revalidatePath` after authorized writes | Preserve; no second replica without shared invalidation design. Do not mutate Production for QA. |
| Account actions | Revalidate account/profile/address paths after writes | Preserve; customer reads must remain dynamic and uncached. |
| Customer AWS, server API client, Firebase token lookup | `cache: no-store` | Preserve. Response privacy separately enforced by BFF headers. |
| Cart/session/saved BFFs | `private, no-store, max-age=0`, Pragma/Expires | CDN off. Verify repeatedly and across separate users on deployed staging. |
| Client saved/session/cart providers | In-flight coalescing and stale-response guards | Preserve; permanent session regression exercises concurrency. |
| Image/news sitemaps | 3600-second revalidation, public s-maxage and stale-while-revalidate | Preserve canonical apex URLs. Staging global X-Robots-Tag prevents indexing. |
| Hashed Next static / selected versioned media | Long immutable cache | Copy `.next/static` and audited local media; verify URLs from rendered pages. |
| Next image optimizer | Already globally unoptimized before migration | No new optimizer introduced. Test existing prebuilt AVIF/JPEG and CDN assets; optimizer latency is N/A. |

No volume or Redis is needed for the first single-instance correctness test. A restart may clear runtime caches and cause a cold read; it must not lose customer records, which remain external. The non-root process owns copied `.next` files so ISR can write its cache. Rolling deployment overlap is possible even with one configured replica: keep source frozen during measurements; do not assume cross-deployment invalidation is coordinated.

Do not enable Railway CDN during baseline. Any later CDN proposal needs a separate public-only header review and proof that authenticated HTML, session/cart/saved API responses, redirects, and error responses cannot enter shared cache. Never add broad s-maxage to improve scores.

Next 15 reference: https://nextjs.org/docs/15/app/guides/self-hosting
