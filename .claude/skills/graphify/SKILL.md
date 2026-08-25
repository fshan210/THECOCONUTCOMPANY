---
name: graphify
description: "Use for any question about a codebase, its architecture, file relationships, or project content — especially when graphify-out/ exists, where the question should be treated as a graphify query first. Turns any input (code, docs, papers, images, videos) into a persistent knowledge graph with god nodes, community detection, and query/path/explain tools."
skill_version: "0.9.18"
derived_from_codex: true
validated_against_cli: "0.9.20"
---

# graphify

**Claude Code port** of the Codex graphify skill. Derived from the 0.9.18 Codex skill (`~/.codex/skills/graphify/`) and validated against Graphify CLI 0.9.20 installed at `/Users/fazilshersha/.local/bin/graphify`.

The pipeline lives under the project at `graphify-out/` (same as upstream). All read paths and examples reference this directory.

> Skill version note: this skill was authored against the 0.9.18 skill instructions. The installed binary is 0.9.20. Treat the binary as authoritative for CLI flags and behavior; use the skill for orchestration policy.

## Binary

```
/Users/fazilshersha/.local/bin/graphify
graphify --version   # 0.9.20 (skill metadata: 0.9.18)
```

## Repo layout

```
.claude/skills/graphify/
  SKILL.md                        # this file
  references/
    query.md                      # query / path / explain flows
    update.md                     # --update and --cluster-only
    extraction-spec.md            # semantic subagent prompt template
    add-watch.md                  # /graphify add and --watch
    exports.md                    # export targets (neo4j, falkordb, wiki, svg, graphml, mcp, benchmark)
    github-and-merge.md           # GitHub URLs, cross-repo merge, monorepo merge
    hooks.md                      # git post-commit hook and native CLAUDE.md install
```

The references/ folder mirrors the Codex source, minus anything that is Claude Code-incompatible (see below).

## Claude Code adaptations from the Codex skill

1. **No Codex platform primitives.** References to `spawn_agent` / `wait_agent` / `close_agent` (Step 3 Part B) were rewritten to use the Claude Code `Agent` tool. Subagents are dispatched from the main loop — there is no `spawn_agent` API in Claude Code.
2. **Agent type defaults to `general-purpose`.** The Codex skill warned against read-only Explore agents for chunk output. In Claude Code the equivalent is the default `general-purpose` agent type. Do not use the Explore subagent type for semantic extraction — it cannot write output files and will silently fail the success check.
3. **Subagent dispatch is single-message parallel.** Launch all semantic subagent calls in a single response so they run concurrently. Collect results sequentially.
4. **Bash restrictions.** Some skill code blocks write to `graphify-out/`. If a Bash call is sandbox-blocked, use the `Write` tool to materialize the JSON file directly.
5. **Skill discovery.** The skill registers as `/graphify` and also as a project skill named `graphify`. The slash command is only required for user-initiated runs; read-only questions surface this skill implicitly when `graphify-out/` exists.

## Usage

```
graphify query "<question>"                          # BFS traversal — broad context
graphify query "<question>" --dfs                    # DFS — trace a specific path
graphify query "<question>" --budget 1500            # cap answer at N tokens
graphify path "AuthModule" "Database"                # shortest path between two concepts
graphify explain "SwinTransformer"                   # plain-language explanation of a node
graphify --update                                     # incremental — re-extract only new/changed files
graphify --cluster-only                               # rerun clustering on existing graph
graphify add <url>                                    # fetch URL, save to ./raw, update graph
graphify --watch                                      # watch folder, auto-rebuild on code changes
```

Other flags (full pipeline): `--mode deep`, `--directed`, `--whisper-model`, `--no-viz`, `--html`, `--svg`, `--graphml`, `--neo4j`, `--neo4j-push`, `--falkordb`, `--falkordb-push`, `--mcp`, `--wiki`, `--obsidian`.

## What graphify is for

