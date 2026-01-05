import {
  checkSentence,
  highlightSentence,
  highlightCorrectSentence,
} from '../../../utils/check-sentence';
import { continueGame } from '../game-controller';
import { resetCheckButton, transformCheckButton } from './check-button-functions';
import { hintState } from '../hints/hint-state';
import { updateGameState } from '../levels/game-steps';
import { eventState } from '../state/event-state';
import { gameState } from '../state/game-state';
import { resultsState } from '../state/results-state';

import type { GameUI } from '../game-ui';

export function manageCheckButton(props: GameUI): void {
  if (gameState.isCompleted) {
    resetCheckButton(props.checkButton);
    gameState.isCompleted = false;
    continueGame(props, 'progress');
    return;
  }

  const isCorrect = checkSentence(props.userSentence, gameState.correctSentenceIndexes);

  updateGameState(
    props.userSentence,
    props.placeholder,
    gameState.correctSentence,
    props.checkButton,
  );

  if (!isCorrect) {
    props.autoCompleteButton.disabled = true;

    highlightSentence(
      props.autoCompleteButton,
      props.userSentence,
      gameState.correctSentenceIndexes,
    );

    return;
  }

  resultsState.addSentence({
    text: gameState.correctSentence.join(' '),
    audioSource: gameState.audioSource,
    isKnown: true,
  });

  gameState.isCompleted = true;

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
