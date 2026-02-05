import { sendRequest } from '@/server/requests';
import { messageStore } from '@/store/message-store';
import { userStore, usersStore } from '@/store/user-store';

import type { Request, Response, Message } from '@/types/types';

const unreadRequests = new Map<string, string>();

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

    const from = message.payload.message.from;
    if (from !== userStore.state.login) {
      messageController.getUnreadCountFromUser(from);
    }
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

  sendReadStatus(messageId: string): void {
    const request: Request<'MSG_READ'> = {
      id: crypto.randomUUID(),
      type: 'MSG_READ',
      payload: {
        message: { id: messageId },
      },
    };
    sendRequest(request);
    messageStore.markRead(messageId);
  },

  markRead(messageId: string): void {
    messageStore.markRead(messageId);
  },

  markAllAsReadForUser(login: string): void {
    const currentLogin: string = userStore.state.login;
    const messages = messageStore.getDialog({ login: currentLogin }, { login });

    messages
      .filter((message) => !message.read && message.senderId === login)
      .forEach((message) => {
        this.sendReadStatus(message.id);
      });

    usersStore.updateUnreadCount(login, 0);
  },

  deleteMessage(messageId: string): void {
    const message = messageStore.state.find((m) => m.id === messageId);

    if (message?.senderId !== userStore.state.login) {
      return;
    }

    messageStore.delete(messageId);

    if (!message.read) {
      const recipientLogin = message.recipientId;
      const recipientState = usersStore.getUserState(recipientLogin);
      if (recipientState?.unreadCount) {
        usersStore.updateUnreadCount(recipientLogin, recipientState.unreadCount - 1);
      }
    }
    sendRequest({
      id: crypto.randomUUID(),
      type: 'MSG_DELETE',
      payload: { message: { id: messageId } },
    });
  },

  handleServerDelete(message: Response<'MSG_DELETE'>): void {
    const serverMessageId = message.payload.message.id;

    const deleteMessage = messageStore.state.find((m) => m.id === serverMessageId);

    if (deleteMessage) {
      if (!deleteMessage.read && deleteMessage.senderId !== userStore.state.login) {
        const senderState = usersStore.getUserState(deleteMessage.senderId);
        if (senderState?.unreadCount) {
          usersStore.updateUnreadCount(deleteMessage.senderId, senderState.unreadCount - 1);
        }
      }

      messageStore.delete(serverMessageId);
    }
  },

  getUnreadCountFromUser(login: string): void {
    const id = crypto.randomUUID();

    unreadRequests.set(id, login);

    sendRequest({
      id,
      type: 'MSG_COUNT_NOT_READED_FROM_USER',
      payload: {
        user: { login },
      },
    });
  },

  editMessage(messageId: string, newText: string): void {
    const message = messageStore.state.find((m) => m.id === messageId);

    if (message?.senderId !== userStore.state.login) {
      return;
    }
    sendRequest({
      id: crypto.randomUUID(),
      type: 'MSG_EDIT',
      payload: { message: { id: messageId, text: newText } },
    });
  },

  handleServerEdit(message: Response<'MSG_EDIT'>): void {
    const serverMessage = message.payload.message;
    messageStore.edit(serverMessage.id, serverMessage.text);
  },

  handleUnreadCount(message: Response<'MSG_COUNT_NOT_READED_FROM_USER'>): void {
    if (message.id === null) {
      return;
    }
    const login = unreadRequests.get(message.id);
    if (!login) {
      return;
    }

    usersStore.updateUnreadCount(login, message.payload.count);
    unreadRequests.delete(message.id);
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

export function syncUnreadCounts(): void {
  usersStore.get().forEach((user) => {
    messageController.getUnreadCountFromUser(user.login);
  });
}
