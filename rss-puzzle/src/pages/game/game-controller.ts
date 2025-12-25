import { updateCheckButtonState } from './game-page';
import { gameState } from './game-state.ts';
import { createSentence } from '../../components/sentence/sentence';
import { createWords } from '../../components/word/word';

import type { GameUI } from './game-types.ts';

export function continueGame(props: GameUI): void {
  const { source, result, placeholder, checkButton, autoCompleteButton, roundTitle } = props;
  const rounds = gameState.rounds;
  let nextSentenceIndex = gameState.sentenceIndex + 1;
  let nextRoundIndex = gameState.roundIndex;

  if (nextSentenceIndex >= rounds[gameState.roundIndex].words.length) {
    gameState.nextRound();
    nextRoundIndex = gameState.roundIndex;
    nextSentenceIndex = gameState.sentenceIndex;

    result.innerHTML = '';

    if (nextRoundIndex >= rounds.length) {
      gameState.isCompleted = true;
      return;
    }
  }

  blockSentence(props.userSentence);

  props.userSentence = createSentence(result);
  props.userSentence.append(placeholder);

  gameState.isSolved = false;

  autoCompleteButton.disabled = false;

  gameState.roundIndex = nextRoundIndex;
  gameState.sentenceIndex = nextSentenceIndex;

  const nextRound = rounds[nextRoundIndex];
  const nextSentence = nextRound.words[nextSentenceIndex];

  roundTitle.textContent = nextRound.levelData.name;

  source.innerHTML = '';

  gameState.correctSentence = nextSentence.textExample.split(' ');

  createWords(
    nextSentence,
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
