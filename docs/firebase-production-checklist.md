# Firebase Production Checklist

Date: June 29, 2026

Project: `cothecoconutcompany`

Production: `https://cothecoconutcompany.com`

## Setup completed

- Phase 4 and Phase 4.1 are merged into `main`.
- Local `main` was fast-forwarded before creating `feature/phase-4-2-firebase-production`.
- Local service-account JSON was found in the project root and is ignored by Git.
- `.env.local` was created locally with secure file permissions and is ignored by Git.
- Firebase project settings verified the expected project ID, project number, and web app ID.
- Firebase Admin SDK initialized locally.
- Firestore connection verified locally.
- Firebase Auth connection verified locally.
- Existing admin account `fshan210@gmail.com` verified locally.
- Dashboard routes verified with an authenticated local admin session.
- Dashboard server-action saves verified for products, recipes, journal, testimonials, homepage, and SEO.
- Public pages verified against published CMS records, then temporary QA records were removed.
- Firebase Storage is not required for the CMS.

## Required environment variables

Set these in local `.env.local` and Vercel Production/Preview as appropriate:

```txt
NEXT_PUBLIC_GA_MEASUREMENT_ID
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
FIREBASE_SERVICE_ACCOUNT_JSON
ADMIN_EMAIL
ADMIN_NAME
ADMIN_ROLE
ADMIN_BASE_PATH
ADMIN_SESSION_SECRET
SESSION_COOKIE_NAME
SESSION_MAX_AGE_DAYS
```

`FIREBASE_SERVICE_ACCOUNT_JSON` can replace the split `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` variables. Do not configure both unless you intentionally want a fallback.

## Vercel environment status

Authenticated Vercel access was available for the `my-website` project. Variable names only were inspected; values were not opened or printed.

Present by name:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_SERVICE_ACCOUNT_JSON`
- `ADMIN_EMAIL`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`

Not found by name:

- `ADMIN_SESSION_SECRET`
- `NEXTAUTH_SECRET`

Because `FIREBASE_SERVICE_ACCOUNT_JSON` is present, missing split private-key variables are acceptable. `ADMIN_SESSION_SECRET` is still required before production dashboard auth is fully activated.

## Remaining manual tasks

1. Open Vercel → `my-website` → Settings → Environment Variables.
2. Add `ADMIN_SESSION_SECRET` for Production, Preview, and Development.
3. Use a long random value from a password manager or secure generator.
4. Redeploy after adding the variable.
5. Open `/control-center/login`.
6. Sign in as `fshan210@gmail.com`.
7. Confirm managed modules show **Firestore connected**.
8. Create a draft record, publish it, confirm public rendering, then archive it.

## Dashboard verification performed

- Products: create draft, publish, edit, archive-as-draft flow succeeded.
- Recipes: create draft and publish flow succeeded.
- Journal: create draft and publish flow succeeded.
- Testimonials: create and edit flow succeeded.
- Homepage: hero copy save flow succeeded and reflected locally.
- SEO: metadata save flow succeeded.

Temporary QA records were removed after verification to avoid production content pollution.

## Failure behavior

Expected behavior when Firebase Admin credentials or the session secret are missing:

- Public pages continue rendering curated fallback content.
- Admin dashboard shows setup/read-only state instead of allowing writes.
- Save/archive controls are disabled or return safe setup-required errors.
- No public write endpoint becomes available.
- No Firebase Storage dependency is introduced.

## Rollback plan

If production dashboard activation causes issues:

1. Remove or disable Firebase Admin credentials in Vercel.
2. Redeploy the previous stable production build.
3. Public pages will fall back to curated static content.
4. Keep Firestore data intact; do not delete content unless a record itself is faulty.
5. Re-enable credentials after fixing the dashboard or content validation issue.

## Recovery procedure

For broken public content:

1. Open the affected dashboard module.
2. Archive the faulty record as draft.
3. Save a corrected record or allow fallback content to show.
4. Verify the public route after cache revalidation.

For credential issues:

1. Confirm `FIREBASE_SERVICE_ACCOUNT_JSON` is valid JSON in Vercel.
2. Confirm `NEXT_PUBLIC_FIREBASE_*` values match the Firebase web app.
3. Confirm `ADMIN_SESSION_SECRET` exists in Vercel.
4. Redeploy.
5. Test `/control-center/login` again.

For Firestore issues:

1. Confirm Firestore is enabled in the Firebase Console.
2. Confirm security rules are not public-write.
3. Confirm the service account has Firestore access.
4. Verify the `admins` collection contains an active admin profile or rely on the bootstrap `ADMIN_EMAIL`.
