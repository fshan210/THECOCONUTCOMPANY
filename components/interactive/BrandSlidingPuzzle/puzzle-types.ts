export type PuzzleGrid = {
  columns: 3 | 4;
  rows: 4;
};

export type PuzzleBoard = number[];
export type PuzzleStatus = "ready" | "playing" | "complete";

export type PuzzlePromotion = {
  eyebrow?: string;
  title: string;
  body?: string;
  ctaLabel: string;
  ctaHref: string;
  couponCode?: string;
};

export type PuzzleResult = {
  moves: number;
  elapsedMs: number;
  grid: PuzzleGrid;
};

export type PuzzleEvent = {
  event: "puzzle_start" | "puzzle_move" | "puzzle_complete" | "puzzle_replay";
  grid: PuzzleGrid;
  moves: number;
  elapsedMs: number;
};
