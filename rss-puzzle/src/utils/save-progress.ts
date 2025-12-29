import { gameState } from '../pages/game/game-state';
import { levelRounds } from '../pages/game/levels/level-storage';

export function saveProgress(): void {
  const { levelIndex, roundIndex } = gameState;
  const progress = { levelIndex, roundIndex };
  localStorage.setItem('userProgress', JSON.stringify(progress));
}

export function uploadProgress(): void {
  const savedProgress = localStorage.getItem('userProgress');

  if (!savedProgress) {
    return;
  }

  const { levelIndex, roundIndex } = JSON.parse(savedProgress);

  const currentLevelIndex = Number(levelIndex);
  const currentRoundIndex = Number(roundIndex) + 1;

  let nextLevel = currentLevelIndex;
  let nextRound = currentRoundIndex;

  if (nextRound >= levelRounds[currentLevelIndex]) {
    nextRound = 0;
    nextLevel = currentLevelIndex + 1;

    if (nextLevel >= levelRounds.length) {
      nextLevel = 0;
      nextRound = 0;
    }
  }

  gameState.levelIndex = nextLevel;
  gameState.roundIndex = nextRound;
  gameState.sentenceIndex = 0;
}
