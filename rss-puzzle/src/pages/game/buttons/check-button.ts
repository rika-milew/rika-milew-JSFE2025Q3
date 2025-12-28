import {
  checkSentence,
  highlightSentence,
  highlightCorrectSentence,
} from '../../../utils/check-sentence';
import { eventState } from '../event-state';
import { continueGame, updateGameState, blockSentence } from '../game-controller';
import { gameState } from '../game-state';
import { hintState } from '../hints/hint-state';

import type { GameUI } from '../game-ui';

export function manageCheckButton(props: GameUI): void {
  if (gameState.isCompleted) {
    resetCheckButton(props.checkButton);
    gameState.isCompleted = false;
    continueGame(props);
    return;
  }

  const isCorrect = checkSentence(props.userSentence, gameState.correctSentence);
  updateGameState(
    props.userSentence,
    props.placeholder,
    gameState.correctSentence,
    props.checkButton,
  );

  if (!isCorrect) {
    highlightSentence(props.userSentence, gameState.correctSentence);
    return;
  }

  gameState.isCompleted = true;
  blockSentence(props.userSentence);
  highlightCorrectSentence(props.userSentence);
  transformCheckButton(props.checkButton);
  props.autoCompleteButton.disabled = true;

  if (hintState.getMode('translation') === 'disabled') {
    eventState.emit('hint:translation:toggle', 'enabled');
  }

  if (hintState.getMode('audio') === 'disabled') {
    eventState.emit('hint:audio:toggle', 'enabled');
  }
}

export function updateCheckButtonState(
  activeResultSentence: HTMLElement,
  checkButton: HTMLButtonElement,
  sentenceLength: number,
): void {
  const resultWords = activeResultSentence.querySelectorAll('.word').length;
  checkButton.disabled = resultWords === sentenceLength ? false : true;
}

export function transformCheckButton(checkButton: HTMLButtonElement): void {
  checkButton.textContent = 'Continue';
  checkButton.classList.add('game__continue-button');
  checkButton.disabled = false;
}

function resetCheckButton(checkButton: HTMLButtonElement): void {
  checkButton.textContent = 'Check';
  checkButton.classList.remove('game__continue-button');
  checkButton.disabled = true;
}
