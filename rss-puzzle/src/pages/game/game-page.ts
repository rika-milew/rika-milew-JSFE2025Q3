import { eventState } from './event-state';
import { continueGame, updateGameState, blockSentence } from './game-controller';
import { gameState } from './game-state';
import { Routes } from '../../app/routes';
import { createButton } from '../../components/button/button';
import { createHeading } from '../../components/heading/heading';
import { createHint } from '../../components/hint/hint';
import { createSentence } from '../../components/sentence/sentence';
import { createWords } from '../../components/word/word.ts';
import wordCollectionData from '../../data/word-collection-level-1.json';
import { autoComplete } from '../../utils/auto-complete';
import {
  checkSentence,
  highlightSentence,
  highlightCorrectSentence,
} from '../../utils/check-sentence.ts';
import { clearContainer } from '../../utils/clear-container';
import { createElement } from '../../utils/create-element';
import { setBackground } from '../../utils/set-background';

import type { GameUI } from './game-types.ts';
import type { AppRouter } from '../../app/app-router';
import type { Game } from '../../types/types';

import './game-page.css';

const wordCollection: Game = wordCollectionData;

export function createGamePage(container: HTMLElement, router: AppRouter): HTMLDivElement {
  clearContainer(container);
  setBackground('game-page');

  gameState.resetGame();

  const round = wordCollection.rounds[gameState.roundIndex];

  gameState.correctSentence = round.words[gameState.sentenceIndex].textExample.split(' ');

  const gameContainer = createElement({
    tag: 'div',
    className: ['game', 'page'],
  });

  const gameBoard = createElement({ tag: 'div', className: 'game-board' });

  const props: GameUI = {
    roundTitle: createHeading('gamePage', round.levelData.name),
    source: createElement({ tag: 'div', className: 'source' }),
    result: createElement({ tag: 'div', className: 'result' }),
    userSentence: createSentence(createElement({ tag: 'div' })),
    placeholder: createElement({
      tag: 'p',
      className: 'result__placeholder',
      textContent: 'Build the sentence here',
    }),
    checkButton: createButton({ text: 'Check', disabled: true }),
    autoCompleteButton: createButton({ text: 'Auto-Complete' }),
  };

  props.userSentence = createSentence(props.result);

  const heading = createElement({
    tag: 'p',
    className: 'result__heading',
    textContent: 'Result',
  });

  const gameButtons = createElement({ tag: 'div', className: 'game__buttons' });

  const backButton = createButton({
    text: 'Back',
  });

  createWords(
    round.words[gameState.sentenceIndex],
    props.source,
    props.userSentence,
    props.placeholder,
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

    const isCorrect = checkSentence(props.userSentence, gameState.correctSentence);
    updateGameState(
      props.userSentence,
      props.placeholder,
      gameState.correctSentence,
      props.checkButton,
    );

    if (!isCorrect) {
      highlightSentence(props.userSentence, gameState.correctSentence);
      return;
    }

    gameState.isCompleted = true;
    blockSentence(props.userSentence);
    highlightCorrectSentence(props.userSentence);
    transformCheckButton(props.checkButton);
    props.autoCompleteButton.disabled = true;
  });

  props.autoCompleteButton.addEventListener('click', () => {
    autoComplete(
      props.userSentence,
      props.source,
      gameState.correctSentence,
      props.placeholder,
      props.autoCompleteButton,
    );
    gameState.isCompleted = true;
    transformCheckButton(props.checkButton);
  });

  const hintIcons = createElement({ tag: 'div', className: 'hint-icons' });

  const translationIcon = createHint({
    container: props.result,
    text: 'Translation',
    icon: 'icons/translation.svg',
    className: 'hint',
  });

  const hintContainer = createElement({ tag: 'div', className: 'hint-container' });

  const translation = createElement({
    tag: 'div',
    className: 'translation',
  });

  eventState.on('translation:update', (text: string) => {
    translation.textContent = text;
  });

  const currentSentence = round.words[gameState.sentenceIndex];
  eventState.emit('translation:update', currentSentence.textExampleTranslate);

  hintIcons.append(translationIcon);
  hintContainer.append(translation);
  props.userSentence.append(props.placeholder);
  gameBoard.append(heading, props.result, props.source);
  gameButtons.append(props.checkButton, props.autoCompleteButton, backButton);
  gameContainer.append(hintIcons, props.roundTitle, hintContainer, gameBoard, gameButtons);
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
