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

import type {
  Response,
  ResponseMap,
  LoginResponse,
  LogoutResponse,
  ErrorResponse,
  ExternalAuthResponse,
} from '@/types/types';

export function handleResponse<T extends keyof ResponseMap>(message: Response<T>): void {
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

function login(message: Response<'LOGIN'>): void {
  const { user }: LoginResponse = message.payload;

  if (user.isLogined) {
    userStore.loginUser();
    userStore.setServerLogin(true);
    navigate('main', document.body);
  } else {
    errorPopup.show(SERVER_ERRORS.loginFailed);
  }
}

function logout(message: Response<'LOGOUT'>): void {
  const { user }: LogoutResponse = message.payload;

  if (user.isLogined) {
    errorPopup.show(SERVER_ERRORS.logoutFailed);
  } else {
    userStore.logoutUser();
    userStore.setServerLogin(false);
    navigate('login', document.body);
  }
}

function handleError(message: Response<'ERROR'>): void {
  const { error }: ErrorResponse = message.payload;
  errorPopup.show(error || SERVER_ERRORS.serverError);
  console.error(error || SERVER_ERRORS.serverError);
}

function externalLogin(message: Response<'EXTERNAL_LOGIN'>): void {
  const { user }: ExternalAuthResponse = message.payload;

  if (!user.isLogined) {
    return;
  }

  notificationPopup.show(`User ${login} logged in`);
}

function externalLogout(message: Response<'EXTERNAL_LOGOUT'>): void {
  const { user }: ExternalAuthResponse = message.payload;

  if (user.isLogined) {
    return;
  }

  notificationPopup.show(`User ${login} logged out`);
}
