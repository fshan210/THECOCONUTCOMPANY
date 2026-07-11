# API Contract

Base path: `/v1`  
Response format:

```json
{
  "data": {},
  "meta": {},
  "requestId": "uuid"
}
```

Error format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Safe user-facing message",
    "fields": {}
  },
  "requestId": "uuid"
}
```

## Public

- `GET /v1/health`
- `GET /v1/ready`
- `GET /v1/products`
- `GET /v1/products/:slug`
- `GET /v1/categories`
- `GET /v1/recipes`
- `GET /v1/recipes/:slug`
- `GET /v1/journal`
- `GET /v1/journal/:slug`
- `POST /v1/newsletter/subscriptions`
- `DELETE /v1/newsletter/subscriptions`

## Authenticated

- `GET /v1/me`
- `PATCH /v1/me`
- `DELETE /v1/me`
- `GET /v1/me/addresses`
- `POST /v1/me/addresses`
- `PATCH /v1/me/addresses/:addressId`
- `DELETE /v1/me/addresses/:addressId`
- `GET /v1/cart`
- `POST /v1/cart/items`
- `PATCH /v1/cart/items/:itemId`
- `DELETE /v1/cart/items/:itemId`
- `DELETE /v1/cart`
- `GET /v1/wishlist`
- `POST /v1/wishlist/items`
- `DELETE /v1/wishlist/items/:productId`
- `POST /v1/discounts/first-purchase/claim`
- `GET /v1/discounts/me`
- `POST /v1/community/submissions`
- `GET /v1/community/me/submissions`
- `POST /v1/orders/preview`
- `POST /v1/orders`
- `GET /v1/orders`
- `GET /v1/orders/:orderId`

Orders remain `DRAFT` or `PENDING_PAYMENT`. No route marks an order as paid.

Shared Zod schemas live in `/packages/contracts/src/index.ts`.
