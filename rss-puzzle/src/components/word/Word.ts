import { updateGameState } from '../../pages/game/game-controller.ts';
import { moveWords } from '../../utils/animation-helpers.ts';
import { createElement } from '../../utils/create-element.ts';
import { designPuzzles } from '../../utils/design-puzzles.ts';
import { dragAndDrop } from '../../utils/drag-and-drop.ts';
import { setPuzzleBackground } from '../../utils/set-puzzle-background.ts';

import type { Word } from '../../types/types.ts';

import './word.css';

export function createWords(
  sentence: Word,
  source: HTMLElement,
  resultSentence: HTMLElement,
  placeholder: HTMLElement,
  correctSentence: string[],
  checkButton: HTMLButtonElement,
): void {
  const words = sentence.textExample.split(' ').map((word, index) => ({
    id: index,
    word,
  }));
  const cards = shuffleWords(words);

  cards.forEach((word) => {
    const wordWrapper = createWord(
      word.word,
      source,
      resultSentence,
      placeholder,
      correctSentence,
      checkButton,
    );

    const card = wordWrapper.querySelector<HTMLElement>('.word');
    if (!card) {
      return;
    }

    designPuzzles(wordWrapper, card, word.word, correctSentence);

    dragAndDrop(wordWrapper, source, resultSentence, placeholder, correctSentence, checkButton);

    source.append(wordWrapper);
    requestAnimationFrame(() => {
      fixWordWidth(wordWrapper);
      if (sentence.puzzle) {
        setPuzzleBackground({
          wrapper: wordWrapper,
          index: word.id,
          total: correctSentence.length,
          puzzle: sentence.puzzle,
        });
      }
    });
  });
}

export function createWord(
  word: string,
  source: HTMLElement,
  resultSentence: HTMLElement,
  placeholder: HTMLElement,
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
    const isInSourceContainer = wordWrapper.parentElement === source;
    if (isInSourceContainer) {
      moveWords(wordWrapper, resultSentence);
      wordWrapper.classList.add('word-wrapper_result');
    } else {
      moveWords(wordWrapper, source);
      wordWrapper.classList.remove('word-wrapper_result');
    }

    updateGameState(resultSentence, placeholder, correctSentence, checkButton);
  });
  return wordWrapper;
}

function shuffleWords<T>(array: T[]): T[] {
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

function fixWordWidth(wordWrapper: HTMLElement): void {
  const width = wordWrapper.getBoundingClientRect().width;
  wordWrapper.style.width = `${width}px`;
  wordWrapper.style.flex = '0 0 auto';
}
