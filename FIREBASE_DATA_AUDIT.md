# Firebase data audit

The audit command is read-only and aggregate-only. It does not print emails, document bodies, tokens, or service-account values.

Run locally with Firebase Admin credentials:

```bash
npm run firebase:audit
```

It reports collection names, document counts, representative field names, timestamp ranges, duplicate-email counts, malformed-record counts, and test/production indicators. If credentials are missing it exits with a setup message and does not fall back to public credentials.

Migration status: not started. Production cutover is blocked until the aggregate report is reviewed and real accounts/orders are explicitly classified.
