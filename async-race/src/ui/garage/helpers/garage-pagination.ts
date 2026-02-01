import { createElement } from '@/utils/create-element';

import type { PaginationElements, PaginationCallbacks } from '@/types/types';

export function implementPagination({ onPrev, onNext }: PaginationCallbacks): PaginationElements {
  const paginationContainer: HTMLDivElement = createElement({
    tag: 'div',
    className: ['pagination'],
  });

  const previousButton: HTMLButtonElement = createElement({
    tag: 'button',
    className: ['prev-button'],
    textContent: 'Prev',
  });
  const nextButton: HTMLButtonElement = createElement({
    tag: 'button',
    className: ['next-button'],
    textContent: 'Next',
  });

  previousButton.addEventListener('click', onPrev);
  nextButton.addEventListener('click', onNext);

  paginationContainer.append(previousButton, nextButton);

  return { paginationContainer, previousButton, nextButton };
}
