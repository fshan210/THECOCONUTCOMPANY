# Abuse Controls

## Implemented foundation

- Hono request ID middleware.
- Strict CORS allowlist.
- Payload size limit default: 64 KB.
- In-memory Lambda-local rate limiter placeholder.
- Honeypot fields in newsletter/community schemas.
- Safe error envelope.
- Security headers.

## Required production controls before public AWS cutover

| Area | Suggested limit | Notes |
|---|---:|---|
| Signup | 5/IP/hour | Cognito + WAF/API Gateway throttling |
| Login | 10/IP/10 minutes | do not reveal user existence |
| Forgot password | 5/email/hour | Cognito recovery |
| Newsletter | 5/IP/hour | honeypot + idempotent email hash |
| Discount claim | 3/user/day | conditional write |
| Contact/community submission | 5/user/hour | moderation queue |
| Cart mutation | 120/user/hour | authenticated only |
| Order creation | 10/user/hour | idempotency required |

CAPTCHA should be risk-triggered, not shown to every user by default.

## Bot strategy

- Honeypot on public forms.
- Rate-limit anonymous endpoints per IP.
- Rate-limit authenticated endpoints per user.
- Add AWS WAF before production API exposure if attacks appear or if API Gateway throttles are insufficient.
