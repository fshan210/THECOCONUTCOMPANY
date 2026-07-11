# Data Privacy

## Data minimization

Do not store:

- passwords,
- raw auth tokens,
- payment card data,
- unnecessary identity documents,
- full sensitive request payloads in logs.

## Personal data

Personal data classes:

- email,
- name,
- phone,
- shipping address,
- order history,
- support/contact requests,
- newsletter consent.

## Access rules

- Customers read/update only their own profile, addresses, cart, wishlist, and orders.
- Support reads limited customer/order support data.
- Operations reads fulfillment-related order/address data.
- Admins manage privileged operations.

## Logs

Logs must redact tokens, cookies, passwords, authorization headers, card-like fields, and secrets.

## Account deletion/export

Phase 1 includes API placeholders. Production implementation must:

- mark account deletion requested,
- revoke sessions,
- queue data deletion/anonymization,
- preserve legally required order/audit records,
- provide export of profile, order, and consent data.
