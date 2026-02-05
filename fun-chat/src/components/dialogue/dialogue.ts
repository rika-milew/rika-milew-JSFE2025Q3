import { createButton } from '@/components/button/button';
import {
  createEmptyNotice,
  setMessageInput,
  updateDialogue,
  updateRecipientStatus,
  createUnreadDivider,
} from '@/components/dialogue/helpers/helpers';
import { messageController } from '@/controller/message-controller';
import { eventState } from '@/store/events/event-state';
import { messageStore } from '@/store/message-store';
import { userStore } from '@/store/user-store';
import { createElement } from '@/utils/create-element';

import type {
  User,
  MessageContainer,
  Message,
  MessageInput,
  DialogueElements,
  DialogueState,
} from '@/types/types';

import './dialogue.css';

export function createDialogue(): MessageContainer {
  const container: HTMLElement = createElement({
    tag: 'section',
    className: ['dialogue'],
  });

  let currentRecipient: User | undefined;
  let editingMessageId: string | null = null;

  const { header, recipientName, messagesWrapper, recipientStatus }: DialogueElements =
    createDialogueElements();

  let isEditing = false;

  const messageInput: MessageInput = createMessageInput((text: string) => {
    if (!currentRecipient) {
      return;
    }
    if (!messageInput.input.value.trim()) {
      return;
    }
    if (editingMessageId) {
      isEditing = true;
      messageController.editMessage(editingMessageId, text);
      editingMessageId = null;
    } else {
      messageController.sendMessage(currentRecipient.login, text);
    }

    if (!isEditing) {
      eventState.emit('dialogue:divider-remove');
    }
    messageInput.input.value = '';
  });

  setMessageInput(false, messageInput);

  container.append(header, messagesWrapper, messageInput.container);

  function handleRecipientChange(user?: User): void {
    currentRecipient = user;
    updateDialogue(user, recipientName, recipientStatus, messagesWrapper, messageInput);
  }

  eventState.on('dialogue:edit-message', (payload) => {
    if (!payload) {
      return;
    }
    const { messageId, text } = payload;
    editingMessageId = messageId;
    messageInput.input.value = text;
    messageInput.input.focus();
  });

  eventState.on('dialogue:recipient-changed', handleRecipientChange);

  eventState.on('messages:changed', () => {
    if (!currentRecipient) {
      return;
    }
    renderMessages({ login: userStore.state.login }, currentRecipient);
  });

  eventState.on('dialogue:divider-remove', () => {
    if (!currentRecipient) {
      return;
    }

    const state = messageStore.getDialogueState(currentRecipient.login);

    if (state.unreadDividerRemoved) {
      return;
    }

    state.unreadDividerRemoved = true;

    messageController.markAllAsReadForUser(currentRecipient.login);

    renderMessages({ login: userStore.state.login }, currentRecipient);
  });

  eventState.on('users:changed', (users) => {
    if (!currentRecipient || !users) {
      return;
    }

    const recipientLogin = currentRecipient.login;
    const updatedUser = users.find((user) => user.login === recipientLogin);
    if (updatedUser) {
      currentRecipient = updatedUser;
      updateRecipientStatus(recipientStatus, updatedUser);
    }
  });

  function renderMessages(currentUser: { login: string }, recipient: User): void {
    const messages = messageStore.getDialog(currentUser, recipient);
    const dialogueState = messageStore.getDialogueState(recipient.login);
    renderMessagesList(messagesWrapper, currentUser, messages, dialogueState);
  }

  return {
    render: (recipient: User): void => {
      eventState.emit('dialogue:recipient-changed', recipient);
    },
    setRecipient: (recipient: User): void => {
      eventState.emit('dialogue:recipient-changed', recipient);
    },
    get container(): HTMLElement {
      return container;
    },
  };
}

