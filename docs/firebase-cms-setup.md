# Firebase CMS Activation Guide

Last verified: June 29, 2026

## Verified Firebase project

- Project ID: `cothecoconutcompany`
- Project number: `551997734422`
- Web App ID: `1:551997734422:web:d6712a9d4de027dbc67f37`
- Billing plan: Spark, no-cost
- Firestore: enabled; an existing `admins` collection was visible
- Firebase Authentication: enabled
- Email/Password provider: enabled
- Intended admin Auth user: `fshan210@gmail.com` exists
- Firebase Storage: not required and was not enabled or modified during this phase

The project settings page matched the known project ID, project number, and Web App ID. No user, key, paid service, Storage bucket, or public-write rule was created.

## Environment variables

### Firebase Web configuration

Required for admin/customer Firebase Authentication:

```text
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

Optional Firebase Web values:

```text
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` is ordinary Firebase web-app configuration, but the CMS does not call Firebase Storage. It may remain empty if Firebase initialization for the deployed app does not require it.

### Firebase Admin SDK

Choose exactly one method.

Preferred single-variable method:

```text
FIREBASE_SERVICE_ACCOUNT_JSON
```

Alternative split-variable method:

```text
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
```

Optional and unused by the storage-free CMS:

```text
FIREBASE_STORAGE_BUCKET
```

### Admin authorization and sessions

```text
ADMIN_EMAIL=fshan210@gmail.com
ADMIN_NAME
ADMIN_ROLE=Super Admin
ADMIN_BASE_PATH=/control-center
ADMIN_SESSION_SECRET
```

`ADMIN_EMAIL` is the bootstrap allowlist. On successful sign-in, the server accepts only an active Firestore admin profile or this exact bootstrap email. If the profile is absent, the bootstrap flow creates the matching active admin document. Firestore is not used as a public route guard; middleware and every CMS server action re-check the signed session and role permission.

Generate `ADMIN_SESSION_SECRET` locally with a password manager or a cryptographically secure random generator. Use a long, unique value and never commit it.
The runtime also accepts the legacy `NEXTAUTH_SECRET` name, but new setup should use `ADMIN_SESSION_SECRET` for clarity.

### Analytics

```text
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-CNXDJ3EMHQ
```

The code has this measurement ID as its production-safe fallback, but setting it explicitly in Vercel makes the deployment contract clear. `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` is separate Firebase Analytics configuration and does not replace the GA4 website variable.

### Revalidation

No `REVALIDATION_SECRET` is required. Content cache invalidation is invoked only inside authenticated, permission-checked server actions. There is no public revalidation endpoint to protect.

## Create a Firebase service-account key

This remains manual because downloading and storing a private key is a sensitive action.

1. Open Firebase Console → **Project settings** → **Service accounts**.
2. Confirm the selected project is `cothecoconutcompany`.
3. Click **Generate new private key** and acknowledge the warning.
4. Store the downloaded JSON outside the repository. The repository ignores common Firebase Admin key filenames.
5. Do not rename or copy the JSON into `public/`, source code, documentation, or Git.

For `FIREBASE_SERVICE_ACCOUNT_JSON`, minify the entire JSON to one line before placing it in Vercel. Do not add extra wrapping quotes in Vercel.

For split variables:

- `FIREBASE_PROJECT_ID`: use the JSON `project_id`.
- `FIREBASE_CLIENT_EMAIL`: use the JSON `client_email`.
- `FIREBASE_PRIVATE_KEY`: paste the complete key, including BEGIN/END lines. In a one-line environment value, replace real newlines with the two characters `\n`. The runtime converts them back to newlines.

Never print the key in terminal output or commit it to `.env.example`.

## Local `.env.local`

1. Copy `.env.example` to `.env.local`.
2. Fill the four required Firebase Web variables from Firebase Console → Project settings → General → Web app → SDK setup.
3. Add one Firebase Admin credential method.
4. Set `ADMIN_EMAIL` to `fshan210@gmail.com`.
5. Set a unique `ADMIN_SESSION_SECRET`.
6. Keep `.env.local` untracked; `.gitignore` already excludes it.

## Add variables in Vercel

1. Open Vercel → `my-website` → **Settings** → **Environment Variables**.
2. Add the required Firebase Web, one Admin SDK method, and admin/session variables listed above.
3. Apply them to Production and Preview; add Development only if Vercel's local pull workflow is intentionally used.
4. Mark Admin SDK and session variables as sensitive when the UI offers that option.
5. Do not expose server variables with a `NEXT_PUBLIC_` prefix.
6. Redeploy after adding or changing environment variables.

Authenticated Vercel was open during this audit, but the environment settings page did not remain responsive through browser automation. Variable names/values were not changed, and current Vercel presence must be checked manually against the list above.

No `.env.local` file exists in the current workspace, so all local values remain intentionally unconfigured until supplied manually.

## Firestore rules

The repository includes `firestore.rules` with explicit collection permissions and a final deny-all fallback. It does not grant unrestricted public writes. CMS reads and writes run through Firebase Admin on the server, so the new `testimonials`, `homepage`, and `seo` collections remain inaccessible to browser clients under the final deny-all rule.

No console rules were published during this phase because the deployed rule revision could not be reliably compared without risking an unintended overwrite. Deploy repository rules only after reviewing the complete diff:

```text
firebase deploy --only firestore:rules --project cothecoconutcompany
```

## Storage-free media

- Existing assets under `/public/assets` are the preferred CMS image references, entered as paths such as `/assets/...`.
- Product, recipe, journal, homepage, and SEO editors use URL/path text fields; none requires an upload.
- `BrandImage` provides a local fallback if an image fails.
- External image URLs are stored by the content model, but Next.js must explicitly allow their host before they are used. Until then, use local `/public` paths.
- The existing media-library sync stores metadata only. Firebase Storage is not required.

## Test dashboard writes

1. Deploy with the environment variables above.
2. Open `/control-center/login` (or the configured `ADMIN_BASE_PATH`).
3. Sign in as `fshan210@gmail.com` using the existing Firebase Auth password.
4. Confirm the dashboard shows **Firestore connected** rather than **Read-only fallback**.
5. Open `/control-center/testimonials`.
6. Create a draft test record with a unique ID and save it.
7. Confirm it exists in Firestore but does not appear publicly while draft.
8. Publish it and confirm the homepage updates after on-demand revalidation.
9. Archive it as draft and confirm the public fallback remains intact.
10. Review `auditLogs` for the create/update/archive entries.

If Admin SDK credentials are missing, save/archive controls remain disabled and server actions return a setup-required message. Public pages continue using curated fallback content and must not return 500 errors.

## Remaining manual actions

- Create and securely store a Firebase service-account key.
- Add the required variable values to Vercel and `.env.local`.
- Confirm Vercel has every required key name; browser automation could not complete this page.
- Redeploy after environment changes.
- Test one draft → publish → archive workflow.
- Compare and deploy `firestore.rules` only if the deployed revision differs.
