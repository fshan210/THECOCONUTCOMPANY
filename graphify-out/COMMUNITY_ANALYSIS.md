# Community Analysis

The structural graph contains 130 communities. Low cohesion in broad UI/admin/auth clusters is a navigation signal, not a module-boundary prescription.

| Community | Nodes | Observed theme | Confidence |
|---|---|---|---|
| 0 | 78 | shared UI/motion/home/about | Strong evidence |
| 1 | 55 | admin dashboard/path context | Strong evidence |
| 2 | 47 | customer auth handlers/rate limits | Strong evidence |
| 3 | 44 | contracts/catalog/analytics types | Strong evidence |
| 4 | 42 | route metadata | Strong evidence |
| 5 | 37 | shared UI cards/primitives | Strong evidence |
| 6 | 37 | mixed structural cluster; inspect node list | Tentative |
| 7 | 36 | mixed structural cluster; inspect node list | Tentative |
| 8 | 35 | mixed structural cluster; inspect node list | Tentative |
| 9 | 32 | mixed structural cluster; inspect node list | Tentative |
| 11 | 31 | mixed structural cluster; inspect node list | Tentative |
| 12 | 30 | account/auth pages | Strong evidence |
| 13 | 30 | mixed structural cluster; inspect node list | Tentative |
| 14 | 28 | mixed structural cluster; inspect node list | Tentative |
| 15 | 28 | Firebase migration scripts | Strong evidence |
| 16 | 27 | mixed structural cluster; inspect node list | Tentative |
| 17 | 27 | mixed structural cluster; inspect node list | Tentative |
| 10 | 27 | backend user-data persistence | Strong evidence |
| 18 | 27 | More Products/motion constants | Strong evidence |
| 19 | 27 | client auth headers | Strong evidence |
| 20 | 26 | customer auth forms | Strong evidence |
| 22 | 26 | mixed structural cluster; inspect node list | Tentative |
| 21 | 26 | mixed structural cluster; inspect node list | Tentative |
| 24 | 25 | mixed structural cluster; inspect node list | Tentative |
| 23 | 25 | Firebase admin/admin auth | Strong evidence |
| 25 | 25 | mixed structural cluster; inspect node list | Tentative |
| 26 | 25 | mixed structural cluster; inspect node list | Tentative |
| 27 | 23 | mixed structural cluster; inspect node list | Tentative |
| 28 | 23 | mixed structural cluster; inspect node list | Tentative |
| 29 | 22 | mixed structural cluster; inspect node list | Tentative |
| 30 | 22 | mixed structural cluster; inspect node list | Tentative |
| 31 | 21 | mixed structural cluster; inspect node list | Tentative |
| 32 | 21 | mixed structural cluster; inspect node list | Tentative |
| 33 | 20 | mixed structural cluster; inspect node list | Tentative |
| 34 | 20 | mixed structural cluster; inspect node list | Tentative |
| 35 | 20 | mixed structural cluster; inspect node list | Tentative |
| 36 | 20 | mixed structural cluster; inspect node list | Tentative |
| 37 | 19 | mixed structural cluster; inspect node list | Tentative |
| 38 | 18 | mixed structural cluster; inspect node list | Tentative |
| 39 | 18 | mixed structural cluster; inspect node list | Tentative |

## Assessment

- Communities 0/1/2 are broad cross-cutting UI, admin, and auth clusters; query specific paths before proposing splits.
- Communities 10/23/58/67/68/129 anchor persistence, Firebase admin, homepage content, recipes, orders, and cart/catalog.
- Community 15 is operational migration tooling, not runtime source-of-truth.
- Community 56 identifies animation/library dependencies but does not prove unused packages.

## Recommendation

Use community IDs to narrow future Graphify queries and combine them with source inspection and route tests. Do not reorganize components solely because a community has low cohesion.
