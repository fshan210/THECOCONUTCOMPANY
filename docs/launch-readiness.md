# Launch readiness flows

## Authentication

- `/login`, `/register`, `/forgot-password`, and `/reset-password` use Firebase client authentication.
- Successful Firebase authentication is exchanged for the existing secure customer session through server actions.
- Google sign-in is active when Firebase public configuration is available. Apple is deliberately shown as unavailable rather than simulating authentication.
- The welcome offer routes to `/register`; a locally saved email and optional name prefill the registration form.

## Cookie consent

- `LaunchExperience` displays consent on first visit and stores the decision in `co_cookie_consent_v1` plus a same-site cookie.
- Essential storage is always enabled. Analytics and marketing are independent optional preferences.
- Google Analytics, Firebase Analytics, Microsoft Clarity, page-view tracking, and analytics event listeners do not mount until analytics consent is granted.
- Visitors can reopen preferences from the cookie control in the lower-left corner.

## Welcome offer

- First-time visitors see the welcome dialog after a short delay.
- Submission validates the email, stores the email and optional name locally, records a one-year welcome cookie, prevents repeat display, then routes to account creation.
- This is a front-end launch foundation. A backend marketing subscription and discount-code issuer should replace local persistence in the backend phase.

## Forms

- Authentication forms use React Hook Form and Zod validation with loading, error, success, labels and autocomplete.
- Newsletter forms validate and preserve the submitted email locally while backend subscription is pending.
- Contact prepares a user-reviewed email rather than claiming a server-side submission that does not exist.
- Tracking clearly reports that live order tracking is not active and creates no order data.

## Routing and CTAs

- Primary brand, commerce, recipe, journal, account and support routes resolve to a working page or an intentional anchor.
- Launch utility routes cover FAQs, shipping, returns, refunds, privacy, cookies, terms, careers, community, support, search, cart, checkout, tracking and the story route.
- Payment checkout remains intentionally disabled until security, fulfilment and backend gates are complete.

## Reusable UX foundations

- `NewsletterForm` provides consistent accessible newsletter states.
- `LaunchExperience` owns onboarding and privacy overlays.
- `useBodyScrollLock` prevents background scroll for drawers, lightboxes and modal content.
- Global focus, coarse-pointer and mobile input rules improve keyboard visibility, touch feedback and prevent unwanted form zoom.
