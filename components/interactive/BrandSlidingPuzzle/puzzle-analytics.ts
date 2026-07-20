import type { PuzzleEvent } from "./puzzle-types";

declare global { interface Window { dataLayer?: unknown[]; } }

export function trackPuzzleEvent(event: PuzzleEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer?.push({
    event: event.event,
    puzzle_columns: event.grid.columns,
    puzzle_rows: event.grid.rows,
    puzzle_moves: event.moves,
    puzzle_elapsed_ms: event.elapsedMs,
  });
}
