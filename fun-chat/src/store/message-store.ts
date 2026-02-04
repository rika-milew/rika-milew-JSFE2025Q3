import { eventState } from './events/event-state';

import type { Message, UserLogin, DialogueState } from '@/types/types';

let messages: Message[] = [];
const dialogueStates = new Map<string, DialogueState>();

export const messageStore = {
  get state(): Message[] {
    return messages;
  },

  get(): Message[] {
    return messages;
  },

  set(newMessages: Message[]): void {
    messages = newMessages;
    eventState.emit('messages:changed', messages);
  },

  add(message: Message): void {
    messages.push(message);
    eventState.emit('messages:changed', messages);
  },

  edit(messageId: string, newText: string): void {
    messages = messages.map((message) =>
      message.id === messageId ? { ...message, text: newText, edited: true } : message,
    );
    eventState.emit('messages:changed', messages);
  },

  delete(messageId: string): void {
    messages = messages.filter((message) => message.id !== messageId);
    eventState.emit('messages:changed', messages);
  },

  markDelivered(messageId: string): void {
    messages = messages.map((message) =>
      message.id === messageId ? { ...message, delivered: true } : message,
    );
    eventState.emit('messages:changed', messages);
  },

  markRead(messageId: string): void {
    messages = messages.map((message) =>
      message.id === messageId ? { ...message, read: true } : message,
    );
    eventState.emit('messages:changed', messages);
  },

  getDialog(currentUser: UserLogin, otherUser: UserLogin): Message[] {
    return messages.filter(
      (message) =>
        (message.senderId === currentUser.login && message.recipientId === otherUser.login) ||
        (message.senderId === otherUser.login && message.recipientId === currentUser.login),
    );
  },

  setDialogWithUser(login: string, messagesFromServer: Message[]): void {
    messages = [
      ...messages.filter((m) => m.senderId !== login && m.recipientId !== login),
      ...messagesFromServer,
    ];

    eventState.emit('messages:changed');
  },

  getDialogueState(login: string): DialogueState {
    let state = dialogueStates.get(login);

    if (!state) {
      state = { unreadDividerRemoved: false };
      dialogueStates.set(login, state);
    }

    return state;
  },
};
