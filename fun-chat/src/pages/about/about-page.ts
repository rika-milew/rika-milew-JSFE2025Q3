import { createElement } from '@/utils/create-element';

export function renderAboutPage(container: HTMLElement): void {
  const pageContainer = createElement({
    tag: 'div',
    className: ['container'],
  });

  const title = createElement({
    tag: 'h1',
    textContent: 'About Page',
    className: ['page-title'],
  });

  container.replaceChildren();
  pageContainer.append(title);
  container.append(pageContainer);
}
