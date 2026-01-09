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
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error while navigating:', error.message);
        } else {
          console.error('Unknown error while navigating:', error);
        }
      }
    },
  };
}
