# Customer authentication contract map

Baseline: `86db521427dac2b9df274223b0d68fb826991285`

This map records the customer authentication owners before the cinematic presentation work. The redesign keeps these contracts intact.

## Routes and presentation owners

| Route | Owner | Behavior |
| --- | --- | --- |
| `/login` | `app/login/page.tsx`, `CustomerLoginForm` | Redirects an existing session to the validated return path; otherwise signs in through the Cognito BFF. |
| `/sign-in` | `app/sign-in/page.tsx` | Legacy redirect to `/login`. |
| `/register` | `app/register/page.tsx`, `CustomerRegisterForm` | Redirects an existing session; creates a Cognito user and begins pending email verification. |
| `/sign-up` | `app/sign-up/page.tsx` | Legacy redirect to `/register`. |
| `/verify-email` | `app/verify-email/page.tsx`, `CustomerVerifyEmailForm` | Reads the sealed pending-verification cookie, confirms the six-digit Cognito code, and preserves `returnTo`. |
| `/email-verified` | `app/email-verified/page.tsx`, `EmailVerifiedCard` | Hands the verified user back to `/login` for password-based session establishment. |
| `/forgot-password` | `app/forgot-password/page.tsx`, `CustomerForgotPasswordForm` | Starts the real Cognito forgot-password flow. |
| `/reset-password` | `app/reset-password/page.tsx`, `CustomerResetPasswordForm` | Confirms the six-digit reset code and the existing password policy. |

## API and provider ownership

- `POST /api/auth/cognito` owns `login`, `signup`, `confirm`, `resend`, `forgot`, `reset`, and `logout` actions.
- `POST /api/auth/cognito/resend-confirmation` owns verification resend and its rate-limit response.
- `GET /api/auth/session` exposes only the safe display session and never returns Cognito tokens.
- AWS Cognito `USER_PASSWORD_AUTH` is the configured customer provider. Google is intentionally disabled in the current UI; Apple has no implementation. The redesign does not simulate either provider.
- Signup requires a name of 2–80 characters and a password of 10–256 characters. The UI retains the stronger existing checklist: upper and lowercase letters, a number, and a special character.
- Email confirmation and password reset both use six numeric digits.

## Session and verification contracts

- `lib/auth/aws-session.ts` encrypts the Cognito token payload with AES-256-GCM and splits it across bounded HttpOnly cookies.
- Cookies retain the existing `Secure` production behavior, `SameSite=Lax`, `/` path, and Cognito token lifetime.
- `lib/auth/verification-state.ts` seals pending email and return path in a 30-minute HttpOnly cookie and masks the address before rendering it.
- `CustomerAuthProvider` refreshes the safe client session after auth changes, focus, and document visibility without exposing tokens.
- Logout remains the `logoutCustomer` server action.

## Redirect and protected-route contracts

- Client and server return-path validation remains restricted to the existing allowlist: `/shop`, `/cart`, `/wishlist`, `/account`, and `/products`.
- Middleware protects `/account`, `/orders`, `/wishlist`, `/profile`, and `/saved-recipes` by checking the Cognito session cookie and preserving the requested path in `redirect`.
- Account, orders, wishlist, saved recipes, and profile continue to use `requireCustomerSession` or `requireVerifiedCustomerSession` on the server.
- Cart remains available before authentication. Wishlist and saved-recipe actions keep their existing login boundary and return behavior.

## Security and data boundaries

- Same-origin checks, request-size limits, Zod request validation, action/IP/email rate limits, generic credential failures, and request IDs remain owned by the existing Cognito routes.
- Passwords and codes stay in component state only for the active form and are not logged or written to local storage.
- Step-one signup intent is presentation-only because no compatible profile field is available before verification.
- Optional marketing consent reuses the existing newsletter endpoint after Cognito accepts signup; a newsletter failure never rolls back or misrepresents account creation.
