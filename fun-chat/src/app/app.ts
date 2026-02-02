import { initRouter } from '@/app/router';
import { createConnectionPopup } from '@/components/popups/popups';
import { startWebsocket } from '@/server/connection';
import { sendLogin } from '@/server/requests';
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
      sendLogin(userStore.state.login, userStore.state.password);
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
