import { createElement } from '../../utils/createElement';
import './LoginPage.css';

// login page

export function createLabel(text: string, htmlFor: string): HTMLLabelElement {
  const label = createElement({
    tag: 'label',
    className: 'login__label',
    textContent: text,
    attributes: { htmlFor },
  });
  label.htmlFor = htmlFor;
  return label;
}

export function createTextInput(
  id: string,
  name: string,
  placeholder: string,
  className: string,
): HTMLInputElement {
  return createElement({
    tag: 'input',
    className,
    attributes: {
      id,
      placeholder,
      required: 'true',
      type: 'text',
      name,
    },
  });
}

export function createSubmitButton(text: string): HTMLButtonElement {
  return createElement({
    tag: 'button',
    className: 'login__button',
    textContent: text,
    attributes: {
      type: 'submit',
      disabled: 'true',
    },
  });
}

export function createForm(id: string): HTMLFormElement {
  return createElement({
    tag: 'form',
    className: 'login__form',
    attributes: { id },
  });
}

export function createLoginPage(container: HTMLElement): HTMLDivElement {
  const loginContainer = createElement({
    tag: 'div',
    className: 'login',
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

  const loginButton = createSubmitButton('Login');

  firstnameDiv.append(firstNameLabel, firstNameInput);
  surnameDiv.append(surnameLabel, surnameInput);
  loginForm.append(firstnameDiv, surnameDiv, loginButton);
  loginContainer.append(loginForm);
  container.append(loginContainer);

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
    // if (!loginButton.disabled) {

    // }
  });

  return loginContainer;
}

// validation

const loginPattern = /^[A-Za-z-]+$/;
const firstLoginLetter = /^[A-Z]/;

const MIN_LENGTHS: Record<string, number> = {
  name: 3,
  surname: 4,
};

function inputValidation(value: string, input: 'name' | 'surname'): string | undefined {
  const minLength = MIN_LENGTHS[input] ?? 0;
  if (value.length < minLength) {
    return `Please enter at least ${minLength} characters`;
  }
  if (!loginPattern.test(value)) {
    return 'Please use only letters A-Z and the hyphen (-)';
  }
  if (!firstLoginLetter.test(value)) {
    return 'Please capitalize the first letter';
  }
  return undefined;
}

function showInputErrors(input: HTMLInputElement, errorMessage?: string): void {
  let error = input.nextElementSibling;

  if (!(error instanceof HTMLSpanElement)) {
    error = document.createElement('span');
    error.className = 'login__error';
    input.after(error);
  }

  if (!error.classList.contains('login__error')) {
    error = document.createElement('span');
    error.className = 'login__error';
    input.after(error);
  }

  if (errorMessage) {
    error.textContent = errorMessage;
    input.classList.add('login__input_error');
  } else {
    error.textContent = '';
    input.classList.remove('login__input_error');
  }
}
