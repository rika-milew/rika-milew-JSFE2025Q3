import type { Response } from './types';

export function isLoginResponse(message: Response): message is Response<'USER_LOGIN'> {
  return message.type === 'USER_LOGIN';
}

export function isErrorResponse(message: Response): message is Response<'ERROR'> {
  return message.type === 'ERROR';
}

export function isLogoutResponse(message: Response): message is Response<'USER_LOGOUT'> {
  return message.type === 'USER_LOGOUT';
}

export function isExternalLoginResponse(
  message: Response,
): message is Response<'USER_EXTERNAL_LOGIN'> {
  return message.type === 'USER_EXTERNAL_LOGIN';
}

export function isExternalLogoutResponse(
  message: Response,
): message is Response<'USER_EXTERNAL_LOGOUT'> {
  return message.type === 'USER_EXTERNAL_LOGOUT';
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

export function isUserActiveResponse(object: unknown): object is Response<'USER_ACTIVE'> {
  if (!isRecord(object)) {
    return false;
  }

  if (object.type !== 'USER_ACTIVE') {
    return false;
  }

  if (!isRecord(object.payload)) {
    return false;
  }

  return 'users' in object.payload && Array.isArray(object.payload.users);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
