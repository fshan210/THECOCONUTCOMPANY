# Auth verification audit — 2026-07-12

## Scope and evidence

This audit covers the DEV Cognito user pool in `ap-south-1`, the Preview BFF implementation, and the DEV Lambda log group. It does not change Production.

## Current Cognito configuration

| Area | Verified configuration | Result |
| --- | --- | --- |
| Self sign-up | Enabled | PASS |
| Email sign-in | Email is the username/sign-in attribute | PASS |
| Auto verification | `email` | PASS |
| Verification method | Cognito confirmation code | PASS |
| Recovery | Verified email only | PASS |
| Email sending account | `COGNITO_DEFAULT` | DEV mode, no SES dependency |
| App-client auth | User password, SRP, refresh-token flows | PASS |
| User-existence protection | Enabled | PASS |
| Google federation | Only `COGNITO` is configured | Not ready; UI is disabled intentionally |

The DEV pool uses Cognito's default email sender. There are no SES identities in `ap-south-1`; SES sending is enabled but is in sandbox mode with a 200-message/24-hour and 1-message/second quota. No SES sender is required for DEV confirmation email. A domain sender must not be configured until a production domain identity and DNS records are verified.

## Signup and confirmation sequence

1. The BFF validates and normalizes the email, rate-limits the request, and calls Cognito `SignUp`.
2. Cognito creates an `UNCONFIRMED` account and sends a native confirmation code.
3. The BFF creates a short-lived encrypted, HttpOnly pending-verification cookie. It contains the normalized email and an allowlisted return path; no password, code, or Cognito token is stored in the browser.
4. `/verify-email` shows a masked destination and accepts the six-digit code.
5. `ConfirmSignUp` activates the account, clears the pending cookie, and takes the customer to a success state then secure sign-in.

The configured subject is `Verify your .CO account`. The CDK template now carries the approved explanatory body; it is applied to DEV when the stack is deployed.

## Unconfirmed and error-state handling

| State | Customer-safe behaviour |
| --- | --- |
| New email | Signup success, native code sent, then `/verify-email` |
| Existing unconfirmed email signup | The BFF requests a new code and resumes `/verify-email`; no dead-end duplicate message |
| Existing confirmed email signup | Sign-in/reset guidance |
| Unconfirmed sign-in | Redirect to `/verify-email` with an actionable resend control |
| Reset required | Redirect to password reset flow |
| Invalid/expired code | Neutral explanation and retry/resend path |
| Throttled send/attempt | `429`, retry-after response, accessible inline feedback |
| Unknown auth failures | Neutral message plus request ID; no Cognito internals |

## Resend confirmation

`POST /api/auth/cognito/resend-confirmation` accepts a validated email and allowlisted return path. It uses Cognito `ResendConfirmationCode`, server-side rate limiting, and returns only `{ delivery: "email", maskedDestination }` plus a request ID. Codes and tokens are never logged.

## Logs and delivery findings

- DEV Lambda log retention is seven days.
- Recent API events were expected `401` authorization rejections only; no Lambda exception or BFF email-delivery failure was found.
- Cognito has no configured Lambda email trigger, so there is no Cognito-trigger Lambda log group to inspect.
- Actual inbox delivery is still a manual Preview E2E gate. Cognito default mail cannot be proven from configuration alone.

## Required production email plan

1. Verify `accounts@cothecoconutcompany.com` or another domain sender in SES in the intended Production region.
2. Publish SES DKIM and SPF records; publish/maintain DMARC at the domain level.
3. Request SES production access only after a successful controlled delivery test.
4. Configure Cognito to use the verified SES identity and a dedicated production pool.
5. Test signup, resend, reset, bounces, and complaint handling before cutover.

## Rollback

- Frontend/BFF rollback: redeploy the preceding Preview commit.
- DEV infrastructure rollback: `cdk deploy` the preceding synthesized stack or `cdk rollback` only after reviewing its change set.
- Do not disable email auto-verification or auto-confirm accounts to work around delivery failures.
