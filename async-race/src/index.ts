import { appState } from './state/app-state';
import { eventState } from './state/event-state';
import { createApp } from './ui/ui';

import './style.css';

eventState.on('view:changed', async (view) => {
  if (!view) {
    return;
  }
  appState.view = view;

  try {
    await createApp();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error while changing view:', error.message);
    } else {
      console.error('Unknown error while changing view:', error);
    }
  }
});

try {
  await createApp();
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error('Error while creating app:', error.message);
  } else {
    console.error('Unknown error while creating app:', error);
  }
}
