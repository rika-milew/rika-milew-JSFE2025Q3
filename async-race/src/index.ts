import { appState } from './state/app-state';
import { createEventState } from './state/event-state';
import { createApp } from './ui/ui';

import type { EventMap } from './state/event-map';

import './style.css';

export const eventState = createEventState<EventMap>();

eventState.on('view:changed', (view) => {
  appState.view = view;
  createApp();
});

createApp();
