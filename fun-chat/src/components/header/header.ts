import { navigate } from '@/app/router';
import { createButton } from '@/components/button/button';
import { logout } from '@/pages/login/helpers/auth-requests';
import { createElement } from '@/utils/create-element';

import './header.css';

export function createHeader(page: string): HTMLElement {
  const header: HTMLElement = createElement({ tag: 'header', className: ['header'] });

  const title: HTMLHeadingElement = createElement({
    tag: 'h2',
    className: ['header__title'],
    textContent: 'Fun Chat',
  });

  const buttons: HTMLDivElement = createElement({ tag: 'div', className: ['header__buttons'] });

  if (page === 'main') {
    const logoutButton: HTMLButtonElement = createButton({
      text: 'Logout',
    });

    logoutButton.addEventListener('click', () => {
      logout();
    });

    const aboutButton: HTMLButtonElement = createButton({
      text: 'About',
    });

    aboutButton.addEventListener('click', () => {
      navigate('about', document.body);
    });

    buttons.append(logoutButton, aboutButton);
  } else if (page === 'about') {
    const backButton: HTMLButtonElement = createButton({
      text: 'Back',
    });

    backButton.addEventListener('click', () => {
      history.back();
    });

    buttons.append(backButton);
  }

  header.append(title, buttons);
  return header;
}
