# God Node Analysis

God Nodes are high-degree structural hubs, not automatic refactoring targets.

| Rank | Label | Node ID(s) | Path:line | In | Out | Communities | Interpretation | Confidence |
|---|---|---|---|---|---|---|---|---|
| 1 | cn() | lib_utils_cn | lib/utils.ts:L4 | 58 | 0 | 5 | Shared className merge utility; high fan-in is expected and low risk. | Confirmed |
| 2 | createPageMetadata() | lib_seo_metadata_createpagemetadata | lib/seo/metadata.ts:L16 | 35 | 0 | 4 | Central SEO metadata factory; changes affect many route heads. | Confirmed |
| 3 | getAdminPath() | lib_admin_path_getadminpath | lib/admin/path.ts:L11 | 27 | 1 | 50 | Admin URL policy bridge used by middleware and admin UI/actions. | Confirmed |
| 4 | scripts | backend_package_scripts, infra_package_scripts, package_scripts, packages_contracts_package_scripts | backend/package.json:L6, infra/package.json:L6, package.json:L5, packages/contracts/package.json:L8 | 4 | 38 | 8, 21, 15, 36 | Package manifest script keys, not one executable abstraction; label is collapsed across manifests. | Confirmed |
| 5 | StructuredData() | components_seo_structureddata_structureddata | components/seo/StructuredData.tsx:L9 | 20 | 4 | 4 | Global JSON-LD renderer; schema changes affect many pages. | Confirmed |
| 6 | isFirebaseAdminConfigured() | lib_firebase_admin_isfirebaseadminconfigured | lib/firebase/admin.ts:L32 | 22 | 1 | 23 | Configuration gate shared by Firebase-backed admin paths. | Confirmed |
| 7 | getEnv() | backend_src_config_env_getenv | backend/src/config/env.ts:L30 | 21 | 0 | 10 | Backend environment parser/cache; changes affect backend services. | Confirmed |
| 8 | getFirebaseAdminDb() | lib_firebase_admin_getfirebaseadmindb | lib/firebase/admin.ts:L59 | 20 | 1 | 23 | Firestore admin client accessor shared by CMS/security functions. | Confirmed |
| 9 | useCoconutMotionMode() | lib_animations_coconut_motion_usecoconutmotionmode | lib/animations/coconut-motion.ts:L19 | 18 | 1 | 0 | Global motion preference hook; preserve reduced-motion behavior. | Confirmed |
| 10 | POST() | app_api_auth_cognito_resend_confirmation_route_post, app_api_auth_cognito_route_post, app_api_customer_saved_route_post, app_api_newsletter_route_post | app/api/auth/cognito/resend-confirmation/route.ts:L20, app/api/auth/cognito/route.ts:L84, app/api/customer/saved/route.ts:L18, app/api/newsletter/route.ts:L6 | 4 | 26 | 2, 2, 30, 83 | Generic route-handler label collapsed across four distinct POST handlers; disambiguate by path. | Confirmed |

## Guardrails

- scripts and POST() are label-collision groups, not single symbols.
- Shared utilities, metadata, structured data, environment parsing, Firebase access, and motion hooks are intentionally reused.
- Before changing a hub, inspect all direct callers and run route-level tests.
