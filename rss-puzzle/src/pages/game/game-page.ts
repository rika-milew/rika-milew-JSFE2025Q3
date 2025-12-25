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

import type { GameUI } from './game-types.ts';
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

  const props: GameUI = {
    roundTitle: createHeading('gamePage', round.levelData.name),
    sourceContainer: createElement({ tag: 'div', className: 'source' }),
    resultContainer: createElement({ tag: 'div', className: 'result' }),
    activeResultSentence: createResultSentence(createElement({ tag: 'div' })),
    resultPlaceholder: createElement({
      tag: 'p',
      className: 'result__placeholder',
      textContent: 'Build the sentence here',
    }),
    checkButton: createButton({ text: 'Check', disabled: true }),
    autoCompleteButton: createButton({ text: 'Auto-Complete' }),
  };

  props.activeResultSentence = createResultSentence(props.resultContainer);

  const resultHeading = createElement({
    tag: 'p',
    className: 'result__heading',
    textContent: 'Result',
  });

  const gameButtons = createElement({ tag: 'div', className: 'game__buttons' });

  const backButton = createButton({
    text: 'Back',
  });

  createWordCards(
    round.words[gameState.sentenceIndex],
    props.sourceContainer,
    props.activeResultSentence,
    props.resultPlaceholder,
    gameState.correctSentence,
    props.checkButton,
  );

  backButton.addEventListener('click', () => {
    router.navigate(Routes.START);
  });

  props.checkButton.addEventListener('click', () => {
    if (gameState.isCompleted) {
      resetCheckButton(props.checkButton);
      gameState.isCompleted = false;
      continueGame(props);
      return;
    }

    const isCorrect = checkSentence(props.activeResultSentence, gameState.correctSentence);
    updateGameState(
      props.activeResultSentence,
      props.resultPlaceholder,
      gameState.correctSentence,
      props.checkButton,
    );

    if (!isCorrect) {
      highlightSentence(props.activeResultSentence, gameState.correctSentence);
      return;
    }

    gameState.isCompleted = true;
    blockResultSentence(props.activeResultSentence);
    highlightCorrectSentence(props.activeResultSentence);
    transformCheckButton(props.checkButton);
    props.autoCompleteButton.disabled = true;
  });

  props.autoCompleteButton.addEventListener('click', () => {
    startAutoComplete(
      props.activeResultSentence,
      props.sourceContainer,
      gameState.correctSentence,
      props.resultPlaceholder,
      props.autoCompleteButton,
    );
    gameState.isCompleted = true;
    transformCheckButton(props.checkButton);
  });

  props.activeResultSentence.append(props.resultPlaceholder);
  gameBoard.append(resultHeading, props.resultContainer, props.sourceContainer);
  gameButtons.append(props.checkButton, props.autoCompleteButton, backButton);
  gameContainer.append(props.roundTitle, gameBoard, gameButtons);
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
