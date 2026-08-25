---
name: redesign-skill
description: >
  Orchestrates controlled, incremental redesign of the .CO The Coconut Company website.
  Use when the user asks to redesign, refresh, modernise, improve the look of, or
  rework any page, component, section, or the visual/UX layer of the site.
  Triggers on: redesign, refresh, modernise, rework, improve visuals, improve UX,
  visual upgrade, new look, make it pop, restyle, revamp.
---

# Redesign Skill — .CO The Coconut Company

This skill governs how redesign work is approached on the .CO site.
It is a thin orchestrator. All visual, motion, and UX decisions are delegated
to the existing skill stack in the authority order below.

## Authority Hierarchy (highest → lowest)

1. **brand-protection** — logos, packaging, product assets, approved identity, origin messaging.
2. **design-system** — colours, spacing, radii, typography, glass/neumorphism tokens, responsive breakpoints.
3. **motion-architecture** — scroll choreography, page transitions, Lenis/GSAP decisions, reveal timing.
4. **graphify** — architecture impact analysis before touching shared components.
5. **ui-ux-pro-max** — layout critique, information hierarchy, conversion paths, accessibility floors.
6. **frontend-taste** — visual evaluation and art direction.
7. **emilkowalski-motion** — micro-interaction refinement.
8. **redesign-skill** (this file) — orchestrates the above; never overrides them.

If any instruction in this skill conflicts with a higher-priority skill, the higher-priority skill wins.
Do not resolve the conflict silently — surface it and ask the user.

## What This Skill Does

- Defines the pre-change inspection protocol.
- Defines the change taxonomy (visual / layout / architecture).
- Defines the .CO-specific hard rules.
- Defines the delivery contract (incremental, page-scoped, reversible).

## What This Skill Does NOT Do

- It does not replace brand-protection, design-system, motion-architecture, ui-ux-pro-max, or graphify.
- It does not provide colour palettes, animation curves, component APIs, or brand rules.
- It does not author packaging mock-ups, product photography, or generative brand imagery.
- It does not propose SaaS/dashboard aesthetics or generic glass-morphism trends.

## Hard Rules — Never Break These

