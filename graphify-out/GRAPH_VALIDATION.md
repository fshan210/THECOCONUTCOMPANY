# Graph Validation

- Graph file: graphify-out/graph.json
- Built-at commit: cd68a4150fd066e56139ac33ad4e75c834753187
- Current commit: cd68a4150fd066e56139ac33ad4e75c834753187
- Working tree: M package-lock.json
 M package.json
?? graphify-out/
- Nodes: 1638
- Links: 3144
- Communities: 130
- Report weak-node claim: 546
- Recomputed unique-neighbor weak nodes (degree <= 1): 737
- Recomputed strict degree-zero nodes: 5

## Integrity checks

| Check | Result | Evidence | Confidence |
|---|---|---|---|
| JSON parses | PASS | graph.json loads with nodes and links. | Confirmed |
| Node IDs unique | PASS | 1638 unique IDs for 1638 nodes. | Confirmed |
| Link endpoints resolve | PASS | Every endpoint checked against node index. | Confirmed |
| Source paths | PASS | Path existence checked without reading credentials. | Strong evidence |
| Import cycles | PASS | GRAPH_REPORT.md reports none detected. | Strong evidence |
| Provenance | WARNING | 99% EXTRACTED, 1% INFERRED; 21 inferred edges, avg confidence 0.64. | Confirmed |
| Semantic enrichment | WARNING | No trustworthy semantic graph was produced; structural fallback retained. | Confirmed |

## Metric discrepancy

GRAPH_REPORT.md calls 546 nodes isolated/weakly connected, while current graph recomputation yields 737 nodes with at most one unique neighbor and 5 true isolates. This is a metric-definition or report-generation mismatch, not evidence of missing source files. The CSV classifies all recomputed weak nodes and the strict isolates are listed separately.

## Conclusion

The extraction is structurally usable for navigation and targeted source reading. It is not semantically complete, and centrality/weak connectivity must not drive automated deletion or refactoring.
