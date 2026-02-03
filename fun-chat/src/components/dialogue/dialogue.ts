import { createButton } from '@/components/button/button';
import { createEmptyNotice, setMessageInput } from '@/components/dialogue/helpers/helpers';
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
} from '@/types/types';

import './dialogue.css';

export function createDialogue(): MessageContainer {
  const container: HTMLDivElement = createElement({
    tag: 'div',
    className: ['dialogue'],
  });

  let currentRecipient: User | undefined;

  const { header, recipientName, messagesWrapper }: DialogueElements = createDialogueElements();

  const messageInput: MessageInput = createMessageInput((text: string) => {
    if (!currentRecipient) {
      return;
    }
    messageController.sendMessage(currentRecipient.login, text);
    renderMessages({ login: userStore.state.login }, currentRecipient);
  });

  setMessageInput(false, messageInput);

  container.append(header, messagesWrapper, messageInput.container);

  function handleRecipientChange(user?: User): void {
    currentRecipient = user;
    recipientName.textContent = user ? user.login : 'Select a user';
    setMessageInput(!!user, messageInput);

    if (!user) {
      messagesWrapper.replaceChildren(createEmptyNotice('Select a user to start chatting...'));
      setMessageInput(false, messageInput);
      return;
    }

    setMessageInput(true, messageInput);

    messageController.getMessagesFromUser(user.login);
  }

  eventState.on('dialogue:recipient-changed', handleRecipientChange);

  eventState.on('messages:changed', () => {
    if (!currentRecipient) {
      return;
    }
    renderMessages({ login: userStore.state.login }, currentRecipient);
  });

  function renderMessages(currentUser: { login: string }, recipient: User): void {
    const messages = messageStore.getDialog(currentUser, recipient);
    renderMessagesList(messagesWrapper, currentUser, messages);
  }

  return {
    render: (recipient: User): void => {
      eventState.emit('dialogue:recipient-changed', recipient);
    },
    setRecipient: (recipient: User): void => {
      eventState.emit('dialogue:recipient-changed', recipient);
    },
    get container(): HTMLDivElement {
      return container;
    },
  };
}

function createDialogueElements(): DialogueElements {
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

  header.append(recipientLabel, recipientName);

  const messagesWrapper: HTMLDivElement = createElement({
    tag: 'div',
    className: ['messages'],
  });

  messagesWrapper.replaceChildren(createEmptyNotice('Select a user to start chatting...'));

  return { header, recipientName, messagesWrapper };
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
): void {
  messagesWrapper.replaceChildren();

  if (messages.length === 0) {
    const emptyDialogue = createEmptyNotice();
    messagesWrapper.append(emptyDialogue);
    return;
  }

  messages
    .toSorted((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())
    .forEach((message) => {
      const messageContainer = createElement({
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
          status.textContent = 'Read';
        } else if (message.delivered) {
          status.textContent = 'Delivered ✓✓';
        } else {
          status.textContent = 'Sent ✓';
        }
      }

      header.append(sender, time);
      footer.append(status);

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
      messagesWrapper.append(messageContainer);
    });

  messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
}
