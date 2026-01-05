import { saveProgress } from './save-progress';
import { levelRounds } from '../pages/game/levels/level-storage';
import { eventState } from '../pages/game/state/event-state';
import { gameState } from '../pages/game/state/game-state';
import { progressState, saveProgressState } from '../pages/game/state/progress-state';

export function markRounds(): void {
  const { levelIndex, roundIndex } = gameState;

  if (!progressState.completedRounds.has(levelIndex)) {
    progressState.completedRounds.set(levelIndex, new Set());
  }

  const roundsSet = progressState.completedRounds.get(levelIndex) ?? new Set<number>();
  roundsSet.add(roundIndex);
  progressState.completedRounds.set(levelIndex, roundsSet);

  if (roundsSet.size === levelRounds[levelIndex]) {
    progressState.completedLevels.add(levelIndex);
  }

  eventState.emit('progress:updated', true);

  saveProgress();
  saveProgressState();
}