Drop any folder of code, docs, papers, images, or video into graphify and get a queryable knowledge graph. Persistent across sessions, honest audit trail (EXTRACTED/INFERRED/AMBIGUOUS), community detection surfaces cross-document connections you wouldn't think to ask about.

## When this skill is active

The skill is active in two situations:

1. **User invokes `/graphify`** — read the user's intent against the Usage block above, then follow the corresponding flow.
2. **Codebase question + `graphify-out/` already exists** — treat it as a graphify query. Jump straight to `## For /graphify query` below. Do not rebuild the graph.

For `--help` or `-h` with no other arguments: print the Usage block verbatim and stop.

## Interpreter guard for subcommands

Before running any subcommand (`--update`, `--cluster-only`, `query`, `path`, `explain`, `add`), ensure `graphify-out/.graphify_python` exists. If it's missing (e.g. user deleted `graphify-out/`), re-resolve the interpreter:

```bash
if [ ! -f graphify-out/.graphify_python ]; then
    GRAPHIFY_BIN=$(which graphify 2>/dev/null)
    if [ -n "$GRAPHIFY_BIN" ]; then
        PYTHON=$(head -1 "$GRAPHIFY_BIN" | tr -d '#!')
        case "$PYTHON" in *[!a-zA-Z0-9/_.@-]*) PYTHON="python3" ;; esac
    else
        PYTHON="python3"
    fi
    mkdir -p graphify-out
    "$PYTHON" -c "import sys; open('graphify-out/.graphify_python', 'w', encoding='utf-8').write(sys.executable)"
fi
```

In all subsequent bash blocks, substitute `$(cat graphify-out/.graphify_python)` for `python3`.

## For --update and --cluster-only

Both are non-default subcommands. `--update` re-extracts only new or changed files; `--cluster-only` reruns clustering on the existing graph. See `references/update.md` for both flows.

---

## For /graphify query

When `graphify-out/graph.json` already exists and the user asks a question about the corpus, answer from the graph rather than rebuilding it.

```bash
graphify query "<question>"
```

Before traversal, expand the question against the graph's own vocabulary so a wording mismatch does not collapse the answer to noise. If the CLI is unavailable, fall back to an inline NetworkX traversal of `graphify-out/graph.json`. For vocab expansion, BFS/DFS traversal modes, `--budget` cap, the NetworkX fallback, `save-result` feedback, `/graphify path`, and `/graphify explain`, see `references/query.md`.

**Honesty rule:** answer using only what the graph contains. Quote `source_location` when citing a specific fact. If the graph lacks enough information, say so — do not hallucinate edges.

## Honesty Rules (clause 2: query-specific)

- Always show the vocab-expansion step (or say explicitly that no vocab tokens matched — do not fabricate a search).
- Always quote `source_location` when citing a fact from the graph.
- Never invent an edge. If unsure, say the graph does not contain a confident link.
- Never claim the graph was regenerated for a read-only query.

---

## For /graphify add and --watch

Neither is part of the default build. When the user runs `/graphify add <url>` to fetch a URL into the corpus, or passes `--watch` to auto-rebuild on file changes, see `references/add-watch.md`.

---

## For the commit hook and native CLAUDE.md integration

When the user asks to install the post-commit auto-rebuild hook or wire graphify into a project's CLAUDE.md, see `references/hooks.md`.

---

## Project authority

This skill is **tier 4** — subordinate to `brand-protection`, `design-system`,
and `motion-architecture` where their domain rules apply. The full project
authority hierarchy (highest → lowest) is:

1. `brand-protection`
2. `design-system`
3. `motion-architecture`
4. `graphify` (this skill)
5. `ui-ux-pro-max`
6. `frontend-taste`
7. `emilkowalski-motion`
8. `redesign-skill`

This skill is authoritative for architecture understanding and impact analysis.

### Interpreter fallback

If `graphify` is not on `$PATH` or the binary at `/Users/fazilshersha/.local/bin/graphify` is missing, do not attempt to install. Tell the user Graphify must be installed separately and exit. This skill does not install or upgrade Graphify.
