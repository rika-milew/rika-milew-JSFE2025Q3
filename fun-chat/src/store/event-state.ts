import type { userStore } from '@/store/user-store';
import type { User, Message, ConnectionState } from '@/types/types';

export type EventMap = {
  'app:login': undefined;
  'user-store:changed': typeof userStore.state;
  'ws:connected': undefined;
  'ws:disconnected': { reason?: string };
  'ws:reconnecting': { attempt: number };
  'connection:changed': ConnectionState;
  'route:changed': string;
  'app:logout': undefined;
  'app:navigate': string;
  'users:changed': User[];
  'users:selected': { login: string };
  'messages:changed': Message[];
  'dialogue:recipient-changed': User | undefined;
  'dialogue:divider-remove': undefined;
  'dialogue:edit-message': { messageId: string; text: string };
};

type EventState<T extends Record<string, unknown>> = {
  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void;
  off<K extends keyof T>(event: K, handler?: EventHandler<T[K]>): void;
  emit<K extends keyof T>(event: K, payload?: T[K]): void;
  once<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void;
};

type EventHandler<T> = (payload?: T) => void;

export function createEventState<T extends Record<string, unknown>>(): EventState<T> {
  const subscribers: { [K in keyof T]?: EventHandler<T[K]>[] } = {};

  return {
    on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
      subscribers[event] = subscribers[event] ?? [];
      subscribers[event].push(handler);
    },

    emit<K extends keyof T>(event: K, payload: T[K]): void {
      const handlers: EventHandler<T[K]>[] | undefined = subscribers[event];

      if (handlers) {
        handlers.forEach((handler) => {
          handler(payload);
        });
      }
    },

    off<K extends keyof T>(event: K, handler?: EventHandler<T[K]>): void {
      const handlers: EventHandler<T[K]>[] | undefined = subscribers[event];

      if (!handlers) {
        return;
      }

      if (!handler) {
        handlers.length = 0;
        return;
      }

      const index: number = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    },

    once<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
      const wrapper: EventHandler<T[K]> = (payload) => {
        handler(payload);
        this.off(event, wrapper);
      };
      this.on(event, wrapper);
    },
  };
}

export const eventState: EventState<EventMap> = createEventState<EventMap>();
