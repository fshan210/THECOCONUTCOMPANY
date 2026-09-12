# Core commerce security follow-up

This file intentionally records deferred work only. It does not authorize a full security hardening pass, payment activation, shipping/fulfilment, or authentication replacement during the core commerce repair.

## Deferred hardening

- Add an explicit CSRF token strategy for state-changing same-origin Next BFF requests in addition to Origin/Fetch Metadata checks.
- Add durable, cross-instance rate limiting for customer mutation routes; the current middleware process memory is not a distributed production limit.
- Define retention and verified erasure for all customer-owned DynamoDB records when an account is deleted, including cart, saved content, addresses and future order records.
- Add structured audit events for sensitive account/address changes without logging tokens, cookies, full addresses, or other unnecessary personal data.
- Review DynamoDB customer-record encryption requirements beyond AWS-managed encryption and document field-level protection requirements for personal data.
- Add abuse monitoring and alarms for repeated authorization failures, invalid item mutations, cart conflicts and address enumeration attempts.
- Review Cognito token revocation and global sign-out UX in a dedicated authentication hardening phase; do not alter the current working auth flow in this repair.
- Perform dependency/SBOM, secret scanning, SAST/DAST and infrastructure policy analysis as a separate release gate.
- Define payment-provider, PCI, webhook-signature, replay-protection and order-state-machine controls before any payment or order creation is enabled.
- Define fulfilment/carrier credentials, least-privilege roles, address minimization and shipment-event authorization before shipping is enabled.
