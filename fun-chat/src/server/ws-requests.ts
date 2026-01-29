import { sendWebsocket } from '@/server/ws-connection';
import { userStore } from '@/store/user-store';
import { generateId } from '@/utils/generate-id';

export function sendAuth(login: string, password: string): void {
  userStore.saveCredentials(login, password);

  const request = {
    id: generateId(),
    type: 'USER_LOGIN',
    payload: {
      user: { login, password },
    },
  };

  sendWebsocket(request);
}

export function sendLogout(): void {
  const request = {
    id: generateId(),
    type: 'USER_LOGOUT',
    payload: {},
  };

  sendWebsocket(request);
}
