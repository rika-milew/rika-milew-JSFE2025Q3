import { saveProgress } from './save-progress';
import { eventState } from '../pages/game/event-state';
import { gameState } from '../pages/game/game-state';
import { levelRounds } from '../pages/game/levels/level-storage';
import { progressState } from '../pages/game/levels/progress-state';

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
}
