# DynamoDB Design

## Tables

Clarity is preferred over an overloaded single-table design. Phase 1 uses three domain tables:

- `dotco-{env}-commerce`
- `dotco-{env}-content`
- `dotco-{env}-audit`

All tables use:

- `PK` string partition key,
- `SK` string sort key,
- `GSI1PK/GSI1SK`,
- `GSI2PK/GSI2SK`,
- on-demand billing,
- server-side encryption,
- TTL attribute `expiresAt`,
- PITR enabled for production,
- deletion protection enabled for production.

## Commerce entities

| Entity | PK | SK | Notes |
|---|---|---|---|
| User | `USER#{userId}` | `PROFILE` | email, display name, status |
| Address | `USER#{userId}` | `ADDRESS#{addressId}` | owner-only |
| Cart | `USER#{userId}` | `CART#ACTIVE` | summary/version |
| CartItem | `USER#{userId}` | `CARTITEM#{itemId}` | product id, variant id, qty |
| WishlistItem | `USER#{userId}` | `WISHLIST#{productId}` | conditional writes |
| Order | `USER#{userId}` | `ORDER#{orderId}` | GSI for order status |
| OrderItem | `ORDER#{orderId}` | `ITEM#{itemId}` | order details |
| DiscountClaim | `DISCOUNT#FIRST_PURCHASE` | `EMAIL#{hash}` | one claim per normalized email |
| IdempotencyRecord | `IDEMPOTENCY#{scope}` | `KEY#{key}` | TTL protected |
| Newsletter | `NEWSLETTER` | `EMAIL#{hash}` | one subscription per email |
| ContactRequest | `CONTACT` | `REQUEST#{id}` | TTL optional |

## Content entities

| Entity | PK | SK | Notes |
|---|---|---|---|
| Product | `PRODUCT#{slug}` | `METADATA` | published product data |
| ProductVariant | `PRODUCT#{slug}` | `VARIANT#{variantId}` | price/stock |
| Category | `CATEGORY#{slug}` | `METADATA` | taxonomy |
| Recipe | `RECIPE#{slug}` | `METADATA` | published/draft |
| JournalPost | `JOURNAL#{slug}` | `METADATA` | published/draft |
| HomepageBlock | `HOMEPAGE` | `BLOCK#{id}` | CMS content |
| SeoMetadata | `SEO#{path}` | `METADATA` | canonical/OG/noindex |
| CommunitySubmission | `COMMUNITY#{userId}` | `SUBMISSION#{id}` | moderation status |

## Audit entities

| Entity | PK | SK | Notes |
|---|---|---|---|
| AuditEvent | `AUDIT#{yyyy-mm}` | `TS#{iso}#${id}` | immutable-style event |
| SecurityEvent | `SECURITY#{yyyy-mm}` | `TS#{iso}#${id}` | sanitized security event |

## GSIs

- `GSI1`: list by status/date, e.g. `GSI1PK=ORDER_STATUS#PENDING_PAYMENT`, `GSI1SK=CREATED#{timestamp}`.
- `GSI2`: lookup by normalized email hash, slug, or moderation status.

## Required safeguards

- No normal user-facing `Scan`.
- Opaque pagination cursors only.
- Conditional writes for carts, wishlists, discounts, orders, newsletter, and idempotency records.
- Optimistic `version` fields for mutable records.
- Order creation uses DynamoDB transaction boundaries and idempotency.
- Server calculates price, discount, shipping/tax placeholders, and total.
- Browser-submitted prices, totals, roles, user IDs, and payment state are ignored.
