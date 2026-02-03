import { createDialogue } from '@/components/dialogue/dialogue';
import { createFooter } from '@/components/footer/footer';
import { createHeader } from '@/components/header/header';
import { createUserList } from '@/components/user-list/user-list';
import { eventState } from '@/store/events/event-state';
import { usersStore } from '@/store/user-store';
import { createElement } from '@/utils/create-element';

import type { UserList } from '@/types/types';

export function renderMainPage(container: HTMLElement): void {
  container.replaceChildren();

  const wrapper: HTMLDivElement = createElement({
    tag: 'div',
    className: ['wrapper'],
  });

  const header: HTMLElement = createHeader('main');

  const pageContainer: HTMLElement = createElement({
    tag: 'main',
    className: ['container main'],
  });

  const title: HTMLHeadingElement = createElement({
    tag: 'h1',
    textContent: 'Main Page',
    className: ['page-title'],
  });

  const footer: HTMLElement = createFooter();

  const dialogueContainer: HTMLDivElement = createElement({
    tag: 'div',
    className: ['dialogue-container'],
  });

  const usersSection: HTMLElement = createElement({
    tag: 'section',
    className: ['user-section'],
  });

  const userList: UserList = createUserList({ container: usersSection, users: usersStore.get() });

  eventState.on('users:changed', (users) => {
    if (!users) {
      return;
    }
    userList.render(users);
  });

  const dialogue = createDialogue();

  eventState.on('users:selected', (payload?: { login: string }) => {
    const user = usersStore.get().find((user) => user.login === payload?.login);
    eventState.emit('dialogue:recipient-changed', user);
  });

  dialogueContainer.append(usersSection, dialogue.container);
  pageContainer.append(title, dialogueContainer);
  wrapper.append(header, pageContainer, footer);
  container.append(wrapper);
}
