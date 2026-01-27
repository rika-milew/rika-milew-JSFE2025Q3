import { createAuthElements } from '@/pages/auth/helpers/create-auth-elements';
import { handleLogin } from '@/pages/auth/helpers/handle-login';
import { eventState } from '@/store/events/event-state';

export function renderAuthPage(container: HTMLElement): void {
  const view = createAuthElements(container);

  const { loginInput, passwordInput, loginErrorDiv, passwordErrorDiv, button } = view;

  button.addEventListener('click', () => handleLogin());

  loginInput.addEventListener('keydown', (error) => {
    if (error.key === 'Enter') {
      handleLogin().catch((error: unknown) => {
        if (error instanceof Error) {
          console.error('Login failed:', error.message);
        } else {
          console.error('Login failed:', error);
        }
      });
    }
  });

  passwordInput.addEventListener('keydown', (error) => {
    if (error.key === 'Enter') {
      handleLogin().catch((error: unknown) => {
        if (error instanceof Error) {
          console.error('Login failed:', error.message);
        } else {
          console.error('Login failed:', error);
        }
      });
    }
  });

  eventState.on('user-store:changed', (state) => {
    if (!state) {
      return;
    }

    loginErrorDiv.textContent = state.errors.login ?? '';
    passwordErrorDiv.textContent = state.errors.password ?? '';
  });
}
