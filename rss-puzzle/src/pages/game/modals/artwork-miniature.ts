import { createElement } from '../../../utils/create-element';
import { gameState } from '../game-state';

export function displayMiniature(): HTMLElement {
  const container = createElement({
    tag: 'div',
    className: 'miniature',
  });

  const artwork = createElement({
    tag: 'div',
    className: 'miniature__image',
  });

  artwork.style.backgroundImage = `url(/pictures/${gameState.cutImage})`;

  const title = createElement({
    tag: 'div',
    className: 'miniature__title',
    textContent: gameState.imageName,
  });

  const author = createElement({
    tag: 'div',
    className: 'miniature__author',
    textContent: `${gameState.author}, ${gameState.year}`,
  });

  container.append(artwork, title, author);

  return container;
}
