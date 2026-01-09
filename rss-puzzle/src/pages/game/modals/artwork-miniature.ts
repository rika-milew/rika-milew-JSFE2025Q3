import { createElement } from '../../../utils/create-element';
import { gameState } from '../state/game-state';

export function displayMiniature(): HTMLElement {
  const container = createElement({
    tag: 'div',
    className: 'miniature',
  });

  const BASE_URL =
    'https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/images/';

  const artwork = createElement({
    tag: 'img',
    className: 'miniature__image',
    attributes: {
      src: `${BASE_URL}${gameState.levelImage}`,
      alt: gameState.imageName,
    },
  });

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
