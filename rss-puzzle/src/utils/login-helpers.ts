import { isUser } from '../types/type-guards';

export function isLoggedIn(): boolean {
  const savedUser = localStorage.getItem('user');

  if (!savedUser) {
    return false;
  }

  try {
    const parsed: unknown = JSON.parse(savedUser);
    return isUser(parsed);
  } catch {
    return false;
  }
}

export function logOut(): void {
  localStorage.removeItem('user');
}
