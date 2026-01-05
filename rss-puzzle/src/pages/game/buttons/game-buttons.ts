import { manageCheckButton } from './check-button';
import { transformCheckButton } from './check-button-functions';
import { Routes } from '../../../app/routes';
import { createButton } from '../../../components/button/button';
import { autoComplete } from '../../../utils/auto-complete';
import { hintState } from '../hints/hint-state';
import { eventState } from '../state/event-state';
import { gameState } from '../state/game-state';
import { resultsState } from '../state/results-state';

import type { AppRouter } from '../../../app/app-router';
import type { GameUI } from '../game-ui';

export function createGameButtons(props: GameUI, router: AppRouter): HTMLButtonElement {
  const backButton = createButton({ text: 'Back' });

  backButton.addEventListener('click', () => {
    eventState.emit('audio:reset', '');
    router.navigate(Routes.START);
  });

  props.checkButton.addEventListener('click', () => {
    manageCheckButton(props);
  });

  props.autoCompleteButton.addEventListener('click', () => {
    resultsState.addSentence({
      text: gameState.correctSentence.join(' '),
      audioSource: gameState.audioSource,
      isKnown: false,
    });

    autoComplete(props);
    gameState.isCompleted = true;

    transformCheckButton(props.checkButton);

    if (hintState.getMode('translation') === 'disabled') {
      eventState.emit('hint:translation:toggle', 'enabled');
    }

    if (hintState.getMode('audio') === 'disabled') {
      eventState.emit('hint:audio:toggle', 'enabled');
    }

    if (hintState.getMode('image') === 'disabled') {
      eventState.emit('hint:image:toggle', 'enabled');
    }
  });

  return backButton;
}