function createDialogueElements(recipient?: User): DialogueElements {
  const header: HTMLDivElement = createElement({
    tag: 'div',
    className: ['dialogue__title'],
  });

  const recipientLabel = createElement({
    tag: 'span',
    className: ['recipient-label'],
    textContent: 'Recipient: ',
  });

  const recipientName = createElement({
    tag: 'span',
    className: ['recipient-name'],
    textContent: 'Select a user',
  });

  const recipientStatus = createElement({
    tag: 'span',
    className: [
      'recipient-status',
      recipient ? (recipient.isOnline ? 'online' : 'offline') : 'unknown',
    ],
  });

  header.append(recipientLabel, recipientName, recipientStatus);

  const messagesWrapper: HTMLDivElement = createElement({
    tag: 'div',
    className: ['messages'],
  });

  messagesWrapper.addEventListener('scroll', () => {
    eventState.emit('dialogue:divider-remove');
  });

  messagesWrapper.addEventListener('click', () => {
    eventState.emit('dialogue:divider-remove');
  });

  messagesWrapper.replaceChildren(createEmptyNotice('Select a user to start chatting...'));

  return { header, recipientName, messagesWrapper, recipientStatus };
}

export function createMessageInput(onSend: (text: string) => void): MessageInput {
  const container: HTMLDivElement = createElement({ tag: 'div', className: ['message-input'] });

  const input: HTMLInputElement = createElement({
    tag: 'input',
    attributes: { placeholder: 'Type a message...' },
  });

  const button: HTMLButtonElement = createButton({
    className: 'send-button',
    text: 'Send',
  });

  function send(): void {
    if (!input.value.trim()) {
      return;
    }
    onSend(input.value);
    input.value = '';
  }

  button.addEventListener('click', send);

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      send();
    }
  });

  container.append(input, button);
  return { container, input, button };
}

function renderMessagesList(
  messagesWrapper: HTMLDivElement,
  currentUser: { login: string },
  messages: Message[],
  dialogueState: DialogueState,
): void {
  messagesWrapper.replaceChildren();
  let dividerInserted = false;

  if (messages.length === 0) {
    const emptyDialogue = createEmptyNotice();
    messagesWrapper.append(emptyDialogue);
    return;
  }

  messages
    .toSorted((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())
    .forEach((message) => {
      if (
        !dividerInserted &&
        !message.read &&
        message.senderId !== currentUser.login &&
        !dialogueState.unreadDividerRemoved
      ) {
        messagesWrapper.append(createUnreadDivider());
        dividerInserted = true;
      }
      const messageElement = createMessageElement(message, currentUser);
      messagesWrapper.append(messageElement);
    });

  messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
}

function createMessageElement(message: Message, currentUser: { login: string }): HTMLDivElement {
  const messageContainer: HTMLDivElement = createElement({
    tag: 'div',
    className: ['message', message.senderId === currentUser.login ? 'sender' : 'recipient'],
  });

  const header: HTMLDivElement = createElement({ tag: 'div', className: ['message__header'] });
  const footer: HTMLDivElement = createElement({ tag: 'div', className: ['message__footer'] });

  const sender: HTMLSpanElement = createElement({
    tag: 'span',
    className: ['sender'],
    textContent: message.senderName,
  });

  const time: HTMLSpanElement = createElement({
    tag: 'span',
    className: ['time'],
    textContent: new Date(message.created).toLocaleTimeString(),
  });

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

  header.append(sender, time);
  footer.append(status);

  if (message.senderId === currentUser.login && !messageContainer.dataset.handlersAttached) {
    const editButton = createElement({
      tag: 'button',
      className: ['edit-btn'],
      textContent: 'Edit',
    });
    const deleteButton = createElement({
      tag: 'button',
      className: ['delete-btn'],
      textContent: 'Delete',
    });

    editButton.addEventListener('click', () => {
      eventState.emit('dialogue:edit-message', { messageId: message.id, text: message.text });
    });

    deleteButton.addEventListener('click', () => {
      messageController.deleteMessage(message.id);
    });

    footer.prepend(editButton, deleteButton);

    messageContainer.dataset.handlersAttached = 'true';
  }

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
