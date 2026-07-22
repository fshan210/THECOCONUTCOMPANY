export type PuzzleGrid = {
  columns: 3 | 4;
  rows: 4;
};

export type PuzzleBoard = number[];
export type PuzzleStatus = "ready" | "playing" | "complete";

export type PuzzleImage = {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  thumbnailSrc?: string;
  alt: string;
};

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
  imageId?: string;
};

export type PuzzleEvent = {
  event: "puzzle_start" | "puzzle_move" | "puzzle_complete" | "puzzle_replay" | "puzzle_preview" | "puzzle_image_change";
  grid: PuzzleGrid;
  moves: number;
  elapsedMs: number;
  imageId?: string;
  previewsRemaining?: number;
};
