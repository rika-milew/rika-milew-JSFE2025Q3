import { updateGameState } from '../../pages/game/game-controller.ts';
import { moveWordCards } from '../../utils/animation-helpers.ts';
import { createElement } from '../../utils/create-element.ts';
import { designPuzzleEdges } from '../../utils/designPuzzleEdges.ts';
import { implementDragAndDrop } from '../../utils/drag-and-drop.ts';

import type { Word } from '../../types/types.ts';

import './Word.css';

export function createWordCards(
  sentence: Word,
  sourceContainer: HTMLElement,
  activeResultSentence: HTMLElement,
  resultPlaceholder: HTMLElement,
  correctSentence: string[],
  checkButton: HTMLButtonElement,
): void {
  const words = sentence.textExample.split(' ').map((word, index) => ({
    id: index,
    word,
  }));
  const wordCards = shuffleWordCards(words);

  wordCards.forEach((word) => {
    const wordWrapper = createWordCard(
      word.word,
      sourceContainer,
      activeResultSentence,
      resultPlaceholder,
      correctSentence,
      checkButton,
    );

    const card = wordWrapper.querySelector<HTMLElement>('.word');
    if (!card) {
      return;
    }

    designPuzzleEdges(wordWrapper, card, word.word, correctSentence);

    implementDragAndDrop(
      wordWrapper,
      sourceContainer,
      activeResultSentence,
      resultPlaceholder,
      correctSentence,
      checkButton,
    );

    sourceContainer.append(wordWrapper);
    requestAnimationFrame(() => {
      fixWordCardWidth(wordWrapper);
    });
  });
}

export function createWordCard(
  word: string,
  sourceContainer: HTMLElement,
  activeResultSentence: HTMLElement,
  resultPlaceholder: HTMLElement,
  correctSentence: string[],
  checkButton: HTMLButtonElement,
): HTMLElement {
  const wordWrapper = createElement({
    tag: 'div',
    className: 'word-wrapper',
  });
  const wordCard = createElement({
    tag: 'div',
    className: 'sentence__word word',
    textContent: word,
  });

  const length = word.length;
  wordWrapper.style.setProperty('--grow', String(length));

  wordWrapper.append(wordCard);

  wordWrapper.addEventListener('click', () => {
    const isInSourceContainer = wordWrapper.parentElement === sourceContainer;
    if (isInSourceContainer) {
      moveWordCards(wordWrapper, activeResultSentence);
      wordWrapper.classList.add('word-wrapper_result');
    } else {
      moveWordCards(wordWrapper, sourceContainer);
      wordWrapper.classList.remove('word-wrapper_result');
    }

    updateGameState(activeResultSentence, resultPlaceholder, correctSentence, checkButton);
  });
  return wordWrapper;
}

function shuffleWordCards<T>(array: T[]): T[] {
  const shuffledArray = [...array];
  for (let index = shuffledArray.length - 1; index > 0; index--) {
    const newIndex = Math.floor(Math.random() * (index + 1));
    [shuffledArray[index], shuffledArray[newIndex]] = [
      shuffledArray[newIndex],
      shuffledArray[index],
    ];
  }
  return shuffledArray;
}

function fixWordCardWidth(wordWrapper: HTMLElement): void {
  const width = wordWrapper.getBoundingClientRect().width;
  wordWrapper.style.width = `${width}px`;
  wordWrapper.style.flex = '0 0 auto';
}
