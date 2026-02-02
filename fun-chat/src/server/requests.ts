import { getSocket } from '@/server/connection';
import { userStore } from '@/store/user-store';
import { generateId } from '@/utils/generate-id';

import type { WebsocketRequest } from '@/types/types';

export function sendRequest(data: unknown): void {
  const socket = getSocket();

  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
}

export function sendLogin(login: string, password: string): void {
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

  sendRequest(request);
}

export function sendLogout(): void {
  const { login, password }: { login: string; password: string } = userStore.state;

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

  sendRequest(request);

  userStore.logoutUser();
}
