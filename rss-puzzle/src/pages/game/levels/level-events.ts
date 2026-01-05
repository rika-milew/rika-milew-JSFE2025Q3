import { eventState } from '../state/event-state';
import { gameState } from '../state/game-state';

export function subscribeLevelEvents(
  levelSelect: HTMLSelectElement,
  roundSelect: HTMLSelectElement,
  updateRounds: (levelIndex: number) => void,
): void {
  levelSelect.addEventListener('change', () => {
    const selectedLevel = Number.parseInt(levelSelect.value, 10);
    gameState.levelIndex = selectedLevel;
    gameState.roundIndex = 0;
    gameState.sentenceIndex = 0;
    updateRounds(selectedLevel);

    eventState.emit('level:changed', selectedLevel);
    eventState.emit('round:changed', 0);
  });

  roundSelect.addEventListener('change', () => {
    const selectedRound = Number.parseInt(roundSelect.value, 10);
    gameState.roundIndex = selectedRound;
    gameState.sentenceIndex = 0;
    eventState.emit('round:changed', selectedRound);
  });

  eventState.on('level:changed', (levelIndex: number) => {
    gameState.levelIndex = levelIndex;
    gameState.roundIndex = 0;
    gameState.sentenceIndex = 0;
    levelSelect.value = levelIndex.toString();

    updateRounds(levelIndex);
  });

  eventState.on('round:changed', (roundIndex: number) => {
    roundSelect.value = roundIndex.toString();
  });
}
