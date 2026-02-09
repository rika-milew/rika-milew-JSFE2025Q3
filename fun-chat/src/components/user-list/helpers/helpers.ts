import type { User } from '@/types/types';

export function filterUsers(users: User[], search: string, caseSensitive: boolean): User[] {
  if (!search) {
    return users;
  }

  return users.filter((user) =>
    caseSensitive
      ? user.login.includes(search)
      : user.login.toLowerCase().includes(search.toLowerCase()),
  );
}
