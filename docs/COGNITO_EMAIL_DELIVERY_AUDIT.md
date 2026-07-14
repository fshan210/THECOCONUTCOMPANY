# Cognito DEV email-delivery audit

## Scope

Canonical DEV user pool: `ap-south-1_XlJmCJYXS` in `ap-south-1`.

This audit contains no customer email addresses, confirmation codes, passwords, tokens, or cookies.

## Confirmed configuration

| Check | Result |
| --- | --- |
| Sign-in and signup attribute | Email (`UsernameAttributes: [email]`) |
| Automatic verification | Email enabled |
| Account recovery | Verified email, priority 1 |
| Verification mechanism | Confirmation code |
| Cognito email mode | `COGNITO_DEFAULT` |
| SES sender identity / custom SES region | Not configured for this DEV pool |
| Web client | `dotco-dev-web`, public client, no client secret |
| App-client auth flows | Password, SRP, and refresh-token flows enabled |
| User-existence protection | Enabled |
| Existing test records | 2 aggregate `UNCONFIRMED` users; addresses withheld |

The verification email subject and code template are configured in the CDK-owned pool. The service uses Cognito's default email delivery rather than a custom SES identity, so SES sandbox or sender-identity restrictions are not evidenced by the current configuration.

## Recent error evidence

No matching `CodeDeliveryFailureException`, `UserNotConfirmedException`, `LimitExceededException`, or `TooManyRequestsException` events were found in the queried seven-day Lambda log window. This does not prove a delivery inbox outcome; it only shows no server-side delivery or rate-limit failure recorded in that window.

## What remains unproven

There has not yet been a fresh completed Preview signup after the Vercel API binding correction. Therefore the following remain pending a disposable-account test:

1. Confirm that `SignUp` returns safe `CodeDeliveryDetails` to the BFF.
2. Confirm actual inbox delivery and spam-folder status.
3. Confirm `ResendConfirmationCode` response and UI countdown.
4. Confirm code entry activates the account, then sign-in creates the encrypted HttpOnly session.

Do not resend to the two existing unconfirmed accounts until the account owner confirms that either record is disposable. A fresh disposable Preview account is the preferred test path.

## Current diagnosis

There is no confirmed platform-level delivery failure. The next evidence-producing action is a new Preview registration and one human email-code entry. If delivery does not arrive, capture only the BFF's safe delivery metadata and the resulting Cognito error class; do not expose the destination address or code.
