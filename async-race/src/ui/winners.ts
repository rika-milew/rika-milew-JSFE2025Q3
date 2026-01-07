import { createElement } from '../utils/create-element';

export function createWinners(): void {
  const title = createElement({
    tag: 'h2',
    textContent: 'Winners',
  });
  document.body.append(title);
}
