import { updateCheckButtonState } from './buttons/check-button';
import { eventState } from './event-state.ts';
import { gameState } from './game-state';
import { hintState } from './hints/hint-state';
import { createSentence } from '../../components/sentence/sentence';
import { createWords } from '../../components/word/word';

import type { GameUI } from './game-ui';

export function continueGame(props: GameUI): void {
  const { source, result, placeholder, checkButton, autoCompleteButton, roundTitle } = props;

  const rounds = gameState.rounds;

  const currentRound = rounds[gameState.roundIndex];
  const isLastSentence = gameState.sentenceIndex >= currentRound.words.length - 1;

  if (isLastSentence) {
    gameState.nextRound();
    result.innerHTML = '';

    if (gameState.roundIndex >= rounds.length) {
      gameState.isCompleted = true;
      return;
    }
  } else {
    gameState.nextSentence();
  }

  blockSentence(props.userSentence);

  props.userSentence = createSentence(result);
  props.userSentence.append(placeholder);

  gameState.isSolved = false;
  autoCompleteButton.disabled = false;

  const updatedRound = rounds[gameState.roundIndex];
  const currentSentence = updatedRound.words[gameState.sentenceIndex];

  eventState.emit('translation:update', currentSentence.textExampleTranslate);

  if (hintState.getMode('translation') === 'enabled') {
    eventState.emit('hint:translation:toggle', 'enabled');
  } else {
    eventState.emit('hint:translation:toggle', 'disabled');
  }

  eventState.emit('audio:update', currentSentence.audioExample);

  roundTitle.textContent = updatedRound.levelData.name;

  source.innerHTML = '';

  gameState.correctSentence = currentSentence.textExample.split(' ');

  createWords(
    currentSentence,
    source,
    props.userSentence,
    placeholder,
    gameState.correctSentence,
    checkButton,
  );

  return;
}

export function updateResultPlaceholder(userSentence: HTMLElement, placeholder: HTMLElement): void {
  const words = [...userSentence.querySelectorAll('.word-wrapper')].filter(
    (word) => word.parentElement === userSentence,
  );

  if (words.length > 0) {
    if (userSentence.contains(placeholder)) {
      placeholder.remove();
    }
  } else {
    if (!userSentence.contains(placeholder)) {
      userSentence.append(placeholder);
    }
  }
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

export function blockSentence(sentence: HTMLElement): void {
  sentence.classList.remove('sentence_active');
  sentence.classList.add('sentence_done');
  sentence.style.pointerEvents = 'none';
}
