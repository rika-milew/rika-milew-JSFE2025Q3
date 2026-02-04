import type { userStore } from '../user-store';
import type { ConnectionState, User, Message } from '@/types/types';

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
};
