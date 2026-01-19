import { POPUP_MESSAGES } from '@data/error-messages';
import { appState } from '@state/app-state';
import { createApp } from '@ui/ui';
import { handleErrorsVoid } from '@utils/handle-errors';

import type { View, AppRouter } from '../types/types';

export function createAppRouter(): AppRouter {
  return {
    navigate: async (view: View): Promise<void> => {
      appState.view = view;

      await handleErrorsVoid(() => createApp(), POPUP_MESSAGES.navigationFailed());
    },
  };
}
