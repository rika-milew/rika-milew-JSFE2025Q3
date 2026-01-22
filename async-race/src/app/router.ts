import { errorPopup } from '@/components/popup/error/error';
import { POPUP_MESSAGES } from '@/data/error-messages';
import { appState } from '@/state/app-state';
import { createApp } from '@/ui/ui';

import type { View, AppRouter } from '@/types/types';

export function createAppRouter(): AppRouter {
  return {
    navigate: async (view: View): Promise<void> => {
      appState.view = view;

      try {
        await createApp();
      } catch {
        errorPopup.show(POPUP_MESSAGES.navigationFailed());
      }
    },
  };
}
