import { Routes } from '../../app/routes';
import wordCollectionData from '../../data/wordCollectionLevel1.json';
import { moveWordCards } from '../../utils/animationHelpers.ts';
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

  const sentenceWords: Word[] = round.words[0].textExample.split(' ').map((word, index) => ({
    audioExample: '',
    textExample: round.words[0].textExample,
    textExampleTranslate: round.words[0].textExampleTranslate,
    id: index,
    word,
    wordTranslate: '',
  }));

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

  const sourceContainer = createElement({ tag: 'div', className: 'source' });
  const resultContainer = createElement({ tag: 'div', className: 'result' });

  const resultHeading = createElement({
    tag: 'p',
    className: 'result__heading',
    textContent: 'Result',
  });

  const resultPlaceholder = createElement({
    tag: 'p',
    className: 'result__placeholder',
    textContent: 'Build the sentence here',
  });

  createWordCards(sentenceWords, sourceContainer, resultContainer, resultPlaceholder);

  const backButton = createLogoutButton('Back');

  backButton.addEventListener('click', () => {
    router.navigate(Routes.START);
  });

  gameBoard.append(sourceContainer, resultHeading, resultContainer);
  resultContainer.append(resultPlaceholder);
  gameContainer.append(roundTitle, gameBoard, backButton);
  container.append(gameContainer);

  return gameContainer;
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

function createWordCards(
  words: Word[],
  sourceContainer: HTMLElement,
  resultContainer: HTMLElement,
  resultPlaceholder: HTMLElement,
): void {
  const wordCards = shuffleWordCards(words);

  wordCards.forEach((word) => {
    const card = createWordCard(word.word, sourceContainer, resultContainer, resultPlaceholder);
    sourceContainer.append(card);
  });
}

function createWordCard(
  word: string,
  sourceContainer: HTMLElement,
  resultContainer: HTMLElement,
  resultPlaceholder: HTMLElement,
): HTMLElement {
  const wordCard = createElement({
    tag: 'div',
    className: 'sentence__word word',
    textContent: word,
  });

  wordCard.addEventListener('click', () => {
    const isInSourceContainer = wordCard.parentElement === sourceContainer;
    if (isInSourceContainer) {
      moveWordCards(wordCard, resultContainer);
      wordCard.classList.add('word_result');
    } else {
      moveWordCards(wordCard, sourceContainer);
      wordCard.classList.remove('word_result');
    }
    updateResultPlaceholder(resultContainer, resultPlaceholder);
  });
  return wordCard;
}

function updateResultPlaceholder(resultContainer: HTMLElement, placeholder: HTMLElement): void {
  const hasWordCards = resultContainer.querySelectorAll('.word').length > 0;

  if (hasWordCards) {
    if (resultContainer.contains(placeholder)) {
      placeholder.remove();
      placeholder.style.opacity = '0';
    }
  } else {
    if (!resultContainer.contains(placeholder)) {
      resultContainer.append(placeholder);
      placeholder.style.opacity = '1';
    }
  }
}
