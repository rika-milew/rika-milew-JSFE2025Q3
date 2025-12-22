import { Routes } from '../../app/routes';
import { createButton } from '../../components/button/createButton.ts';
import wordCollectionData from '../../data/wordCollectionLevel1.json';
import { moveWordCards } from '../../utils/animationHelpers.ts';
import { startAutoComplete } from '../../utils/autoComplete.ts';
import {
  checkSentence,
  highlightSentence,
  highlightCorrectSentence,
} from '../../utils/checkSentence.ts';
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
  let isCompleted = false;

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

  const checkButton = createButton({
    text: 'Check',
    className: 'game__check-button button',
    disabled: true,
  });

  const autoCompleteButton = createButton({
    text: 'Auto-Complete',
    className: 'game__complete-button button',
  });

  createWordCards(
    round.words[sentenceIndex],
    sourceContainer,
    resultContainer,
    resultPlaceholder,
    correctSentence,
    checkButton,
  );

  backButton.addEventListener('click', () => {
    router.navigate(Routes.START);
  });

  checkButton.addEventListener('click', () => {
    if (isCompleted) {
      resetCheckButton(checkButton);
      isCompleted = false;

      continueGame(
        wordCollection.rounds,
        roundIndex,
        sentenceIndex,
        (value) => (roundIndex = value),
        (value) => (sentenceIndex = value),
        sourceContainer,
        resultContainer,
        resultPlaceholder,
        roundTitle,
        checkButton,
        correctSentence,
        autoCompleteButton,
        (value) => (isCompleted = value),
      );
      return;
    }
    const isCorrect = checkSentence(resultContainer, correctSentence);
    updateGameState(resultContainer, resultPlaceholder, correctSentence, checkButton);

    if (!isCorrect) {
      highlightSentence(resultContainer, correctSentence);
      return;
    }

    isCompleted = true;
    highlightCorrectSentence(resultContainer);
    transformCheckButton(checkButton);
    autoCompleteButton.disabled = true;
  });

  autoCompleteButton.addEventListener('click', () => {
    startAutoComplete(
      resultContainer,
      sourceContainer,
      correctSentence,
      resultPlaceholder,
      autoCompleteButton,
    );
    isCompleted = true;
    transformCheckButton(checkButton);
  });

  gameBoard.append(sourceContainer, resultHeading, resultContainer);
  resultContainer.append(resultPlaceholder);
  gameButtons.append(checkButton, autoCompleteButton, backButton);
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

    updateGameState(resultContainer, resultPlaceholder, correctSentence, checkButton);
  });
  return wordCard;
}

export function updateResultPlaceholder(
  resultContainer: HTMLElement,
  placeholder: HTMLElement,
): void {
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
  roundTitle: HTMLElement,
  checkButton: HTMLButtonElement,
  correctSentence: string[],
  autoCompleteButton: HTMLButtonElement,
  setSolved: (value: boolean) => void,
): void {
  setSolved(false);
  autoCompleteButton.disabled = false;

  let nextSentenceIndex = sentenceIndex + 1;
  let nextRoundIndex = roundIndex;

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

  correctSentence.splice(0, correctSentence.length, ...nextSentence.textExample.split(' '));

  createWordCards(
    nextSentence,
    sourceContainer,
    resultContainer,
    resultPlaceholder,
    nextSentence.textExample.split(' '),
    checkButton,
  );
}

function updateGameState(
  resultContainer: HTMLElement,
  resultPlaceholder: HTMLElement,
  correctSentence: string[],
  checkButton: HTMLButtonElement,
): void {
  updateResultPlaceholder(resultContainer, resultPlaceholder);
  updateCheckButtonState(resultContainer, checkButton, correctSentence.length);
  resultContainer.style.pointerEvents = 'auto';
}

function updateCheckButtonState(
  resultContainer: HTMLElement,
  checkButton: HTMLButtonElement,
  sentenceLength: number,
): void {
  const resultWords = resultContainer.querySelectorAll('.word').length;
  checkButton.disabled = resultWords === sentenceLength ? false : true;
}

function transformCheckButton(checkButton: HTMLButtonElement): void {
  checkButton.textContent = 'Continue';
  checkButton.classList.add('game__continue-button');
  checkButton.disabled = false;
}

function resetCheckButton(checkButton: HTMLButtonElement): void {
  checkButton.textContent = 'Check';
  checkButton.classList.remove('game__continue-button');
  checkButton.disabled = true;
}
