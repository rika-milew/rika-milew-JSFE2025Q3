import { moveWords } from './animation-helpers';
import { highlightCorrectSentence } from './check-sentence';

export function autoComplete(
  userSentence: HTMLElement,
  source: HTMLElement,
  correctSentence: string[],
  placeholder: HTMLElement,
  autoCompleteButton: HTMLButtonElement,
): void {
  autoCompleteButton.disabled = true;

  const ANIMATION_DELAY = 450;

  if (userSentence.contains(placeholder)) {
    placeholder.remove();
  }

  const wordCards = [
    ...userSentence.querySelectorAll<HTMLElement>('.word-wrapper'),
    ...source.querySelectorAll<HTMLElement>('.word-wrapper'),
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
      moveWords(wordCard, userSentence);
      wordCard.classList.add('word-wrapper_result');
    }
  });

  setTimeout(() => {
    highlightCorrectSentence(userSentence);
  }, ANIMATION_DELAY);
}
