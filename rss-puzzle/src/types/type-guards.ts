import type { User } from './types';

export function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (!('firstName' in value) || !('surname' in value)) {
    return false;
  }

  const firstName = value.firstName ?? '';
  const surname = value.surname ?? '';

  return typeof firstName === 'string' && typeof surname === 'string';
}
