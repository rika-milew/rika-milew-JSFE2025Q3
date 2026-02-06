import { createMessagesList } from '@/components/message/message';
import { messageController } from '@/controller/message-controller';
import { eventState } from '@/store/events/event-state';
import { messageStore } from '@/store/message-store';
import { createElement } from '@/utils/create-element';

import type {
  User,
  MessageInput,
  BindDialogueEventsParams,
  BindRecipientEventsParams,
} from '@/types/types';

export function bindDialogueEvents(params: BindDialogueEventsParams): void {
  const {
    getRecipient,
    setRecipient,
    setEditingMessageId,
    messageInput,
    recipientStatus,
    renderMessages,
  } = params;

  bindRecipientEvents({
    getRecipient,
    setRecipient,
    recipientStatus,
    renderMessages,
  });

  eventState.on('dialogue:edit-message', (payload) => {
    if (!payload) {
      return;
    }

    setEditingMessageId(payload.messageId);
    messageInput.input.value = payload.text;
    messageInput.input.focus();
  });

  eventState.on('dialogue:recipient-changed', (user?: User) => {
    if (!user) {
      return;
    }

    setRecipient(user);
  });
}

function bindRecipientEvents(params: BindRecipientEventsParams): void {
  const { getRecipient, setRecipient, recipientStatus, renderMessages } = params;

  const withRecipient = (function_: (recipient: User) => void): void => {
    const recipient = getRecipient();
    if (!recipient) {
      return;
    }
    function_(recipient);
  };

  eventState.on('messages:changed', () => {
    withRecipient(renderMessages);
  });

  eventState.on('dialogue:divider-remove', () => {
    withRecipient((recipient) => {
      handleDividerRemove(recipient, renderMessages);
    });
  });

  eventState.on('users:changed', (users) => {
    withRecipient((recipient) => {
      handleUsersChanged({
        users,
        recipient,
        setRecipient,
        recipientStatus,
      });
    });
  });
}

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
  messagesContainer: HTMLElement,
  messageInput: MessageInput,
): void {
  recipientName.textContent = user ? user.login : 'Select a user';
  updateRecipientStatus(recipientStatus, user);

  messagesContainer.replaceChildren(createEmptyNotice());
  setMessageInput(!!user, messageInput);

  if (!user) {
    setMessageInput(false, messageInput);
    return;
  }

  setMessageInput(true, messageInput);

  const dialogueState = messageStore.getDialogueState(user.login);
  dialogueState.dividerRemoved = false;

  messageController.getMessagesFromUser(user.login);
}

function handleUsersChanged(params: {
  users: User[] | undefined;
  recipient: User;
  setRecipient: (user: User) => void;
  recipientStatus: HTMLElement;
}): void {
  const { users, recipient, setRecipient, recipientStatus } = params;

  if (!users) {
    return;
  }

  const updatedUser = users.find((user) => user.login === recipient.login);
  if (!updatedUser) {
    return;
  }

  setRecipient(updatedUser);
  updateRecipientStatus(recipientStatus, updatedUser);
}

export function createDivider(): HTMLDivElement {
  return createElement({
    tag: 'div',
    className: ['divider'],
    textContent: 'Unread messages',
  });
}

function handleDividerRemove(recipient: User, renderMessages: (recipient: User) => void): void {
  const state = messageStore.getDialogueState(recipient.login);

  if (state.dividerRemoved) {
    return;
  }

  state.dividerRemoved = true;
  messageController.markAllRead(recipient.login);
  renderMessages(recipient);
}

export function createMessages(params: {
  wrapper: HTMLDivElement;
  currentUser: { login: string };
  recipient: User;
}): void {
  const { wrapper, currentUser, recipient } = params;

  const messages = messageStore.getDialog(currentUser, recipient);
  const dialogueState = messageStore.getDialogueState(recipient.login);

  createMessagesList(wrapper, currentUser, messages, dialogueState);
}
