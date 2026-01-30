import type { WebsocketResponse } from './types';

export function isUserLoginMessage(
  message: WebsocketResponse,
): message is WebsocketResponse<'USER_LOGIN'> {
  return message.type === 'USER_LOGIN';
}

export function isErrorMessage(message: WebsocketResponse): message is WebsocketResponse<'ERROR'> {
  return message.type === 'ERROR';
}

export function isUserLogoutMessage(
  message: WebsocketResponse,
): message is WebsocketResponse<'USER_LOGOUT'> {
  return message.type === 'USER_LOGOUT';
}

export function isUserExternalLoginMessage(
  message: WebsocketResponse,
): message is WebsocketResponse<'USER_EXTERNAL_LOGIN'> {
  return message.type === 'USER_EXTERNAL_LOGIN';
}

export function isUserExternalLogoutMessage(
  message: WebsocketResponse,
): message is WebsocketResponse<'USER_EXTERNAL_LOGOUT'> {
  return message.type === 'USER_EXTERNAL_LOGOUT';
}
