import { sendRequest } from '@/server/requests';
import { messageStore } from '@/store/message-store';
import { userStore } from '@/store/user-store';

import type { Request, Response, Message } from '@/types/types';

export const messageController = {
  sendMessage(to: string, text: string): void {
    const request: Request<'MSG_SEND'> = {
      id: crypto.randomUUID(),
      type: 'MSG_SEND',
      payload: {
        message: {
          to,
          text,
        },
      },
    };

    sendRequest(request);
  },

  handleSendMessage(message: Response<'MSG_SEND'>): void {
    const serverMessage = message.payload.message;
    const sendMessage: Message = mapServerMessage(serverMessage);
    messageStore.add(sendMessage);
  },

  handleMessagesFromUser(message: Response<'MSG_FROM_USER'>): void {
    const serverMessages = message.payload.messages;
    const mapped: Message[] = serverMessages.map((message) => mapServerMessage(message));

    if (mapped.length === 0) {
      return;
    }

    const otherUserLogin =
      mapped[0].senderId === userStore.state.login ? mapped[0].recipientId : mapped[0].senderId;

    messageStore.setDialogWithUser(otherUserLogin, mapped);
  },

  getMessagesFromUser(login: string): void {
    const request: Request<'MSG_FROM_USER'> = {
      id: crypto.randomUUID(),
      type: 'MSG_FROM_USER',
      payload: {
        user: {
          login,
        },
      },
    };
    sendRequest(request);
  },

  markDelivered(messageId: string): void {
    messageStore.markDelivered(messageId);
  },

  markRead(messageId: string): void {
    messageStore.markRead(messageId);
  },

  deleteMessage(messageId: string): void {
    messageStore.delete(messageId);
    sendRequest({
      id: crypto.randomUUID(),
      type: 'MSG_DELETE',
      payload: { message: { id: messageId } },
    });
  },

  editMessage(messageId: string, newText: string): void {
    messageStore.edit(messageId, newText);
    sendRequest({
      id: crypto.randomUUID(),
      type: 'MSG_EDIT',
      payload: { message: { id: messageId, text: newText } },
    });
  },
};

function mapServerMessage(serverMessage: {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
  };
}): Message {
  return {
    id: serverMessage.id,
    senderId: serverMessage.from,
    senderName: serverMessage.from,
    recipientId: serverMessage.to,
    text: serverMessage.text,
    created: new Date(serverMessage.datetime).toISOString(),
    delivered: serverMessage.status.isDelivered,
    read: serverMessage.status.isReaded,
    edited: serverMessage.status.isEdited,
  };
}
