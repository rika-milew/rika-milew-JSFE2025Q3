import { eventState } from '../event-state';

export function showResultsButton(resultsButton: HTMLButtonElement): void {
  resultsButton.classList.add('visible');

  resultsButton.addEventListener('click', () => {
    eventState.emit('results:open', true);
  });
}

export function hideResultsButton(resultsButton: HTMLButtonElement): void {
  resultsButton.classList.remove('visible');
}
