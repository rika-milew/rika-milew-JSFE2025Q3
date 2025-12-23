import { updateGameState } from '../../pages/game/game-controller.ts';
import { moveWordCards } from '../../utils/animation-helpers.ts';
import { createElement } from '../../utils/create-element.ts';
import { implementDragAndDrop } from '../../utils/drag-and-drop.ts';

import type { Word } from '../../types/types.ts';

import './word.css';

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
    const card = createWordCard(
      word.word,
      sourceContainer,
      activeResultSentence,
      resultPlaceholder,
      correctSentence,
      checkButton,
    );

    implementDragAndDrop(
      card,
      sourceContainer,
      activeResultSentence,
      resultPlaceholder,
      correctSentence,
      checkButton,
    );

    sourceContainer.append(card);
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
  const wordCard = createElement({
    tag: 'div',
    className: 'sentence__word word',
    textContent: word,
  });

  wordCard.addEventListener('click', () => {
    const isInSourceContainer = wordCard.parentElement === sourceContainer;
    if (isInSourceContainer) {
      moveWordCards(wordCard, activeResultSentence);
      wordCard.classList.add('word_result');
    } else {
      moveWordCards(wordCard, sourceContainer);
      wordCard.classList.remove('word_result');
    }

    updateGameState(activeResultSentence, resultPlaceholder, correctSentence, checkButton);
  });
  return wordCard;
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
