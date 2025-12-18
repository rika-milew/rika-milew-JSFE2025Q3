import { Routes } from '../../app/routes';
import { showLogoutModal } from '../../components/Modal';
import { isUser } from '../../types/typeGuards';
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

function createStartButton(text: string): HTMLButtonElement {
  return createElement({
    tag: 'button',
    className: 'start__game-button button',
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
  const startButton = createStartButton('Start');

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
