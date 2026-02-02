import { getSocket } from '@/server/connection';
import { userStore } from '@/store/user-store';

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

  const request: WebsocketRequest<'LOGIN'> = {
    id: crypto.randomUUID(),
    type: 'LOGIN',
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

  const request: WebsocketRequest<'LOGOUT'> = {
    id: crypto.randomUUID(),
    type: 'LOGOUT',
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
