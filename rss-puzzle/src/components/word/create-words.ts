import { createWord } from './word';
import { gameState } from '../../pages/game/state/game-state';
import { designPuzzles } from '../../utils/design-puzzles';
import { dragAndDrop } from '../../utils/drag-and-drop';
import { setPuzzleBackground } from '../../utils/set-puzzle-background';
import { shuffleWords, fixWordWidth } from '../../utils/word-helpers';

import type { Word } from '../../types/types';

export function createWords(
  sentence: Word,
  source: HTMLElement,
  resultSentence: HTMLElement,
  placeholder: HTMLElement,
  correctSentence: string[],
  checkButton: HTMLButtonElement,
): void {
  const words = sentence.textExample.split(' ').map((word, index) => ({
    id: index,
    word,
  }));

  const cards = shuffleWords(words);

  cards.forEach((word) => {
    const wordWrapper = createWord(
      word.word,
      word.id,
      source,
      resultSentence,
      placeholder,
      correctSentence,
      checkButton,
    );

    const card = [...wordWrapper.children].find(
      (element): element is HTMLElement =>
        element instanceof HTMLElement && element.classList.contains('word'),
    );

    if (!card) {
      return;
    }

    designPuzzles(wordWrapper, card, word.word, correctSentence);

    dragAndDrop(wordWrapper, source, resultSentence, placeholder, correctSentence, checkButton);

    source.append(wordWrapper);

    requestAnimationFrame(() => {
      fixWordWidth(wordWrapper);
      if (gameState.levelImage) {
        setPuzzleBackground({
          wrapper: wordWrapper,
          index: word.id,
          correctSentence,
        });
      }
    });
  });
}
