export type ProgressState = {
  completedLevels: Set<number>;
  completedRounds: Map<number, Set<number>>;
};

export const progressState: ProgressState = {
  completedLevels: new Set(),
  completedRounds: new Map<number, Set<number>>(),
};
