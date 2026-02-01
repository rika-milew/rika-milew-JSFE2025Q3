import { createRequest } from '@/server/create-request';
import { sendWebsocket } from '@/server/ws-connection';
import { userStore } from '@/store/user-store';
import { validateField } from '@/utils/validate-field';

export function handleLogin(): void {
  const { login, password } = userStore.state;

  const loginValid = validateField('login', userStore.state.login, userStore.state.password);
  const passwordValid = validateField('password', userStore.state.password, userStore.state.login);

  if (!loginValid || !passwordValid) {
    return;
  }

  userStore.saveCredentials(login, password);

  const request = createRequest('USER_LOGIN', { user: { login, password } });
  sendWebsocket(request);
}
