import { handleServerMessage } from '@/server/ws-events';
import { eventState } from '@/store/events/event-state';

import type { WebsocketResponse } from '@/types/types';

let socket: WebSocket | undefined;
let reconnectAttempt = 0;
let manuallyClosed = false;

export function startWebSocket(): void {
  manuallyClosed = false;
  connect();
}

export function closeWebSocket(): void {
  manuallyClosed = true;
  socket?.close();
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

      if (!isWebsocketResponse(parsed)) {
        console.error('Invalid websocket message shape', parsed);
        return;
      }

      handleServerMessage(parsed);
    } catch {
      console.error('Invalid websocket message', event.data);
    }
  });

  socket.addEventListener('close', (): void => {
    eventState.emit('ws:disconnected');

    if (!manuallyClosed) {
      reconnectWebsocket();
    }
  });

  socket.addEventListener('error', (): void => {
    socket?.close();
  });
}

function reconnectWebsocket(): void {
  const DELAY = 1000;
  const MAX_DELAY = 5000;

  reconnectAttempt += 1;
  eventState.emit('ws:reconnecting', { attempt: reconnectAttempt });

  setTimeout(connect, Math.min(DELAY * reconnectAttempt, MAX_DELAY));
}

export function sendWebsocket(data: unknown): void {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
}

function isWebsocketResponse(value: unknown): value is WebsocketResponse {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (!('type' in value) || !('payload' in value)) {
    return false;
  }

  return typeof value.type === 'string';
}
