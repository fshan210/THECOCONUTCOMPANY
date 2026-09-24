# Preview service isolation audit

## Current decision after Preview Firebase Admin isolation (2026-09-24)

**Gate A remains blocked — C, UNSAFE / AMBIGUOUS for all authenticated Preview QA.** New immutable Preview `dpl_4PRe8Mib25wWBFt4Xc5mAbDm7vyU` at `https://my-website-gbedxvebg-fazil-s-projects1.vercel.app/` runs source SHA `460489311809641f27fd880b1b940afeeaf641c8`. Its server-side Firebase Admin credential project ID is **`cothecoconutcompany-preview`**. A no-cookie public `GET /admin/login` returned 200/MISS and caused a Preview function log containing only `firebaseAdminProjectId: cothecoconutcompany-preview`. The credential was created for the new project and set only in Vercel Preview; the separate Production secret entry's update timestamp did not change. The Preview service identity read a deliberately nonexistent document from the new Firestore database and received 404, proving read access without reading a record. No Firestore write probe was necessary or made.

The exact **Production Firebase Admin credential project ID remains unproven** because Vercel masks its Sensitive value. Its credential entry was last updated on 2026-06-29, before the Preview Firebase project existed, so that existing Production entry cannot contain a valid key created for the new project. The canonical checkout's local credential and the deployed Production public client both identify `cothecoconutcompany`, but neither is direct proof of the Production Admin credential.

There is a further mutable boundary: the **new Preview public Firebase client bundle still identifies `cothecoconutcompany`**. `components/admin/AdminForms.tsx` uses that client for admin sign-in and password reset, so Preview admin-auth actions can touch the shared Firebase Authentication project. Only the server-side Admin credential was authorized to change in this task. Admin login, password reset, and all authenticated customer QA remain stopped until this client binding is isolated or the shared-auth risk is explicitly accepted, and Production Admin identity is attested. The current customer-auth flow uses DEV Cognito; no customer sign-in was attempted.

| Service | New Preview | Production | Shared? | QA safety |
| --- | --- | --- | --- | --- |
| Cognito | DEV pool/client from prior audit | Distinct live Production pool/client | No for audited configuration | Customer login remains paused by full Gate A |
| Backend API | DEV `evba5qgrqi` from prior audit; no backend env change | Live Production `pt4om0dz42` | No for traced path | Public reads only |
| Commerce persistence | DEV `dotco-dev-commerce` from prior audit | Production backend table `dotco-production-commerce` | No for traced path | Authenticated QA paused |
| Firebase Admin / Firestore | Runtime ID `cothecoconutcompany-preview`; default Native database in `asia-south1` | Exact Admin ID unproven; Production credential entry unchanged | New project cannot be Production's existing key; exact Production ID unknown | Preview credential isolation proven; complete Gate A still blocked |
| Firebase public client / Auth | `cothecoconutcompany` in new deployed bundle | Same project in deployed Production bundle | **Yes, mutable admin-auth service** | No Preview admin sign-in or password reset |
| Media/CDN | Shared public read-only host | Same host | Yes, read-only | Public visual reads safe |

`FIREBASE_PROJECT_ID=cothecoconutcompany-preview` was added as a non-secret **Preview-only** Vercel variable. `lib/firebase/admin.ts` checks that it matches the credential's `project_id`, refuses the known shared public project in Preview, sets the Admin app `projectId`, and emits the project ID once per Preview function process for operator-visible provenance. Production code and environment are unchanged. The credential has only `roles/datastore.user` on the new project; a temporary operator impersonation grant used for the empty-document read was removed and verified absent. No CMS records were copied: Preview public content is served by the existing DEV API adapter or curated fallback, and the security collection can be created on first legitimate write.

The dedicated project, database, IAM grant, and Preview Vercel variables are recorded in [environment-resource-map.md](environment-resource-map.md). Billing is disabled. Source validation passed frontend/backend typechecks, lint, tests, security tests, build, infrastructure synth, local smoke, and SEO QA. New immutable Preview smoke passed 6 public routes, 4 infrastructure routes, and 139 assets with zero failures; Preview SEO QA passed 20 routes and 58 sitemap URLs. Unauthenticated customer cart/saved GET returned 401 with `private, no-store` caching. No authenticated mutation, diagnostic Firestore write, Production deployment, AWS change, or performance optimization was performed.

## Prior read-only audit of the old Preview

Audited: 2026-09-24. Application SHA: `1e4e09accba7d490da125a240d13510f95ad8f86`; immutable Preview: `dpl_6Qa6BeCBZjRfYPNrKBvi9AHhWDVL`. This historical section describes the old deployment before the authorized Preview configuration and source change. No customer mutation, Vercel configuration change, or AWS mutation was made in that earlier audit.

## Prior decision

