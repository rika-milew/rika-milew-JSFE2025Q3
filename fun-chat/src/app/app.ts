import { initRouter } from '@/app/router';
import { connectionPopup, createReconnectionPopup } from '@/components/popups/popups';
import { startWebsocket, handleReconnect } from '@/server/connection';
import { connectionStore } from '@/store/connection-store';
import { eventState } from '@/store/event-state';
import { userStore } from '@/store/user-store';

export function app(): void {
  startWebsocket();
  createReconnectionPopup();

  initRouter(document.body);

  eventState.on('ws:connected', () => {
    handleReconnect();
  });

  eventState.on('ws:disconnected', () => {
    connectionStore.setConnected(false);
    userStore.setServerLogin(false);
    history.replaceState(undefined, '', '#login');
  });

  eventState.on('ws:reconnecting', () => {
    connectionStore.setReconnecting();
  });

  eventState.on('connection:changed', (state) => {
    if (!state) {
      return;
    }
    if (state.connected) {
      connectionPopup.show('Connection restored');
    }
  });
}
