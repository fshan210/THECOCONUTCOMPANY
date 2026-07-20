import type { PuzzleBoard, PuzzleSize } from "./puzzle-types";

export function createSolvedBoard(size: PuzzleSize): PuzzleBoard {
  return [...Array(size * size - 1)].map((_, index) => index + 1).concat(0);
}

export function legalMoves(board: PuzzleBoard, size: PuzzleSize) {
  const empty = board.indexOf(0);
  const row = Math.floor(empty / size);
  const column = empty % size;
  return [
    row > 0 ? empty - size : -1,
    row < size - 1 ? empty + size : -1,
    column > 0 ? empty - 1 : -1,
    column < size - 1 ? empty + 1 : -1,
  ].filter((index) => index >= 0).map((index) => board[index]);
}

export function moveTile(board: PuzzleBoard, tile: number, size: PuzzleSize): PuzzleBoard {
  if (!legalMoves(board, size).includes(tile)) return board;
  const next = [...board];
  const emptyIndex = next.indexOf(0);
  const tileIndex = next.indexOf(tile);
  [next[emptyIndex], next[tileIndex]] = [next[tileIndex], next[emptyIndex]];
  return next;
}

export function isSolved(board: PuzzleBoard, size: PuzzleSize) {
  const solved = createSolvedBoard(size);
  return board.every((tile, index) => tile === solved[index]);
}

export function shuffleBoard(size: PuzzleSize, iterations = size === 4 ? 96 : 54): PuzzleBoard {
  let board = createSolvedBoard(size);
  let previous = -1;
  for (let index = 0; index < iterations; index += 1) {
    const options = legalMoves(board, size).filter((tile) => tile !== previous);
    const tile = options[Math.floor(Math.random() * options.length)];
    previous = tile;
    board = moveTile(board, tile, size);
  }
  return isSolved(board, size) ? moveTile(board, legalMoves(board, size)[0], size) : board;
}

export function tileBackgroundPosition(tile: number, size: PuzzleSize) {
  const sourceIndex = tile - 1;
  const x = (sourceIndex % size) / (size - 1) * 100;
  const y = Math.floor(sourceIndex / size) / (size - 1) * 100;
  return `${x}% ${y}%`;
}
