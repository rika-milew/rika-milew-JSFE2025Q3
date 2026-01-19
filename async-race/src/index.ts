import { POPUP_MESSAGES } from '@data/error-messages';
import { appState } from '@state/app-state';
import { eventState } from '@state/events/event-state';
import { createApp } from '@ui/ui';
import { handleErrorsVoid } from '@utils/handle-errors';

import './style.css';

eventState.on('view:changed', async (view) => {
  if (!view) {
    return;
  }
  appState.view = view;

  await handleErrorsVoid(() => createApp(), POPUP_MESSAGES.viewChangeFailed());
});

await handleErrorsVoid(() => createApp(), POPUP_MESSAGES.appLoadFailed());