- Do not redesign approved packaging. Packaging imagery is locked by brand-protection.
- Do not alter logos in any way.
- Do not invent new product identities, sub-brands, or product lines.
- Do not replace existing visual language with generic 2024+ web trends (cold glass, neon gradients, Bento-for-Bento's-sake, flat 2.0).
- Avoid SaaS/dashboard aesthetics (grey-on-grey cards, indicator chips, funnel icons).
- Preserve premium FMCG editorial feeling — this is a food/wellness brand, not a tech product.
- Prefer gradients and continuous storytelling over disconnected card grids where the page currently uses editorial flow.
- Respect existing coconut-origin storytelling; do not neutralise Kerala-origin language.
- Avoid AI-generated-looking layouts (uniformly-spaced generic cards, stock-photo grids without editorial intent).
- Do not add framework migrations (e.g., swap Framer Motion for something else, replace GSAP, move off Lenis) as part of a redesign.

## Before Any Redesign Work

Claude must complete every step before proposing changes.

### Step 1 — Inspect Current Implementation

Locate and read the real implementation of the target surface.
Do not redesign from memory, a description, or a screenshot alone.

Target surfaces live under `components/` and `app/`.
Each major page has a `Reference{Page}Page.tsx` file that is the single source of truth
for that page's structure, data, and animation wiring.

Common reference files:
- `components/home/ReferenceHomePage.tsx`
- `components/shop/ReferenceShopPage.tsx`
- `components/recipes/ReferenceRecipesPage.tsx`
- `components/sustainability/ReferenceSustainabilityPage.tsx`
- `components/journal/ReferenceJournalPage.tsx`
- `components/our-story/ReferenceOurStoryPage.tsx`
- `components/health-benefits/ReferenceHealthBenefitsPage.tsx`

Shared infrastructure used by every page:
- `components/home/ReferenceHeader.tsx`
- `components/home/ReferenceFooter.tsx`
- `components/home/NewsletterSection.tsx`
- `components/home/MobileBottomNav.tsx`

If architecture impact is unclear (e.g., a shared component may need to change),
run graphify before proposing anything that touches `components/home/`.

### Step 2 — Classify the Change

Every change falls into one of three buckets.

#### A. Visual-only (no architecture impact)
- Typography scale / weight / line-height tweaks within the existing font stack.
- Colour adjustments inside the existing token set (cream `#f8f4ec`, coconut green `#214d2b`, etc.).
- Spacing / padding / border-radius refinements on a single component.
- Blur / glass / shadow tuning.
- Image crop, focal point, or blur-data-URL swap on a single hero.

These can be applied directly after reading the target file.

#### B. Layout change (minor architecture touch)
- Reordering sections within a single page.
- Swapping a card grid for an editorial stack, or vice versa, inside one page.
- Adding / removing a CTA, trust strip, or sub-section within one page.
- Adjusting responsive breakpoints for one page.

Before applying, confirm the change does not require a shared-component change.
If it does, classify it as C.

#### C. Architecture change (must plan first)
- Changes that touch shared components (`ReferenceHeader`, `ReferenceFooter`, `MobileBottomNav`, layout primitives).
- Changes that introduce new shared components.
- Changes that modify routing, data fetching, or state shape.
- Changes that affect more than one page.

For C-class changes: stop, present a plan to the user, wait for approval,
then proceed incrementally.

### Step 3 — Define Improvement Goals

Before touching code, state — in prose, one or two sentences — what is improving
and why. Do not start from "it looks dated" — start from a specific user or business goal.

Examples of acceptable goals:
- "The hero image dominates on mobile and pushes the CTA below the fold."
- "The category filter is not discoverable on touch devices."
- "The trust strip repeats on every page but is only relevant on /shop."

Examples of unacceptable goals:
- "Make it look like Vercel's marketing site."
- "Use more gradients."
- "Modernise the look."

## During Redesign

### Preserve Working Systems

Do not touch:
- Animation wiring (Framer Motion `motion.*`, `AnimatePresence`, `whileInView`, `whileHover`).
- GSAP ScrollTrigger bindings.
- Lenis smooth-scroll integration.
- Data fetching or content shape (recipe-data, journal data, website-assets).
- Existing routing or page boundaries.

Animation and scroll behaviour are owned by motion-architecture.
Do not adjust easing curves, duration defaults, or scroll-linked behaviour
without consulting that skill.

### Incremental Delivery

- Change one section at a time.
- After each section change, describe what changed and why.
- Pause and let the user review before moving to the next section.
- Do not batch a full-site redesign into a single response.

### Separate Visual from Architecture

When proposing a change, label it visual / layout / architecture.
Do not mix them in the same edit without flagging it.

### Mobile Behaviour

Every proposed visual or layout change must include a mobile statement:
"On mobile this becomes…" or "Mobile is unchanged."
If the change degrades mobile, do not propose it.

### Accessibility Floor

- Do not remove focus indicators.
- Do not introduce colour-only meaning (icons or text must accompany colour signals).
- Preserve existing `aria-label` and `role` attributes.
- If adding interactive elements, include keyboard support.

This is a floor, not a ceiling. For deeper accessibility work, defer to ui-ux-pro-max.

### Performance Awareness

- Do not add new image sources without a blur placeholder strategy (the codebase uses `blurDataURL` consistently).
- Do not add client-side dependencies.
- Avoid adding heavy new animation libraries.
- Keep image `sizes` attributes tight; the existing pattern uses responsive `sizes` strings correctly — match it.

## .CO Brand Guardrails (Override Generic Redesign Instincts)

These rules override any "best practice" that would push the site toward a generic direction.

- **No SaaS chrome.** No grey sidebar chrome, no tab-for-everything navigation, no funnel dashboards.
- **No cold glass.** The existing glass uses warm cream (`#f8f4ec`) tones with soft shadows. New glass must use the same warm palette.
- **No neutral sans-serif everywhere.** Cormorant Garamond carries editorial weight. Removing it flattens the brand.
- **No stock-photo Bento grids** without editorial intent. If a bento layout is proposed, it must serve a story.
- **No neutralising the origin story.** Kerala origin, coconut groves, farmer relationships — these are brand DNA, not decoration.
- **No product-line invention.** Do not propose new SKUs, variants, or product categories in the redesign.

## Integration With Other Skills

When the redesign work touches a domain owned by another skill, invoke that skill's guidance.

### brand-protection
Trigger when:
- any visual touches logos, packaging, product photography, brand colours at the identity level.
- any content rewrite touches product claims, origin language, or approved taglines.

Do not proceed past visual decisions on brand-locked surfaces until brand-protection is consulted.

### design-system
Trigger when:
- introducing new spacing values, radii, shadow shapes, or blur levels.
- adjusting the type scale beyond the existing Inter / Cormorant Garamond stack.
- adding new component shapes that must match the existing token system.

### motion-architecture
Trigger when:
- changing section reveal timing.
- adding or removing scroll-triggered animation.
- adjusting Lenis behaviour or GSAP ScrollTrigger wiring.

### ui-ux-pro-max
Trigger when:
- restructuring navigation, CTAs, or conversion paths.
- changing information hierarchy across a full page.
- the redesign requires a layout critique rather than a visual tweak.

### graphify
Trigger when:
- the change touches a shared component.
- architecture impact is unclear.
- the user asks "what else uses this?" or "what breaks if I change X?"

## Redesign Workflow Summary

```
1. Locate the target surface (Reference*.tsx + its shared components).
2. If shared components are in scope → graphify first.
3. Read the current implementation. Do not redesign from a description.
4. Classify the change: Visual / Layout / Architecture.
5. State the improvement goal in one or two sentences.
6. If Architecture-class: present plan, wait for approval.
7. Apply the change to one section.
8. State mobile behaviour and what was preserved.
9. Wait for user review before the next section.
```

## Example: Acceptable Redesign Request → Execution

User request: "The shop hero feels cramped on mobile. Can you fix it?"

Claude response pattern:
1. Read `ReferenceShopPage.tsx` and `ShopHero.tsx`.
2. Confirm ShopHero is not shared (it is shop-only) → Visual-class change.
3. Identify the cramped element (e.g., hero text hitting the fold before the product image).
4. Propose a specific adjustment (e.g., reduce `min-h-[480px]` to `min-h-[420px]` on mobile, shift the image object-position).
5. Apply to one section only.
6. Report: "On mobile the hero is now 420px tall; the product image remains visible. Desktop is unchanged."

## Example: Unacceptable Pattern to Reject

User request: "Make it look like Apple's product pages."

Claude response:
- Apple's aesthetic conflicts with the .CO brand system (brand-protection).
- The request implies replacing the existing editorial/FMCG language with a tech-product language.
- Propose a direction that improves the current page within the existing brand system instead,
  and surface the conflict explicitly.

## Deliverable Contract

At the end of any redesign task, Claude must report:

- Sections changed (file paths and section descriptions).
- Sections left untouched (with reason).
- Brand risk surface (what was checked against brand-protection).
- Mobile behaviour summary.
- Follow-up suggestions (if any) that are out of scope of the current request and
  require explicit user approval before proceeding.
