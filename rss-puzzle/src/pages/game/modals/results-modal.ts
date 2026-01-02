import { createModal } from '../../../components/modal/modal';
import { createElement } from '../../../utils/create-element';
import { eventState } from '../event-state';
import { displayMiniature } from './artwork-miniature';
import { gameState } from '../game-state';

import './results-modal.css';

let currentResultsModal: HTMLElement | undefined;

export function openResultsModal(
  container: HTMLElement,
  // stats: RoundStats,
): void {
  if (currentResultsModal) {
    currentResultsModal.remove();
    currentResultsModal = undefined;
  }

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

  currentResultsModal = createModal({
    container,
    content,
    modalClassName: 'results-modal',
    buttons: [
      {
        text: 'Next Round',
        className: 'results__button',
        onClick: (): void => {
          eventState.emit('round:next', true);
        },
      },
    ],
  });
}
