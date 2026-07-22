# Semantic Backend Diagnosis

## Result

The current graph is a structural fallback, not a semantically enriched graph. AST extraction completed with 1,638 nodes and 3,144 links. No trustworthy LLM-produced semantic JSON was merged.

## Attempts and evidence

| Backend/path | Result | Confidence |
|---|---|---|
| Structural AST | Completed; 99% extracted, 1% inferred, 21 inferred edges | Confirmed |
| Bedrock | Invalid/unreachable model or endpoint configuration | Confirmed from command output |
| OpenAI-compatible proxy | Authentication failure; no key was printed or committed | Confirmed from command output |
| Claude-compatible proxy | Authentication/service failure | Confirmed from command output |
| Ollama qwen2.5-coder:7b | Prose/Markdown instead of required Graphify JSON; retries interrupted | Confirmed from command output |

## Implications

- Relationships are usable for deterministic navigation and targeted source lookup.
- Runtime configuration, dynamic imports, and business semantics remain incomplete.
- Inferred edges average 0.64 confidence and are hypotheses.
- No credentials or secret model output were written to the repository.

## Safe next run

Use one supported backend with valid local configuration, write semantic output to a temporary file, validate schema/counts, then merge only after review.
