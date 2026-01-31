import { createApp } from '@/app/app';
import { errorPopup } from '@/components/popup/error/error';
import { POPUP_MESSAGES } from '@/constants/error-messages';
import { appState } from '@/state/app-state';
import { eventState } from '@/state/events/event-state';

import './style.css';

eventState.on('view:changed', async (view) => {
  if (!view) {
    return;
  }
  appState.view = view;

  try {
    await createApp();
  } catch {
    errorPopup.show(POPUP_MESSAGES.viewChangeFailed());
  }
});

try {
  await createApp();
} catch {
  errorPopup.show(POPUP_MESSAGES.appLoadFailed());
}
