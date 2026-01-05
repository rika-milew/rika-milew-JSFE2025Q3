import { hideResultsButton } from './buttons/results-button';
import { hintState } from './hints/hint-state';
import { launchNextStep } from './levels/game-steps';
import { eventState } from './state/event-state';
import { gameState } from './state/game-state';
import { resultsState } from './state/results-state';
import { updateGameStateData } from './update-game-state';
import { createSentence } from '../../components/sentence/sentence';
import { createWords } from '../../components/word/create-words';
import { blockSentence } from '../../utils/block-sentence';
import { clearContainer } from '../../utils/clear-container';
import { hideImage } from '../../utils/reveal-image';

import type { GameUI } from './game-ui';

export function continueGame(props: GameUI, mode: 'change' | 'progress' = 'progress'): void {
  const { source, result, placeholder, checkButton, autoCompleteButton, roundTitle } = props;

  if (mode === 'progress') {
    const step = launchNextStep();
    if (step === 'sentence') {
      blockSentence(props.userSentence);
    }

    if (step === 'gameover' || step === 'round' || step === 'level') {
      clearContainer(result);
      hideImage(props.result);
      hideResultsButton();
      resultsState.reset();
      resultsState.initRound({
        roundIndex: gameState.roundIndex,
        levelId: gameState.levelIndex,
      });
    }
  }

  props.userSentence = createSentence(result);
  props.userSentence.append(placeholder);

  gameState.isSolved = false;
  autoCompleteButton.disabled = false;

  const updatedRound = gameState.currentLevel.rounds[gameState.roundIndex];
  const currentSentence = updatedRound.words[gameState.sentenceIndex];

  eventState.emit('translation:update', currentSentence.textExampleTranslate);

  if (hintState.getMode('translation') === 'enabled') {
    eventState.emit('hint:translation:toggle', 'enabled');
  } else {
    eventState.emit('hint:translation:toggle', 'disabled');
  }

  eventState.emit('audio:update', currentSentence.audioExample);

  if (hintState.getMode('audio') === 'enabled') {
    eventState.emit('hint:audio:toggle', 'enabled');
  } else {
    eventState.emit('hint:audio:toggle', 'disabled');
  }

  if (hintState.getMode('image') === 'enabled') {
    eventState.emit('hint:image:toggle', 'enabled');
  } else {
    eventState.emit('hint:image:toggle', 'disabled');
  }

  updateGameStateData(updatedRound, currentSentence);
  roundTitle.textContent = updatedRound.levelData.name;
  clearContainer(source);

  createWords(
    currentSentence,
    source,
    props.userSentence,
    placeholder,
    gameState.correctSentence,
    checkButton,
  );

  return;
}
