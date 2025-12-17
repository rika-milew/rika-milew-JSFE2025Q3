import { showLogoutModal } from '../../components/Modal';
import { clearContainer } from '../../utils/clearContainer';
import { createElement } from '../../utils/createElement';

import type { AppRouter } from '../../app/AppRouter';

function createLogoutButton(text: string): HTMLButtonElement {
  return createElement({
    tag: 'button',
    className: 'logout-button button',
    textContent: text,
    attributes: {
      type: 'button',
    },
  });
}

export function createStartPage(container: HTMLElement, router: AppRouter): HTMLDivElement {
  clearContainer(container);
  const buttonContainer = createElement({
    tag: 'div',
    className: 'start-screen__buttons',
  });

  const logoutButton = createLogoutButton('Logout');

  logoutButton.addEventListener('click', () => {
    showLogoutModal(container, () => {
      router.logout();
    });
  });

  buttonContainer.append(logoutButton);
  container.append(buttonContainer);

  return buttonContainer;
}
