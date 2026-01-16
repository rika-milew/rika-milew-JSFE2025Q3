import { errorPopup } from '@/components/popup/error/error';
import { appState } from '@state/app-state';
import { eventState } from '@state/events/event-state';
import { createApp } from '@ui/ui';

import './style.css';

eventState.on('view:changed', async (view) => {
  if (!view) {
    return;
  }
  appState.view = view;

  try {
    await createApp();
  } catch {
    errorPopup.show('Failed to change the view');
  }
});

try {
  await createApp();
} catch {
  errorPopup.show('Failed to load the app');
}
