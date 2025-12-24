import { Routes } from '../../app/routes';
import { createButton } from '../../components/button/button';
import { createHeading } from '../../components/heading/heading';
import { showLogoutModal } from '../../components/modal/Modal';
import { START_PAGE_TEXT } from '../../configs/text.config';
import { isUser } from '../../types/type-guards';
import { clearContainer } from '../../utils/clear-container';
import { createElement } from '../../utils/create-element';
import { setBodyBackground } from '../../utils/set-body-background';

import type { AppRouter } from '../../app/app-router';

import './start-page.css';

export function createStartPage(container: HTMLElement, router: AppRouter): HTMLDivElement {
  clearContainer(container);
  setBodyBackground('start-page');

  const startContainer = createElement({
    tag: 'div',
    className: 'start',
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

export function createGreeting(container: HTMLElement): HTMLDivElement | undefined {
  const savedUser = localStorage.getItem('user');
  if (!savedUser) {
    return undefined;
  }

  try {
    const parsed: unknown = JSON.parse(savedUser);
    if (!isUser(parsed)) {
      return undefined;
    }

    const { firstName, surname } = parsed;

    if (!firstName.trim() || !surname.trim()) {
      return undefined;
    }

    const greeting = createElement({
      tag: 'div',
      className: 'start__greeting',
      textContent: `Hello, ${parsed.firstName} ${parsed.surname}!`,
    });

    container.append(greeting);
    return greeting;
  } catch {
    return undefined;
  }
}
