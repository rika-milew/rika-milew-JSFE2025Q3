import { errorPopup } from '@/components/popups/popups';
import { syncUnreadCounts } from '@/controller/message-controller';
import { handleResponse } from '@/server/reponses';
import { requestLogin } from '@/server/requests';
import { connectionStore } from '@/store/connection-store';
import { eventState } from '@/store/event-state';
import { messageStore } from '@/store/message-store';
import { userStore, usersStore } from '@/store/user-store';
import { isResponse } from '@/types/type-guards';

let socket: WebSocket | undefined;
let reconnectTimeout: ReturnType<typeof setTimeout> | undefined;
let reconnectAttempt = 0;
let manuallyClosed = false;

export function startWebsocket(): void {
  manuallyClosed = false;
  connect();
}

export function closeWebsocket(): void {
  manuallyClosed = true;
  socket?.close();
}

export function getSocket(): WebSocket | undefined {
  return socket;
}

function connect(): void {
  socket = new WebSocket('ws://localhost:4000');

  socket.addEventListener('open', (): void => {
    reconnectAttempt = 0;
    eventState.emit('ws:connected');
  });

  socket.addEventListener('message', (event: MessageEvent): void => {
    try {
      if (typeof event.data !== 'string') {
        return;
      }

      const parsed: unknown = JSON.parse(event.data);

      if (!isResponse(parsed)) {
        console.error('Invalid websocket message shape', parsed);
        errorPopup.show('Received invalid data format from the server');
        return;
      }

      handleResponse(parsed);
    } catch {
      console.error('Invalid websocket message', event.data);
      errorPopup.show('Failed to process the message from the server');
    }
  });

  socket.addEventListener('close', (): void => {
    eventState.emit('ws:disconnected');

    if (!manuallyClosed) {
      reconnect();
    }
  });

  socket.addEventListener('error', (): void => {
    socket?.close();
  });
}

function reconnect(): void {
  const DELAY = 1000;
  const MAX_DELAY = 5000;

  reconnectAttempt += 1;
  eventState.emit('ws:reconnecting', { attempt: reconnectAttempt });

  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
  }

  reconnectTimeout = setTimeout(connect, Math.min(DELAY * reconnectAttempt, MAX_DELAY));
}

export function handleReconnect(): void {
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
    requestLogin(login, password);
  }

  usersStore.reset();
  messageStore.reset();
  syncUnreadCounts();
}
