import { errorPopup } from '../components/error/error';
import { appState } from '../state/app-state';
import { createApp } from '../ui/ui';

import type { View } from '../types/types';

export type AppRouter = {
  navigate: (view: View) => void;
};

export function createAppRouter(): AppRouter {
  return {
    navigate: async (view: View): Promise<void> => {
      appState.view = view;
      try {
        await createApp();
      } catch {
        errorPopup.show('Failed to navigate to the selected view');
      }
    },
  };
}
