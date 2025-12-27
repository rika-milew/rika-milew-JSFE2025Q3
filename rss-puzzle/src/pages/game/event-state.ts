type EventMap = {
  'translation:update': string;
  'hint:translation:toggle': 'enabled' | 'disabled';
};

type EventState<T extends Record<string, unknown>> = {
  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void;
  off<K extends keyof T>(event: K, handler?: EventHandler<T[K]>): void;
  emit<K extends keyof T>(event: K, payload: T[K]): void;
};

type EventHandler<T> = (payload: T) => void;

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
      subscribers[event] = handler ? handlers.filter((subscriber) => subscriber !== handler) : [];
    },
  };
}

export const eventState = createEventState<EventMap>();
