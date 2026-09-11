# Correction ownership audit

Verified start: clean correction worktree on commerce branch, HEAD 75a2cbcbceac330f5a5bf6429c2bf6dbc5159d09; origin/main remains 93a01b2dbb2d207e4eff075a0332f131835d15d3 and is an ancestor.

- AccountShell tabs are plain anchors with data-motion=off, causing full-document navigations. Every AccountPage renders a fresh header, hero, tabs, content and footer. There is no shared Account layout. The root loading fallback returns null for Account, so no stable frame remains while a new server page loads.
- globals.css body explicitly paints var(--co-cream); html has no dark canvas. Empty/loading/remounted regions and margin exposure show the underlying cream. Root loading and RouteTransition still own a full-screen green CoconutLoader for public navigation.
- Canonical ReferenceHeader Products href is /shop#all-products. This deliberately targets the grid. Custom document click interception, Lenis and unconditional smooth scrolling also participate in scroll handling.
- Auth CSS sets login split minimum max(100svh,1120px), register minimum 1610px, content padding 150px/108px, generous per-section margins, and an extra 550-660px mobile scene. These values force scroll independent of content needs.
- Sustainability's approved route source remains unchanged from Production. The document-level cream exposure is the first owner to fix; verify hero geometry before changing route-local composition.

Correction plan: persistent Account route-group frame with existing page-level session verification; client links and content-only settling; measured stable content frame; canonical dark document fallback; no theatrical global loading overlay; explicit top-level navigation intent with deterministic scroll/focus; CSS-only auth density with required controls preserved. No backend, cookies, middleware, payments, data or dependencies changed.
