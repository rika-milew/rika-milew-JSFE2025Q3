import type { WebsocketResponse } from './types';

export function isLoginResponse(message: WebsocketResponse): message is WebsocketResponse<'LOGIN'> {
  return message.type === 'LOGIN';
}

export function isErrorResponse(message: WebsocketResponse): message is WebsocketResponse<'ERROR'> {
  return message.type === 'ERROR';
}

export function isLogoutResponse(
  message: WebsocketResponse,
): message is WebsocketResponse<'LOGOUT'> {
  return message.type === 'LOGOUT';
}

export function isExternalLoginResponse(
  message: WebsocketResponse,
): message is WebsocketResponse<'EXTERNAL_LOGIN'> {
  return message.type === 'EXTERNAL_LOGIN';
}

export function isExternalLogoutResponse(
  message: WebsocketResponse,
): message is WebsocketResponse<'EXTERNAL_LOGOUT'> {
  return message.type === 'EXTERNAL_LOGOUT';
}

export function isResponse(value: unknown): value is WebsocketResponse {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (!('type' in value) || !('payload' in value)) {
    return false;
  }

  return typeof value.type === 'string';
}
