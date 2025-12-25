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

export function checkElement<T extends HTMLElement>(element: T | undefined, name: string): T {
  if (!element) {
    throw new Error(`This element "${name}" is not initialized`);
  }
  return element;
}
