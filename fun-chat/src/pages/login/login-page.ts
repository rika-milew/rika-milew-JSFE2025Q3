import { navigate } from '@/app/router';
import { createButton } from '@/components/button/button';
import { login } from '@/pages/login/helpers/auth-requests';
import { eventState } from '@/store/event-state';
import { userStore } from '@/store/user-store';
import { createElement } from '@/utils/create-element';
import { validate } from '@/utils/validate';

import type { LoginView, UserState } from '@/types/types';

import './login-page.css';

export function renderLoginPage(container: HTMLElement): void {
  const view: LoginView = createLoginElements(container);

  const { form, loginInput, passwordInput, loginError, passwordError, button }: LoginView = view;

  loginInput.addEventListener('input', () => {
    userStore.setLogin(loginInput.value);
    validate('login', userStore.state.login, userStore.state.password);
    updateLoginButtonState(button);
  });

  passwordInput.addEventListener('input', () => {
    userStore.setPassword(passwordInput.value);
    validate('password', userStore.state.password, userStore.state.login);
    updateLoginButtonState(button);
  });

  form.addEventListener('submit', (event: SubmitEvent) => {
    event.preventDefault();
    login();
  });

  eventState.on('user-store:changed', (state: UserState | undefined) => {
    if (!state) {
      return;
    }

    loginError.textContent = state.errors.login ?? '';
    passwordError.textContent = state.errors.password ?? '';
  });
}

export function createLoginElements(container: HTMLElement): LoginView {
  const pageContainer: HTMLDivElement = createElement({
    tag: 'div',
    className: ['container auth-container'],
  });

  const title: HTMLHeadingElement = createElement({
    tag: 'h1',
    textContent: 'Login Page',
    className: ['page-title'],
  });

  const form: HTMLFormElement = createElement({ tag: 'form', className: ['form-container'] });

  const loginWrapper: HTMLDivElement = createElement({ tag: 'div', className: ['input-wrapper'] });

  const loginInput: HTMLInputElement = createElement({
    tag: 'input',
    className: ['input'],
    attributes: { type: 'text', name: 'login', placeholder: 'Login' },
  });

  const loginError: HTMLDivElement = createElement({ tag: 'div', className: ['input-error'] });

  const passwordWrapper: HTMLDivElement = createElement({
    tag: 'div',
    className: ['input-wrapper'],
  });

  const passwordInput: HTMLInputElement = createElement({
    tag: 'input',
    className: ['input'],
    attributes: { type: 'password', name: 'password', placeholder: 'Password' },
  });

  const passwordError: HTMLDivElement = createElement({ tag: 'div', className: ['input-error'] });

  const button: HTMLButtonElement = createButton({
    text: 'Login',
    className: 'login-button',
    disabled: true,
  });

  button.type = 'submit';

  const aboutLink: HTMLAnchorElement = createElement({
    tag: 'a',
    className: ['login__about-link'],
    textContent: 'About Fun Chat',
    attributes: {
      href: '/about',
    },
  });

  aboutLink.addEventListener('click', (event: MouseEvent) => {
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

function updateLoginButtonState(button: HTMLButtonElement): void {
  const loginValid: boolean = validate('login', userStore.state.login, userStore.state.password);
  const passwordValid: boolean = validate(
    'password',
    userStore.state.password,
    userStore.state.login,
  );

  button.disabled = !(loginValid && passwordValid);
}
