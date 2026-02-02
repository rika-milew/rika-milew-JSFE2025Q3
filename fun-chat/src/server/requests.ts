import { getSocket } from '@/server/connection';
import { userStore } from '@/store/user-store';

import type { Request } from '@/types/types';

export function sendRequest(data: unknown): void {
  const socket: WebSocket | undefined = getSocket();

  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
}

export function requestLogin(login: string, password: string): void {
  const request: Request<'USER_LOGIN'> = {
    id: crypto.randomUUID(),
    type: 'USER_LOGIN',
    payload: {
      user: { login, password },
    },
  };

  // console.log('requestLogin');

  sendRequest(request);
}

export function requestLogout(): void {
  const { login, password }: { login: string; password: string } = userStore.state;

  if (!login || !password) {
    return;
  }

  const request: Request<'USER_LOGOUT'> = {
    id: crypto.randomUUID(),
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

export function requestActiveUsers(): void {
  const request: Request<'USER_ACTIVE'> = {
    id: crypto.randomUUID(),
    type: 'USER_ACTIVE',
    payload: null,
  };

  sendRequest(request);
}

export function requestInactiveUsers(): void {
  const request: Request<'USER_INACTIVE'> = {
    id: crypto.randomUUID(),
    type: 'USER_INACTIVE',
    payload: null,
  };

  sendRequest(request);
}
