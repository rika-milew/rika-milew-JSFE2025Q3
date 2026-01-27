import { navigate } from '@/app/router';
import { SERVER_ERRORS } from '@/data/errors';
import { userStore } from '@/store/user-store';
import { validateField } from '@/utils/validate-field';

export async function handleLogin(): Promise<void> {
  const { login, password } = userStore.state;

  const loginValid = validateField('login', login);
  const passwordValid = validateField('password', password);

  if (!loginValid || !passwordValid) {
    return;
  }

  try {
    const response = await fakeAuthRequest(login, password);

    if (!response.success) {
      userStore.showError('password', response.message ?? SERVER_ERRORS.loginFailed);
      return;
    }

    userStore.loginUser();
    navigate('main', document.body);
  } catch {
    userStore.showError('password', SERVER_ERRORS.serverError);
  }
}

async function fakeAuthRequest(
  login: string,
  password: string,
): Promise<{ success: boolean; message?: string }> {
  const REQUEST_TIME = 500;
  return new Promise<{ success: boolean; message?: string }>((resolve) =>
    setTimeout(() => {
      if (login === 'rika' && password === 'Rika123!') {
        resolve({ success: true });
      } else {
        resolve({ success: false, message: SERVER_ERRORS.loginFailed });
      }
    }, REQUEST_TIME),
  );
}
