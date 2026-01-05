import { eventState } from '../state/event-state';
import { gameState } from '../state/game-state';

export function updateCheckButtonState(
  activeResultSentence: HTMLElement,
  checkButton: HTMLButtonElement,
  sentenceLength: number,
): void {
  const resultWords = [...activeResultSentence.children].filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child.classList.contains('word-wrapper'),
  ).length;

  checkButton.disabled = resultWords === sentenceLength ? false : true;
}

export function transformCheckButton(checkButton: HTMLButtonElement): void {
  checkButton.textContent = 'Continue';
  checkButton.classList.add('game__continue-button');
  checkButton.disabled = false;

  const LAST_SENTENCE = 9;

  if (gameState.sentenceIndex === LAST_SENTENCE) {
    eventState.emit('round:completed', true);
  }
}

export function resetCheckButton(checkButton: HTMLButtonElement): void {
  checkButton.textContent = 'Check';
  checkButton.classList.remove('game__continue-button');
  checkButton.disabled = true;
}
