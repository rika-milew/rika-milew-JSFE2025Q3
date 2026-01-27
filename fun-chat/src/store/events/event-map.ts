import type { userStore } from '../user-store';

export type EventMap = {
  'app:login': undefined;
  'user-store:changed': typeof userStore.state;
};
