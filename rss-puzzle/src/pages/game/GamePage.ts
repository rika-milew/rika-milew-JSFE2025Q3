import { Routes } from '../../app/routes';
import wordCollectionData from '../../data/wordCollectionLevel1.json';
import { clearContainer } from '../../utils/clearContainer';
import { createElement } from '../../utils/createElement';
import { setBodyBackground } from '../../utils/setBodyBackground';

import type { AppRouter } from '../../app/AppRouter';
import type { Game, Word } from '../../types/types';

import './GamePage.css';

const wordCollection: Game = wordCollectionData;

function createLogoutButton(text: string): HTMLButtonElement {
  return createElement({
    tag: 'button',
    className: 'game__back-button button',
    textContent: text,
    attributes: {
      type: 'button',
    },
  });
}

export function createGamePage(container: HTMLElement, router: AppRouter): HTMLDivElement {
  clearContainer(container);
  setBodyBackground('game-page');

  const round = wordCollection.rounds[0];

  const gameContainer = createElement({
    tag: 'div',
    className: 'game',
  });

  const gameBoard = createElement({ tag: 'div', className: 'game-board' });

  const roundTitle = createElement({
    tag: 'h2',
    className: 'game__round',
    textContent: round.levelData.name,
  });

  const sourceContainer = createElement({ tag: 'div', className: 'game-board__source' });
  const resultContainer = createElement({ tag: 'div', className: 'game-board__result' });

  const resultHeading = createElement({ tag: 'p', className: 'result', textContent: 'Result' });

  createWordCards(round.words, sourceContainer, resultContainer);

  const backButton = createLogoutButton('Back');

  backButton.addEventListener('click', () => {
    router.navigate(Routes.START);
  });

  gameBoard.append(sourceContainer, resultHeading, resultContainer);
  gameContainer.append(roundTitle, gameBoard, backButton);
  container.append(gameContainer);

  return gameContainer;
}

function shuffleWordCards<T>(array: T[]): T[] {
  const wordArray = [...array];
  for (let index = array.length - 1; index > 0; index--) {
    const newIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[newIndex]] = [array[newIndex], array[index]];
  }
  const shuffledArray = wordArray;
  return shuffledArray;
}

function createWordCards(
  words: Word[],
  sourceContainer: HTMLElement,
  resultContainer: HTMLElement,
): void {
  const wordCards = shuffleWordCards(words);

  wordCards.forEach((wordData) => {
    const wordCard = createElement({
      tag: 'div',
      className: 'sentence__word word',
      textContent: wordData.word,
    });

    wordCard.addEventListener('click', () => {
      resultContainer.append(wordCard);
      wordCard.classList.add('word_result');
    });

    sourceContainer.append(wordCard);
  });
}
