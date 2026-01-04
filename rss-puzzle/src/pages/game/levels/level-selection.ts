import { levelRounds } from './level-storage';
import { createElement } from '../../../utils/create-element';
import { eventState } from '../../game/event-state';
import { gameState } from '../game-state';
import { progressState } from './progress-state';
import { clearContainer } from '../../../utils/clear-container';

import './level-selection.css';

export function createLevelAndRoundsSelector(): [HTMLDivElement, HTMLDivElement] {
  const levelDiv = createElement({ tag: 'div', className: 'level-selector' });
  const roundDiv = createElement({ tag: 'div', className: 'round-selector' });

  const levelSelect = createElement({
    tag: 'select',
    className: 'level-select',
  });

  const roundSelect = createElement({
    tag: 'select',
    className: 'round-select',
  });

  levelSelect.id = 'level-select';
  roundSelect.id = 'round-select';

  function updateLevels(): void {
    clearContainer(levelSelect);
    levelRounds.forEach((_, index) => {
      const option = createElement({
        tag: 'option',
        textContent: `Level ${index + 1}`,
        className: ['level-option', progressState.completedLevels.has(index) ? 'completed' : ''],
      });
      option.value = index.toString();
      levelSelect.append(option);
    });
    levelSelect.value = gameState.levelIndex.toString();
  }

  function updateRounds(levelIndex: number): void {
    clearContainer(roundSelect);
    const roundsCount = levelRounds[levelIndex];
    const completedRounds = progressState.completedRounds.get(levelIndex) ?? new Set();

    for (let index = 0; index < roundsCount; index++) {
      const option = createElement({
        tag: 'option',
        textContent: `Round ${index + 1}`,
        className: ['round-option', completedRounds.has(index) ? 'completed' : ''],
      });
      option.value = index.toString();
      roundSelect.append(option);
    }

    roundSelect.value = gameState.roundIndex.toString();
  }

  updateLevels();
  updateRounds(gameState.levelIndex);

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

  levelDiv.append(levelSelect);
  roundDiv.append(roundSelect);

  eventState.on('progress:updated', () => {
    updateLevels();
    updateRounds(gameState.levelIndex);

    const completedRounds = progressState.completedRounds.get(gameState.levelIndex) ?? new Set();

    [...roundSelect.options].forEach((option) => {
      const index = Number(option.value);
      option.classList.toggle('completed', completedRounds.has(index));
    });
  });

  return [levelDiv, roundDiv];
}
