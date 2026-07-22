# Graph Report - .  (2026-07-19)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1638 nodes · 3144 edges · 130 communities (87 shown, 43 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.64)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cd68a415`
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

## God Nodes (most connected - your core abstractions)
1. `cn()` - 58 edges
2. `createPageMetadata()` - 35 edges
3. `getAdminPath()` - 28 edges
4. `scripts` - 28 edges
5. `StructuredData()` - 24 edges
6. `isFirebaseAdminConfigured()` - 23 edges
7. `getEnv()` - 21 edges
8. `getFirebaseAdminDb()` - 21 edges
9. `useCoconutMotionMode()` - 19 edges
10. `POST()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `generateMetadata()` --calls--> `createPageMetadata()`  [EXTRACTED]
  app/[slug]/page.tsx → lib/seo/metadata.ts
- `OrdersPage()` --calls--> `requireVerifiedCustomerSession()`  [EXTRACTED]
  app/orders/page.tsx → lib/customer/auth.ts
- `generateStaticParams()` --calls--> `getRecipes()`  [EXTRACTED]
  app/recipes/[slug]/page.tsx → lib/content/server.ts
- `ShopPage()` --calls--> `getProducts()`  [EXTRACTED]
  app/shop/page.tsx → lib/content/server.ts
- `ZeroWasteCard()` --calls--> `cn()`  [EXTRACTED]
  components/about/ReferenceAboutPage.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (130 total, 43 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (44): metadata, AboutJourney(), steps, AnimatedDoodleIcon(), BentoCard(), BentoGrid(), BillboardWord(), BrandMarquee() (+36 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (26): AdminHero(), AdminModulePage(), spring, AdminPathContext, AdminPathProvider(), buildAdminHref(), useAdminBasePath(), useAdminHref() (+18 more)

### Community 2 - "Community 2"
Cohesion: 0.10
Nodes (41): allowedOrigin(), input, POST(), sourceKey(), applyRateLimit(), bad(), beginVerification(), clearSessionCookies() (+33 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (30): Footer(), links, CookiePreferencesButton(), NewsletterForm(), LenisProvider(), Analytics(), AnalyticsEventName, AnalyticsEventParams (+22 more)

### Community 4 - "Community 4"
Cohesion: 0.12
Nodes (27): generateMetadata(), metadata, FoundersPage(), generateMetadata(), generateMetadata(), JournalPage(), generateMetadata(), RecipesPage() (+19 more)

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
Cohesion: 0.20
Nodes (24): getEnv(), getDocumentClient(), subscribeNewsletter(), deleteAddress(), deleteProfile(), getWishlist(), isLocal(), key() (+16 more)

### Community 11 - "Community 11"
Cohesion: 0.06
Nodes (30): backend, cdk.out, dom, dom.iterable, esnext, infra, .next/dev/types/**/*.ts, next-env.d.ts (+22 more)

### Community 12 - "Community 12"
Cohesion: 0.11
Nodes (20): AccountPage(), metadata, GET(), LoginPage(), metadata, metadata, OrdersPage(), metadata (+12 more)

### Community 13 - "Community 13"
Cohesion: 0.11
Nodes (25): AboutCounter(), AboutHero(), JourneyTimeline(), CounterStat(), CounterStatProps, ease, FounderCard(), gallery (+17 more)

### Community 14 - "Community 14"
Cohesion: 0.16
Nodes (16): app, createApp(), payloadTooLarge(), rateLimited(), handler, port, bodySizeLimit(), strictCors() (+8 more)

### Community 15 - "Community 15"
Cohesion: 0.07
Nodes (28): scripts, assets:optimize, assets:transparent, aws:dev:verify, aws:whoami, backend:typecheck, build, dev (+20 more)

### Community 16 - "Community 16"
Cohesion: 0.12
Nodes (21): metadata, AddToCartButton(), CartButton(), CartDrawer(), CartLine(), QuantityControl(), RecentlyAddedCard(), spring (+13 more)

### Community 17 - "Community 17"
Cohesion: 0.10
Nodes (13): metadata, NewsletterSection(), ease, PremiumImage(), ReferenceJournalPage(), Period, periods, SocialCocreationHub() (+5 more)

### Community 18 - "Community 18"
Cohesion: 0.12
Nodes (19): MobileDrawer(), MobileDrawerProps, MoreProduct, MoreProductsCloud(), MoreProductsCloudProps, MoreProductsDialog(), ease, LaunchExperience() (+11 more)

### Community 19 - "Community 19"
Cohesion: 0.15
Nodes (25): allowPublicDnsFallback, applyPlan(), args, authAvailable(), authHeaders(), createDesiredZone(), createPlan(), dig() (+17 more)

### Community 20 - "Community 20"
Cohesion: 0.13
Nodes (16): metadata, allowedClientReturnPaths, AuthApiError, AuthResult, cognitoAuth(), CustomerForgotPasswordForm(), CustomerLoginForm(), CustomerRegisterForm() (+8 more)

### Community 21 - "Community 21"
Cohesion: 0.08
Nodes (25): aws-cdk-lib, constructs, dependencies, aws-cdk-lib, constructs, devDependencies, aws-cdk, esbuild (+17 more)

### Community 22 - "Community 22"
Cohesion: 0.18
Nodes (18): ImageReveal(), ImageRevealProps, MagneticButton(), MagneticButtonProps, MotionMarquee(), MotionMarqueeProps, ScrollStory(), ScrollStoryProps (+10 more)

### Community 23 - "Community 23"
Cohesion: 0.20
Nodes (20): AdminModuleProps, AdminModuleRoute(), fetchRecentAuditLogs(), writeAdminAuditLog(), requireAdminSession(), LocalMediaAsset, MediaProvider, syncLocalMediaLibrary() (+12 more)

### Community 24 - "Community 24"
Cohesion: 0.11
Nodes (12): metadata, generateMetadata(), metadata, states, icons, StateKind, StatePanel(), searchable (+4 more)

### Community 25 - "Community 25"
Cohesion: 0.09
Nodes (17): bentoCards, categoryItems, DisplayProduct, ease, fallbackDisplayTestimonials, faqItems, footerLink(), marqueeItems (+9 more)

### Community 26 - "Community 26"
Cohesion: 0.14
Nodes (18): MobileBottomNav(), imageMeta(), manifest, normalizeSrc(), OptimizedImage, optimizedImageSrc(), OptimizedVariant, ResponsiveImage() (+10 more)

### Community 27 - "Community 27"
Cohesion: 0.10
Nodes (18): ReferenceRecipesPage(), categoryOptions, collectionOptions, dietaryOptions, ease, fallbackShopProducts, FilterContent(), mergeProductCatalog() (+10 more)

### Community 28 - "Community 28"
Cohesion: 0.22
Nodes (16): fallbackHomepage, fallbackJournalPosts, fallbackProducts, fallbackRecipes, fallbackSeoMetadata, fallbackTestimonials, ContentJournalPost, ContentProduct (+8 more)

### Community 29 - "Community 29"
Cohesion: 0.17
Nodes (18): AdminLoginPage(), AdminShell(), base64Url(), createAdminCsrfToken(), fromBase64Url(), getAdminProfile(), getAdminSession(), getConfiguredAdminRole() (+10 more)

### Community 30 - "Community 30"
Cohesion: 0.16
Nodes (14): DELETE(), isSameOrigin(), POST(), metadata, ProfilePage(), CustomerAuthState, deleteCustomerAccount(), profileSchema (+6 more)

### Community 31 - "Community 31"
Cohesion: 0.19
Nodes (15): AuditInput, AdminSession, FirestoreCollectionName, firestoreCollections, limits, protectionSchema, validateAuthProtection(), SecurityEventInput (+7 more)

### Community 32 - "Community 32"
Cohesion: 0.10
Nodes (20): ActivityLogDocument, AdminDocument, AuditLogDocument, BaseDocument, BrandAssetDocument, ContactFormDocument, JournalDocument, MediaLibraryDocument (+12 more)

### Community 33 - "Community 33"
Cohesion: 0.21
Nodes (14): hasRole(), isKnownRole(), normalizeRoles(), roleOrder, getVerifier(), parseBearerToken(), verifyBearerToken(), forbidden() (+6 more)

### Community 34 - "Community 34"
Cohesion: 0.10
Nodes (11): cleanItems, conventionalItems, ease, IngredientList(), ReferenceAboutPage(), statItems, timelineItems, values (+3 more)

### Community 35 - "Community 35"
Cohesion: 0.15
Nodes (4): FallbackContentSource, FirestoreContentSource, published(), validateContentRecord()

### Community 36 - "Community 36"
Cohesion: 0.10
Nodes (19): dependencies, zod, devDependencies, tsx, @types/node, typescript, tsx, @types/node (+11 more)

### Community 37 - "Community 37"
Cohesion: 0.11
Nodes (19): autoprefixer, eslint, eslint-config-next, devDependencies, autoprefixer, esbuild, eslint, eslint-config-next (+11 more)

### Community 38 - "Community 38"
Cohesion: 0.17
Nodes (14): instrumentSerif, metadata, roboto, viewport, CustomerAuthContext, CustomerAuthProvider(), SafeSessionResponse, toCustomerSession() (+6 more)

### Community 39 - "Community 39"
Cohesion: 0.20
Nodes (14): GET(), xml(), metadata, SavedRecipesPage(), metadata, WishlistPage(), CustomerSimplePage(), SavedCard (+6 more)

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
Cohesion: 0.20
Nodes (15): clearFailedLogins(), failedLogins, forgotPasswordSchema, getRateLimitKey(), isRateLimited(), loginAdmin(), loginSchema, logoutAdmin() (+7 more)

### Community 44 - "Community 44"
Cohesion: 0.18
Nodes (13): absolute(), GET(), xml(), RootLayout(), generateMetadata(), ProductDetailPage(), ProductPageProps, routes (+5 more)

### Community 45 - "Community 45"
Cohesion: 0.12
Nodes (15): compilerOptions, lib, module, moduleResolution, outDir, skipLibCheck, strict, target (+7 more)

### Community 46 - "api-error.ts"
Cohesion: 0.22
Nodes (5): ApiError, notFound(), contentRoutes, journal, recipes

### Community 47 - "Community 47"
Cohesion: 0.19
Nodes (11): ContentEditor(), ContentManager(), EditableRecord, emptyRecord(), recordLabel(), ContentRecord, ContentType, base (+3 more)

### Community 48 - "Community 48"
Cohesion: 0.13
Nodes (14): compilerOptions, declaration, exactOptionalPropertyTypes, lib, module, moduleResolution, noUncheckedIndexedAccess, outDir (+6 more)

### Community 49 - "Community 49"
Cohesion: 0.15
Nodes (9): ApiEnvelope, ApiErrorEnvelope, dotcoApi, DotCoApiError, isServerApiConfigured(), serverApiGet(), getContentSource(), fallbackRecords() (+1 more)

### Community 50 - "Community 50"
Cohesion: 0.33
Nodes (7): AdminPage(), getAdminPath(), isConfiguredAdminPath(), mapConfiguredAdminPath(), normalizePath(), config, middleware()

### Community 51 - "Community 51"
Cohesion: 0.20
Nodes (7): ApiEnv, boolFromString, envSchema, discountRoutes, claimFirstPurchase(), localDiscounts, localNewsletter

### Community 52 - "Community 52"
Cohesion: 0.20
Nodes (9): allowedExt, files, manifest, optimize(), outputDir, publicDir, slugFor(), sourceDirs (+1 more)

### Community 53 - "Community 53"
Cohesion: 0.50
Nodes (6): errorHandler(), logError(), logInfo(), logWarn(), redactedKeys, sanitizeForLog()

### Community 54 - "Community 54"
Cohesion: 0.20
Nodes (6): AssetCategory, assets, assetsRoot, categories, outputPath, publicRoot

### Community 55 - "Community 55"
Cohesion: 0.22
Nodes (5): Base, AdminUser, Customer, Lead, DeclarativeBase

### Community 56 - "Community 56"
Cohesion: 0.22
Nodes (9): embla-carousel-react, framer-motion, gsap, @hookform/resolvers, dependencies, embla-carousel-react, framer-motion, gsap (+1 more)

### Community 57 - "Community 57"
Cohesion: 0.22
Nodes (8): entrypoint, root, routePrefix, experimentalServices, backend, frontend, framework, routePrefix

### Community 58 - "Community 58"
Cohesion: 0.39
Nodes (7): generateMetadata(), HomePage(), cachedHomepage, cachedTestimonials, getHomepageContent(), getTestimonials(), faqSchema()

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
Cohesion: 0.53
Nodes (5): asReferenceRecipe(), findRecipe(), generateMetadata(), generateStaticParams(), RecipePage()

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

### Community 129 - "cart.ts"
Cohesion: 0.24
Nodes (8): cartRoutes, productRoutes, ApiProduct, catalog, getProductById(), getProductBySlug(), listProducts(), getCart()

## Knowledge Gaps
- **546 isolated node(s):** `next/core-web-vitals`, `metadata`, `AdminModuleProps`, `metadata`, `input` (+541 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **43 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getAdminPath()` connect `Community 50` to `Community 38`, `Community 9`, `Community 43`, `Community 23`, `Community 29`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 5` to `Community 34`, `Community 3`, `Community 4`, `Community 13`, `Community 17`, `Community 18`, `Community 24`, `Community 25`, `Community 26`, `Community 27`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `createPageMetadata()` connect `Community 4` to `Community 0`, `Community 2`, `Community 67`, `Community 39`, `Community 12`, `Community 44`, `Community 16`, `Community 17`, `Community 20`, `Community 24`, `Community 58`, `Community 30`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `next/core-web-vitals`, `metadata`, `AdminModuleProps` to the rest of the system?**
  _546 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05328005328005328 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.052525252525252523 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.10175763182238667 - nodes in this community are weakly interconnected._