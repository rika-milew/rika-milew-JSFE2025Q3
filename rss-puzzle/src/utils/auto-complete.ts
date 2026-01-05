import { moveWords } from './animation-helpers';
import { highlightCorrectSentence } from './check-sentence';
import { gameState } from '../pages/game/state/game-state';

import type { GameUI } from '../pages/game/game-ui';

export function autoComplete(props: GameUI): void {
  const { userSentence, source, placeholder, autoCompleteButton } = props;

  autoCompleteButton.disabled = true;

  const ANIMATION_DELAY = 450;

  if (userSentence.contains(placeholder)) {
    placeholder.remove();
  }

  const wordCards = [
    ...[...userSentence.children].filter(
      (element): element is HTMLElement =>
        element instanceof HTMLElement && element.classList.contains('word-wrapper'),
    ),
    ...[...source.children].filter(
      (element): element is HTMLElement =>
        element instanceof HTMLElement && element.classList.contains('word-wrapper'),
    ),
  ];

  gameState.correctSentenceIndexes.forEach((index) => {
    const wordCard = wordCards.find((card) => Number(card.dataset.wordIndex) === index);

    if (wordCard) {
      moveWords(wordCard, userSentence);
      wordCard.classList.add('word-wrapper_result');
    }
  });

  setTimeout(() => {
    highlightCorrectSentence(userSentence);
  }, ANIMATION_DELAY);
}
