export type ClickModifiers = {
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
};

export function pointerDistance(start: { x: number; y: number }, current: { x: number; y: number }) {
  return Math.hypot(current.x - start.x, current.y - start.y);
}

export function shouldSuppressDraggedClick(dragged: boolean, modifiers: ClickModifiers) {
  if (!dragged) return false;
  return !(modifiers.altKey || modifiers.ctrlKey || modifiers.metaKey || modifiers.shiftKey);
}

export function boundedSlideIndex(index: number, total: number) {
  return Math.max(0, Math.min(index, Math.max(0, total - 1)));
}
