import type { Response } from './types';

export function isLoginResponse(message: Response): message is Response<'LOGIN'> {
  return message.type === 'LOGIN';
}

export function isErrorResponse(message: Response): message is Response<'ERROR'> {
  return message.type === 'ERROR';
}

export function isLogoutResponse(message: Response): message is Response<'LOGOUT'> {
  return message.type === 'LOGOUT';
}

export function isExternalLoginResponse(message: Response): message is Response<'EXTERNAL_LOGIN'> {
  return message.type === 'EXTERNAL_LOGIN';
}

export function isExternalLogoutResponse(
  message: Response,
): message is Response<'EXTERNAL_LOGOUT'> {
  return message.type === 'EXTERNAL_LOGOUT';
}

export function isResponse(value: unknown): value is Response {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (!('type' in value) || !('payload' in value)) {
    return false;
  }

  return typeof value.type === 'string';
}
