import { initRouter } from '@/app/router';
import { createConnectionPopup } from '@/components/popup/connection-popup';
import { startWebsocket } from '@/server/ws-connection';
import { sendAuth } from '@/server/ws-requests';
import { connectionStore } from '@/store/connection-store';
import { eventState } from '@/store/events/event-state';
import { userStore } from '@/store/user-store';

export function app(): void {
  createConnectionPopup();

  startWebsocket();

  initRouter(document.body);

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
