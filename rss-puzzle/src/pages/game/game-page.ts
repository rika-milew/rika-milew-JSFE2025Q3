import { continueGame, updateGameState, blockResultSentence } from './game-controller.ts';
import { Routes } from '../../app/routes.ts';
import { createButton } from '../../components/button/create-button.ts';
import { createWordCards } from '../../components/word/word.ts';
import wordCollectionData from '../../data/word-collection-level-1.json';
import { startAutoComplete } from '../../utils/auto-complete.ts';
import {
  checkSentence,
  highlightSentence,
  highlightCorrectSentence,
} from '../../utils/check-sentence.ts';
import { clearContainer } from '../../utils/clear-container.ts';
import { createElement } from '../../utils/create-element.ts';
import { setBodyBackground } from '../../utils/set-body-background.ts';

import type { AppRouter } from '../../app/app-router.ts';
import type { Game } from '../../types/types.ts';

import './game-page.css';

const wordCollection: Game = wordCollectionData;

export function createResultSentence(resultContainer: HTMLElement): HTMLElement {
  const sentence = createElement({
    tag: 'div',
    className: 'result__sentence result__sentence_active',
  });

  resultContainer.append(sentence);
  return sentence;
}

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

  let activeResultSentence = createResultSentence(resultContainer);

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
    activeResultSentence,
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

      activeResultSentence = continueGame(
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
        activeResultSentence,
        (value) => (isCompleted = value),
      );
      return;
    }
    const isCorrect = checkSentence(activeResultSentence, correctSentence);
    updateGameState(activeResultSentence, resultPlaceholder, correctSentence, checkButton);

    if (!isCorrect) {
      highlightSentence(activeResultSentence, correctSentence);
      return;
    }

    isCompleted = true;
    blockResultSentence(activeResultSentence);
    highlightCorrectSentence(activeResultSentence);
    transformCheckButton(checkButton);
    autoCompleteButton.disabled = true;
  });

  autoCompleteButton.addEventListener('click', () => {
    startAutoComplete(
      activeResultSentence,
      sourceContainer,
      correctSentence,
      resultPlaceholder,
      autoCompleteButton,
    );
    isCompleted = true;
    transformCheckButton(checkButton);
  });

  activeResultSentence.append(resultPlaceholder);
  gameBoard.append(resultHeading, resultContainer, sourceContainer);
  gameButtons.append(checkButton, autoCompleteButton, backButton);
  gameContainer.append(roundTitle, gameBoard, gameButtons);
  container.append(gameContainer);

  return gameContainer;
}

export function updateCheckButtonState(
  activeResultSentence: HTMLElement,
  checkButton: HTMLButtonElement,
  sentenceLength: number,
): void {
  const resultWords = activeResultSentence.querySelectorAll('.word').length;
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
