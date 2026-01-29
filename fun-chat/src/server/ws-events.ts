import { navigate } from '@/app/router';
import { SERVER_ERRORS } from '@/data/errors';
import { userStore } from '@/store/user-store';

import type { WebsocketResponse, WebsocketResponseMap } from '@/types/types';

export function handleServerMessage<T extends keyof WebsocketResponseMap>(
  message: WebsocketResponse<T>,
): void {
  if (isUserLoginMessage(message)) {
    const { user } = message.payload;
    if (user.isLogined) {
      userStore.loginUser();
      navigate('main', document.body);
    } else {
      userStore.showError('password', SERVER_ERRORS.loginFailed);
    }
    return;
  }

  if (isErrorMessage(message)) {
    const { error } = message.payload;
    userStore.showError('password', error || SERVER_ERRORS.serverError);
    return;
  }

  if (message.type === 'USER_EXTERNAL_LOGIN') {
    userStore.logoutUser();
    return;
  }
}

function isUserLoginMessage(
  message: WebsocketResponse,
): message is WebsocketResponse<'USER_LOGIN'> {
  return message.type === 'USER_LOGIN';
}

function isErrorMessage(message: WebsocketResponse): message is WebsocketResponse<'ERROR'> {
  return message.type === 'ERROR';
}
