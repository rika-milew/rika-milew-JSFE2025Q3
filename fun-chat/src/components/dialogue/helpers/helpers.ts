import { messageController } from '@/controller/message-controller';
import { createElement } from '@/utils/create-element';

import type { User, MessageInput } from '@/types/types';

export function createEmptyNotice(
  text = 'Start the conversation by sending a message…',
): HTMLDivElement {
  return createElement({
    tag: 'div',
    className: ['dialogue_empty'],
    textContent: text,
  });
}

export function setMessageInput(
  enabled: boolean,
  messageInput: { input: HTMLInputElement; button: HTMLButtonElement },
): void {
  messageInput.input.disabled = !enabled;
  messageInput.button.disabled = !enabled;
}

export function updateRecipientStatus(statusElement: HTMLSpanElement, user?: User): void {
  statusElement.classList.remove('online', 'offline', 'unknown');

  if (!user) {
    statusElement.classList.add('unknown');
    return;
  }

  statusElement.classList.add(user.isOnline ? 'online' : 'offline');
}

export function updateDialogue(
  user: User | undefined,
  recipientName: HTMLElement,
  recipientStatus: HTMLElement,
  messagesWrapper: HTMLElement,
  messageInput: MessageInput,
): void {
  recipientName.textContent = user ? user.login : 'Select a user';
  updateRecipientStatus(recipientStatus, user);
  messagesWrapper.replaceChildren(createEmptyNotice());
  setMessageInput(!!user, messageInput);

  if (!user) {
    setMessageInput(false, messageInput);
    return;
  }

  setMessageInput(true, messageInput);

  messageController.getMessagesFromUser(user.login);
}
