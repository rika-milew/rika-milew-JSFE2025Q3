import { createElement } from '../utils/create-element';

export function createGarage(): void {
  const title = createElement({
    tag: 'h2',
    textContent: 'Garage',
  });
  document.body.append(title);
}
