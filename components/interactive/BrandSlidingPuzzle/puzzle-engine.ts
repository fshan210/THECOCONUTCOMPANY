import type { PuzzleBoard, PuzzleGrid } from "./puzzle-types";

export function createSolvedBoard(grid: PuzzleGrid): PuzzleBoard {
  return [...Array(grid.columns * grid.rows - 1)].map((_, index) => index + 1).concat(0);
}

export function getLegalMoves(board: PuzzleBoard, grid: PuzzleGrid) {
  const empty = board.indexOf(0);
  const row = Math.floor(empty / grid.columns);
  const column = empty % grid.columns;
  return [
    row > 0 ? empty - grid.columns : -1,
    row < grid.rows - 1 ? empty + grid.columns : -1,
    column > 0 ? empty - 1 : -1,
    column < grid.columns - 1 ? empty + 1 : -1,
  ].filter((index) => index >= 0).map((index) => board[index]);
}

export const legalMoves = getLegalMoves;

export function moveTile(board: PuzzleBoard, tile: number, grid: PuzzleGrid): PuzzleBoard {
  if (!getLegalMoves(board, grid).includes(tile)) return board;
  const next = [...board];
  const emptyIndex = next.indexOf(0);
  const tileIndex = next.indexOf(tile);
  [next[emptyIndex], next[tileIndex]] = [next[tileIndex], next[emptyIndex]];
  return next;
}

export function isSolved(board: PuzzleBoard, grid: PuzzleGrid) {
  const solved = createSolvedBoard(grid);
  return board.every((tile, index) => tile === solved[index]);
}

export function countInversions(board: PuzzleBoard) {
  const tiles = board.filter((tile) => tile !== 0);
  let inversions = 0;
  for (let left = 0; left < tiles.length; left += 1) {
    for (let right = left + 1; right < tiles.length; right += 1) {
      if (tiles[left] > tiles[right]) inversions += 1;
    }
  }
  return inversions;
}

export function isSolvable(board: PuzzleBoard, grid: PuzzleGrid) {
  if (board.length !== grid.columns * grid.rows || new Set(board).size !== board.length) return false;
  const inversions = countInversions(board);
  if (grid.columns % 2 === 1) return inversions % 2 === 0;
  const emptyRowFromBottom = grid.rows - Math.floor(board.indexOf(0) / grid.columns);
  return emptyRowFromBottom % 2 === 0 ? inversions % 2 === 1 : inversions % 2 === 0;
}

export function shuffleSolvable(
  grid: PuzzleGrid,
  iterations = grid.columns === 4 ? 96 : 60,
  random: () => number = Math.random,
): PuzzleBoard {
  let board = createSolvedBoard(grid);
  let previous = -1;
  for (let index = 0; index < iterations; index += 1) {
    const options = getLegalMoves(board, grid).filter((tile) => tile !== previous);
    const tile = options[Math.floor(random() * options.length)];
    previous = tile;
    board = moveTile(board, tile, grid);
  }
  const shuffled = isSolved(board, grid) ? moveTile(board, getLegalMoves(board, grid)[0], grid) : board;
  if (!isSolvable(shuffled, grid)) {
    throw new Error("Sliding-puzzle shuffle produced an invalid board");
  }
  return shuffled;
}

export const shuffleBoard = shuffleSolvable;

export function tileBackgroundPosition(tile: number, grid: PuzzleGrid) {
  const sourceIndex = tile - 1;
  const x = (sourceIndex % grid.columns) / (grid.columns - 1) * 100;
  const y = Math.floor(sourceIndex / grid.columns) / (grid.rows - 1) * 100;
  return `${x}% ${y}%`;
}

export function tileForArrow(board: PuzzleBoard, grid: PuzzleGrid, key: string) {
  const empty = board.indexOf(0);
  const row = Math.floor(empty / grid.columns);
  const column = empty % grid.columns;
  const index = key === "ArrowUp" && row < grid.rows - 1
    ? empty + grid.columns
    : key === "ArrowDown" && row > 0
      ? empty - grid.columns
      : key === "ArrowLeft" && column < grid.columns - 1
        ? empty + 1
        : key === "ArrowRight" && column > 0
          ? empty - 1
          : -1;
  return index >= 0 ? board[index] : null;
}
