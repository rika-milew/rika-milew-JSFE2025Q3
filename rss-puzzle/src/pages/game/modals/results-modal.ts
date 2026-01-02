import { createModal } from '../../../components/modal/modal';
import { createElement } from '../../../utils/create-element';
import { eventState } from '../event-state';
import { displayMiniature } from './artwork-miniature';
import { gameState } from '../game-state';

import './results-modal.css';

export function openResultsModal(
  container: HTMLElement,
  // stats: RoundStats,
): void {
  const content = createElement({
    tag: 'div',
    className: 'results',
  });

  const title = createElement({
    tag: 'h2',
    className: 'results__title',
    textContent: 'Round Statistics',
  });

  content.append(title);

  if (gameState.cutImage) {
    const artworkMiniature = displayMiniature();
    content.append(artworkMiniature);
  }

  createModal({
    container,
    content,
    modalClassName: 'results-modal',
    buttons: [
      {
        text: 'Continue',
        className: 'results__continue',
        onClick: (): void => {
          eventState.emit('results:open', true);
        },
      },
      {
        text: 'Cancel',
        className: 'results__details',
      },
    ],
  });
}
