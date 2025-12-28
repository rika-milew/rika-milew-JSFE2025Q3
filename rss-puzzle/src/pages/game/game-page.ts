import { manageCheckButton, transformCheckButton } from './buttons/check-button';
import { eventState } from './event-state';
import { gameState } from './game-state';
import { createGameUI } from './game-ui';
import { hintState } from './hints/hint-state';
import { createHints } from './hints/hints';
import { Routes } from '../../app/routes';
import { createButton } from '../../components/button/button';
import { createSentence } from '../../components/sentence/sentence';
import { createWords } from '../../components/word/word';
import wordCollectionData from '../../data/words/word-collection-level-1.json';
import { autoComplete } from '../../utils/auto-complete';
import { clearContainer } from '../../utils/clear-container';
import { createElement } from '../../utils/create-element';
import { playAudio } from '../../utils/play-audio';
import { setBackground } from '../../utils/set-background';

import type { AppRouter } from '../../app/app-router';
import type { Game, Round, Word } from '../../types/types';

import './game-page.css';

const wordCollection: Game = wordCollectionData;

export function createGamePage(container: HTMLElement, router: AppRouter): HTMLDivElement {
  clearContainer(container);
  setBackground('game-page');

  gameState.resetGame();

  playAudio();

  const { round, currentSentence } = initRound(wordCollection);

  const gameContainer: HTMLDivElement = createElement({
    tag: 'div',
    className: ['game', 'page'],
  });

  const gameBoard = createElement({ tag: 'div', className: 'game-board' });

  const props = createGameUI(round.levelData.name);

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

  const { hintIcons, hintContainer } = createHints(currentSentence);

  backButton.addEventListener('click', () => {
    eventState.emit('audio:reset', '');
    router.navigate(Routes.START);
  });

  props.checkButton.addEventListener('click', () => {
    manageCheckButton(props);
  });

  props.autoCompleteButton.addEventListener('click', () => {
    autoComplete(props);
    gameState.isCompleted = true;
    transformCheckButton(props.checkButton);

    if (hintState.getMode('translation') === 'disabled') {
      eventState.emit('hint:translation:toggle', 'enabled');
    }

    if (hintState.getMode('audio') === 'disabled') {
      eventState.emit('hint:audio:toggle', 'enabled');
    }
  });

  props.userSentence.append(props.placeholder);
  gameBoard.append(heading, props.result, props.source);
  gameButtons.append(props.checkButton, props.autoCompleteButton, backButton);
  gameContainer.append(hintIcons, props.roundTitle, hintContainer, gameBoard, gameButtons);
  container.append(gameContainer);

  return gameContainer;
}

function initRound(game: Game): {
  round: Round;
  currentSentence: Word;
} {
  const round = game.rounds[gameState.roundIndex];
  const currentSentence = round.words[gameState.sentenceIndex];
  gameState.correctSentence = currentSentence.textExample.split(' ');

  return { round, currentSentence };
}
