import { updateCheckButtonState } from './game-page';
import { gameState } from './game-state.ts';
import { createResultSentence } from '../../components/sentence/sentence';
import { createWordCards } from '../../components/word/Word';

import type { GameUI } from './game-types.ts';

export function continueGame(props: GameUI): void {
  const {
    sourceContainer,
    resultContainer,
    resultPlaceholder,
    checkButton,
    autoCompleteButton,
    roundTitle,
  } = props;
  const rounds = gameState.rounds;
  let nextSentenceIndex = gameState.sentenceIndex + 1;
  let nextRoundIndex = gameState.roundIndex;

  if (nextSentenceIndex >= rounds[gameState.roundIndex].words.length) {
    gameState.nextRound();
    nextRoundIndex = gameState.roundIndex;
    nextSentenceIndex = gameState.sentenceIndex;

    resultContainer.innerHTML = '';

    if (nextRoundIndex >= rounds.length) {
      gameState.isCompleted = true;
      return;
    }
  }

  blockResultSentence(props.activeResultSentence);

  props.activeResultSentence = createResultSentence(resultContainer);
  props.activeResultSentence.append(resultPlaceholder);

  gameState.isSolved = false;

  autoCompleteButton.disabled = false;

  gameState.roundIndex = nextRoundIndex;
  gameState.sentenceIndex = nextSentenceIndex;

  const nextRound = rounds[nextRoundIndex];
  const nextSentence = nextRound.words[nextSentenceIndex];

  roundTitle.textContent = nextRound.levelData.name;

  sourceContainer.innerHTML = '';

  gameState.correctSentence = nextSentence.textExample.split(' ');

  createWordCards(
    nextSentence,
    sourceContainer,
    props.activeResultSentence,
    resultPlaceholder,
    gameState.correctSentence,
    checkButton,
  );

  return;
}

export function updateResultPlaceholder(
  activeResultSentence: HTMLElement,
  placeholder: HTMLElement,
): void {
  const words = [...activeResultSentence.querySelectorAll('.word-wrapper')].filter(
    (word) => word.parentElement === activeResultSentence,
  );

  if (words.length > 0) {
    if (activeResultSentence.contains(placeholder)) {
      placeholder.remove();
    }
  } else {
    if (!activeResultSentence.contains(placeholder)) {
      activeResultSentence.append(placeholder);
    }
  }
}

export function updateGameState(
  activeResultSentence: HTMLElement,
  resultPlaceholder: HTMLElement,
  correctSentence: string[],
  checkButton: HTMLButtonElement,
): void {
  updateResultPlaceholder(activeResultSentence, resultPlaceholder);
  updateCheckButtonState(activeResultSentence, checkButton, correctSentence.length);
  activeResultSentence.style.pointerEvents = 'auto';
}

export function blockResultSentence(sentence: HTMLElement): void {
  sentence.classList.remove('result__sentence_active');
  sentence.classList.add('result__sentence_done');
  sentence.style.pointerEvents = 'none';
}
