import { createGameButtons } from './buttons/game-buttons';
import { createGameElements } from './game-elements';
import { subscribeGameEvents } from './game-events';
import { createGameUI } from './game-ui';
import { hintState } from './hints/hint-state';
import { createHints } from './hints/hints';
import { initRound } from './levels/level-controller';
import { eventState } from './state/event-state';
import { gameState } from './state/game-state';
import { loadProgressState } from './state/progress-state';
import { resultsState } from './state/results-state';
import { createWords } from '../../components/word/create-words';
import { clearContainer } from '../../utils/clear-container';
import { createElement } from '../../utils/create-element';
import { playAudio, playResultsAudio } from '../../utils/play-audio';
import { uploadProgress } from '../../utils/save-progress';
import { setBackground } from '../../utils/set-background';

import type { AppRouter } from '../../app/app-router';

import './game-page.css';

export function createGamePage(container: HTMLElement, router: AppRouter): HTMLDivElement {
  clearContainer(container);
  setBackground('game-page');

  uploadProgress();
  loadProgressState();
  hintState.upload();

  const { round, currentSentence } = initRound(gameState.currentLevel);
  gameState.audioSource = currentSentence.audioExample;

  resultsState.initRound({
    levelId: gameState.levelIndex,
    roundIndex: gameState.roundIndex,
  });

  const words = currentSentence.textExample.split(' ');
  gameState.correctSentenceIndexes = words.map((_, index) => index);

  gameState.levelImage = round.levelData.imageSrc;
  gameState.imageName = round.levelData.name;
  gameState.cutImage = round.levelData.cutSrc;
  gameState.author = round.levelData.author;
  gameState.year = round.levelData.year;

  const gameContainer: HTMLDivElement = createElement({
    tag: 'div',
    className: ['game', 'page'],
  });

  const gameBoard = createElement({ tag: 'div', className: 'game-board' });

  const props = createGameUI(round.levelData.name);

  const { heading, settings, levelSelection } = createGameElements();

  const gameButtons = createElement({ tag: 'div', className: 'game__buttons' });

  const backButton = createGameButtons(props, router);

  subscribeGameEvents(props, gameButtons, gameContainer);

  createWords(
    round.words[gameState.sentenceIndex],
    props.source,
    props.userSentence,
    props.placeholder,
    gameState.correctSentence,
    props.checkButton,
  );

  const { hintIcons, hintContainer } = createHints(currentSentence);

  playAudio();
  playResultsAudio();

  eventState.emit('audio:update', gameState.audioSource);

  props.userSentence.append(props.placeholder);
  gameBoard.append(heading, props.result, props.source);
  gameButtons.append(props.checkButton, props.autoCompleteButton, backButton);
  settings.append(levelSelection, hintIcons);
  gameContainer.append(settings, props.roundTitle, hintContainer, gameBoard, gameButtons);
  container.append(gameContainer);

  return gameContainer;
}
