import { createGreeting } from './create-greeting';
import { showLogoutModal } from './logout-modal';
import { Routes } from '../../app/routes';
import { createButton } from '../../components/button/button';
import { createHeading } from '../../components/heading/heading';
import { START_PAGE_TEXT } from '../../configs/text.config';
import { clearContainer } from '../../utils/clear-container';
import { createElement } from '../../utils/create-element';
import { setBackground } from '../../utils/set-background';

import type { AppRouter } from '../../app/app-router';

import './start-page.css';

export function createStartPage(container: HTMLElement, router: AppRouter): HTMLDivElement {
  clearContainer(container);
  setBackground('start-page');

  const startContainer = createElement({
    tag: 'div',
    className: ['start', 'page'],
  });

  const heading = createHeading('startPage', START_PAGE_TEXT.content.title);

  const description = createElement({
    tag: 'p',
    className: 'start__description',
    textContent: START_PAGE_TEXT.content.description,
  });

  const buttonContainer = createElement({
    tag: 'div',
    className: 'start__buttons',
  });

  const logoutButton = createButton({
    text: 'Log out',
  });

  const startButton = createButton({
    text: 'Start',
  });

  logoutButton.addEventListener('click', () => {
    showLogoutModal(container, () => {
      router.logout();
    });
  });

  startButton.addEventListener('click', () => {
    router.navigate(Routes.GAME);
  });

  createGreeting(startContainer);

  startContainer.append(heading, description);
  buttonContainer.append(startButton, logoutButton);
  startContainer.append(buttonContainer);
  container.append(startContainer);

  return startContainer;
}
