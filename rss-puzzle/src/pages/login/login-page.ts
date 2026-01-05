import { createForm, createLabel, createTextInput } from './login-elements';
import { Routes } from '../../app/routes';
import { createButton } from '../../components/button/button';
import { clearContainer } from '../../utils/clear-container';
import { createElement } from '../../utils/create-element';
import { saveUserCredentials, getUserCredentials } from '../../utils/save-user';
import { setBackground } from '../../utils/set-background';
import { inputValidation, showInputErrors } from '../../utils/validate-login';

import type { AppRouter } from '../../app/app-router';

import './login-page.css';

export function createLoginPage(container: HTMLElement, router: AppRouter): HTMLDivElement {
  clearContainer(container);
  setBackground('login-page');

  const loginContainer = createElement({
    tag: 'div',
    className: ['login', 'page'],
  });

  const loginForm = createForm('login__form');

  const firstnameDiv = createElement({
    tag: 'div',
    className: 'login__div',
  });

  const surnameDiv = createElement({
    tag: 'div',
    className: 'login__div',
  });

  const firstNameLabel = createLabel('First Name', 'first-name-input');

  const firstNameInput = createTextInput(
    'first-name-input',
    'name',
    'Enter your first name',
    'login__input',
  );

  const surnameLabel = createLabel('Surname', 'surname-input');

  const surnameInput = createTextInput(
    'surname-input',
    'surname',
    'Enter your surname',
    'login__input',
  );

  const loginButton = createButton({
    text: 'Log in',
    className: 'login__button',
    type: 'submit',
    disabled: true,
  });

  loginButton.classList.remove('middle-button');

  firstnameDiv.append(firstNameLabel, firstNameInput);
  surnameDiv.append(surnameLabel, surnameInput);
  loginForm.append(firstnameDiv, surnameDiv, loginButton);
  loginContainer.append(loginForm);
  container.append(loginContainer);

  getUserCredentials(firstNameInput, surnameInput);

  function checkLoginForm(): void {
    const nameError = inputValidation(firstNameInput.value.trim(), 'name');
    const surnameError = inputValidation(surnameInput.value.trim(), 'surname');

    showInputErrors(firstNameInput, nameError);
    showInputErrors(surnameInput, surnameError);

    loginButton.disabled = Boolean(nameError ?? surnameError);
  }

  firstNameInput.addEventListener('input', checkLoginForm);
  surnameInput.addEventListener('input', checkLoginForm);

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    checkLoginForm();
    const firstName = firstNameInput.value.trim();
    const surname = surnameInput.value.trim();
    if (!loginButton.disabled) {
      saveUserCredentials(firstName, surname);
      router.navigate(Routes.START);
    }
  });

  return loginContainer;
}
