import { sendRequest } from '@/server/requests';
import { userStore } from '@/store/user-store';
import { validate } from '@/utils/validate';

import type { WebsocketRequest } from '@/types/types';

export function login(): void {
  const { login, password }: { login: string; password: string } = userStore.state;

  const loginValid: boolean = validate('login', userStore.state.login, userStore.state.password);
  const passwordValid: boolean = validate(
    'password',
    userStore.state.password,
    userStore.state.login,
  );

  if (!loginValid || !passwordValid) {
    return;
  }

  userStore.saveCredentials(login, password);

  const request: WebsocketRequest<'LOGIN'> = {
    id: crypto.randomUUID(),
    type: 'LOGIN',
    payload: {
      user: { login, password },
    },
  };

  sendRequest(request);
}

export function logout(): void {
  const { login, password }: { login: string; password: string } = userStore.state;

  if (!login || !password) {
    userStore.logoutUser();
    return;
  }

  const request: WebsocketRequest<'LOGOUT'> = {
    id: crypto.randomUUID(),
    type: 'LOGOUT',
    payload: {
      user: { login, password },
    },
  };

  sendRequest(request);
}
