# Authorization Matrix

| Endpoint | CUSTOMER | SUPPORT | CONTENT_EDITOR | OPERATIONS | ADMIN | Notes |
|---|---:|---:|---:|---:|---:|---|
| `GET /v1/health` | public | public | public | public | public | no sensitive data |
| `GET /v1/ready` | public | public | public | public | public | dependency status only |
| `GET /v1/products` | public | public | public | public | public | published products only |
| `GET /v1/products/:slug` | public | public | public | public | public | published products only |
| `GET /v1/categories` | public | public | public | public | public | public taxonomy |
| `GET /v1/recipes` | public | public | public | public | public | published recipes only |
| `GET /v1/recipes/:slug` | public | public | public | public | public | published recipes only |
| `GET /v1/journal` | public | public | public | public | public | published posts only |
| `GET /v1/journal/:slug` | public | public | public | public | public | published posts only |
| `GET /v1/me` | owner | limited | no | no | admin | customers see only self |
| `PATCH /v1/me` | owner | no | no | no | admin | role cannot be changed by user |
| `DELETE /v1/me` | owner request | no | no | no | admin | deletion workflow placeholder |
| `GET /v1/me/addresses` | owner | limited | no | operations limited | admin | ownership enforced server-side |
| `POST /v1/me/addresses` | owner | no | no | no | admin | validated body |
| `PATCH /v1/me/addresses/:addressId` | owner | no | no | operations limited | admin | ownership condition required |
| `DELETE /v1/me/addresses/:addressId` | owner | no | no | no | admin | ownership condition required |
| `GET /v1/cart` | owner | no | no | no | admin | no browser prices trusted |
| `POST /v1/cart/items` | owner | no | no | no | admin | server validates product/stock |
| `PATCH /v1/cart/items/:itemId` | owner | no | no | no | admin | quantity only |
| `DELETE /v1/cart/items/:itemId` | owner | no | no | no | admin | ownership condition required |
| `GET /v1/wishlist` | owner | limited | no | no | admin | ownership condition required |
| `POST /v1/wishlist/items` | owner | no | no | no | admin | ownership condition required |
| `DELETE /v1/wishlist/items/:productId` | owner | no | no | no | admin | ownership condition required |
| `POST /v1/newsletter/subscriptions` | public | public | public | public | public | rate limited + honeypot |
| `DELETE /v1/newsletter/subscriptions` | requester | support | no | no | admin | verify ownership before prod |
| `POST /v1/discounts/first-purchase/claim` | verified owner | no | no | no | admin | conditional write required |
| `GET /v1/discounts/me` | owner | no | no | no | admin | owner only |
| `POST /v1/community/submissions` | authenticated | support review | content review | no | admin | plain text only |
| `GET /v1/community/me/submissions` | owner | support | content review | no | admin | ownership enforced |
| `POST /v1/orders/preview` | owner | support limited | no | operations | admin | server-priced |
| `POST /v1/orders` | owner | no | no | operations | admin | idempotent, unpaid only |
| `GET /v1/orders` | owner | limited support | no | operations | admin | ownership/role filters |
| `GET /v1/orders/:orderId` | owner | limited support | no | operations | admin | ownership/role filters |
