import { updateResultPlaceholder } from './update-placeholder';
import { updateGameState } from '../pages/game/levels/game-steps';

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
    });
  });

  let draggedWord: HTMLElement | undefined = undefined;
  let offsetX = 0;
  let offsetY = 0;

  word.addEventListener('touchstart', (event: TouchEvent) => {
    if (word.classList.contains('correct')) {
      return;
    }

    draggedWord = word;
    const touch = event.touches[0];
    const rect = word.getBoundingClientRect();
    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;

    word.classList.add('mobile-dragging');
  });

  document.addEventListener('touchmove', (event: TouchEvent) => {
    if (!draggedWord) {
      return;
    }

    event.preventDefault();
    const touch = event.touches[0];

    draggedWord.style.left = `${touch.clientX - offsetX}px`;
    draggedWord.style.top = `${touch.clientY - offsetY}px`;
  });

  document.addEventListener('touchend', (event: TouchEvent) => {
    if (!draggedWord) {
      return;
    }

    const touch = event.changedTouches[0];

    const sentenceRect = userSentence.getBoundingClientRect();
    const isValidTarget = touch.clientY >= sentenceRect.top && touch.clientY <= sentenceRect.bottom;
    const targetContainer = isValidTarget ? userSentence : source;

    const words = [...targetContainer.children].filter(
      (child): child is HTMLElement =>
        child instanceof HTMLElement &&
        child.classList.contains('word-wrapper') &&
        !child.classList.contains('dragging'),
    );

    let dragged = false;

    for (const word of words) {
      const rect = word.getBoundingClientRect();
      if (touch.clientX < rect.left + rect.width / 2) {
        word.before(draggedWord);
        dragged = true;
        break;
      }
    }

    if (!dragged) {
      targetContainer.append(draggedWord);
    }

    draggedWord.classList.toggle('word-wrapper_result', targetContainer === userSentence);
    draggedWord.style.top = '';
    draggedWord.style.left = '';

    word.classList.remove('mobile-dragging');

    draggedWord = undefined;

    updateGameState(userSentence, placeholder, correctSentence, checkButton);
  });
}

function findWordPosition(container: HTMLElement, x: number): HTMLElement | undefined {
  const draggableWords = [...container.children].filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement &&
      child.classList.contains('word-wrapper') &&
      !child.classList.contains('dragging') &&
      !child.classList.contains('correct'),
  );

  for (const word of draggableWords) {
    const rect = word.getBoundingClientRect();
    if (x < rect.left + rect.width / 2) {
      return word;
    }
  }

  return undefined;
}
