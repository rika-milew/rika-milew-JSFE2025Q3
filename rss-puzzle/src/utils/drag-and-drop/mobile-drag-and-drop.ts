import { updateGameState } from '../../pages/game/levels/game-steps';

export function dragAndDropMobile(
  word: HTMLElement,
  source: HTMLElement,
  userSentence: HTMLElement,
  placeholder: HTMLElement,
  correctSentence: string[],
  checkButton: HTMLButtonElement,
): void {
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
