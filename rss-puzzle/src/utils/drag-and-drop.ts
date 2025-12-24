import { updateGameState, updateResultPlaceholder } from '../pages/game/game-controller';

export function implementDragAndDrop(
  wordWrapper: HTMLElement,
  sourceContainer: HTMLElement,
  activeResultSentence: HTMLElement,
  resultPlaceholder: HTMLElement,
  correctSentence: string[],
  checkButton: HTMLButtonElement,
): void {
  wordWrapper.setAttribute('draggable', 'true');

  wordWrapper.addEventListener('dragstart', (event: DragEvent) => {
    event.dataTransfer?.setData('text/plain', wordWrapper.textContent || '');
    wordWrapper.classList.add('dragging');
  });

  wordWrapper.addEventListener('dragend', () => {
    wordWrapper.classList.remove('dragging');
    if (wordWrapper.parentElement !== activeResultSentence) {
      sourceContainer.append(wordWrapper);
      wordWrapper.classList.remove('word-wrapper_result');
    }
    updateResultPlaceholder(activeResultSentence, resultPlaceholder);
  });

  [sourceContainer, activeResultSentence].forEach((container) => {
    container.addEventListener('dragover', (event: DragEvent) => {
      event.preventDefault();
      container.classList.add('container_drag-over');

      const wordDragging = document.querySelector<HTMLElement>('.dragging');
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

      wordDragging.classList.toggle('word-wrapper_result', container === activeResultSentence);
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

      const wordDragging = document.querySelector<HTMLElement>('.dragging');

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

  wordWrapper.addEventListener('touchstart', (event: TouchEvent) => {
    draggedWord = wordWrapper;
    const touch = event.touches[0];
    const rect = wordWrapper.getBoundingClientRect();
    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;

    wordWrapper.classList.add('mobile-dragging');
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

    const sentenceRect = activeResultSentence.getBoundingClientRect();

    const isValidTarget = touch.clientY >= sentenceRect.top && touch.clientY <= sentenceRect.bottom;

    const targetContainer = isValidTarget ? activeResultSentence : sourceContainer;

    const wordWrappers = [
      ...targetContainer.querySelectorAll<HTMLElement>('.word-wrapper:not(.dragging)'),
    ];

    let dragged = false;

    for (const wordWrapper of wordWrappers) {
      const rect = wordWrapper.getBoundingClientRect();
      if (touch.clientX < rect.left + rect.width / 2) {
        wordWrapper.before(draggedWord);
        dragged = true;
        break;
      }
    }

    if (!dragged) {
      targetContainer.append(draggedWord);
    }

    draggedWord.classList.toggle('word-wrapper_result', targetContainer === activeResultSentence);
    draggedWord.style.top = '';
    draggedWord.style.left = '';

    wordWrapper.classList.remove('mobile-dragging');

    draggedWord = undefined;

    updateGameState(activeResultSentence, resultPlaceholder, correctSentence, checkButton);
  });
}

function findWordPosition(container: HTMLElement, x: number): HTMLElement | undefined {
  const draggableWords = [
    ...container.querySelectorAll<HTMLElement>('.word-wrapper:not(.dragging)'),
  ];

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
