import { updateCheckButtonState, createResultSentence } from './game-page';
import { createWordCards } from '../../components/word/word';

import type { Game } from '../../types/types';

export function continueGame(
  rounds: Game['rounds'],
  roundIndex: number,
  sentenceIndex: number,
  selectRoundIndex: (value: number) => void,
  selectSentenceIndex: (value: number) => void,
  sourceContainer: HTMLElement,
  resultContainer: HTMLElement,
  resultPlaceholder: HTMLElement,
  roundTitle: HTMLElement,
  checkButton: HTMLButtonElement,
  correctSentence: string[],
  autoCompleteButton: HTMLButtonElement,
  activeResultSentence: HTMLElement,
  setSolved: (value: boolean) => void,
): HTMLElement {
  let nextSentenceIndex = sentenceIndex + 1;
  let nextRoundIndex = roundIndex;

  if (nextSentenceIndex >= rounds[roundIndex].words.length) {
    nextRoundIndex += 1;
    nextSentenceIndex = 0;
    resultContainer.innerHTML = '';

    if (nextRoundIndex >= rounds.length) {
      return activeResultSentence;
    }
  }

  blockResultSentence(activeResultSentence);
  activeResultSentence = createResultSentence(resultContainer);
  activeResultSentence.append(resultPlaceholder);

  setSolved(false);

  autoCompleteButton.disabled = false;
  selectRoundIndex(nextRoundIndex);
  selectSentenceIndex(nextSentenceIndex);

  const nextRound = rounds[nextRoundIndex];
  const nextSentence = nextRound.words[nextSentenceIndex];

  roundTitle.textContent = nextRound.levelData.name;

  sourceContainer.innerHTML = '';

  correctSentence.splice(0, correctSentence.length, ...nextSentence.textExample.split(' '));

  createWordCards(
    nextSentence,
    sourceContainer,
    activeResultSentence,
    resultPlaceholder,
    correctSentence,
    checkButton,
  );

  return activeResultSentence;
}

export function updateResultPlaceholder(
  activeResultSentence: HTMLElement,
  placeholder: HTMLElement,
): void {
  const words = [...activeResultSentence.querySelectorAll('.word')].filter(
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
