import { manageCheckButton, transformCheckButton } from './buttons/check-button';
import { eventState } from './event-state';
import { gameState } from './game-state';
import { createGameUI } from './game-ui';
import { hintState } from './hints/hint-state';
import { createHints } from './hints/hints';
import { changeRound } from './levels/game-steps';
import { initRound } from './levels/level-controller';
import { createLevelAndRoundsSelector } from './levels/level-selection';
import { Routes } from '../../app/routes';
import { createButton } from '../../components/button/button';
import { createWords } from '../../components/word/word';
import { autoComplete } from '../../utils/auto-complete';
import { clearContainer } from '../../utils/clear-container';
import { createElement } from '../../utils/create-element';
import { playAudio } from '../../utils/play-audio';
import { uploadProgress } from '../../utils/save-progress';
import { setBackground } from '../../utils/set-background';

import type { AppRouter } from '../../app/app-router';

import './game-page.css';

export function createGamePage(container: HTMLElement, router: AppRouter): HTMLDivElement {
  clearContainer(container);
  setBackground('game-page');

  uploadProgress();

  const { round, currentSentence } = initRound(gameState.currentLevel);

  gameState.levelImage = round.levelData.imageSrc;

  const gameContainer: HTMLDivElement = createElement({
    tag: 'div',
    className: ['game', 'page'],
  });
  const gameBoard = createElement({ tag: 'div', className: 'game-board' });

  const props = createGameUI(round.levelData.name);

  const heading = createElement({
    tag: 'p',
    className: 'result__heading',
    textContent: 'Result',
  });

  const settings = createElement({ tag: 'div', className: 'settings' });

  const levelSelection = createElement({ tag: 'div', className: 'level-selection' });

  const [levelDiv, roundDiv] = createLevelAndRoundsSelector();

  eventState.on('level:changed', () => {
    gameState.roundIndex = 0;
    changeRound(props);
  });

  eventState.on('round:changed', () => {
    changeRound(props);
  });

  levelSelection.append(levelDiv, roundDiv);

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

  playAudio();

  props.userSentence.append(props.placeholder);
  gameBoard.append(heading, props.result, props.source);
  gameButtons.append(props.checkButton, props.autoCompleteButton, backButton);
  settings.append(levelSelection, hintIcons);
  gameContainer.append(settings, props.roundTitle, hintContainer, gameBoard, gameButtons);
  container.append(gameContainer);

  return gameContainer;
}
