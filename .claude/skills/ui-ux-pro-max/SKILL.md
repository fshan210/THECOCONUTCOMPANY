---
name: ui-ux-pro-max
description: |
  Port of the UI/UX Pro Max design analysis skill (nextlevelbuilder).
  Provides layout/system thinking, hierarchy analysis, typography reasoning,
  responsive thinking, component composition, and UX heuristics.
  Does NOT override brand-protection, design-system, or motion-architecture.
triggers:
  - "ui ux patterns"
  - "design patterns"
  - "ux heuristics"
  - "usability"
  - "layout critique"
  - "component analysis"
  - "hierarchy review"
  - "typography reasoning"
metadata:
  type: project
  skill_version: "0.1.0-claude"
  source: ".reference-downloads/open-design/skills/ui-ux-pro-max/SKILL.md"
  upstream: "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill"
---

# UI/UX Pro Max — .CO The Coconut Company

## Purpose

Provides design analysis capability for the .CO website:
- hierarchy analysis
- layout / system thinking
- typography reasoning
- responsive thinking
- component composition
- UX heuristics

Does NOT provide:
- A bundled pattern library (upstream data CSVs, templates, search
  workflow, and scripts are NOT bundled in this repository).
- Generic redesign recipes.
- Template generation without an explicit user request.

## Source

Derived from the Open Design catalog entry for UI/UX Pro Max
(`nextlevelbuilder/ui-ux-pro-max-skill`).

The Open Design catalog entry explicitly notes that the upstream workflow
requires assets not present locally:
- `data/` CSVs (pattern library entries)
- `scripts/search.py`
- templates and reference material

If the user has installed those upstream files into their skills directory,
the Agent tool can be used to invoke them. Otherwise, this skill provides
Claude-native design analysis grounded in the .CO project rules below.

## When to activate

Use when:
- The user asks about design patterns, UX heuristics, or usability
- Analyzing a component, section, or page layout
- Critiquing hierarchy, typography, or responsive behaviour
- Composing or reorganising components
- A design change requires system-level thinking before implementation

Do NOT use for:
- Brand asset decisions (→ brand-protection)
- Colour / spacing / token decisions (→ design-system)
- Animation / scroll / motion decisions (→ motion-architecture)
- Generic SaaS dashboard layouts, startup landing pages, or random gradients
- Trend-following redesigns without user request
- Unnecessary component replacement

## Hierarchy

```
brand-protection  >  design-system  >  motion-architecture  >  ui-ux-pro-max
```

This skill is subordinate to the three existing project skills. When guidance
conflicts with any of them, defer to the higher-priority skill.

## Project override rules

These rules are non-negotiable for .CO The Coconut Company:

1. **Never redesign approved brand assets.** If a critique touches logos,
   packaging, or approved artwork, route the observation through
   brand-protection first.
2. **Never alter product packaging.** Packaging is owned by brand-protection.
3. **Never replace existing architecture without analysis.** Surface the
   trade-offs before proposing structural changes.
4. **Prefer editorial premium FMCG patterns.** .CO is a premium FMCG brand;
   analyse layouts through that lens — bento grids, editorial whitespace,
   generous typography, restrained colour, liquid surfaces.
5. **Avoid generic SaaS aesthetics.** No card-heavy dashboard layouts,
   startup-gradient hero sections, or stock-photo editorial unless the
   brand context explicitly calls for them.
6. **Preserve the .CO visual universe.** Glass effects, bento layouts,
   scroll-driven experiences, liquid surfaces — these are the brand
   language, not optional decoration.
7. **Prefer existing .CO architecture.** Analyse the current implementation
   before suggesting alternatives; do not propose replacement patterns
   without showing why the current pattern falls short.

## Claude-native workflow

1. **Read before critiquing.** Inspect the actual component, section, or
   page before making recommendations. Do not invent a critique from a
   brief description.
2. **Rank by impact.** Distinguish:
   - hierarchy / information architecture issues (high)
   - typography / readability issues (medium-high)
   - layout / whitespace issues (medium)
   - responsive edge cases (medium)
   - cosmetic alignment issues (low)
3. **Tie every observation to .CO context.** A "generic improvement" is
   rarely useful. Frame each finding in terms of the brand's existing
   visual language.
4. **Preserve existing intent.** Do not propose wholesale replacements
   unless the current pattern is genuinely broken or the user has asked
   for a rethink.
5. **Prefer delta recommendations.** "Swap X for Y here" beats "replace
   this entire section."
6. **Fall back to design-system.** When a finding is fundamentally about
   colour, spacing, or token usage, reference design-system directly
   instead of restating its rules.

## Excluded (from upstream Open Design scope)

The Open Design upstream bundles additional templates, data, and search
workflows that are not available in this repository. The following are
explicitly OUT OF SCOPE for this port:

- Pattern library search (no `data/` CSVs installed)
- Template library (no templates installed)
- `scripts/search.py` (not installed)
- Generic SaaS dashboard pattern library (not aligned with .CO brand)
- Startup landing page templates (not aligned with .CO brand)

## Upstream install path (if user wants full feature set)

If the user wants the full upstream UI/UX Pro Max pattern library:

1. Install upstream: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
2. Place the skill files in a skills directory Claude can invoke (e.g.
   `.claude/skills/` or a parent/global skills directory).
3. Invoke via `ui-ux-pro-max` trigger phrase or direct skill invocation.
4. This .CO skill remains active as the project override layer that
   prevents generic patterns from being applied to .CO surfaces.
