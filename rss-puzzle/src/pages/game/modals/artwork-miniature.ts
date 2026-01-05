import { createElement } from '../../../utils/create-element';
import { gameState } from '../state/game-state';

export function displayMiniature(): HTMLElement {
  const container = createElement({
    tag: 'div',
    className: 'miniature',
  });

  const artwork = createElement({
    tag: 'img',
    className: 'miniature__image',
    attributes: {
      src: `/pictures/${gameState.levelImage}`,
      alt: gameState.imageName,
    },
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
    textContent: gameState.author,
  });

  const year = createElement({
    tag: 'div',
    className: 'miniature__year',
    textContent: gameState.year,
  });

  container.append(artwork, title, author, year);

  return container;
}
