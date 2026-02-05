// elements

export type HTMLElements = Pick<
  HTMLElementTagNameMap,
  | 'div'
  | 'input'
  | 'button'
  | 'form'
  | 'span'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'p'
  | 'a'
  | 'img'
  | 'ul'
  | 'li'
  | 'select'
  | 'option'
  | 'label'
  | 'section'
  | 'header'
  | 'footer'
  | 'main'
  | 'nav'
>;

export type ElementTag = keyof HTMLElements;

export type ElementOptions<K extends ElementTag> = {
  tag: K;
  className?: string[];
  textContent?: string;
  attributes?: Record<string, string>;
};

export type ButtonConfig = {
  text: string;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
};

// server

export type RequestMap = {
  USER_LOGIN: LoginPayload;
  USER_LOGOUT: LogoutPayload;
  USER_ACTIVE: null;
  USER_INACTIVE: null;
  MSG_SEND: SendMessageRequest;
  MSG_FROM_USER: MessageHistoryRequest;
  MSG_COUNT_NOT_READED_FROM_USER: UnreadMessagesRequest;
  MSG_READ: ReadStatusRequest;
  MSG_DELETE: MessageDeletionRequest;
  MSG_EDIT: MessageEditingRequest;
};

export type Request<T extends keyof RequestMap = keyof RequestMap> = {
  id: string;
  type: T;
  payload: RequestMap[T];
};

export type ResponseMap = {
  USER_LOGIN: LoginResponse;
  ERROR: ErrorResponse;
  USER_LOGOUT: LogoutResponse;
  USER_EXTERNAL_LOGIN: ExternalAuthResponse;
  USER_EXTERNAL_LOGOUT: ExternalAuthResponse;
  USER_ACTIVE: UserActiveResponse;
  USER_INACTIVE: UserActiveResponse;
  MSG_SEND: SendMessageResponse;
  MSG_FROM_USER: { messages: ServerMessage[] };
  MSG_COUNT_NOT_READED_FROM_USER: UnreadMessagesResponse;
  MSG_DELIVER: MessageDeliveryResponse;
  MSG_READ: ReadStatusResponse;
  MSG_DELETE: MessageDeletionResponse;
  MSG_EDIT: MessageEditingResponse;
};

export type Response<T extends keyof ResponseMap = keyof ResponseMap> = {
  id: string | null;
  type: T;
  payload: ResponseMap[T];
};

// server requests and responses

export type LoginPayload = {
  user: {
    login: string;
    password: string;
  };
};

export type LogoutPayload = {
  user: {
    login: string;
    password: string;
  };
};

export type SendMessageRequest = {
  message: {
    to: string;
    text: string;
  };
};

export type UnreadMessagesRequest = {
  user: {
    login: string;
  };
};

export type ReadStatusRequest = {
  message: {
    id: string;
  };
};

export type MessageDeletionRequest = {
  message: {
    id: string;
  };
};

export type MessageDeletionResponse = {
  message: {
    id: string;
    status: {
      isDeleted: boolean;
    };
  };
};

export type MessageEditingRequest = {
  message: {
    id: string;
    text: string;
  };
};

export type MessageEditingResponse = {
  message: {
    id: string;
    text: string;
    status: {
      isEdited: boolean;
    };
  };
};

export type ReadStatusResponse = {
  message: {
    id: string;
    status: {
      isReaded: boolean;
    };
  };
};

export type UnreadMessagesResponse = {
  count: number;
};

export type SendMessageResponse = {
  message: {
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
  };
};

export type MessageDeliveryResponse = {
  message: {
    id: string;
    status: {
      isDelivered: boolean;
    };
  };
};

export type MessageHistoryRequest = {
  user: {
    login: string;
  };
};

export type MessageHistoryResponse = {
  messages: [];
};

export type LoginResponse = {
  user: {
    login: string;
    isLogined: boolean;
  };
};

export type ErrorResponse = {
  error: string;
};

export type LogoutResponse = {
  user: {
    login: string;
    isLogined: boolean;
  };
};

export type ExternalAuthResponse = {
  user: {
    login: string;
    isLogined: boolean;
  };
};

export type UserActiveResponse = {
  users: AuthenticatedUser[];
};

export type ServerMessage = {
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
};

// app

export type User = {
  login: string;
  isOnline: boolean;
  unreadCount: number;
};

export type AuthenticatedUser = {
  login: string;
};

export type Message = {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  text: string;
  created: string;
  edited?: boolean;
  delivered: boolean;
  read: boolean;
};

export type MessageContainer = {
  container: HTMLElement;
  render: (recipient: User) => void;
  setRecipient: (recipient: User) => void;
};

// elements

export type PopupOptions = {
  overlayClass: string;
  containerClass: string;
  headingContent: string;
  imageSrc: string;
  animationDuration: number;
  messageContent?: (message: string) => string;
};

export type LoginView = {
  form: HTMLFormElement;
  loginInput: HTMLInputElement;
  passwordInput: HTMLInputElement;
  loginError: HTMLDivElement;
  passwordError: HTMLDivElement;
  button: HTMLButtonElement;
};

export type MessageInput = {
  container: HTMLDivElement;
  input: HTMLInputElement;
  button: HTMLButtonElement;
};

export type DialogueElements = {
  header: HTMLDivElement;
  recipientName: HTMLSpanElement;
  messagesWrapper: HTMLDivElement;
  recipientStatus: HTMLSpanElement;
};

export type Route = 'login' | 'main' | 'about';

export type SoundTypes = 'notification' | 'button';

export type AudioPlayer = {
  stopSound: (id: SoundTypes) => void;
  stopAllSounds: () => void;
  toggleMute: () => void;
  isMuted: boolean;
  playOnce: (id: SoundTypes) => void;
};

export type UserList = {
  render: (users: User[]) => void;
};

export type UserLogin = {
  login: string;
};

export type DialogueState = {
  unreadDividerRemoved: boolean;
};

// state

export type ConnectionState = {
  connected: boolean;
  reconnecting: boolean;
};

export type ConnectionStore = {
  state: ConnectionState;
  setConnected(value: boolean): void;
  setReconnecting(): void;
};

export type UserState = {
  login: string;
  password: string;
  isLoggedIn: boolean;
  isLoggedInOnServer: boolean;
  errors: {
    login?: string;
    password?: string;
  };
};
