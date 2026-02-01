import { createAuthElements } from '@/pages/login/helpers/create-auth-elements';
import { handleLogin } from '@/pages/login/helpers/handle-login';
import { eventState } from '@/store/events/event-state';
import { userStore } from '@/store/user-store';
import { validateField } from '@/utils/validate-field';

import './login-page.css';

export function renderLoginPage(container: HTMLElement): void {
  const view = createAuthElements(container);

  const { form, loginInput, passwordInput, loginError, passwordError } = view;

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
    handleLogin();
  });

  eventState.on('user-store:changed', (state) => {
    if (!state) {
      return;
    }

    loginError.textContent = state.errors.login ?? '';
    passwordError.textContent = state.errors.password ?? '';
  });
}
