import { clearContainer } from './clear-container';
import { createElement } from './create-element';
import { gameState } from '../pages/game/state/game-state';

export function revealImage(result: HTMLElement): void {
  result.classList.add('revealed');
  result.style.setProperty('--image', `url(pictures/${gameState.levelImage})`);

  const imageInfo = addImageInfo();

  result.append(imageInfo);

  imageInfo.classList.add('visible');
}

export function hideImage(result: HTMLElement): void {
  result.classList.remove('revealed');
  result.style.removeProperty('--image');
  clearContainer(result);
}

export function addImageInfo(): HTMLElement {
  const container = createElement({
    tag: 'div',
    className: 'image-info',
  });

  const title = createElement({
    tag: 'div',
    className: 'image-info__title',
  });

  const author = createElement({
    tag: 'div',
    className: 'image-info__author',
  });

  title.textContent = gameState.imageName;
  author.textContent = `${gameState.author} , ${gameState.year}`;

  container.append(title, author);

  return container;
}
