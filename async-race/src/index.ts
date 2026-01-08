import { appState } from './state/app-state';
import { eventState } from './state/event-state';
import { createApp } from './ui/ui';

import './style.css';

eventState.on('view:changed', (view) => {
  appState.view = view;
  createApp();
});

createApp();
