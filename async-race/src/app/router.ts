import { appState } from '../state/app-state';
import { createApp } from '../ui/ui';

import type { View } from '../types/types';

export type AppRouter = {
  navigate: (view: View) => void;
};

export function createAppRouter(): AppRouter {
  return {
    navigate: (view: View): void => {
      appState.view = view;
      createApp();
    },
  };
}