**Classification: C — UNSAFE / AMBIGUOUS for authenticated mutation QA.** The existing Preview is strongly correlated to the DEV API by two uncached public server reads and DEV-only Lambda invocations. That Lambda is configured for DEV customer tables. Preview Cognito matches the DEV pool/client. The deployed Preview and Production public Firebase client bundles both name project `cothecoconutcompany`, but the Firebase **Admin** service-account project used for rate-limit/security-event writes remains unreadable. Shared public client configuration does not prove which Firestore project the server credential targets. A mere `preview` target or `NEXT_PUBLIC_APP_ENV=dev` label is not resource binding proof.

Stop authenticated cart, wishlist, saved recipe, account, address, preference, login, and logout QA until the Firebase Admin project identity and shared-state risk are resolved. Login itself can write rate-limit/security-event state through Firebase Admin, so it is inside this stop boundary. Public read-only QA may continue.

## Configuration provenance

| Service | Config variable | Source and Vercel scope | Runtime owner | Non-secret identity available? | Proven resource | Confidence |
| --- | --- | --- | --- | --- | --- | --- |
| Cognito | `COGNITO_USER_POOL_ID`, `COGNITO_APP_CLIENT_ID` | Separate Production Sensitive entries; one encrypted Development+Preview entry for each; no branch override surfaced | Next BFF Cognito client and AWS API JWT verifier | Yes, current Preview pull and live CDK/Lambda outputs | Preview DEV pool `ap-south-1_XlJmCJYXS`, client `4md7svldn4dndr9gtfijgfl80` | High for current Preview configuration; Production Vercel values remain masked |
| Backend API | `SERVER_API_BASE_URL`; optional public-content fallback `NEXT_PUBLIC_DOTCO_API_BASE_URL` | Separate Preview/Production Sensitive entries, no surfaced branch override; fallback key absent from Vercel listing | `lib/customer/aws-api.ts` and `lib/backend/server-api-client.ts` | Yes, runtime correlation; direct variable value remains unreadable | Existing Preview reaches DEV API `evba5qgrqi` for public server reads | High for the deployed public server path; source shares this server variable with authenticated BFF calls |
| Customer persistence | Lambda `COMMERCE_TABLE_NAME`, `CONTENT_TABLE_NAME`, `AUDIT_TABLE_NAME` | CDK stack sets Lambda environment by `envName`; not a browser/Vercel table override | `dotco-dev-api` Lambda | Yes, filtered read-only Lambda configuration | `dotco-dev-commerce`, `dotco-dev-content`, `dotco-dev-audit` | High once DEV API correlation is accepted |
| Firebase | `FIREBASE_SERVICE_ACCOUNT_JSON`; `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Separate Preview/Production Sensitive entries, no surfaced branch override | `lib/firebase/admin.ts` selects Admin project from service-account `project_id`; client bundle embeds public project ID | Public ID yes; Admin ID no | Both deployed public admin-login bundles contain `cothecoconutcompany`; Admin project unknown | High for public client ID, insufficient for Admin/Firestore writes |
| Media/CDN | `NEXT_PUBLIC_MEDIA_BASE_URL` | Separate Preview/Production Sensitive entries | `lib/media.ts` | Yes, rendered URLs | Both Shop pages request public `media.cothecoconutcompany.com`; bundled assets stay deployment-local | High for observed read-only media paths |

The canonical checkout's `.vercel/project.json` links project `my-website` (`prj_x7Ffk9KqIwGX42ZXahpR3CRdf75o`) and team `fazil-s-projects1`; the isolated worktree has no local project link, so read-only CLI calls used an explicit project and scope. `vercel.json` also defines a Python `/_/backend` service; customer commerce BFF calls instead use the AWS `SERVER_API_BASE_URL`. `next.config.mjs` uses `VERCEL_ENV` for Preview/Production headers and crawler policy, not to select the AWS API or Firebase project. The Vercel environment metadata lists separate target entries and no branch-specific `gitBranch` value for the audited keys.

Vercel metadata dates below are UTC and describe variable entries, not the secret values or the immutable deployment's resolved binding:

| Key | Preview entry type; created; updated | Production entry type; created; updated |
| --- | --- | --- |
| `SERVER_API_BASE_URL` | Sensitive; 2026-07-12; 2026-07-17 | Sensitive; 2026-07-14; 2026-07-14 |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Sensitive; 2026-06-29; 2026-06-29 | Sensitive; 2026-06-19; 2026-06-29 |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Sensitive; 2026-06-29; 2026-06-29 | Sensitive; 2026-06-19; 2026-06-19 |

## Service-binding matrix

| Service | Production resource | Preview resource | Same / different | Safe for QA? | Evidence |
| --- | --- | --- | --- | --- | --- |
| Cognito | Live `dotco-production-backend` pool `ap-south-1_Ux3bulrBi`, client ending `c3f`; Vercel Production identifiers present but Sensitive | Pullable Preview identifiers match live `dotco-dev-backend` pool `ap-south-1_XlJmCJYXS` and DEV client ending `l80` | AWS stacks differ; current Preview values match DEV | Identity selection is promising; authenticated QA still blocked by Firebase Admin identity | Vercel environment list and Preview pull; read-only CloudFormation outputs in account `574246331930`, `ap-south-1` |
| Backend API | Live Production API `pt4om0dz42` integrates `dotco-production-api` | Existing Preview public server reads correlate to DEV API `evba5qgrqi`, integrated with `dotco-dev-api`; Sensitive URL remains unreadable | Different for observed Preview server path | Backend binding **passes** for read-only/public path; Gate A still blocked by Firebase | Two uncached Preview pages each followed by exactly one DEV Lambda invocation and zero Production invocations; `DOTCO_USE_API_CONTENT=true`, fallback URL key absent, and `serverApiGet`/customer BFF use `SERVER_API_BASE_URL` |
| Customer persistence | Production Lambda targets `dotco-production-commerce` | Correlated DEV Lambda targets `dotco-dev-commerce` | Different | AWS customer storage identity is DEV; Firebase gate still blocks login QA | Filtered live Lambda environment, API Gateway integrations, repository BFF path |
| Cart persistence | `dotco-production-commerce` | `dotco-dev-commerce` through DEV API | Different | AWS customer storage isolated; overall authenticated QA still blocked | Same BFF/API route and Lambda table binding |
| Wishlist | `dotco-production-commerce` | `dotco-dev-commerce` through DEV API | Different | AWS customer storage isolated; overall authenticated QA still blocked | Same BFF/API route and table binding |
| Saved recipes | `dotco-production-commerce` | `dotco-dev-commerce` through DEV API | Different | AWS customer storage isolated; overall authenticated QA still blocked | Same BFF/API route and table binding |
| Addresses | `dotco-production-commerce` | `dotco-dev-commerce` through DEV API | Different | AWS customer storage isolated; overall authenticated QA still blocked | Same BFF/API route and table binding |
| Preferences/profile | `dotco-production-commerce` | `dotco-dev-commerce` through DEV API | Different | AWS customer storage isolated; overall authenticated QA still blocked | Same BFF/API route and table binding |
| Catalog | Production public content source depends on its own configuration | Preview `DOTCO_USE_API_CONTENT=true`; public reads reached DEV API | Observed Preview catalog source is DEV | Yes for read-only public QA | `lib/content/content-source.ts`; two uncached Preview route reads; DEV-only Lambda logs |
| Firebase rate limiting/security events | Production public client bundle names `cothecoconutcompany`; Production Admin credential project is Sensitive | Preview public client bundle also names `cothecoconutcompany`; Preview Admin credential project is Sensitive and unknown | Public client project shared; Admin project unknown | **No login or other write QA** | Deployed admin-login JavaScript and `lib/firebase/config.ts`; `lib/security/rate-limit.ts` can write Firestore using `lib/firebase/admin.ts` |
| Media/CDN | Public `media.cothecoconutcompany.com` observed on Production Shop | Same public host observed on Preview Shop; bundled media also served from each deployment | Shared public read-only CDN | Yes for read-only visual QA | Rendered Shop HTML on both immutable Preview and canonical Production; `lib/media.ts` |

## Evidence and limits

- Vercel project `my-website` has separate Preview and Production entries for `SERVER_API_BASE_URL`, Cognito identifiers, Firebase project/admin credentials, and media configuration. Separate entries can still contain the same value.
- The Preview pull yielded a DEV Cognito pool/client, `NEXT_PUBLIC_APP_ENV=dev`, and `DOTCO_USE_API_CONTENT=true`. It did not yield the Sensitive API or Firebase values. The Production pull likewise masked those values. Temporary pull files were removed without printing values.
- Read-only CloudFormation/API Gateway/Lambda inspection found distinct live DEV and Production APIs, pools/clients, integrations, and `dotco-dev-*` versus `dotco-production-*` tables. Both APIs use `$default` stages; neither has API Gateway access logs configured.
- Before probes, neither API Lambda log group had a `START` event in the preceding five minutes. A single uncached Preview `GET /shop` ran at 04:45:33–35 UTC (`200`, `x-vercel-cache: MISS`); one DEV Lambda `START` appeared at 04:45:36 UTC and none in Production. A second uncached Preview `GET /journal` ran at 04:46:14–16 UTC (`200`, `MISS`); one DEV `START` appeared at 04:46:16 UTC and none in Production. CloudWatch event timestamps trail the client response slightly, so this is temporal correlation, not a propagated request-ID trace. Two distinct route probes and the source path make the DEV conclusion strong. No customer data or cookies were sent or read.
- Browser-visible Preview resources remain on the Preview/media hosts; the public content API is fetched server-side, so browser host inspection cannot show the upstream AWS hostname. No existing public endpoint exposes the server's effective API URL or Firebase Admin project ID.
- The deployed Preview and Production `/admin/login` JavaScript each embed public Firebase `projectId` `cothecoconutcompany`. This is a non-secret client identifier, not proof that both Firebase Admin service accounts use that project. Firebase Admin selects its project from `FIREBASE_SERVICE_ACCOUNT_JSON.project_id` and can write `securityEvents` for rate limits/logging. It is also used for admin records, audit logs, CMS content, and media-library metadata; AWS DynamoDB is the current customer cart/saved/profile persistence path.
- The repository's older `AWS_CORRECTION_EXECUTION_LOG.md` says Preview API configuration was corrected to DEV in July. The fresh runtime correlation above supplies stronger current evidence than that historical note.
- Vercel documents that a Sensitive environment variable is unreadable after creation, including through the dashboard and pull/API surfaces. A resource-owner attestation or safe runtime binding assertion is necessary; masked values cannot be compared.

## Prior minimum closure evidence

1. Prove the **Preview Firebase Admin service-account project ID** and the Production Admin project ID from an authoritative configuration record or a separately approved, narrowly scoped runtime identity assertion. Only the project IDs should be reported; no JSON, key, token, or email is needed. The public client project is already proven shared.
2. If the Admin projects differ and Preview uses non-Production Firestore, Gate A can be reclassified **ISOLATED**. If they are the same, describe the exact `securityEvents` rate-limit/log writes and possible cross-environment interference, then seek explicit approval before classifying **SHARED BUT CONTROLLED** and doing authenticated QA.
3. If the project IDs cannot be proved, retain **UNSAFE / AMBIGUOUS**. Possible minimum remedies for separate approval are a non-secret Preview resource identity variable, a controlled temporary diagnostic output exposing only project ID, or a Preview-specific Firebase Admin binding. Do not add endpoints or mutate Vercel/Firebase under this audit.

## Prior Firebase Admin provenance

| Question | Finding |
| --- | --- |
| Preview Firebase Admin project ID | **Unknown** for immutable deployment `dpl_6Qa6BeCBZjRfYPNrKBvi9AHhWDVL` |
| Production Firebase Admin project ID | **Unknown** for canonical deployment `dpl_8di1DwrhhGeHh6butKXD1ixFYFYx` |
| Same Admin project? | **Unknown**. Both deployed public client bundles name `cothecoconutcompany`, but that does not identify the server credential. |
| Evidence method | Read-only source and configuration trace; sanitized Vercel environment pulls, deployment metadata and build-log inspection; local credential parsed internally for project ID only. No deployed Admin identity was available. |
| QA implication | Gate A remains **C — UNSAFE / AMBIGUOUS**. No login, authenticated customer mutation, or performance work. |

`lib/firebase/admin.ts` initializes Admin from `FIREBASE_SERVICE_ACCOUNT_JSON.project_id`, or from the split `FIREBASE_PROJECT_ID` credential trio. The canonical checkout's local service-account project ID is `cothecoconutcompany`, matching its local public ID. The local file has no verified linkage to either immutable Vercel deployment, so it is **not** Preview or Production proof. Both Vercel targets return masked Sensitive values from `env pull`; temporary pull files were created outside the repository and removed immediately. Deployment inspection and build logs supplied no Admin ID. Production runtime logs contained no Admin ID; the Preview runtime log query timed out. No diagnostic route was added.

| Firestore collection/path | Purpose and data | Cross-environment impact if the Admin project is shared |
| --- | --- | --- |
| `securityEvents/rate-${action}:${key}` | Rate-limit state for customer/admin authentication and forms; `key` can include IP and email; `checkRateLimit` reads then writes a counter | The key has no environment partition. The same action, IP, and email could share a counter and throttle a Production user after Preview attempts. |
| `securityEvents` generated documents | Security-event log with actor ID/email, IP, user agent, action, and outcome | Preview and Production events would mix in one collection. These records can contain customer identifiers even though storefront cart/saved/profile state is in DEV DynamoDB. |
| `admins`, `auditLogs`, CMS content collections, `mediaLibrary` | Admin accounts/roles, audit history, content and media metadata; writes require their respective admin flows | Shared Admin use could affect Production admin/content state. Those flows are outside the proposed customer QA, but project isolation is still material. |

No Firestore record was read or changed for this proof. Only the non-secret local project ID was extracted from a credential in memory; no credential fields were displayed. A public diagnostic endpoint would add exposure without proving the existing immutable deployment and was not implemented.

Vercel reference: [Sensitive environment variables](https://vercel.com/docs/environment-variables/sensitive-environment-variables).
