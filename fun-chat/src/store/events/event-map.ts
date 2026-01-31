import type { userStore } from '../user-store';
import type { ConnectionState } from '@/types/types';

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
};
