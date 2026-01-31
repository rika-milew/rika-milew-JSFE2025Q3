import { navigate } from '@/app/router';
import { createButton } from '@/components/button/button';
import { createElement } from '@/utils/create-element';

import type { AuthView } from '@/types/types';

export function createAuthElements(container: HTMLElement): AuthView {
  const pageContainer = createElement({ tag: 'div', className: ['container auth-container'] });

  const title = createElement({
    tag: 'h1',
    textContent: 'Login Page',
    className: ['page-title'],
  });

  const form = createElement({ tag: 'form', className: ['form-container'] });

  const loginWrapper = createElement({ tag: 'div', className: ['input-wrapper'] });

  const loginInput = createElement({
    tag: 'input',
    className: ['input'],
    attributes: { type: 'text', name: 'login', placeholder: 'Login' },
  });
  const loginError = createElement({ tag: 'div', className: ['input-error'] });

  const passwordWrapper = createElement({ tag: 'div', className: ['input-wrapper'] });
  const passwordInput = createElement({
    tag: 'input',
    className: ['input'],
    attributes: { type: 'password', name: 'password', placeholder: 'Password' },
  });
  const passwordError = createElement({ tag: 'div', className: ['input-error'] });

  const button = createButton({
    text: 'Login',
    className: 'login-button',
    disabled: false,
  });

  button.type = 'submit';

  const aboutLink = createElement({
    tag: 'a',
    className: ['login__about-link'],
    textContent: 'About Fun Chat',
    attributes: {
      href: '/about',
    },
  });

  aboutLink.addEventListener('click', (event) => {
    event.preventDefault();
    navigate('about', document.body);
  });

  loginWrapper.append(loginInput, loginError);
  passwordWrapper.append(passwordInput, passwordError);
  form.append(loginWrapper, passwordWrapper, button);
  pageContainer.append(title, form, aboutLink);

  container.replaceChildren(pageContainer);

  return { form, loginInput, passwordInput, loginError, passwordError, button };
}
