import { createElement } from '@/utils/create-element';

export function renderAuthPage(container: HTMLElement): void {
  const title = createElement({
    tag: 'h1',
    textContent: 'Authentication Page',
    className: ['page-title'],
  });

  container.replaceChildren();
  container.append(title);
}
