import { showLogoutModal } from '../../components/Modal';
import { clearContainer } from '../../utils/clearContainer';
import { createElement } from '../../utils/createElement';
import { setBodyBackground } from '../../utils/setBodyBackground';

import type { AppRouter } from '../../app/AppRouter';

import './StartPage.css';

function createLogoutButton(text: string): HTMLButtonElement {
  return createElement({
    tag: 'button',
    className: 'start__logout-button button',
    textContent: text,
    attributes: {
      type: 'button',
    },
  });
}

export function createStartPage(container: HTMLElement, router: AppRouter): HTMLDivElement {
  clearContainer(container);
  setBodyBackground('start-page');

  const startContainer = createElement({
    tag: 'div',
    className: 'start',
  });

  const heading = createElement({
    tag: 'h1',
    className: 'start__heading',
    textContent: 'RSS Puzzle',
  });

  const description = createElement({
    tag: 'p',
    className: 'start__description',
    textContent: `RSS Puzzle is a language learning mini-game where you assemble 
      sentences from mixed-up words. Train your English, solve puzzles, and enjoy a thoughtful, 
      visual gameplay experience.`,
  });

  const buttonContainer = createElement({
    tag: 'div',
    className: 'start__buttons',
  });

  const logoutButton = createLogoutButton('Log out');

  logoutButton.addEventListener('click', () => {
    showLogoutModal(container, () => {
      router.logout();
    });
  });

  startContainer.append(heading, description);
  buttonContainer.append(logoutButton);
  startContainer.append(buttonContainer);
  container.append(startContainer);

  return startContainer;
}
