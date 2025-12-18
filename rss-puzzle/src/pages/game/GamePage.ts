import { Routes } from '../../app/routes';
import { clearContainer } from '../../utils/clearContainer';
import { createElement } from '../../utils/createElement';
import { setBodyBackground } from '../../utils/setBodyBackground';

import type { AppRouter } from '../../app/AppRouter';

function createLogoutButton(text: string): HTMLButtonElement {
  return createElement({
    tag: 'button',
    className: 'game__back-button button',
    textContent: text,
    attributes: {
      type: 'button',
    },
  });
}

export function createGamePage(container: HTMLElement, router: AppRouter): HTMLDivElement {
  clearContainer(container);
  setBodyBackground('game-page');

  const gameContainer = createElement({
    tag: 'div',
    className: 'game',
  });

  const backButton = createLogoutButton('Back');

  backButton.addEventListener('click', () => {
    router.navigate(Routes.START);
  });

  gameContainer.append(backButton);
  container.append(gameContainer);

  return gameContainer;
}
