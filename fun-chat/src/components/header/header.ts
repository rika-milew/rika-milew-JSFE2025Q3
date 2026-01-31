import { navigate } from '@/app/router';
import { createButton } from '@/components/button/button';
import { handleLogout } from '@/pages/main/helpers/handle-logout';
import { createElement } from '@/utils/create-element';

import './header.css';

export function createHeader(page: string): HTMLElement {
  const header = createElement({ tag: 'header', className: ['header'] });

  const title = createElement({ tag: 'h2', className: ['header__title'], textContent: 'Fun Chat' });

  if (page === 'main') {
    const buttons = createElement({ tag: 'div', className: ['header__buttons'] });

    const logoutButton = createButton({
      text: 'Logout',
    });

    logoutButton.addEventListener('click', () => {
      handleLogout();
    });

    const aboutButton = createButton({
      text: 'About',
    });

    aboutButton.addEventListener('click', () => {
      navigate('about', document.body);
    });

    buttons.append(logoutButton, aboutButton);
    header.append(title, buttons);
  } else if (page === 'about') {
    const backButton = createButton({
      text: 'Back',
    });

    backButton.addEventListener('click', () => {
      history.back();
    });
  }

  return header;
}
