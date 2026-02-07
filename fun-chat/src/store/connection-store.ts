import { eventState } from '@/store/event-state';

import type { ConnectionStore } from '@/types/types';

export const connectionStore: ConnectionStore = {
  state: {
    connected: false,
    reconnecting: false,
  },

  setConnected(value: boolean): void {
    this.state.connected = value;
    this.state.reconnecting = false;
    eventState.emit('connection:changed', this.state);
  },

  setReconnecting(): void {
    this.state.reconnecting = true;
    eventState.emit('connection:changed', this.state);
  },
};
