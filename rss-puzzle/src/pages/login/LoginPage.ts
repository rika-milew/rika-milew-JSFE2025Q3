import { createElement } from '../../utils/createElement';

export function createLoginPage(container: HTMLElement): HTMLDivElement {
  const loginContainer = createElement({ tag: 'div', className: 'login-container' });
  const firstNameInput = createElement({
    tag: 'input',
    className: 'firstname-input',
    attributes: {
      placeholder: 'First Name',
      required: 'true',
    },
  });
  const surnameInput = createElement({ tag: 'input', attributes: { placeholder: 'Surname', required: 'true' } });
  const loginButton = createElement({ tag: 'button', textContent: 'Login' });
  container.append(firstNameInput, surnameInput, loginButton);
  return loginContainer;
}
