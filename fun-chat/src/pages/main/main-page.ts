import { createElement } from '@/utils/create-element';

export function renderMainPage(container: HTMLElement): void {
  const title = createElement({
    tag: 'h1',
    textContent: 'Main Page',
    className: ['page-title'],
  });

  container.replaceChildren();
  container.append(title);
}
