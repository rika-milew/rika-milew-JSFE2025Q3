import { createModal } from '../../../components/modal/modal';
import { createElement } from '../../../utils/create-element';
import { eventState } from '../event-state';

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
    textContent: 'Round Statistics',
  });

  content.append(title);

  createModal({
    container,
    content,
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
