# .CO current production architecture

## Runtime

```text
Browser
  -> cothecoconutcompany.com (Vercel / Next.js App Router)
       -> server-rendered content and public routes
       -> BFF routes for Cognito session, saved content, and newsletter
       -> Firebase Admin for Admin OS/CMS/audit records
       -> Hono API for customer, content, newsletter, pricing, and order previews
  -> media.cothecoconutcompany.com/site-media/v1 (CloudFront)
       -> private versioned S3 origin through OAC
```

- Framework: Next.js 15 App Router on Vercel, React 18.
- Public content: repository defaults with optional API/Firebase-backed content reads.
- Media: `lib/media.ts` maps managed paths to CloudFront and preserves a local fallback. Transparent current product assets and the two homepage videos remain deliberately bundled for production continuity.
- Motion: `MotionProvider`, central `lib/motion` configuration, Framer Motion/GSAP, and explicit `prefers-reduced-motion` paths. Lenis, ripple effects, continuous media, and scroll effects disable or flatten for reduced motion.
- SEO: central metadata helpers, sitemap/robots/image/news sitemap routes, and organization/website/navigation plus page-specific structured data.

## Identity and authorization

- Customer identity: Cognito BFF endpoints set encrypted, HTTP-only, same-site cookies. Browser session reads never return tokens.
- Admin identity: Firebase token lookup plus an active Firestore admin profile. `ADMIN_EMAIL` can bootstrap the first administrator. Middleware only performs early cookie routing; server layouts/actions independently call `requireAdminSession` and RBAC permissions.
- Abuse controls: same-origin checks, bounded payload schemas, distributed Firebase-backed rate limiting with memory fallback, request IDs, and optional reCAPTCHA.

## Commerce state

- Cart and routine selections are presentation/client state.
- Checkout is explicitly labelled "coming soon"; no production payment capture is wired.
- The backend can produce server-priced previews and pending unpaid order envelopes, but this is not a live commerce commitment or payment system.

## Backend and data

- Hono API applies request IDs, strict allow-list CORS, secure headers, body limits, rate limits, and normalized error envelopes.
- Cognito validates customer tokens. DynamoDB repositories hold customer/content/commerce records where configured.
- Firebase Admin supports Admin OS, CMS records, audit/security events, and distributed form/auth rate limits.

## Failure and observability

- Next.js provides loading, error, offline, and not-found experiences; unknown public paths return HTTP 404.
- Vercel logs diagnose application/BFF failures. Backend logs are structured JSON with request IDs and sanitized fields.
- No paid third-party error platform is currently installed. Add one only after an explicit operating decision.

## Delivery protection

- `main` is the sole permanent branch and Vercel production source.
- GitHub Actions job `validate` installs locked dependencies, typechecks, lints, tests, builds, synthesizes infrastructure, and smoke-tests the production build.
- Release baseline: tag `v2.2.0-production-baseline` at `b83631b8c5fe48dbc20e5ae30b8b86a1913e880d`.
