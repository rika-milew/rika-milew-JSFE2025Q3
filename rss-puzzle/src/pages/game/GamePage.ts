import { Routes } from '../../app/routes';
import { createButton } from '../../components/button/createButton.ts';
import wordCollectionData from '../../data/wordCollectionLevel1.json';
import { moveWordCards } from '../../utils/animationHelpers.ts';
import { checkSentence, highlightSentence } from '../../utils/checkSentence.ts';
import { clearContainer } from '../../utils/clearContainer';
import { createElement } from '../../utils/createElement';
import { setBodyBackground } from '../../utils/setBodyBackground';

import type { AppRouter } from '../../app/AppRouter';
import type { Game, Word } from '../../types/types';

import './GamePage.css';

const wordCollection: Game = wordCollectionData;

export function createGamePage(container: HTMLElement, router: AppRouter): HTMLDivElement {
  clearContainer(container);
  setBodyBackground('game-page');

  let sentenceIndex = 0;
  let roundIndex = 0;

  const round = wordCollection.rounds[roundIndex];

  const correctSentence = round.words[sentenceIndex].textExample.split(' ');

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

  const gameButtons = createElement({ tag: 'div', className: 'game__buttons' });

  const backButton = createButton({
    text: 'Back',
    className: 'game__back-button button',
  });

  const continueButton = createButton({
    text: 'Continue',
    className: 'game__continue-button button',
    disabled: true,
  });

  const checkButton = createButton({
    text: 'Check',
    className: 'game__check-button button',
    disabled: true,
  });

  createWordCards(
    round.words[sentenceIndex],
    sourceContainer,
    resultContainer,
    resultPlaceholder,
    continueButton,
    correctSentence,
    checkButton,
  );

  backButton.addEventListener('click', () => {
    router.navigate(Routes.START);
  });

  continueButton.addEventListener('click', () => {
    continueGame(
      wordCollection.rounds,
      roundIndex,
      sentenceIndex,
      (value) => (roundIndex = value),
      (value) => (sentenceIndex = value),
      sourceContainer,
      resultContainer,
      resultPlaceholder,
      continueButton,
      roundTitle,
      checkButton,
    );
  });

  checkButton.addEventListener('click', () => {
    highlightSentence(resultContainer, correctSentence);
  });

  gameBoard.append(sourceContainer, resultHeading, resultContainer);
  resultContainer.append(resultPlaceholder);
  gameButtons.append(checkButton, continueButton, backButton);
  gameContainer.append(roundTitle, gameBoard, gameButtons);
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
  sentence: Word,
  sourceContainer: HTMLElement,
  resultContainer: HTMLElement,
  resultPlaceholder: HTMLElement,
  continueButton: HTMLButtonElement,
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
      resultContainer,
      resultPlaceholder,
      continueButton,
      correctSentence,
      checkButton,
    );
    sourceContainer.append(card);
  });
}

function createWordCard(
  word: string,
  sourceContainer: HTMLElement,
  resultContainer: HTMLElement,
  resultPlaceholder: HTMLElement,
  continueButton: HTMLButtonElement,
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
      moveWordCards(wordCard, resultContainer);
      wordCard.classList.add('word_result');
    } else {
      moveWordCards(wordCard, sourceContainer);
      wordCard.classList.remove('word_result');
    }

    updateGameState(
      resultContainer,
      resultPlaceholder,
      correctSentence,
      checkButton,
      continueButton,
    );
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

function continueGame(
  rounds: Game['rounds'],
  roundIndex: number,
  sentenceIndex: number,
  selectRoundIndex: (value: number) => void,
  selectSentenceIndex: (value: number) => void,
  sourceContainer: HTMLElement,
  resultContainer: HTMLElement,
  resultPlaceholder: HTMLElement,
  continueButton: HTMLButtonElement,
  roundTitle: HTMLElement,
  checkButton: HTMLButtonElement,
): void {
  let nextSentenceIndex = sentenceIndex + 1;
  let nextRoundIndex = roundIndex;
  checkButton.disabled = true;

  if (nextSentenceIndex >= rounds[roundIndex].words.length) {
    nextRoundIndex += 1;
    nextSentenceIndex = 0;

    if (nextRoundIndex >= rounds.length) {
      return;
    }
  }
  selectRoundIndex(nextRoundIndex);
  selectSentenceIndex(nextSentenceIndex);

  const nextRound = rounds[nextRoundIndex];
  const nextSentence = nextRound.words[nextSentenceIndex];

  roundTitle.textContent = nextRound.levelData.name;

  sourceContainer.innerHTML = '';
  resultContainer.innerHTML = '';
  resultContainer.append(resultPlaceholder);
  continueButton.disabled = true;

  createWordCards(
    nextSentence,
    sourceContainer,
    resultContainer,
    resultPlaceholder,
    continueButton,
    nextSentence.textExample.split(' '),
    checkButton,
  );
}

function updateGameState(
  resultContainer: HTMLElement,
  resultPlaceholder: HTMLElement,
  correctSentence: string[],
  checkButton: HTMLButtonElement,
  continueButton: HTMLButtonElement,
): void {
  updateResultPlaceholder(resultContainer, resultPlaceholder);

  updateCheckButtonState(resultContainer, checkButton, correctSentence.length);

  const isSentenceCorrect = checkSentence(resultContainer, correctSentence);
  continueButton.disabled = !isSentenceCorrect;
  updateResultState(resultContainer, isSentenceCorrect);
}

function updateResultState(resultContainer: HTMLElement, isSentenceCorrect: boolean): void {
  const ANIMATION_DELAY = 400;
  const ANIMATION_DURATION = 1000;
  if (isSentenceCorrect) {
    setTimeout(() => {
      resultContainer.querySelectorAll('.word').forEach((word) => {
        word.classList.add('correct');
        setTimeout(() => {
          word.classList.remove('correct');
        }, ANIMATION_DURATION);
      });
    }, ANIMATION_DELAY);
  }
}

function updateCheckButtonState(
  resultContainer: HTMLElement,
  checkButton: HTMLButtonElement,
  sentenceLength: number,
): void {
  const resultWords = resultContainer.querySelectorAll('.word').length;
  checkButton.disabled = resultWords !== sentenceLength;
}
