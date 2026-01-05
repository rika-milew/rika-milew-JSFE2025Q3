import { resetCheckButton } from './buttons/check-button-functions';
import { showResultsButton } from './buttons/results-button';
import { continueGame } from './game-controller';
import { changeRound } from './levels/game-steps';
import { openResultsModal } from './modals/results-modal';
import { eventState } from './state/event-state';
import { gameState } from './state/game-state';
import { resultsState } from './state/results-state';
import { clearContainer } from '../../utils/clear-container';
import { revealImage } from '../../utils/reveal-image';

import type { GameUI } from './game-ui';

export function subscribeGameEvents(
  props: GameUI,
  gameButtons: HTMLElement,
  gameContainer: HTMLElement,
): void {
  eventState.on('level:changed', () => {
    gameState.roundIndex = 0;
    resultsState.reset();
    resultsState.initRound({
      roundIndex: gameState.roundIndex,
      levelId: gameState.levelIndex,
    });
    changeRound(props);
  });

  eventState.on('round:changed', () => {
    resultsState.reset();
    resultsState.initRound({
      roundIndex: gameState.roundIndex,
      levelId: gameState.levelIndex,
    });
    changeRound(props);
  });

  eventState.on('round:completed', () => {
    revealImage(props.result);
    showResultsButton(gameButtons, gameContainer);
  });

  eventState.on('round:next', () => {
    resetCheckButton(props.checkButton);
    clearContainer(props.result);
    gameState.isCompleted = false;
    continueGame(props, 'progress');
  });

  eventState.on('results:open', (container: HTMLElement) => {
    openResultsModal(container);
  });
}
