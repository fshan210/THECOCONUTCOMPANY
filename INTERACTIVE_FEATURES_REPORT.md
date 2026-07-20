# Phase 4.3 Interactive Features Report

## Sliding puzzle

The previous Pure vs Processed peeler rendering is replaced by `BrandSlidingPuzzle`. The board is 4×4 on desktop and 3×3 on mobile. It uses the approved existing coconut split asset; no new generative image was created.

### Solvability

Each shuffle starts from the solved board and executes 96 (desktop) or 54 (mobile) legal empty-cell moves, avoiding an immediate reversal when possible. This construction guarantees a reachable board. A defensive final move prevents a solved initial state. Automated parity checks passed across 80 generated boards.

### Accessibility

- Tiles are native buttons with legal/disabled states.
- Keyboard activation is native Space/Enter behavior.
- The board exposes its size and move count.
- A polite live region announces legal move availability and completion.
- Reduced/minimal motion preserves the complete interaction without decorative confetti.

### Analytics

Events: `puzzle_start`, `puzzle_move`, `puzzle_complete`, and `puzzle_replay`, with board size, moves, and elapsed time. No personal data is included.

## Impact counters

Counters read from the typed homepage CMS schema and use a safe curated fallback. Current truthful defaults are:

- approximately 450 trees in the contract-farm anchor
- 0 preservatives in the Phase 1 UHT brief
- 10,000-unit Phase 1 UHT MOQ

The prior unsupported partner-farm and coconuts-saved claims are no longer used in the counter banner. Counters start once on intersection and render immediately in reduced/minimal quality.

## Product configurator

### Schema and valid matrix

Dimensions are size (100/200/500ml), processing (UHT/RAW), and pulp (with/without). The data source declares 12 deterministic SKU records. Both 100ml RAW variants are intentionally unavailable; the other ten combinations resolve.

### Transaction design

1. Validate the requested dimension against available variants.
2. Resolve the target variant and increment a request token.
3. Preload the target image.
4. Ignore completion from stale requests.
5. Commit selection, image, price, SKU and copy together.
6. Crossfade for 460ms without a blank frame.
7. Add the exact SKU, unit price and human-readable variant label to cart state.

Cart identity uses SKU when present and slug otherwise, so configured variants remain independently adjustable.

### Analytics

Events: `configurator_change` and `configurator_add_to_cart`, carrying only variant dimensions and SKU metadata.

## Assets

No assets were generated. The interaction reuses approved static/optimized imagery and keeps Vercel runtime image optimization disabled.
