# Isolated Node Classification

The original report listed 546 weak nodes. Current graph recomputation finds 737 nodes with degree <= 1 and 5 true degree-zero isolates. All 737 weak nodes are classified in isolated-nodes.csv.

| Classification | Count | Meaning |
|---|---|---|
| framework convention | 61 | Next.js convention-discovered route/layout. |
| indirectly referenced | 362 | Repository search found indirect references. |
| manual review | 27 | Insufficient automation evidence. |
| parser limitation | 4 | Missing path/parser evidence. |
| potentially unused | 2 | No graph/text reference; manual review. |
| test fixture | 1 | Test-runner discovered code. |
| test/dev utility or config | 280 | CI/scripts/config entry point. |

## Strict isolates

| Node | Path | Reason | Confidence |
|---|---|---|---|
| __init__.py | backend/app/api/__init__.py | No graph neighbor or text reference found; manual review required. | Tentative |
| __init__.py | backend/app/models/__init__.py | No graph neighbor or text reference found; manual review required. | Tentative |
| validation.test.ts | backend/src/__tests__/validation.test.ts | Test runner discovery is outside app imports. | Confirmed |
| postcss.config.js | postcss.config.js | CI, migration, test, or configuration entry point. | Strong evidence |
| verify-migration.ts | scripts/verify-migration.ts | CI, migration, test, or configuration entry point. | Strong evidence |

## Decision rule

No row is marked safe to delete. Weak structural connectivity is a review queue only.
