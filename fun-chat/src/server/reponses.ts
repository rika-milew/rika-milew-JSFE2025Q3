import { navigate } from '@/app/router';
import { errorPopup, notificationPopup } from '@/components/popups/popups';
import { SERVER_ERRORS } from '@/constants/errors';
import { requestActiveUsers } from '@/server/requests';
import { userStore, usersStore } from '@/store/user-store';
import {
  isLoginResponse,
  isLogoutResponse,
  isErrorResponse,
  isExternalLoginResponse,
  isExternalLogoutResponse,
  isUserActiveResponse,
} from '@/types/type-guards';

import type {
  Response,
  ResponseMap,
  LoginResponse,
  LogoutResponse,
  ErrorResponse,
  ExternalAuthResponse,
  UserActiveResponse,
  User,
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

  if (isUserActiveResponse(message)) {
    getActiveUsers(message);
    return;
  }
}

function login(message: Response<'USER_LOGIN'>): void {
  const { user }: LoginResponse = message.payload;

  if (user.isLogined) {
    userStore.loginUser();
    userStore.setServerLogin(true);
    requestActiveUsers();
    navigate('main', document.body);
  } else {
    errorPopup.show(SERVER_ERRORS.loginFailed);
  }
}

function logout(message: Response<'USER_LOGOUT'>): void {
  const { user }: LogoutResponse = message.payload;

  if (user.isLogined) {
    errorPopup.show(SERVER_ERRORS.logoutFailed);
  } else {
    userStore.logoutUser();
    userStore.setServerLogin(false);
    usersStore.set([]);
    navigate('login', document.body);
  }
}

function handleError(message: Response<'ERROR'>): void {
  const { error }: ErrorResponse = message.payload;
  errorPopup.show(error || SERVER_ERRORS.serverError);
  console.error(error || SERVER_ERRORS.serverError);
}

function externalLogin(message: Response<'USER_EXTERNAL_LOGIN'>): void {
  const { user }: ExternalAuthResponse = message.payload;

  if (!user.isLogined) {
    return;
  }

  requestActiveUsers();
  notificationPopup.show(`User ${user.login} logged in`);
}

function externalLogout(message: Response<'USER_EXTERNAL_LOGOUT'>): void {
  const { user }: ExternalAuthResponse = message.payload;

  if (user.isLogined) {
    return;
  }

  requestActiveUsers();
  notificationPopup.show(`User ${user.login} logged out`);
}

export function getActiveUsers(message: Response<'USER_ACTIVE'>): void {
  const { users }: UserActiveResponse = message.payload;
  const currentLogin = userStore.state.login;

  const activeUsers: User[] = users
    .filter((user) => user.login !== currentLogin)
    .map((user) => ({
      login: user.login,
      isOnline: true,
      unreadCount: 0,
    }));

  usersStore.set(activeUsers);
}
