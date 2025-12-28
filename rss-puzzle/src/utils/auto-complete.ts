import { moveWords } from './animation-helpers';
import { highlightCorrectSentence } from './check-sentence';
import { gameState } from '../pages/game/game-state';

import type { GameUI } from '../pages/game/game-ui';

export function autoComplete(props: GameUI): void {
  const { userSentence, source, placeholder, autoCompleteButton } = props;

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

  gameState.correctSentence.forEach((word) => {
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
