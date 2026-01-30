import { router } from '@/app/router';
import { createConnectionPopup } from '@/components/popup/connection-error';
import { connectionStore } from '@/server/connection-store';
import { startWebSocket } from '@/server/ws-connection';
import { sendAuth } from '@/server/ws-requests';
import { eventState } from '@/store/events/event-state';
import { userStore } from '@/store/user-store';

export function startApp(root: HTMLElement): void {
  createConnectionPopup();

  startWebSocket();

  let route = location.hash.replace('#', '');

  if (!route) {
    route = 'login';
    history.replaceState(undefined, '', '#login');
  }

  router(route, root);

  globalThis.addEventListener('hashchange', () => {
    const route = location.hash.replace('#', '') || 'login';
    router(route, root);
  });

  eventState.on('ws:connected', () => {
    connectionStore.setConnected(true);
    if (!userStore.state.isLoggedInOnServer && userStore.state.login && userStore.state.password) {
      sendAuth(userStore.state.login, userStore.state.password);
    }
  });

  eventState.on('ws:disconnected', () => {
    connectionStore.setConnected(false);
    history.replaceState(undefined, '', '#login');
  });

  eventState.on('ws:reconnecting', () => {
    connectionStore.setReconnecting();
  });
}
