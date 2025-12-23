import { moveWordCards } from './animationHelpers';
import { highlightCorrectSentence } from './checkSentence.ts';

export function startAutoComplete(
  activeResultSentence: HTMLElement,
  sourceContainer: HTMLElement,
  correctSentence: string[],
  resultPlaceholder: HTMLElement,
  autoCompleteButton: HTMLButtonElement,
): void {
  autoCompleteButton.disabled = true;

  const ANIMATION_DELAY = 450;

  if (activeResultSentence.contains(resultPlaceholder)) {
    resultPlaceholder.remove();
  }

  const wordCards = [
    ...activeResultSentence.querySelectorAll<HTMLElement>('.word'),
    ...sourceContainer.querySelectorAll<HTMLElement>('.word'),
  ];

  const wordMap = new Map<string, HTMLElement[]>();
  wordCards.forEach((wordCard) => {
    const word = wordCard.textContent || '';
    if (!wordMap.has(word)) {
      wordMap.set(word, []);
    }
    wordMap.get(word)?.push(wordCard);
  });

  correctSentence.forEach((word) => {
    const wordCard = wordMap.get(word)?.shift();
    if (wordCard) {
      moveWordCards(wordCard, activeResultSentence);
      wordCard.classList.add('word_result');
    }
  });

  setTimeout(() => {
    highlightCorrectSentence(activeResultSentence);
  }, ANIMATION_DELAY);
}
