# Graph Report - my-website  (2026-07-20)

## Corpus Check
- 378 files · ~13,111,496 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2421 nodes · 4001 edges · 215 communities (161 shown, 54 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.64)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9dfaa0dc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- user-data.ts
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- api-error.ts
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73
- Community 74
- Community 75
- Community 76
- Community 77
- Community 79
- Community 80
- Community 81
- Community 82
- Community 90
- Community 91
- Community 92
- Community 93
- Community 94
- Community 95
- Community 96
- Community 97
- Community 98
- Community 99
- Community 100
- Community 101
- Community 102
- Community 103
- Community 104
- Community 105
- Community 106
- Community 107
- Community 108
- Community 109
- Community 110
- Community 111
- Community 112
- Community 113
- Community 114
- Community 115
- Community 116
- Community 117
- Community 118
- Community 119
- Community 120
- Community 121
- Community 122
- Community 123
- cart.ts
- Google Ranking Roadmap
- Future AWS Free-Tier Migration Plan
- ReferenceSustainabilityPage.tsx
- Firebase CMS Activation Guide
- Analytics.tsx
- SEO, Analytics, Webmaster Tools, and Indexing Readiness
- AWS configuration audit — 2026-07-13
- Useful patterns for `.CO`
- Deployment Runbook
- .CO Stage 1 Design System Foundation
- Dashboard CMS Operations
- Phase 4.3 Interactive Features Report
- Backend Architecture — Phase 1
- Vercel Cost Safety
- Content Architecture
- Phase 4.5 Premium Motion Plan
- Image Audit
- .CO Premium Refinement Report
- Security Decisions
- Authentication final E2E — preview release candidate
- Auth verification audit — 2026-07-12
- Backend Discovery — .CO The Coconut Company
- Final SEO Verification
- Firebase Production Checklist
- Phase 4 CMS Foundation Report
- SEO, Analytics, and Indexing Actions
- cart-context.tsx
- .CO Productization Report
- Final Technical SEO Audit
- events.ts
- Phase 4.3 Motion Architecture
- AWS credit and cost-safety report — 2026-07-12
- ImpactCounters.tsx
- AWS correction execution log
- Content Cache and Revalidation
- Launch readiness flows
- Stage 1 Reference Audit
- DynamoDB Design
- Incident Response
- Performance Results
- Production authentication release report — pending approval
- Production CDK diff review — 2026-07-14
- Firestore Backup and Restore Guide
- layout.tsx
- ContentManager.tsx
- scroll.ts
- Data Privacy
- AWS application configuration audit — 2026-07-12
- Cognito DEV email-delivery audit
- design-review.md
- Firebase to AWS Migration
- Phase 4.3 Motion Root-Cause Audit
- Performance Baseline
- Phase 2 implementation plan
- .CO Backend API
- AWS profile audit — 2026-07-13
- Local toolchain audit — 2026-07-12
- Phase 4.5 Motion Tooling Audit
- Unmanaged us-east-1 Cognito client decommission record
- Local Backend Setup
- Phase 4.3 Preview QA Report
- Production merge impact audit — 2026-07-14
- Abuse Controls
- Authentication E2E results — Preview gate
- Cognito unconfirmed-user retention policy
- Asset Sources
- Phase 1 security verification (DEV)
- API Contract
- CLI installation report — 2026-07-12
- .CO | The Coconut Company
- Local Phase 2 setup
- Phase 4.3 Motion Verification Matrix
- ADMIN_BACKEND_PLAN.md
- AUTHORIZATION_MATRIX.md
- backend-security-ci-workflow.md
- FIREBASE_DATA_AUDIT.md
- FIREBASE_USAGE_INVENTORY.md
- framer-motion
- gsap
- @hookform/resolvers
- PRODUCTION_AUTH_BACKEND_CUTOVER.md
- SOURCE_OF_TRUTH_MATRIX.md
- legalMoves
- shuffleBoard

