import { updateGameState, updateResultPlaceholder } from '../pages/game/game-controller';

export function implementDragAndDrop(
  wordCard: HTMLElement,
  sourceContainer: HTMLElement,
  activeResultSentence: HTMLElement,
  resultPlaceholder: HTMLElement,
  correctSentence: string[],
  checkButton: HTMLButtonElement,
): void {
  wordCard.setAttribute('draggable', 'true');

  wordCard.addEventListener('dragstart', (event: DragEvent) => {
    event.dataTransfer?.setData('text/plain', wordCard.textContent || '');
    wordCard.classList.add('word_dragging');
  });

  wordCard.addEventListener('dragend', () => {
    wordCard.classList.remove('word_dragging');
    if (wordCard.parentElement !== activeResultSentence) {
      sourceContainer.append(wordCard);
      wordCard.classList.remove('word_result');
    }
    updateResultPlaceholder(activeResultSentence, resultPlaceholder);
  });

  [sourceContainer, activeResultSentence].forEach((container) => {
    container.addEventListener('dragover', (event: DragEvent) => {
      event.preventDefault();
      container.classList.add('container_drag-over');

      const wordDragging = document.querySelector<HTMLElement>('.word_dragging');
      if (!wordDragging) {
        return;
      }

      const wordAfter = findWordPosition(container, event.clientX);
      if (wordAfter) {
        wordAfter.before(wordDragging);
      } else if (container.children.length === 0) {
        container.prepend(wordDragging);
      } else {
        container.append(wordDragging);
      }

      wordDragging.classList.toggle('word_result', container === activeResultSentence);
    });

    container.addEventListener('dragleave', () => {
      container.classList.remove('container_drag-over');
    });

    container.addEventListener('drop', (event: DragEvent) => {
      event.preventDefault();

      const draggedWord = document.querySelector<HTMLElement>('.dragging');

      if (!draggedWord) {
        throw new Error('Dragged word is not found');
      }

      if (draggedWord.parentElement !== activeResultSentence) {
        sourceContainer.append(draggedWord);
        draggedWord.classList.remove('word_result');
        updateResultPlaceholder(activeResultSentence, resultPlaceholder);
      }

      container.classList.remove('container_drag-over');

      const wordDragging = document.querySelector<HTMLElement>('.word_dragging');

      if (!wordDragging) {
        return;
      }

      if (!container.contains(wordDragging)) {
        container.append(wordDragging);
      }

      updateGameState(activeResultSentence, resultPlaceholder, correctSentence, checkButton);
    });
  });

  let draggedWord: HTMLElement | undefined = undefined;
  let offsetX = 0;
  let offsetY = 0;

  wordCard.addEventListener('touchstart', (event: TouchEvent) => {
    draggedWord = wordCard;
    const touch = event.touches[0];
    const rect = wordCard.getBoundingClientRect();
    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;

    wordCard.classList.add('word_mobile-dragging');
  });

  document.addEventListener('touchmove', (event: TouchEvent) => {
    if (!draggedWord) {
      return;
    }
    const touch = event.touches[0];

    draggedWord.style.left = `${touch.clientX - offsetX}px`;
    draggedWord.style.top = `${touch.clientY - offsetY}px`;
  });

  document.addEventListener('touchend', (event: TouchEvent) => {
    if (!draggedWord) {
      return;
    }

    const touch = event.changedTouches[0];

    const sentenceRect = activeResultSentence.getBoundingClientRect();
    const isValidTarget = touch.clientY >= sentenceRect.top && touch.clientY <= sentenceRect.bottom;

    const targetContainer = isValidTarget ? activeResultSentence : sourceContainer;

    const wordCards = [...targetContainer.querySelectorAll<HTMLElement>('.word:not(.dragging)')];

    let dragged = false;

    for (const wordCard of wordCards) {
      const rect = wordCard.getBoundingClientRect();
      if (touch.clientX < rect.left + rect.width / 2) {
        wordCard.before(draggedWord);
        dragged = true;
        break;
      }
    }

    if (!dragged) {
      targetContainer.append(draggedWord);
    }

    draggedWord.classList.toggle('word_result', targetContainer === activeResultSentence);

    wordCard.classList.remove('word_mobile-dragging');

    draggedWord = undefined;

    updateGameState(activeResultSentence, resultPlaceholder, correctSentence, checkButton);
  });
}

function findWordPosition(container: HTMLElement, x: number): HTMLElement | undefined {
  const draggableWords = [...container.querySelectorAll<HTMLElement>('.word:not(.word_dragging)')];

  let closestWord: HTMLElement | undefined;
  let closestOffset = Number.NEGATIVE_INFINITY;

  for (const word of draggableWords) {
    const container = word.getBoundingClientRect();
    const offset = x - container.left - container.width / 2;

    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset;
      closestWord = word;
    }
  }

  return closestWord;
}
