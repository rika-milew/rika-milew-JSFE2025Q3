import { createButton } from '@/components/button/button';
import {
  bindDialogueEvents,
  createEmptyNotice,
  setMessageInput,
  updateDialogue,
  createMessages,
} from '@/components/dialogue/helpers/helpers';
import { messageController } from '@/controller/message-controller';
import { eventState } from '@/store/events/event-state';
import { userStore } from '@/store/user-store';
import { createElement } from '@/utils/create-element';

import type { User, MessageContainer, MessageInput, DialogueElements } from '@/types/types';

import './dialogue.css';

export function createDialogue(): MessageContainer {
  const container: HTMLElement = createElement({
    tag: 'section',
    className: ['dialogue'],
  });

  let currentRecipient: User | undefined;
  let editingMessageId: string | undefined;

  const { header, recipientName, messagesContainer, recipientStatus }: DialogueElements =
    createDialogueElements();

  const messageInput: MessageInput = createMessageInput((text: string) => {
    if (!currentRecipient || !messageInput.input.value.trim()) {
      return;
    }

    if (editingMessageId) {
      messageController.editMessage(editingMessageId, text);
      editingMessageId = undefined;
    } else {
      messageController.sendMessage(currentRecipient.login, text);
      eventState.emit('dialogue:divider-remove');
    }

    messageInput.input.value = '';
  });

  setMessageInput(false, messageInput);
  container.append(header, messagesContainer, messageInput.container);

  function changeRecipient(user?: User): void {
    currentRecipient = user;
    updateDialogue(user, recipientName, recipientStatus, messagesContainer, messageInput);
  }

  bindDialogueEvents({
    getRecipient: () => currentRecipient,
    setRecipient: changeRecipient,
    getEditingMessageId: () => {
      return editingMessageId;
    },
    setEditingMessageId: (id) => {
      editingMessageId = id;
    },
    messageInput,
    recipientStatus,
    renderMessages: (recipient) => {
      createMessages({
        wrapper: messagesContainer,
        currentUser: { login: userStore.state.login },
        recipient,
      });
    },
  });

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

  const recipientLabel: HTMLSpanElement = createElement({
    tag: 'span',
    className: ['recipient-label'],
    textContent: 'Recipient: ',
  });

  const recipientName: HTMLSpanElement = createElement({
    tag: 'span',
    className: ['recipient-name'],
    textContent: 'Select a user',
  });

  const recipientStatus: HTMLSpanElement = createElement({
    tag: 'span',
    className: [
      'recipient-status',
      recipient ? (recipient.isOnline ? 'online' : 'offline') : 'unknown',
    ],
  });

  header.append(recipientLabel, recipientName, recipientStatus);

  const messagesContainer: HTMLDivElement = createElement({
    tag: 'div',
    className: ['messages'],
  });

  // messagesContainer.addEventListener('scroll', () => {
  //   eventState.emit('dialogue:divider-remove');
  // });

  messagesContainer.addEventListener('click', () => {
    eventState.emit('dialogue:divider-remove');
  });

  messagesContainer.replaceChildren(createEmptyNotice('Select a user to start chatting...'));

  return { header, recipientName, messagesContainer, recipientStatus };
}

export function createMessageInput(onSend: (text: string) => void): MessageInput {
  const container: HTMLDivElement = createElement({ tag: 'div', className: ['message-input'] });

  const input: HTMLInputElement = createElement({
    tag: 'input',
    attributes: { placeholder: 'Type a message...', name: 'message', type: 'text' },
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
