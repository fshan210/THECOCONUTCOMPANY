export const maximumPuzzlePreviews = 3;

export type PuzzlePreviewState = {
  remaining: number;
  visible: boolean;
};

export function createPuzzlePreviewState(): PuzzlePreviewState {
  return { remaining: maximumPuzzlePreviews, visible: false };
}

export function beginPuzzlePreview(state: PuzzlePreviewState): PuzzlePreviewState {
  if (state.remaining <= 0 || state.visible) return state;
  return { remaining: state.remaining - 1, visible: true };
}

export function endPuzzlePreview(state: PuzzlePreviewState): PuzzlePreviewState {
  return state.visible ? { ...state, visible: false } : state;
}
