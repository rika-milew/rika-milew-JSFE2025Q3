import { createApp } from '@/app/app';
import { errorPopup } from '@/components/popup/error/error';
import { POPUP_MESSAGES } from '@/constants/error-messages';
import { appState } from '@/state/app-state';

import type { View, AppRouter } from '@/types/types';

export function createAppRouter(): AppRouter {
  return {
    navigate: handleNavigate,
  };
}

async function handleNavigate(view: View): Promise<void> {
  appState.view = view;

  try {
    await createApp();
  } catch {
    errorPopup.show(POPUP_MESSAGES.navigationFailed());
  }
}
