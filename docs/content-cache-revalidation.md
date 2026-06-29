# Content Cache and Revalidation

## Read strategy

Public content getters use Next.js server cache entries with a five-minute revalidation interval and content-specific tags.

| Content | Cache tag | Public paths refreshed after save |
| --- | --- | --- |
| Products | `content:products` | `/`, `/shop`, affected `/shop/[slug]` |
| Recipes | `content:recipes` | `/`, `/recipes` |
| Journal | `content:journal` | `/journal` |
| Testimonials | `content:testimonials` | `/` |
| Homepage | `content:homepage` | `/` |
| SEO | `content:seo` | `/`, `/shop`, `/recipes`, `/journal`, `/about`, `/founders`, `/sustainability` |

All writes also invalidate the shared `content` tag.

## When changes appear

- Dashboard save/publish/archive: on-demand tag and path revalidation is requested immediately. The next request rebuilds affected cached content.
- External Firestore edits: visible within at most five minutes under normal operation.
- Static fallback file edits: require a new deployment.
- Design/component code, local assets, environment variables, and Firebase credential changes: require a deployment/restart.

## Failure behavior

- Missing Firebase Admin credentials: use local fallback.
- Firestore read error or timeout: use local fallback.
- Invalid Firestore record: discard that record and retain the matching curated fallback.
- No published records or all records drafted: retain a non-empty curated collection to prevent blank public pages.
- Missing homepage/SEO content: use the existing hard-coded editorial metadata and Phase 4 fallback object.
- Missing/broken image: `BrandImage` falls back to the approved local product image and then a branded text panel.

## Manual refresh

The safe refresh mechanism is a protected dashboard save or archive action. No public revalidation endpoint or shared secret URL was added. If content was changed directly in Firestore and cannot wait five minutes, open the dashboard record and save it again.

## Limitations

- Revalidation is best-effort across server instances; Next.js/Vercel controls exact propagation timing.
- Firestore changes made outside the dashboard have no audit entry and rely on timed revalidation.
- A draft overlay can suppress one matching fallback item, but the system will not allow an entire core collection to become empty.
- Cache invalidation does not deploy new local images or code.
