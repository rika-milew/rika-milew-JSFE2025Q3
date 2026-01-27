import { createAuthElements } from '@/pages/auth/helpers/create-auth-elements';
import { handleLogin } from '@/pages/auth/helpers/handle-login';
import { eventState } from '@/store/events/event-state';
import { userStore } from '@/store/user-store';
import { validateField } from '@/utils/validate-field';

import './auth-page.css';

export function renderAuthPage(container: HTMLElement): void {
  const view = createAuthElements(container);

  const { form, loginInput, passwordInput, loginError, passwordError, button } = view;

  button.addEventListener('click', () => handleLogin());

  loginInput.addEventListener('input', () => {
    userStore.setLogin(loginInput.value);
    validateField('login', userStore.state.login, userStore.state.password);
  });

  passwordInput.addEventListener('input', () => {
    userStore.setPassword(passwordInput.value);
    validateField('password', userStore.state.password, userStore.state.login);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    handleLogin().catch((error: unknown) => {
      if (error instanceof Error) {
        console.error('Login failed:', error.message);
      } else {
        console.error('Login failed:', error);
      }
    });
  });

  eventState.on('user-store:changed', (state) => {
    if (!state) {
      return;
    }

    loginError.textContent = state.errors.login ?? '';
    passwordError.textContent = state.errors.password ?? '';
  });
}
