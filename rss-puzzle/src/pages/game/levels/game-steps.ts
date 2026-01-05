import { levels } from './level-storage';
import { clearContainer } from '../../../utils/clear-container';
import { markRounds } from '../../../utils/mark-rounds';
import { hideImage } from '../../../utils/reveal-image';
import { updateResultPlaceholder } from '../../../utils/update-placeholder';
import { resetCheckButton, updateCheckButtonState } from '../buttons/check-button-functions';
import { continueGame } from '../game-controller';
import { eventState } from '../state/event-state';
import { gameState } from '../state/game-state';
import { resultsState } from '../state/results-state';

import type { GameUI } from '../game-ui';

type NextStep = 'sentence' | 'round' | 'level' | 'gameover';

export function launchNextStep(): NextStep {
  const level = levels[gameState.levelIndex];
  const round = level.rounds[gameState.roundIndex];

  if (gameState.sentenceIndex < round.words.length - 1) {
    gameState.nextSentence();
    return 'sentence';
  }

  if (gameState.roundIndex < level.rounds.length - 1) {
    markRounds();
    gameState.nextRound();
    eventState.emit('round:changed', gameState.roundIndex);
    return 'round';
  }

  if (gameState.levelIndex < levels.length - 1) {
    markRounds();
    gameState.nextLevel();
    eventState.emit('level:changed', gameState.levelIndex);
    return 'level';
  }

  markRounds();

  gameState.resetGame();
  resultsState.reset();

  eventState.emit('level:changed', gameState.levelIndex);

  return 'gameover';
}

export function changeRound(props: GameUI): void {
  gameState.sentenceIndex = 0;
  hideImage(props.result);

  clearContainer(props.result);
  clearContainer(props.source);

  resetCheckButton(props.checkButton);
  gameState.isCompleted = false;

  continueGame(props, 'change');
}

export function updateGameState(
  userSentence: HTMLElement,
  placeholder: HTMLElement,
  correctSentence: string[],
  checkButton: HTMLButtonElement,
): void {
  updateResultPlaceholder(userSentence, placeholder);
  updateCheckButtonState(userSentence, checkButton, correctSentence.length);
  userSentence.style.pointerEvents = 'auto';
}
