import { createEmptyNotice, createDivider } from '@/components/dialogue/helpers/helpers';
import { messageController } from '@/controller/message-controller';
import { eventState } from '@/store/events/event-state';
import { createElement } from '@/utils/create-element';

import type { Message, DialogueState } from '@/types/types';

export function createMessagesList(
  messagesContainer: HTMLDivElement,
  currentUser: { login: string },
  messages: Message[],
  dialogueState: DialogueState,
): void {
  messagesContainer.replaceChildren();
  let divider = false;

  if (messages.length === 0) {
    const emptyDialogue = createEmptyNotice();
    messagesContainer.append(emptyDialogue);
    return;
  }

  messages
    .toSorted((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())
    .forEach((message) => {
      if (
        !divider &&
        !message.read &&
        message.senderId !== currentUser.login &&
        !dialogueState.unreadDividerRemoved
      ) {
        messagesContainer.append(createDivider());
        divider = true;
      }
      const messageElement = createMessageElement(message, currentUser);
      messagesContainer.append(messageElement);
    });

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

export function createMessageElement(
  message: Message,
  currentUser: { login: string },
): HTMLDivElement {
  const messageContainer: HTMLDivElement = createElement({
    tag: 'div',
    className: ['message', message.senderId === currentUser.login ? 'sender' : 'recipient'],
  });

  const header = createMessageHeader(message, currentUser);

  const footer = createMessageFooter(message, currentUser);

  const body: HTMLDivElement = createElement({ tag: 'div', className: ['message-body'] });
  const textSpan: HTMLSpanElement = createElement({ tag: 'span', textContent: message.text });
  body.append(textSpan);

  if (message.edited) {
    const edited: HTMLSpanElement = createElement({
      tag: 'span',
      className: ['edited'],
      textContent: ' (edited)',
    });
    body.append(edited);
  }

  messageContainer.append(header, body, footer);
  return messageContainer;
}

function createMessageHeader(message: Message, currentUser: { login: string }): HTMLDivElement {
  const header = createElement({ tag: 'div', className: ['message__header'] });

  const sender = createElement({
    tag: 'span',
    className: ['sender'],
    textContent: message.senderId === currentUser.login ? 'You' : message.senderName,
  });

  const time = createElement({
    tag: 'span',
    className: ['time'],
    textContent: new Date(message.created).toLocaleTimeString(),
  });

  header.append(sender, time);
  return header;
}

function createMessageFooter(message: Message, currentUser: { login: string }): HTMLDivElement {
  const footer = createElement({ tag: 'div', className: ['message__footer'] });

  const status: HTMLSpanElement = createElement({
    tag: 'span',
    className: ['status'],
    textContent: '',
  });

  if (message.senderId === currentUser.login) {
    if (message.read) {
      status.textContent = 'Read ✓✓';
    } else if (message.delivered) {
      status.textContent = 'Delivered ✓';
    } else {
      status.textContent = 'Sent';
    }
  }

  if (message.senderId === currentUser.login && !footer.dataset.handlersAttached) {
    const editButton = createElement({
      tag: 'button',
      className: ['edit-button'],
      textContent: 'Edit',
    });
    const deleteButton = createElement({
      tag: 'button',
      className: ['delete-button'],
      textContent: 'Delete',
    });

    editButton.addEventListener('click', () => {
      eventState.emit('dialogue:edit-message', { messageId: message.id, text: message.text });
    });

    deleteButton.addEventListener('click', () => {
      messageController.deleteMessage(message.id);
    });

    footer.prepend(editButton, deleteButton);
    footer.dataset.handlersAttached = 'true';
  }

  footer.append(status);
  return footer;
}
