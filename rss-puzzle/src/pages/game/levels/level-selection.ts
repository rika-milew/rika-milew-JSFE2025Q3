import { subscribeLevelEvents } from './level-events';
import { levelRounds } from './level-storage';
import { clearContainer } from '../../../utils/clear-container';
import { createElement } from '../../../utils/create-element';
import { eventState } from '../state/event-state';
import { gameState } from '../state/game-state';
import { progressState } from '../state/progress-state';

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

  levelDiv.append(levelSelect);
  roundDiv.append(roundSelect);

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

  subscribeLevelEvents(levelSelect, roundSelect, updateRounds);

  updateLevels();
  updateRounds(gameState.levelIndex);

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
