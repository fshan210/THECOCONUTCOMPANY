export type SavedContentScope = { owner: string | null; generation: number };

export function advanceSavedContentScope(current: SavedContentScope, owner: string | null): SavedContentScope {
  return current.owner === owner ? current : { owner, generation: current.generation + 1 };
}

export function isCurrentSavedContentScope(current: SavedContentScope, request: SavedContentScope) {
  return current.owner === request.owner && current.generation === request.generation;
}
