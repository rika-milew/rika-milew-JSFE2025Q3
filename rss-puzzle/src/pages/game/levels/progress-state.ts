export type ProgressState = {
  completedLevels: Set<number>;
  completedRounds: Map<number, Set<number>>;
};

export const progressState: ProgressState = {
  completedLevels: new Set(),
  completedRounds: new Map<number, Set<number>>(),
};

export function saveProgressState(): void {
  const savedProgressState = {
    completedLevels: [...progressState.completedLevels],
    completedRounds: [...progressState.completedRounds.entries()].map(([level, rounds]) => [
      level,
      [...rounds],
    ]),
  };
  localStorage.setItem('progressState', JSON.stringify(savedProgressState));
}

export function loadProgressState(): void {
  const progressData = localStorage.getItem('progressState');
  if (!progressData) {
    return;
  }

  const parsedProgress = JSON.parse(progressData);

  if (!isProgressObject(parsedProgress)) {
    return;
  }

  if (Array.isArray(parsedProgress.completedLevels)) {
    const numbers = parsedProgress.completedLevels.filter(
      (item): item is number => typeof item === 'number',
    );
    progressState.completedLevels = new Set(numbers);
  }

  if (Array.isArray(parsedProgress.completedRounds)) {
    const mapEntries: [number, Set<number>][] = parsedProgress.completedRounds
      .filter((item): item is [unknown, unknown] => Array.isArray(item) && item.length === 2)
      .map(([level, rounds]) => {
        const validLevel = typeof level === 'number' ? level : 0;
        const validRounds: number[] = Array.isArray(rounds)
          ? rounds.filter((round): round is number => typeof round === 'number')
          : [];
        return [validLevel, new Set(validRounds)];
      });

    progressState.completedRounds = new Map(mapEntries);
  }
}

function isProgressObject(
  object: unknown,
): object is { completedLevels: unknown; completedRounds: unknown } {
  return (
    typeof object === 'object' &&
    object !== null &&
    'completedLevels' in object &&
    'completedRounds' in object
  );
}
