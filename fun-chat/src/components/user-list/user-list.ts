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
  const list: HTMLUListElement = createElement({ tag: 'ul', className: ['user-list'] });

  const title: HTMLHeadingElement = createElement({
    tag: 'h2',
    textContent: 'Active Users',
    className: ['list-title'],
  });

  container.append(title, list);

  function render(users: User[]): void {
    list.replaceChildren();

    users.forEach((user) => {
      const item: HTMLLIElement = createElement({ tag: 'li', className: ['item'] });

      const userInfo: HTMLDivElement = createElement({ tag: 'div', className: ['user__info'] });

      const login: HTMLSpanElement = createElement({
        tag: 'span',
        className: ['user__login'],
        textContent: user.login,
      });

      const status: HTMLSpanElement = createElement({
        tag: 'span',
        className: ['user__status', user.isOnline ? 'online' : ''],
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

      list.append(item);
    });
  }

  render(users);

  return { render };
}
