import { createElement } from '@/utils/create-element';

export function renderAboutPage(container: HTMLElement): void {
  const title = createElement({
    tag: 'h1',
    textContent: 'About Page',
    className: ['page-title'],
  });

  container.replaceChildren();
  container.append(title);
}