## God Nodes (most connected - your core abstractions)
1. `cn()` - 57 edges
2. `createPageMetadata()` - 35 edges
3. `getAdminPath()` - 28 edges
4. `scripts` - 28 edges
5. `StructuredData()` - 24 edges
6. `isFirebaseAdminConfigured()` - 23 edges
7. `.CO Website Rules` - 23 edges
8. `.CO Design Review Checklist` - 22 edges
9. `getEnv()` - 21 edges
10. `getFirebaseAdminDb()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `generateMetadata()` --calls--> `createPageMetadata()`  [EXTRACTED]
  app/[slug]/page.tsx → lib/seo/metadata.ts
- `ZeroWasteCard()` --calls--> `cn()`  [EXTRACTED]
  components/about/ReferenceAboutPage.tsx → lib/utils.ts
- `ZeroWasteTree()` --calls--> `cn()`  [EXTRACTED]
  components/about/ReferenceAboutPage.tsx → lib/utils.ts
- `AdminLoginForm()` --indirect_call--> `loginAdmin()`  [INFERRED]
  components/admin/AdminForms.tsx → lib/admin/actions.ts
- `PremiumImage()` --calls--> `cn()`  [EXTRACTED]
  components/founders/ReferenceFoundersPage.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (215 total, 54 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (47): metadata, generateMetadata(), ProductDetailPage(), ProductPageProps, AboutJourney(), steps, AnimatedDoodleIcon(), BentoCard() (+39 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (26): AdminHero(), AdminModulePage(), spring, AdminPathContext, AdminPathProvider(), buildAdminHref(), useAdminBasePath(), useAdminHref() (+18 more)

### Community 2 - "Community 2"
Cohesion: 0.10
Nodes (39): allowedOrigin(), input, POST(), sourceKey(), applyRateLimit(), bad(), beginVerification(), clearSessionCookies() (+31 more)

### Community 3 - "Community 3"
Cohesion: 0.15
Nodes (13): Footer(), links, CookiePreferencesButton(), communityNotes, productCategories, ProductStatus, Recipe, recipeCategories (+5 more)

### Community 4 - "Community 4"
Cohesion: 0.13
Nodes (23): generateMetadata(), FoundersPage(), generateMetadata(), generateMetadata(), JournalPage(), metadata, generateMetadata(), metadata (+15 more)

### Community 5 - "Community 5"
Cohesion: 0.13
Nodes (24): BentoGrid(), BentoGridProps, Footer(), FooterProps, FounderCard(), FounderCardProps, GlassCard(), GlassCardProps (+16 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (36): args, crypto, dryRun, { existsSync }, fileHash(), findUsage(), force, formatBytes() (+28 more)

### Community 7 - "Community 7"
Cohesion: 0.06
Nodes (33): addressIdParamSchema, AddressInput, addressInputSchema, ApiErrorCode, apiErrorCodeSchema, cartItemIdParamSchema, CartItemInput, cartItemInputSchema (+25 more)

### Community 8 - "Community 8"
Cohesion: 0.06
Nodes (34): aws-jwt-verify, @aws-sdk/client-dynamodb, @aws-sdk/lib-dynamodb, dependencies, aws-jwt-verify, @aws-sdk/client-dynamodb, @aws-sdk/lib-dynamodb, @dotco/contracts (+26 more)

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (24): AdminForgotPasswordPage(), AdminForgotPasswordForm(), AdminLoginForm(), createAdminTokenFormData(), initialState, LoginFields, loginSchema, ResetFields (+16 more)

### Community 10 - "user-data.ts"
Cohesion: 0.17
Nodes (27): getEnv(), getDocumentClient(), cartRoutes, getProductById(), subscribeNewsletter(), deleteAddress(), deleteProfile(), getCart() (+19 more)

### Community 11 - "Community 11"
Cohesion: 0.06
Nodes (30): backend, cdk.out, dom, dom.iterable, esnext, infra, .next/dev/types/**/*.ts, next-env.d.ts (+22 more)

### Community 12 - "Community 12"
Cohesion: 0.20
Nodes (13): AccountPage(), metadata, GET(), LoginPage(), metadata, metadata, RegisterPage(), AuthShell() (+5 more)

### Community 13 - "Community 13"
Cohesion: 0.16
Nodes (14): ease, FounderCard(), gallery, milestones, PaperNote(), PremiumImage(), qas, ReferenceFoundersPage() (+6 more)

### Community 14 - "Community 14"
Cohesion: 0.16
Nodes (16): app, createApp(), payloadTooLarge(), rateLimited(), handler, port, bodySizeLimit(), strictCors() (+8 more)

### Community 15 - "Community 15"
Cohesion: 0.07
Nodes (28): scripts, assets:optimize, assets:transparent, aws:dev:verify, aws:whoami, backend:typecheck, build, dev (+20 more)

### Community 16 - "Community 16"
Cohesion: 0.21
Nodes (12): metadata, AddToCartButton(), CartButton(), CartDrawer(), CartLine(), QuantityControl(), RecentlyAddedCard(), spring (+4 more)

### Community 17 - "Community 17"
Cohesion: 0.12
Nodes (11): NewsletterSection(), ease, PremiumImage(), Period, periods, SocialCocreationHub(), communityPosts, communityTestimonials (+3 more)

### Community 18 - "Community 18"
Cohesion: 0.19
Nodes (11): MobileDrawer(), MobileDrawerProps, MoreProduct, MoreProductsCloud(), MoreProductsCloudProps, Button, ButtonProps, buttonVariants (+3 more)

### Community 19 - "Community 19"
Cohesion: 0.15
Nodes (25): allowPublicDnsFallback, applyPlan(), args, authAvailable(), authHeaders(), createDesiredZone(), createPlan(), dig() (+17 more)

### Community 20 - "Community 20"
Cohesion: 0.12
Nodes (17): metadata, metadata, allowedClientReturnPaths, AuthApiError, AuthResult, cognitoAuth(), CustomerForgotPasswordForm(), CustomerLoginForm() (+9 more)

### Community 21 - "Community 21"
Cohesion: 0.08
Nodes (25): aws-cdk-lib, constructs, dependencies, aws-cdk-lib, constructs, devDependencies, aws-cdk, esbuild (+17 more)

### Community 22 - "Community 22"
Cohesion: 0.16
Nodes (14): MagneticButton(), MagneticButtonProps, MotionMarquee(), MotionMarqueeProps, ScrollStory(), ScrollStoryProps, ScrollStoryStep, coEase (+6 more)

### Community 23 - "Community 23"
Cohesion: 0.15
Nodes (28): AdminModuleProps, AdminModuleRoute(), AuditInput, fetchRecentAuditLogs(), writeAdminAuditLog(), requireAdminSession(), LocalMediaAsset, MediaProvider (+20 more)

### Community 24 - "Community 24"
Cohesion: 0.11
Nodes (12): metadata, generateMetadata(), metadata, states, icons, StateKind, StatePanel(), searchable (+4 more)

### Community 25 - "Community 25"
Cohesion: 0.08
Nodes (19): bentoCards, categoryItems, DisplayProduct, ease, fallbackDisplayTestimonials, faqItems, footerLink(), marqueeItems (+11 more)

### Community 26 - "Community 26"
Cohesion: 0.15
Nodes (15): useCustomerSession(), MobileBottomNav(), ReferenceHeader(), recipeCategories, RecipeItem, recipes, categoryIcons, DietaryVersions() (+7 more)

### Community 27 - "Community 27"
Cohesion: 0.12
Nodes (14): categoryOptions, collectionOptions, dietaryOptions, ease, fallbackShopProducts, FilterContent(), mergeProductCatalog(), Product (+6 more)

### Community 28 - "Community 28"
Cohesion: 0.16
Nodes (22): fallbackHomepage, fallbackJournalPosts, fallbackProducts, fallbackRecipes, fallbackSeoMetadata, fallbackTestimonials, cachedHomepage, cachedJournal (+14 more)

### Community 29 - "Community 29"
Cohesion: 0.15
Nodes (19): AdminLoginPage(), AdminShell(), AdminSession, base64Url(), createAdminCsrfToken(), fromBase64Url(), getAdminProfile(), getAdminSession() (+11 more)

### Community 30 - "Community 30"
Cohesion: 0.15
Nodes (14): DELETE(), isSameOrigin(), POST(), metadata, ProfilePage(), readAwsSession(), CustomerAuthState, deleteCustomerAccount() (+6 more)

### Community 31 - "Community 31"
Cohesion: 0.06
Nodes (29): JourneyScrollStory(), milestones, CoconutLoader(), MotionDebugOverlay(), isPlainInternalClick(), MotionContext, MotionContextValue, MotionLink() (+21 more)

### Community 32 - "Community 32"
Cohesion: 0.10
Nodes (20): ActivityLogDocument, AdminDocument, AuditLogDocument, BaseDocument, BrandAssetDocument, ContactFormDocument, JournalDocument, MediaLibraryDocument (+12 more)

### Community 33 - "Community 33"
Cohesion: 0.21
Nodes (14): hasRole(), isKnownRole(), normalizeRoles(), roleOrder, getVerifier(), parseBearerToken(), verifyBearerToken(), forbidden() (+6 more)

### Community 34 - "Community 34"
Cohesion: 0.11
Nodes (18): AboutCounter(), AboutHero(), ease, ReferenceAboutPage(), statItems, values, ZeroWasteCard(), zeroWasteParts (+10 more)

### Community 35 - "Community 35"
Cohesion: 0.21
Nodes (3): FallbackContentSource, FirestoreContentSource, published()

### Community 36 - "Community 36"
Cohesion: 0.10
Nodes (19): dependencies, zod, devDependencies, tsx, @types/node, typescript, tsx, @types/node (+11 more)

### Community 37 - "Community 37"
Cohesion: 0.11
Nodes (19): autoprefixer, eslint, eslint-config-next, devDependencies, autoprefixer, esbuild, eslint, eslint-config-next (+11 more)

### Community 38 - "Community 38"
Cohesion: 0.23
Nodes (9): CustomerAuthContext, CustomerAuthProvider(), SafeSessionResponse, toCustomerSession(), links, Navigation(), CustomerAccountStatus, CustomerSession (+1 more)

### Community 39 - "Community 39"
Cohesion: 0.15
Nodes (17): GET(), xml(), metadata, OrdersPage(), metadata, SavedRecipesPage(), metadata, WishlistPage() (+9 more)

### Community 40 - "Community 40"
Cohesion: 0.11
Nodes (17): compilerOptions, exactOptionalPropertyTypes, lib, module, moduleResolution, noUncheckedIndexedAccess, outDir, rootDir (+9 more)

### Community 41 - "Community 41"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 42 - "Community 42"
Cohesion: 0.13
Nodes (11): app, stack, DotCoBackendStack, DotCoBackendStackProps, EnvName, repoRoot, api, identity (+3 more)

### Community 43 - "Community 43"
Cohesion: 0.15
Nodes (20): clearFailedLogins(), failedLogins, forgotPasswordSchema, getRateLimitKey(), isRateLimited(), loginAdmin(), loginSchema, logoutAdmin() (+12 more)

### Community 44 - "Community 44"
Cohesion: 0.14
Nodes (22): absolute(), GET(), xml(), RootLayout(), generateMetadata(), HomePage(), RecipesPage(), asReferenceRecipe() (+14 more)

### Community 45 - "Community 45"
Cohesion: 0.12
Nodes (15): compilerOptions, lib, module, moduleResolution, outDir, skipLibCheck, strict, target (+7 more)

### Community 46 - "api-error.ts"
Cohesion: 0.17
Nodes (9): notFound(), contentRoutes, journal, recipes, productRoutes, ApiProduct, catalog, getProductBySlug() (+1 more)

### Community 47 - "Community 47"
Cohesion: 0.16
Nodes (8): pathsByType, ContentRecord, ContentType, base, contentSchemas, publicationStatus, seoSchema, validateContentRecord()

### Community 48 - "Community 48"
Cohesion: 0.13
Nodes (14): compilerOptions, declaration, exactOptionalPropertyTypes, lib, module, moduleResolution, noUncheckedIndexedAccess, outDir (+6 more)

### Community 49 - "Community 49"
Cohesion: 0.15
Nodes (9): ApiEnvelope, ApiErrorEnvelope, dotcoApi, DotCoApiError, isServerApiConfigured(), serverApiGet(), getContentSource(), fallbackRecords() (+1 more)

### Community 50 - "Community 50"
Cohesion: 0.44
Nodes (7): AdminPage(), getAdminPath(), isConfiguredAdminPath(), mapConfiguredAdminPath(), normalizePath(), config, middleware()

### Community 51 - "Community 51"
Cohesion: 0.20
Nodes (7): ApiEnv, boolFromString, envSchema, discountRoutes, claimFirstPurchase(), localDiscounts, localNewsletter

### Community 52 - "Community 52"
Cohesion: 0.20
Nodes (9): allowedExt, files, manifest, optimize(), outputDir, publicDir, slugFor(), sourceDirs (+1 more)

### Community 53 - "Community 53"
Cohesion: 0.36
Nodes (7): ApiError, errorHandler(), logError(), logInfo(), logWarn(), redactedKeys, sanitizeForLog()

### Community 54 - "Community 54"
Cohesion: 0.20
Nodes (6): AssetCategory, assets, assetsRoot, categories, outputPath, publicRoot

### Community 55 - "Community 55"
Cohesion: 0.22
Nodes (5): Base, AdminUser, Customer, Lead, DeclarativeBase

### Community 56 - "Community 56"
Cohesion: 0.29
Nodes (7): class-variance-authority, embla-carousel-react, lucide-react, dependencies, class-variance-authority, embla-carousel-react, lucide-react

### Community 57 - "Community 57"
Cohesion: 0.22
Nodes (8): entrypoint, root, routePrefix, experimentalServices, backend, frontend, framework, routePrefix

### Community 58 - "Community 58"
Cohesion: 0.06
Nodes (35): Admin Operating System Release, Asset Optimization Report, Assets Used, Assets Used, Auth And Admin Hardening Release, Bing Webmaster Tools, Favicon Report, Firebase Integration Release (+27 more)

### Community 59 - "Community 59"
Cohesion: 0.32
Nodes (5): assets, convertToWebp(), exec, makeVariants(), manifest

### Community 60 - "Community 60"
Cohesion: 0.25
Nodes (6): args, collections, execute, projectId, result, timestamp

### Community 61 - "Community 61"
Cohesion: 0.33
Nodes (4): database_health(), Session, create_app(), FastAPI

### Community 64 - "Community 64"
Cohesion: 0.29
Nodes (4): auth, configuredAdminEmail, db, serviceAccount

### Community 65 - "Community 65"
Cohesion: 0.29
Nodes (5): args, execute, projectId, result, source

### Community 66 - "Community 66"
Cohesion: 0.29
Nodes (4): assets, colors, outDir, root

### Community 67 - "Community 67"
Cohesion: 0.19
Nodes (24): BrandSlidingPuzzle(), BrandSlidingPuzzleProps, defaultPromotion, desktopGrid, mobileGrid, trackPuzzleEvent(), Window, countInversions() (+16 more)

### Community 68 - "Community 68"
Cohesion: 0.47
Nodes (3): orderRoutes, previewOrder(), prices

### Community 69 - "Community 69"
Cohesion: 0.33
Nodes (4): candidates, outputDir, publicDir, results

### Community 70 - "Community 70"
Cohesion: 0.33
Nodes (3): db, manifest, serviceAccount

### Community 71 - "Community 71"
Cohesion: 0.50
Nodes (3): get_settings(), Settings, BaseSettings

### Community 72 - "Community 72"
Cohesion: 0.50
Nodes (4): collections, isTimestamp(), main(), ServiceAccount

### Community 73 - "Community 73"
Cohesion: 0.50
Nodes (3): name, private, version

### Community 74 - "Community 74"
Cohesion: 0.50
Nodes (3): icons, logo, publicDir

### Community 95 - "Community 95"
Cohesion: 0.23
Nodes (16): availableProcessing(), availableSizes(), findVariant(), isOptionAvailable(), trackConfigurator(), Window, configuredVariants, processing (+8 more)

### Community 102 - "Community 102"
Cohesion: 0.09
Nodes (23): Approved Font System, Brand Positioning, .CO The Coconut Company Design System, Color System, Core Principles, Current Token Contract, Design Taste Inputs, Doodles and Editorial Details (+15 more)

### Community 103 - "Community 103"
Cohesion: 0.09
Nodes (23): Accessibility Rules, Allowed Change Categories, Anti-Patterns, Authority And Scope, Before Editing Code, Bento And Grid Rules, .CO Website Rules, Component And Styling Rules (+15 more)

### Community 129 - "cart.ts"
Cohesion: 0.09
Nodes (22): About And Founders, Accessibility, Breakpoint Review, .CO Design Review Checklist, Deployment Review, Documentation Governance Review, Final Approval Gate, Git And Deployment (+14 more)

### Community 130 - "Google Ranking Roadmap"
Cohesion: 0.09
Nodes (21): 30-day plan, 90-day plan, Authority system, Backlink portfolio, Backlinks and brand mentions, Brand demand, Content clusters, Digital PR (+13 more)

### Community 131 - "Future AWS Free-Tier Migration Plan"
Cohesion: 0.10
Nodes (19): Backend, Cost controls, Current measured asset baseline, Data, Expected free-tier limits to watch, Frontend, Future AWS Free-Tier Migration Plan, Images (+11 more)

### Community 132 - "ReferenceSustainabilityPage.tsx"
Cohesion: 0.16
Nodes (14): imageMeta(), manifest, normalizeSrc(), OptimizedImage, optimizedImageSrc(), OptimizedVariant, ResponsiveImage(), ResponsiveImageProps (+6 more)

### Community 133 - "Firebase CMS Activation Guide"
Cohesion: 0.12
Nodes (15): Add variables in Vercel, Admin authorization and sessions, Analytics, Create a Firebase service-account key, Environment variables, Firebase Admin SDK, Firebase CMS Activation Guide, Firebase Web configuration (+7 more)

### Community 134 - "Analytics.tsx"
Cohesion: 0.20
Nodes (6): ease, LaunchExperience(), Analytics(), CookieConsent, readCookieConsent(), saveCookieConsent()

### Community 135 - "SEO, Analytics, Webmaster Tools, and Indexing Readiness"
Cohesion: 0.13
Nodes (14): Bing Webmaster Tools Setup Guide, Critical Issues, Current Strengths, Google Analytics 4 Setup Guide, Google Search Console Setup Guide, Indexing Readiness, Microsoft Clarity Setup Guide, Open Graph Report (+6 more)

### Community 136 - "AWS configuration audit — 2026-07-13"
Cohesion: 0.14
Nodes (13): ap-south-1, AWS configuration audit — 2026-07-13, Confirmed AWS identities, Correction status, Cost and credit read-only result, Decision table, Exact commands proposed for the next phase, Executive conclusion (+5 more)

### Community 137 - "Useful patterns for `.CO`"
Cohesion: 0.14
Nodes (13): Animation rhythm, Button treatment, Card treatment, Image treatment, Phase 4.5 Refero Animation Notes, Scroll behavior, Section transitions, Spacing and hierarchy (+5 more)

### Community 138 - "Deployment Runbook"
Cohesion: 0.17
Nodes (11): Deployment Runbook, Dev deploy, Disable compromised user, Inspect errors safely, Phase 2 deployment status, Phase 3 Production cutover — approval required, Preview authentication gate, Production deploy (+3 more)

### Community 139 - ".CO Stage 1 Design System Foundation"
Cohesion: 0.17
Nodes (11): Animation rules, Asset pipeline, .CO Stage 1 Design System Foundation, Component foundation, Current framework decision, Installed foundation, MCP workflow, More Products cloud plan (+3 more)

### Community 140 - "Dashboard CMS Operations"
Cohesion: 0.17
Nodes (11): Archive behavior, Current limitations, Dashboard CMS Operations, Editing content, Homepage rules, Product rules, Production activation status, Read-only mode (+3 more)

### Community 141 - "Phase 4.3 Interactive Features Report"
Cohesion: 0.17
Nodes (11): Accessibility, Analytics, Analytics, Assets, Impact counters, Phase 4.3 Interactive Features Report, Product configurator, Schema and valid matrix (+3 more)

### Community 142 - "Backend Architecture — Phase 1"
Cohesion: 0.18
Nodes (10): Backend Architecture — Phase 1, Current status, Dev deployment, Phase 2 status, Phase 3 Production architecture plan — pending approval, Repository structure, Runtime, Security posture (+2 more)

### Community 143 - "Vercel Cost Safety"
Cohesion: 0.18
Nodes (10): Backend cost-safety additions, Current decision, Local optimizer, Near-term recommendation, Operating rules, Production authentication cost gate — 2026-07-14, Remaining cost risks, Vercel Cost Safety (+2 more)

### Community 144 - "Content Architecture"
Cohesion: 0.18
Nodes (10): Authentication and authorization, Content Architecture, Content layer, Content still intentionally static, Current system, Fallback contract, Firestore collections, Phase 4.2 Firebase verification (+2 more)

### Community 145 - "Phase 4.5 Premium Motion Plan"
Cohesion: 0.18
Nodes (10): 1. Hero cinematic sequence, 2. Grove to Goodness animation, 3. Rounded image system enforcement, 4. Shop card polish, 5. Recipe cards, 6. Admin dashboard link audit, 7. Animation performance rules, Current setup status (+2 more)

### Community 146 - "Image Audit"
Cohesion: 0.18
Nodes (10): Duplicate image groups, Flag summary, Image Audit, Largest active source assets with generated variants, Largest generated AVIF variants, Largest original images, Page/media findings, Recommended follow-ups (+2 more)

### Community 147 - ".CO Premium Refinement Report"
Cohesion: 0.18
Nodes (10): .CO Premium Refinement Report, Customer profile and saved content, Deployment gate, Motion system, Performance and accessibility, Popup and cart fixes, Preview configuration correction, Release summary (+2 more)

### Community 148 - "Security Decisions"
Cohesion: 0.18
Nodes (10): API entry, Authentication source of truth, Authorization groups, CDK bootstrap note, CORS, JWT verification, Phase 2 implementation status, Phase 3 production decisions — 2026-07-14 (+2 more)

### Community 149 - "Authentication final E2E — preview release candidate"
Cohesion: 0.20
Nodes (9): Authenticated browser scenario, Authentication final E2E — preview release candidate, Automated checks, Preview browser checks, Production-cutover release gate — 2026-07-14, Redirect policy, Scope, Secure session continuation (+1 more)

### Community 150 - "Auth verification audit — 2026-07-12"
Cohesion: 0.20
Nodes (9): Auth verification audit — 2026-07-12, Current Cognito configuration, Logs and delivery findings, Required production email plan, Resend confirmation, Rollback, Scope and evidence, Signup and confirmation sequence (+1 more)

### Community 151 - "Backend Discovery — .CO The Coconut Company"
Cohesion: 0.20
Nodes (9): Backend Discovery — .CO The Coconut Company, Data migration requirements, Existing environment variables, Firestore collections found, Migration risks, Rollback plan, What exists, What will be replaced (+1 more)

### Community 152 - "Final SEO Verification"
Cohesion: 0.20
Nodes (9): Analytics status, Bing status, Final SEO Verification, Fixed issues, Outcome, Remaining issues and expectations, Search Console actions completed, Structured data status (+1 more)

### Community 153 - "Firebase Production Checklist"
Cohesion: 0.20
Nodes (9): Dashboard verification performed, Failure behavior, Firebase Production Checklist, Recovery procedure, Remaining manual tasks, Required environment variables, Rollback plan, Setup completed (+1 more)

### Community 154 - "Phase 4 CMS Foundation Report"
Cohesion: 0.20
Nodes (9): Architecture found, Dynamic now, Implemented, Outcome, Phase 4 CMS Foundation Report, Quality and security, Recommended Phase 4.5 / Phase 6 work, Still static by design (+1 more)

### Community 155 - "SEO, Analytics, and Indexing Actions"
Cohesion: 0.20
Nodes (9): Automated and confirmed, Bing steps still required, Exact URLs, GA4 post-deployment check, Google waiting tasks, Implementation completed locally, Post-deployment checklist, SEO, Analytics, and Indexing Actions (+1 more)

### Community 156 - "cart-context.tsx"
Cohesion: 0.24
Nodes (9): CartConfiguration, CartContext, CartContextValue, CartItem, cartItemKey(), CartProvider(), previewPrices, readInitialCart() (+1 more)

### Community 157 - ".CO Productization Report"
Cohesion: 0.20
Nodes (9): Analytics and consent, CMS integration, .CO Productization Report, Image management, Motion system, Release decision, Remaining blockers, SEO (+1 more)

### Community 158 - "Final Technical SEO Audit"
Cohesion: 0.22
Nodes (8): Canonical verification, Complete audit, Final Technical SEO Audit, Remaining work, Scores, Search Console evidence, Sitemap mismatch resolution, Structured data validation

### Community 159 - "events.ts"
Cohesion: 0.33
Nodes (8): AnalyticsEventName, AnalyticsEventParams, trackAuthEvent(), trackContactSubmission(), trackDistributorInquiry(), trackEvent(), trackProductInteraction(), Window

### Community 160 - "Phase 4.3 Motion Architecture"
Cohesion: 0.22
Nodes (8): Component primitives, Header glass, Phase 4.3 Motion Architecture, Quality behavior, Reference basis, Runtime ownership, Scroll choreography, Shared foundation

### Community 161 - "AWS credit and cost-safety report — 2026-07-12"
Cohesion: 0.25
Nodes (7): Access limits, AWS credit and cost-safety report — 2026-07-12, Guardrails in code, Phase 3 recheck — 2026-07-14, Planning estimates (not a bill forecast), Required owner-console actions before Production, Verified current DEV posture

### Community 162 - "ImpactCounters.tsx"
Cohesion: 0.32
Nodes (6): ImpactCounters(), MetricCounter(), defaultImpactCounterConfig, ImpactCounterConfig, ImpactMetric, ImpactMetricStatus

### Community 163 - "AWS correction execution log"
Cohesion: 0.25
Nodes (7): AWS correction execution log, Deterministic project commands, Local CLI correction, Pending gates, Preserved baseline, Scope and safety boundary, Vercel Preview correction

### Community 164 - "Content Cache and Revalidation"
Cohesion: 0.25
Nodes (7): Content Cache and Revalidation, Failure behavior, Limitations, Manual refresh, Phase 4.2 cache verification, Read strategy, When changes appear

### Community 165 - "Launch readiness flows"
Cohesion: 0.25
Nodes (7): Authentication, Cookie consent, Forms, Launch readiness flows, Reusable UX foundations, Routing and CTAs, Welcome offer

### Community 166 - "Stage 1 Reference Audit"
Cohesion: 0.25
Nodes (7): Component references checked, Cult UI toolbar expandable, Downloaded references, Inspiration references, Official documentation checked, React Bits Magic Bento, Stage 1 Reference Audit

### Community 167 - "DynamoDB Design"
Cohesion: 0.25
Nodes (7): Audit entities, Commerce entities, Content entities, DynamoDB Design, GSIs, Required safeguards, Tables

### Community 168 - "Incident Response"
Cohesion: 0.25
Nodes (7): First 15 minutes, Incident Response, Investigation, Post-incident, Production authentication containment, Recovery, Severity triggers

### Community 169 - "Performance Results"
Cohesion: 0.25
Nodes (7): Before / after Lighthouse and payload values, Key payload wins, Largest remaining local transferred assets, Mobile variant verification, Performance Results, Remaining blockers, Testing conditions

### Community 170 - "Production authentication release report — pending approval"
Cohesion: 0.25
Nodes (7): Content-source decision, Current deployment, Deployment commands after approval, Email delivery readiness, Production authentication release report — pending approval, Production configuration plan, Status

### Community 171 - "Production CDK diff review — 2026-07-14"
Cohesion: 0.25
Nodes (7): Diff result, Estimated monthly cost, Production CDK diff review — 2026-07-14, Release prerequisites still pending, Resources proposed for creation, Scope and execution, Security controls confirmed in the synthesized template

### Community 172 - "Firestore Backup and Restore Guide"
Cohesion: 0.25
Nodes (7): Collections Included, Dry Run, Execute Export, Firestore Backup and Restore Guide, Restore, Scheduling, Setup

### Community 173 - "layout.tsx"
Cohesion: 0.33
Nodes (5): instrumentSerif, metadata, roboto, viewport, ConsentDefaults()

### Community 174 - "ContentManager.tsx"
Cohesion: 0.38
Nodes (5): ContentEditor(), ContentManager(), EditableRecord, emptyRecord(), recordLabel()

### Community 175 - "scroll.ts"
Cohesion: 0.52
Nodes (5): LenisProvider(), CoLenis, CoLenisOptions, createCoLenis(), startCoLenis()

### Community 176 - "Data Privacy"
Cohesion: 0.29
Nodes (6): Access rules, Account deletion/export, Data minimization, Data Privacy, Logs, Personal data

### Community 177 - "AWS application configuration audit — 2026-07-12"
Cohesion: 0.29
Nodes (6): AWS application configuration audit — 2026-07-12, Customer authentication integration, GitHub Actions / OIDC, Local environment files, Repository configuration, Vercel configuration

### Community 178 - "Cognito DEV email-delivery audit"
Cohesion: 0.29
Nodes (6): Cognito DEV email-delivery audit, Confirmed configuration, Current diagnosis, Recent error evidence, Scope, What remains unproven

### Community 179 - "design-review.md"
Cohesion: 0.43
Nodes (3): .CO Premium Implementation Reference Pack, Current Typography, Motion, And Campaign Implementation, Implementation Priorities

### Community 180 - "Firebase to AWS Migration"
Cohesion: 0.29
Nodes (6): Decommission criteria, Field mapping highlights, Firebase to AWS Migration, Migration approach, Phase 2 migration status, Source collections

### Community 181 - "Phase 4.3 Motion Root-Cause Audit"
Cohesion: 0.29
Nodes (6): Confirmed root causes, Guardrails, Outcome, Phase 4.3 Motion Root-Cause Audit, Removed conflicting paths, Structural evidence

### Community 182 - "Performance Baseline"
Cohesion: 0.29
Nodes (6): Findings, Largest 20 transferred assets, Performance Baseline, Route metrics, Testing conditions, Worst LCP pages

### Community 183 - "Phase 2 implementation plan"
Cohesion: 0.29
Nodes (6): Affected areas, Branch and rollback, Current boundary, Explicit exclusions, Phase 2 implementation plan, Sequence

### Community 184 - ".CO Backend API"
Cohesion: 0.33
Nodes (5): .CO Backend API, Important security notes, Local setup, Stack, Validation

### Community 185 - "AWS profile audit — 2026-07-13"
Cohesion: 0.33
Nodes (5): AWS profile audit — 2026-07-13, Environment override, Local profiles, Resource ownership findings, Verification

### Community 186 - "Local toolchain audit — 2026-07-12"
Cohesion: 0.33
Nodes (5): Assessment, Confirmed environment, Local toolchain audit — 2026-07-12, Recommended long-term cleanup, Repository safety

### Community 187 - "Phase 4.5 Motion Tooling Audit"
Cohesion: 0.33
Nodes (5): 21st.dev reference audit, Future dependency use rules, Package audit before installation, Phase 4.5 Motion Tooling Audit, Utility files created

### Community 188 - "Unmanaged us-east-1 Cognito client decommission record"
Cohesion: 0.33
Nodes (5): Canonical environment safety check, Decision, Explicit approval required, Required post-deletion verification, Unmanaged us-east-1 Cognito client decommission record

### Community 189 - "Local Backend Setup"
Cohesion: 0.33
Nodes (5): Environment, Install, Local Backend Setup, Run local API, Validate

### Community 190 - "Phase 4.3 Preview QA Report"
Cohesion: 0.33
Nodes (5): Local validation, Manual gates, Phase 4.3 Preview QA Report, Required viewport matrix, Scope

### Community 191 - "Production merge impact audit — 2026-07-14"
Cohesion: 0.33
Nodes (5): Classification, Current public behaviour, Decision, Evidence, Production merge impact audit — 2026-07-14

### Community 192 - "Abuse Controls"
Cohesion: 0.40
Nodes (4): Abuse Controls, Bot strategy, Implemented foundation, Required production controls before public AWS cutover

### Community 193 - "Authentication E2E results — Preview gate"
Cohesion: 0.40
Nodes (4): Authentication E2E results — Preview gate, Automated checks completed, Gate status, Manual Preview gate still required

### Community 194 - "Cognito unconfirmed-user retention policy"
Cohesion: 0.40
Nodes (4): Cognito unconfirmed-user retention policy, Current implementation decision, Future safe job design, Policy

### Community 195 - "Asset Sources"
Cohesion: 0.40
Nodes (4): Approved sourcing policy, Asset Sources, Missing or optional assets for future Phase 4.5 implementation, Phase 4.5 asset audit

### Community 196 - "Phase 1 security verification (DEV)"
Cohesion: 0.40
Nodes (4): DEV smoke evidence, Open verification items, Phase 1 security verification (DEV), Verified from source

### Community 197 - "API Contract"
Cohesion: 0.50
Nodes (3): API Contract, Authenticated, Public

### Community 198 - "CLI installation report — 2026-07-12"
Cohesion: 0.50
Nodes (3): CDK verification, CLI installation report — 2026-07-12, Notes

### Community 199 - ".CO | The Coconut Company"
Cohesion: 0.50
Nodes (3): Backend, .CO | The Coconut Company, Frontend

## Knowledge Gaps
- **1078 isolated node(s):** `next/core-web-vitals`, `metadata`, `AdminModuleProps`, `metadata`, `input` (+1073 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **54 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 5` to `Community 34`, `ReferenceSustainabilityPage.tsx`, `Community 13`, `Community 17`, `Community 18`, `Community 24`, `Community 25`, `Community 26`, `Community 27`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `getAdminPath()` connect `Community 50` to `Community 38`, `Community 9`, `Community 43`, `Community 23`, `Community 29`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `ContentTestimonial` connect `Community 28` to `Community 0`, `Community 25`, `Community 63`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `next/core-web-vitals`, `metadata`, `AdminModuleProps` to the rest of the system?**
  _1078 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05485232067510549 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.052525252525252523 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.10303030303030303 - nodes in this community are weakly interconnected._