import { sendWebsocket } from '@/server/ws-connection';
import { userStore } from '@/store/user-store';
import { generateId } from '@/utils/generate-id';

import type { WebsocketRequest } from '@/types/types';

export function sendAuth(login: string, password: string): void {
  if (!login || !password || userStore.state.isLoggedInOnServer) {
    return;
  }

  userStore.saveCredentials(login, password);

  const request: WebsocketRequest<'USER_LOGIN'> = {
    id: generateId(),
    type: 'USER_LOGIN',
    payload: {
      user: { login, password },
    },
  };

  sendWebsocket(request);
}

export function sendLogout(): void {
  const { login, password } = userStore.state;

  if (!login || !password) {
    return;
  }

  const request: WebsocketRequest<'USER_LOGOUT'> = {
    id: generateId(),
    type: 'USER_LOGOUT',
    payload: {
      user: {
        login,
        password,
      },
    },
  };

  sendWebsocket(request);

  userStore.logoutUser();
}
