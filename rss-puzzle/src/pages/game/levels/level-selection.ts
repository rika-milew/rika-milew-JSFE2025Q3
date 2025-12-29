import { levelRounds } from './level-storage';
import { createElement } from '../../../utils/create-element';
import { eventState } from '../../game/event-state';
import { gameState } from '../game-state';

import './level-selection.css';

export function createLevelAndRoundsSelector(): [HTMLDivElement, HTMLDivElement] {
  const levelDiv = createElement({ tag: 'div', className: 'level-selector' });
  const roundDiv = createElement({ tag: 'div', className: 'round-selector' });

  const levelSelect = createElement({
    tag: 'select',
    className: 'level-select',
  });

  levelRounds.forEach((_, index) => {
    const option = createElement({
      tag: 'option',
      textContent: `Level ${index + 1}`,
      className: 'level-option',
    });
    option.value = index.toString();
    levelSelect.append(option);
  });

  const roundSelect = createElement({
    tag: 'select',
    className: 'round-select',
  });

  function updateRounds(levelIndex: number): void {
    roundSelect.innerHTML = '';
    const roundsCount = levelRounds[levelIndex];

    for (let index = 0; index < roundsCount; index++) {
      const option = createElement({
        tag: 'option',
        textContent: `Round ${index + 1}`,
        className: 'round-option',
      });
      option.value = index.toString();
      roundSelect.append(option);
    }

    roundSelect.value = '0';
  }

  updateRounds(0);

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
    levelSelect.value = levelIndex.toString();

    updateRounds(levelIndex);
  });

  eventState.on('round:changed', (roundIndex: number) => {
    roundSelect.value = roundIndex.toString();
  });

  levelDiv.append(levelSelect);
  roundDiv.append(roundSelect);

  return [levelDiv, roundDiv];
}
