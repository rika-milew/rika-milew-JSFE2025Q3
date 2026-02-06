import { initRouter } from '@/app/router';
import { startWebsocket, handleServerReconnect } from '@/server/connection';
import { connectionStore } from '@/store/connection-store';
import { eventState } from '@/store/events/event-state';
import { userStore } from '@/store/user-store';

export function app(): void {
  startWebsocket();

  initRouter(document.body);

  eventState.on('ws:connected', () => {
    handleServerReconnect();
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
