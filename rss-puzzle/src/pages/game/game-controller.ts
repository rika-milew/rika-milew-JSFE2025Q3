import { updateCheckButtonState } from './buttons/check-button';
import { eventState } from './event-state.ts';
import { gameState } from './game-state';
import { hintState } from './hints/hint-state';
import { launchNextStep } from './levels/game-steps';
import { createSentence } from '../../components/sentence/sentence';
import { createWords } from '../../components/word/word';

import type { GameUI } from './game-ui';

export function continueGame(props: GameUI, mode: 'change' | 'progress' = 'progress'): void {
  const { source, result, placeholder, checkButton, autoCompleteButton, roundTitle } = props;
  if (mode === 'progress') {
    const step = launchNextStep();
    if (step === 'gameover') {
      // openFinalModal();
      return;
    }
    if (step === 'round' || step === 'level') {
      result.innerHTML = '';
    }
  }

  blockSentence(props.userSentence);

  props.userSentence = createSentence(result);
  props.userSentence.append(placeholder);

  gameState.isSolved = false;
  autoCompleteButton.disabled = false;

  const updatedRound = gameState.currentLevel.rounds[gameState.roundIndex];
  const currentSentence = updatedRound.words[gameState.sentenceIndex];

  eventState.emit('translation:update', currentSentence.textExampleTranslate);

  if (hintState.getMode('translation') === 'enabled') {
    eventState.emit('hint:translation:toggle', 'enabled');
  } else {
    eventState.emit('hint:translation:toggle', 'disabled');
  }

  eventState.emit('audio:update', currentSentence.audioExample);

  if (hintState.getMode('audio') === 'enabled') {
    eventState.emit('hint:audio:toggle', 'enabled');
  } else {
    eventState.emit('hint:audio:toggle', 'disabled');
  }

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
