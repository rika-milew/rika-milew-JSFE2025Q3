import { navigate } from '@/app/router';
import { errorPopup } from '@/components/popup/error-popup';
import { SERVER_ERRORS } from '@/data/errors';
import { userStore } from '@/store/user-store';
import { isUserLoginMessage, isUserLogoutMessage, isErrorMessage } from '@/types/type-guards';

import type { WebsocketResponse, WebsocketResponseMap } from '@/types/types';

export function handleServerMessage<T extends keyof WebsocketResponseMap>(
  message: WebsocketResponse<T>,
): void {
  if (isUserLoginMessage(message)) {
    handleUserLogin(message);
    return;
  }

  if (isUserLogoutMessage(message)) {
    handleUserLogout();
    return;
  }

  if (isErrorMessage(message)) {
    handleError(message);
    return;
  }
}

function handleUserLogin(message: WebsocketResponse<'USER_LOGIN'>): void {
  const { user } = message.payload;

  if (user.isLogined) {
    userStore.loginUser();
    userStore.setServerLogin(true);
    navigate('main', document.body);
  } else {
    errorPopup.show(SERVER_ERRORS.loginFailed);
  }
}

function handleUserLogout(): void {
  userStore.logoutUser();
  userStore.setServerLogin(false);
  navigate('login', document.body);
}

function handleError(message: WebsocketResponse<'ERROR'>): void {
  const { error } = message.payload;
  errorPopup.show(error || SERVER_ERRORS.serverError);
  console.error(error || SERVER_ERRORS.serverError);
}
