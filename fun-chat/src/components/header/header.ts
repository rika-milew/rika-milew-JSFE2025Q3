import { navigate } from '@/app/router';
import { createButton } from '@/components/button/button';
import { logout } from '@/pages/login/helpers/auth-requests';
import { userStore } from '@/store/user-store';
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
    const userLabel: HTMLSpanElement = createElement({
      tag: 'span',
      className: ['header__user-label'],
      textContent: 'You: ',
    });

    const userName: HTMLSpanElement = createElement({
      tag: 'span',
      className: ['header__username'],
      textContent: userStore.state.login || '',
    });

    const userContainer: HTMLDivElement = createElement({
      tag: 'div',
      className: ['header__user'],
    });

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

    userContainer.append(userLabel, userName);
    buttons.append(logoutButton, aboutButton);
    header.append(userContainer, title, buttons);
  } else if (page === 'about') {
    const backButton: HTMLButtonElement = createButton({
      text: 'Back',
    });

    backButton.addEventListener('click', () => {
      history.back();
    });

    buttons.append(backButton);

    header.append(title, buttons);
  }

  return header;
}
