import assert from "node:assert/strict";
import test from "node:test";
import { createSolvedBoard, isSolved, legalMoves, moveTile, shuffleBoard } from "../../components/interactive/BrandSlidingPuzzle/puzzle-engine";

function inversionCount(board: number[]) {
  const tiles = board.filter(Boolean);
  return tiles.reduce((total, tile, index) => total + tiles.slice(index + 1).filter((other) => other < tile).length, 0);
}

function isSolvable(board: number[], size: 3 | 4) {
  const inversions = inversionCount(board);
  if (size % 2 === 1) return inversions % 2 === 0;
  const emptyRowFromBottom = size - Math.floor(board.indexOf(0) / size);
  return emptyRowFromBottom % 2 === 0 ? inversions % 2 === 1 : inversions % 2 === 0;
}

test("generated 3x3 and 4x4 boards are solvable and not initially solved", () => {
  for (const size of [3, 4] as const) {
    for (let sample = 0; sample < 40; sample += 1) {
      const board = shuffleBoard(size);
      assert.equal(isSolved(board, size), false);
      assert.equal(isSolvable(board, size), true);
    }
  }
});

test("legal moves change the board and illegal moves are rejected", () => {
  const board = createSolvedBoard(3);
  const movable = legalMoves(board, 3);
  assert.deepEqual(movable.sort((a, b) => a - b), [6, 8]);
  assert.notDeepEqual(moveTile(board, 8, 3), board);
  assert.strictEqual(moveTile(board, 1, 3), board);
});

test("solved state is detected after the final legal move", () => {
  const solved = createSolvedBoard(3);
  const almostSolved = moveTile(solved, 8, 3);
  assert.equal(isSolved(almostSolved, 3), false);
  assert.equal(isSolved(moveTile(almostSolved, 8, 3), 3), true);
});
