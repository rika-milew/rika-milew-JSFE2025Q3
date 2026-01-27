import { createButton } from '@/components/button/button';
import { createElement } from '@/utils/create-element';

type AuthView = {
  loginInput: HTMLInputElement;
  passwordInput: HTMLInputElement;
  loginErrorDiv: HTMLDivElement;
  passwordErrorDiv: HTMLDivElement;
  button: HTMLButtonElement;
};

export function createAuthElements(container: HTMLElement): AuthView {
  const pageContainer = createElement({ tag: 'div', className: ['container'] });

  const title = createElement({
    tag: 'h1',
    textContent: 'Login Page',
    className: ['page-title'],
  });

  const formContainer = createElement({ tag: 'div', className: ['form-container'] });

  const loginWrapper = createElement({ tag: 'div', className: ['input-wrapper'] });

  const loginInput = createElement({
    tag: 'input',
    className: ['input'],
    attributes: { placeholder: 'Login' },
  });
  const loginErrorDiv = createElement({ tag: 'div', className: ['input-error'] });

  const passwordWrapper = createElement({ tag: 'div', className: ['input-wrapper'] });
  const passwordInput = createElement({
    tag: 'input',
    className: ['input'],
    attributes: { placeholder: 'Password', type: 'password' },
  });
  const passwordErrorDiv = createElement({ tag: 'div', className: ['input-error'] });

  const button = createButton({
    text: 'Login',
    className: 'login-button',
    disabled: false,
  });

  loginWrapper.append(loginInput, loginErrorDiv);
  passwordWrapper.append(passwordInput, passwordErrorDiv);
  formContainer.append(loginWrapper, passwordWrapper, button);
  pageContainer.append(title, formContainer);

  container.replaceChildren(pageContainer);

  return { loginInput, passwordInput, loginErrorDiv, passwordErrorDiv, button };
}
