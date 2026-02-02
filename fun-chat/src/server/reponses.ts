import { navigate } from '@/app/router';
import { errorPopup, notificationPopup } from '@/components/popups/popups';
import { SERVER_ERRORS } from '@/constants/errors';
import { userStore } from '@/store/user-store';
import {
  isLoginResponse,
  isLogoutResponse,
  isErrorResponse,
  isExternalLoginResponse,
  isExternalLogoutResponse,
} from '@/types/type-guards';

import type { WebsocketResponse, WebsocketResponseMap } from '@/types/types';

export function handleResponse<T extends keyof WebsocketResponseMap>(
  message: WebsocketResponse<T>,
): void {
  if (isLoginResponse(message)) {
    login(message);
    return;
  }

  if (isLogoutResponse(message)) {
    logout(message);
    return;
  }

  if (isErrorResponse(message)) {
    handleError(message);
    return;
  }

  if (isExternalLoginResponse(message)) {
    externalLogin(message);
    return;
  }

  if (isExternalLogoutResponse(message)) {
    externalLogout(message);
    return;
  }
}

function login(message: WebsocketResponse<'USER_LOGIN'>): void {
  const { user } = message.payload;

  if (user.isLogined) {
    userStore.loginUser();
    userStore.setServerLogin(true);
    navigate('main', document.body);
  } else {
    errorPopup.show(SERVER_ERRORS.loginFailed);
  }
}

function logout(message: WebsocketResponse<'USER_LOGOUT'>): void {
  const { user } = message.payload;

  if (user.isLogined) {
    errorPopup.show(SERVER_ERRORS.logoutFailed);
  } else {
    userStore.logoutUser();
    userStore.setServerLogin(false);
    navigate('login', document.body);
  }
}

function handleError(message: WebsocketResponse<'ERROR'>): void {
  const { error } = message.payload;
  errorPopup.show(error || SERVER_ERRORS.serverError);
  console.error(error || SERVER_ERRORS.serverError);
}

function externalLogin(message: WebsocketResponse<'USER_EXTERNAL_LOGIN'>): void {
  const { login, isLogined } = message.payload.user;

  if (!isLogined) {
    return;
  }

  notificationPopup.show(`User ${login} logged in`);
}

function externalLogout(message: WebsocketResponse<'USER_EXTERNAL_LOGOUT'>): void {
  const { login, isLogined } = message.payload.user;

  if (isLogined) {
    return;
  }

  notificationPopup.show(`User ${login} logged out`);
}
