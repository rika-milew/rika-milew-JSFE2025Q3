import { initRouter } from '@/app/router';
import { createConnectionPopup } from '@/components/popups/popups';
import { startWebsocket, handleReconnect } from '@/server/connection';
import { connectionStore } from '@/store/connection-store';
import { eventState } from '@/store/event-state';
import { userStore } from '@/store/user-store';

export function app(): void {
  startWebsocket();
  createConnectionPopup();

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
}
