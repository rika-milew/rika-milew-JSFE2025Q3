import type { EventMap } from '@/store/events/event-map';

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
      const handlers = subscribers[event];

      if (handlers) {
        handlers.forEach((handler) => {
          handler(payload);
        });
      }
    },

    off<K extends keyof T>(event: K, handler?: EventHandler<T[K]>): void {
      const handlers = subscribers[event];

      if (!handlers) {
        return;
      }

      if (!handler) {
        handlers.length = 0;
        return;
      }

      const index = handlers.indexOf(handler);
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

export const eventState = createEventState<EventMap>();
