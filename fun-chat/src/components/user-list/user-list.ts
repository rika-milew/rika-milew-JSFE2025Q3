import { eventState } from '@/store/events/event-state';
import { usersStore } from '@/store/user-store';
import { createElement } from '@/utils/create-element';

import type { User, UserList } from '@/types/types';

import './user-list.css';

export function createUserList({
  container,
  users,
}: {
  container: HTMLElement;
  users: User[];
}): UserList {
  const { list, searchInput } = createUserListContainer(container);

  let search = '';
  const caseSensitive = false;

  searchInput.addEventListener('input', () => {
    search = searchInput.value;
    createList(list, usersStore.get(), search, caseSensitive);
  });

  createList(list, users, search, caseSensitive);

  return {
    render: (users: User[]): void => {
      createList(list, users, search, caseSensitive);
    },
  };
}

function createUserListContainer(container: HTMLElement): {
  list: HTMLUListElement;
  searchInput: HTMLInputElement;
} {
  const list: HTMLUListElement = createElement({ tag: 'ul', className: ['user-list'] });

  const title: HTMLHeadingElement = createElement({
    tag: 'h2',
    textContent: 'Active Users',
    className: ['list-title'],
  });

  const searchInput = createElement({
    tag: 'input',
    className: ['user-search'],
    attributes: { placeholder: 'Search users...', name: 'search', type: 'text' },
  });

  container.append(title, searchInput, list);

  return { list, searchInput };
}

function createList(
  list: HTMLUListElement,
  users: User[],
  search = '',
  caseSensitive = false,
): void {
  list.replaceChildren();
  const filteredUsers = filterUsers(users, search, caseSensitive);

  filteredUsers.forEach((user) => {
    list.append(createItem(user));
  });
}

function createItem(user: User): HTMLLIElement {
  const item: HTMLLIElement = createElement({ tag: 'li', className: ['item'] });

  const userInfo: HTMLDivElement = createElement({ tag: 'div', className: ['user__info'] });

  const login: HTMLSpanElement = createElement({
    tag: 'span',
    className: ['user__login'],
    textContent: user.login,
  });

  const status: HTMLSpanElement = createElement({
    tag: 'span',
    className: ['user__status', user.isOnline ? 'online' : 'offline'],
  });

  userInfo.append(login, status);
  item.append(userInfo);

  if (user.unreadCount > 0) {
    const unread: HTMLSpanElement = createElement({
      tag: 'span',
      className: ['user__unread'],
      textContent: user.unreadCount.toString(),
    });
    item.append(unread);
  }

  item.addEventListener('click', () => {
    eventState.emit('users:selected', { login: user.login });
  });

  return item;
}

function filterUsers(users: User[], search: string, caseSensitive: boolean): User[] {
  if (!search) {
    return users;
  }

  return users.filter((user) =>
    caseSensitive
      ? user.login.includes(search)
      : user.login.toLowerCase().includes(search.toLowerCase()),
  );
}
