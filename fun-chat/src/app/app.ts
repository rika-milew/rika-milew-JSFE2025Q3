import { initRouter } from '@/app/router';
import { syncUnreadCounts } from '@/controller/message-controller';
import { startWebsocket } from '@/server/connection';
import { requestLogin } from '@/server/requests';
import { connectionStore } from '@/store/connection-store';
import { eventState } from '@/store/events/event-state';
import { userStore } from '@/store/user-store';

export function app(): void {
  startWebsocket();

  initRouter(document.body);

  eventState.on('ws:connected', () => {
    connectionStore.setConnected(true);

    const {
      login,
      password,
      isLoggedIn,
      isLoggedInOnServer,
    }: {
      login: string;
      password: string;
      isLoggedIn: boolean;
      isLoggedInOnServer: boolean;
    } = userStore.state;

    if (isLoggedIn && !isLoggedInOnServer && login && password) {
      requestLogin(userStore.state.login, userStore.state.password);
    }

    syncUnreadCounts();
  });

  eventState.on('ws:disconnected', () => {
    connectionStore.setConnected(false);
    userStore.setServerLogin(false);
    history.replaceState(undefined, '', '#login');
  });

  eventState.on('ws:reconnecting', () => {
    connectionStore.setReconnecting();
  });
}
