# Codex Graph Usage

## Source of truth

Use graphify-out/graph.json for relationships and GRAPH_REPORT.md for the summary. Treat this graph as structural fallback; do not re-run extraction for ordinary questions.

## Targeted queries

    cd /Users/fazilshersha/Desktop/my-website
    graphify query "What calls createPageMetadata and how does homepage SEO flow?"
    graphify query "Trace Cognito session to cart persistence" --dfs
    graphify path "HomePage()" "getProducts()"
    graphify explain "getFirebaseAdminDb()"

## Reading rules

- Start with a node ID/path, then read only cited source files and lines.
- Generic labels such as metadata, POST(), scripts, and input are collisions; disambiguate by source_file.
- EXTRACTED edges are stronger than INFERRED edges.
- God node analysis estimates blast radius; it does not justify refactoring.
- isolated-nodes.csv is a review queue, not a deletion list.

## Refresh policy

Only refresh after material source changes or explicit user instruction. Record the commit first and preserve this audit.
