import { createRequest } from '@/server/create-request';
import { sendWebsocket } from '@/server/ws-connection';
import { userStore } from '@/store/user-store';

export function handleLogout(): void {
  const { login, password } = userStore.state;

  if (!login || !password) {
    userStore.logoutUser();
    return;
  }

  const request = createRequest('USER_LOGOUT', {
    user: { login, password },
  });

  sendWebsocket(request);

  userStore.logoutUser();
  userStore.setServerLogin(false);
  history.replaceState(undefined, '', '#login');
}
