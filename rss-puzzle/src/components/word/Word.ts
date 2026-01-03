import { updateGameState } from '../../pages/game/game-controller';
import { gameState } from '../../pages/game/game-state';
import { hintState } from '../../pages/game/hints/hint-state';
import { moveWords } from '../../utils/animation-helpers';
import { createElement } from '../../utils/create-element';
import { designPuzzles } from '../../utils/design-puzzles';
import { dragAndDrop } from '../../utils/drag-and-drop';
import { setPuzzleBackground } from '../../utils/set-puzzle-background';

import type { Word } from '../../types/types';

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

    const card = [...wordWrapper.children].find(
      (element): element is HTMLElement =>
        element instanceof HTMLElement && element.classList.contains('word'),
    );

    if (!card) {
      return;
    }

    designPuzzles(wordWrapper, card, word.word, correctSentence);

    dragAndDrop(wordWrapper, source, resultSentence, placeholder, correctSentence, checkButton);

    source.append(wordWrapper);
    requestAnimationFrame(() => {
      fixWordWidth(wordWrapper);
      if (gameState.levelImage) {
        setPuzzleBackground({
          wrapper: wordWrapper,
          index: word.id,
          correctSentence,
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

  if (hintState.getMode('image') === 'enabled') {
    wordWrapper.classList.add('background');
  }

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
