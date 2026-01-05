import { findWordPosition } from './find-word-position';
import { dragAndDropMobile } from './mobile-drag-and-drop';
import { updateGameState } from '../../pages/game/levels/game-steps';
import { playSound } from '../play-sounds';
import { updateResultPlaceholder } from '../update-placeholder';

export function dragAndDrop(
  word: HTMLElement,
  source: HTMLElement,
  userSentence: HTMLElement,
  placeholder: HTMLElement,
  correctSentence: string[],
  checkButton: HTMLButtonElement,
): void {
  word.setAttribute('draggable', 'true');

  word.addEventListener('dragstart', (event: DragEvent) => {
    if (word.classList.contains('correct')) {
      event.preventDefault();
      return;
    }
    event.dataTransfer?.setData('text/plain', word.textContent || '');
    word.classList.add('dragging');
  });

  word.addEventListener('dragend', () => {
    word.classList.remove('dragging');

    if (word.parentElement !== userSentence) {
      source.append(word);
      word.classList.remove('word-wrapper_result');
    }

    updateResultPlaceholder(userSentence, placeholder);
  });

  [source, userSentence].forEach((container) => {
    container.addEventListener('dragover', (event: DragEvent) => {
      event.preventDefault();
      container.classList.add('container_drag-over');

      const wordDragging = [...document.getElementsByClassName('dragging')].find(
        (element): element is HTMLElement => element instanceof HTMLElement,
      );

      if (!wordDragging) {
        return;
      }

      const wordAfter = findWordPosition(container, event.clientX);

      if (wordAfter) {
        wordAfter.before(wordDragging);
      } else {
        container.append(wordDragging);
      }

      wordDragging.classList.toggle('word-wrapper_result', container === userSentence);
    });

    container.addEventListener('dragleave', () => {
      container.classList.remove('container_drag-over');
    });

    container.addEventListener('drop', (event: DragEvent) => {
      event.preventDefault();

      const draggedWord = [...document.getElementsByClassName('dragging')].find(
        (element): element is HTMLElement => element instanceof HTMLElement,
      );

      if (!draggedWord) {
        throw new Error('Dragged word is not found');
      }

      if (draggedWord.parentElement !== userSentence) {
        source.append(draggedWord);
        draggedWord.classList.remove('word_result');
        updateResultPlaceholder(userSentence, placeholder);
      }

      container.classList.remove('container_drag-over');

      const wordDragging = [...document.getElementsByClassName('dragging')].find(
        (element): element is HTMLElement => element instanceof HTMLElement,
      );

      if (!wordDragging) {
        return;
      }

      if (!container.contains(wordDragging)) {
        container.append(wordDragging);
      }

      if (!word.classList.contains('correct')) {
        updateGameState(userSentence, placeholder, correctSentence, checkButton);
      }

      playSound('move');
    });
  });

  dragAndDropMobile(word, source, userSentence, placeholder, correctSentence, checkButton);
}
