import { navigate } from '@/app/router';
import { errorPopup, notificationPopup } from '@/components/popups/popups';
import { SERVER_ERRORS } from '@/constants/errors';
import { messageController, syncUnreadCounts } from '@/controller/message-controller';
import { requestActiveUsers, requestInactiveUsers } from '@/server/requests';
import { userStore, usersStore } from '@/store/user-store';
import {
  isLoginResponse,
  isLogoutResponse,
  isErrorResponse,
  isExternalLoginResponse,
  isExternalLogoutResponse,
  isUserActiveResponse,
  isUserInactiveResponse,
  isSendMessageResponse,
  isFromUserResponse,
  isMessageDeliverResponse,
  isMessageNotReadResponse,
  isMessageReadResponse,
  isMessageDeleteResponse,
  isMessageEditResponse,
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

  if (isUserInactiveResponse(message)) {
    getInactiveUsers(message);
    return;
  }

  if (isSendMessageResponse(message)) {
    messageController.handleSendMessage(message);
    return;
  }

  if (isFromUserResponse(message)) {
    messageController.handleMessagesFromUser(message);
    return;
  }

  if (isMessageNotReadResponse(message)) {
    messageController.handleUnreadCount(message);
    return;
  }

  if (isMessageDeliverResponse(message)) {
    messageController.markDelivered(message.payload.message.id);
    return;
  }

  if (isMessageReadResponse(message)) {
    messageController.markRead(message.payload.message.id);
    return;
  }

  if (isMessageDeleteResponse(message)) {
    messageController.handleServerDelete(message);
    return;
  }

  if (isMessageEditResponse(message)) {
    messageController.handleServerEdit(message);
    return;
  }
}

function login(message: Response<'USER_LOGIN'>): void {
  const { user }: LoginResponse = message.payload;

  if (user.isLogined) {
    userStore.loginUser();
    userStore.setServerLogin(true);
    requestActiveUsers();
    requestInactiveUsers();

    syncUnreadCounts();

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
  requestInactiveUsers();
  notificationPopup.show(`User ${user.login} logged in`);
}

function externalLogout(message: Response<'USER_EXTERNAL_LOGOUT'>): void {
  const { user }: ExternalAuthResponse = message.payload;

  if (user.isLogined) {
    return;
  }

  requestActiveUsers();
  requestInactiveUsers();
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
  syncUnreadCounts();
}

export function getInactiveUsers(message: Response<'USER_INACTIVE'>): void {
  const { users }: UserActiveResponse = message.payload;
  const currentLogin = userStore.state.login;

  const inactiveUsers: User[] = users
    .filter((user) => user.login !== currentLogin)
    .map((user) => ({
      login: user.login,
      isOnline: false,
      unreadCount: 0,
    }));

  const currentUsers = usersStore.get();

  usersStore.set([...currentUsers.filter((u) => u.isOnline), ...inactiveUsers]);
  syncUnreadCounts();
}
