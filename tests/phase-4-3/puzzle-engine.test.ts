import assert from "node:assert/strict";
import test from "node:test";
import {
  countInversions,
  createSolvedBoard,
  getLegalMoves,
  isSolvable,
  isSolved,
  moveTile,
  shuffleSolvable,
  tileForArrow,
} from "../../components/interactive/BrandSlidingPuzzle/puzzle-engine";
import {
  beginPuzzlePreview,
  createPuzzlePreviewState,
  endPuzzlePreview,
} from "../../components/interactive/BrandSlidingPuzzle/puzzle-session";
import type { PuzzleGrid } from "../../components/interactive/BrandSlidingPuzzle/puzzle-types";

const mobile: PuzzleGrid = { columns: 3, rows: 4 };
const desktop: PuzzleGrid = { columns: 4, rows: 4 };

test("1000 generated 3x4 and 4x4 boards remain solvable and never start solved", () => {
  for (const grid of [mobile, desktop]) {
    for (let sample = 0; sample < 500; sample += 1) {
      const board = shuffleSolvable(grid);
      assert.equal(isSolved(board, grid), false);
      assert.equal(isSolvable(board, grid), true);
    }
  }
});

test("legal moves change the board and illegal moves are rejected", () => {
  const board = createSolvedBoard(mobile);
  const movable = getLegalMoves(board, mobile);
  assert.deepEqual(movable.sort((a, b) => a - b), [3, 6, 9, 10, 11]);
  assert.notDeepEqual(moveTile(board, 11, mobile), board);
  assert.strictEqual(moveTile(board, 1, mobile), board);
});

test("a distant tile shifts its complete row or column atomically", () => {
  const board = createSolvedBoard(mobile);
  assert.deepEqual(moveTile(board, 10, mobile), [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 10, 11]);
  assert.deepEqual(moveTile(board, 3, mobile), [1, 2, 0, 4, 5, 3, 7, 8, 6, 10, 11, 9]);
});

test("solved state is detected after the final legal move", () => {
  const solved = createSolvedBoard(desktop);
  const almostSolved = moveTile(solved, 15, desktop);
  assert.equal(isSolved(almostSolved, desktop), false);
  assert.equal(isSolved(moveTile(almostSolved, 15, desktop), desktop), true);
});

test("inversion validator rejects an impossible board", () => {
  const impossible = createSolvedBoard(desktop);
  [impossible[0], impossible[1]] = [impossible[1], impossible[0]];
  assert.equal(countInversions(impossible), 1);
  assert.equal(isSolvable(impossible, desktop), false);
});

test("arrow-key movement resolves the farthest tile in the chosen row or column", () => {
  const board = createSolvedBoard(mobile);
  assert.equal(tileForArrow(board, mobile, "ArrowDown"), 3);
  assert.equal(tileForArrow(board, mobile, "ArrowRight"), 10);
  assert.equal(tileForArrow(board, mobile, "ArrowUp"), null);
  assert.equal(tileForArrow(board, mobile, "ArrowLeft"), null);
});

test("original-image previews are capped at three and do not mutate session state", () => {
  let state = createPuzzlePreviewState();
  for (let preview = 0; preview < 3; preview += 1) {
    state = beginPuzzlePreview(state);
    assert.equal(state.visible, true);
    state = endPuzzlePreview(state);
  }
  assert.deepEqual(state, { remaining: 0, visible: false });
  assert.strictEqual(beginPuzzlePreview(state), state);
});
