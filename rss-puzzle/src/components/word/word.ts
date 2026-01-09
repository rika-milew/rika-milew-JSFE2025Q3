import { hintState } from '../../pages/game/hints/hint-state';
import { updateGameState } from '../../pages/game/levels/game-steps';
import { moveWords } from '../../utils/animation-helpers';
import { createElement } from '../../utils/create-element';

import './word.css';

export function createWord(
  word: string,
  id: number,
  source: HTMLElement,
  resultSentence: HTMLElement,
  placeholder: HTMLElement,
  correctSentence: string[],
  checkButton: HTMLButtonElement,
): HTMLElement {
  const wordWrapper = createElement({
    tag: 'div',
    className: 'word-wrapper',
  });

  wordWrapper.dataset.wordIndex = String(id);

  const wordCard = createElement({
    tag: 'div',
    className: 'sentence__word word',
    textContent: word,
  });

  const length = word.length;
  wordWrapper.style.setProperty('--grow', String(length));

  if (hintState.getMode('image') === 'enabled') {
    wordWrapper.classList.add('background');
  }

  wordWrapper.append(wordCard);

  wordWrapper.addEventListener('click', () => {
    const isInSourceContainer = wordWrapper.parentElement === source;
    if (isInSourceContainer) {
      moveWords(wordWrapper, resultSentence);
      wordWrapper.classList.add('word-wrapper_result');
    } else {
      moveWords(wordWrapper, source);
      wordWrapper.classList.remove('word-wrapper_result');
    }

    updateGameState(resultSentence, placeholder, correctSentence, checkButton);
  });

  return wordWrapper;
}
