import { handleResponse } from '@/server/reponses';
import { eventState } from '@/store/events/event-state';
import { isResponse } from '@/types/type-guards';

let socket: WebSocket | undefined;
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
        return;
      }

      handleResponse(parsed);
    } catch {
      console.error('Invalid websocket message', event.data);
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

  setTimeout(connect, Math.min(DELAY * reconnectAttempt, MAX_DELAY));
}
