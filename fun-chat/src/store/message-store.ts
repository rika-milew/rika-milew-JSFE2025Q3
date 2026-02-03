import { eventState } from './events/event-state';

import type { Message, User, UserLogin } from '@/types/types';

let messages: Message[] = [];

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

  getDialog(currentUser: UserLogin, otherUser: User): Message[] {
    return messages.filter(
      (message) =>
        (message.senderId === currentUser.login && message.recipientId === otherUser.login) ||
        (message.senderId === otherUser.login && message.recipientId === currentUser.login),
    );
  },
};
