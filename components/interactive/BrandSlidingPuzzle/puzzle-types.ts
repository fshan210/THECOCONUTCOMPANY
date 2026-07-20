export type PuzzleSize = 3 | 4;
export type PuzzleBoard = number[];
export type PuzzleStatus = "ready" | "playing" | "complete";

export type PuzzleEvent = {
  event: "puzzle_start" | "puzzle_move" | "puzzle_complete" | "puzzle_replay";
  size: PuzzleSize;
  moves: number;
  elapsedMs: number;
};
