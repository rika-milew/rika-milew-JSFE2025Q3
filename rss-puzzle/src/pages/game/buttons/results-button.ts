import { createButton } from '../../../components/button/button';
import { eventState } from '../event-state';

let currentResultsButton: HTMLButtonElement | undefined;

export function showResultsButton(gameButtons: HTMLElement, gameContainer: HTMLElement): void {
  if (currentResultsButton) {
    currentResultsButton.remove();
    currentResultsButton = undefined;
  }

  const resultsButton = createButton({
    text: 'Results',
    className: 'result-button',
  });

  resultsButton.classList.add('visible');
  resultsButton.addEventListener('click', () => {
    eventState.emit('results:open', gameContainer);
  });

  gameButtons.append(resultsButton);
  currentResultsButton = resultsButton;
}

export function hideResultsButton(): void {
  if (currentResultsButton) {
    currentResultsButton.remove();
    currentResultsButton = undefined;
  }
}
