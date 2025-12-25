import { continueGame, updateGameState, blockResultSentence } from './game-controller';
import { gameState } from './game-state.ts';
import { Routes } from '../../app/routes.ts';
import { createButton } from '../../components/button/button';
import { createHeading } from '../../components/heading/heading';
import { createResultSentence } from '../../components/sentence/sentence';
import { createWordCards } from '../../components/word/Word';
import wordCollectionData from '../../data/word-collection-level-1.json';
import { startAutoComplete } from '../../utils/auto-complete';
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

export function createGamePage(container: HTMLElement, router: AppRouter): HTMLDivElement {
  clearContainer(container);
  setBodyBackground('game-page');

  gameState.resetGame();

  const round = wordCollection.rounds[gameState.roundIndex];

  gameState.correctSentence = round.words[gameState.sentenceIndex].textExample.split(' ');

  const gameContainer = createElement({
    tag: 'div',
    className: 'game',
  });

  const gameBoard = createElement({ tag: 'div', className: 'game-board' });

  gameState.elements.roundTitle = createHeading('gamePage', round.levelData.name);

  gameState.elements.sourceContainer = createElement({ tag: 'div', className: 'source' });
  gameState.elements.resultContainer = createElement({ tag: 'div', className: 'result' });

  gameState.elements.activeResultSentence = createResultSentence(
    gameState.elements.resultContainer,
  );

  const resultHeading = createElement({
    tag: 'p',
    className: 'result__heading',
    textContent: 'Result',
  });

  gameState.elements.resultPlaceholder = createElement({
    tag: 'p',
    className: 'result__placeholder',
    textContent: 'Build the sentence here',
  });

  const gameButtons = createElement({ tag: 'div', className: 'game__buttons' });

  const backButton = createButton({
    text: 'Back',
  });

  gameState.elements.checkButton = createButton({
    text: 'Check',
    disabled: true,
  });

  gameState.elements.autoCompleteButton = createButton({
    text: 'Auto-Complete',
  });

  createWordCards(
    round.words[gameState.sentenceIndex],
    gameState.sourceContainer,
    gameState.activeResultSentence,
    gameState.resultPlaceholder,
    gameState.correctSentence,
    gameState.checkButton,
  );

  backButton.addEventListener('click', () => {
    router.navigate(Routes.START);
  });

  gameState.checkButton.addEventListener('click', () => {
    if (gameState.isCompleted) {
      resetCheckButton(gameState.checkButton);
      gameState.isCompleted = false;
      continueGame();
      return;
    }

    const isCorrect = checkSentence(gameState.activeResultSentence, gameState.correctSentence);
    updateGameState(
      gameState.activeResultSentence,
      gameState.resultPlaceholder,
      gameState.correctSentence,
      gameState.checkButton,
    );

    if (!isCorrect) {
      highlightSentence(gameState.activeResultSentence, gameState.correctSentence);
      return;
    }

    gameState.isCompleted = true;
    blockResultSentence(gameState.activeResultSentence);
    highlightCorrectSentence(gameState.activeResultSentence);
    transformCheckButton(gameState.checkButton);
    gameState.autoCompleteButton.disabled = true;
  });

  gameState.autoCompleteButton.addEventListener('click', () => {
    startAutoComplete(
      gameState.activeResultSentence,
      gameState.sourceContainer,
      gameState.correctSentence,
      gameState.resultPlaceholder,
      gameState.autoCompleteButton,
    );
    gameState.isCompleted = true;
    transformCheckButton(gameState.checkButton);
  });

  gameState.activeResultSentence.append(gameState.resultPlaceholder);
  gameBoard.append(resultHeading, gameState.resultContainer, gameState.sourceContainer);
  gameButtons.append(gameState.checkButton, gameState.autoCompleteButton, backButton);
  gameContainer.append(gameState.roundTitle, gameBoard, gameButtons);
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
