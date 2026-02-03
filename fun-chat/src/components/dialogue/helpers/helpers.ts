import { messageStore } from '@/store/message-store';
import { userStore } from '@/store/user-store';
import { createElement } from '@/utils/create-element';

import type { User } from '@/types/types';

export function createEmptyNotice(
  text = 'Start the conversation by sending a message…',
): HTMLDivElement {
  return createElement({
    tag: 'div',
    className: ['dialogue_empty'],
    textContent: text,
  });
}

export function sendMessage(text: string, recipient: User): void {
  messageStore.add({
    id: crypto.randomUUID(),
    text,
    senderId: userStore.state.login,
    senderName: userStore.state.login,
    recipientId: recipient.login,
    created: new Date().toISOString(),
    delivered: false,
    read: false,
    edited: false,
  });
}

export function setMessageInput(
  enabled: boolean,
  messageInput: { input: HTMLInputElement; button: HTMLButtonElement },
): void {
  messageInput.input.disabled = !enabled;
  messageInput.button.disabled = !enabled;
}
