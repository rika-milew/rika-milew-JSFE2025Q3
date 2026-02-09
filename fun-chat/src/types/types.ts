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

export type Request<T extends keyof RequestMap = keyof RequestMap> = {
  id: string;
  type: T;
  payload: RequestMap[T];
};

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

export type Response<T extends keyof ResponseMap = keyof ResponseMap> = {
  id: string | null;
  type: T;
  payload: ResponseMap[T];
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

// server requests and responses

export type ErrorResponse = {
  error: string;
};

export type LoginPayload = {
  user: {
    login: string;
    password: string;
  };
};

export type LoginResponse = {
  user: {
    login: string;
    isLogined: boolean;
  };
};

export type LogoutPayload = {
  user: {
    login: string;
    password: string;
  };
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

export type SendMessageRequest = {
  message: {
    to: string;
    text: string;
  };
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

export type MessageHistoryRequest = {
  user: {
    login: string;
  };
};

export type MessageHistoryResponse = {
  messages: [];
};

export type UnreadMessagesRequest = {
  user: {
    login: string;
  };
};

export type UnreadMessagesResponse = {
  count: number;
};

export type MessageDeliveryResponse = {
  message: {
    id: string;
    status: {
      isDelivered: boolean;
    };
  };
};

export type ReadStatusRequest = {
  message: {
    id: string;
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

export type Route = 'login' | 'main' | 'about';

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

export type UserLogin = {
  login: string;
};

// ui

export type MessageContainer = {
  container: HTMLElement;
  render: (recipient: User) => void;
  setRecipient: (recipient: User) => void;
};

export type PopupOptions = {
  overlayClass: string;
  containerClass: string;
  headingContent?: string;
  imageSrc?: string;
  clickToClose?: boolean;
  closeButton?: boolean;
  messageContent?: (message: string) => string;
};

export type PopupElements = {
  overlay: HTMLDivElement;
  container: HTMLDivElement;
  content: HTMLParagraphElement;
  button?: HTMLButtonElement;
};

export type PopupController = {
  show: (message: string, autoClose?: boolean, autoCloseDuration?: number) => void;
  hide: () => void;
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
  messagesContainer: HTMLDivElement;
  recipientStatus: HTMLSpanElement;
};

export type UserList = {
  render: (users: User[]) => void;
};

export type AboutPageTextType = {
  title: string;
  introduction: string;
  description: string;
  featuresTitle: string;
  features: string[];
  conclusion: string;
};

// params

export type BindDialogueEventsParams = {
  getRecipient: () => User | undefined;
  setRecipient: (user: User) => void;
  getEditingMessageId: () => string | undefined;
  setEditingMessageId: (id: string | undefined) => void;
  messageInput: MessageInput;
  recipientStatus: HTMLElement;
  renderMessages: (recipient: User) => void;
};

export type BindRecipientEventsParams = {
  getRecipient: () => User | undefined;
  setRecipient: (user: User) => void;
  recipientStatus: HTMLElement;
  renderMessages: (recipient: User) => void;
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

export type DialogueState = {
  dividerRemoved: boolean;
  dividerElement?: HTMLDivElement | undefined;
};

export type MessageStore = {
  readonly state: Message[];

  get(): Message[];
  set(messages: Message[]): void;

  add(message: Message): void;
  edit(messageId: string, newText: string): void;
  delete(messageId: string): void;

  markDelivered(messageId: string): void;
  markRead(messageId: string): void;

  getDialog(currentUser: UserLogin, otherUser: UserLogin): Message[];
  setDialog(login: UserLogin['login'], messagesFromServer: Message[]): void;

  getDialogueState(login: UserLogin['login']): DialogueState;

  reset(): void;
};

export type UserStore = {
  state: UserState;
  saveCredentials(login: string, password: string): void;
  setLogin(login: string): void;
  setPassword(password: string): void;
  showError(field: 'login' | 'password', message: string): void;
  removeError(field: 'login' | 'password'): void;
  loginUser(): void;
  logoutUser(): void;
  isLoggedIn(): boolean;
  setServerLogin(value: boolean): void;
};

export type UsersStore = {
  get(): User[];
  set(newUsers: User[]): void;
  getUserState(login: string): User | undefined;
  addUnread(login: User['login']): void;
  resetUnread(login: User['login']): void;
  updateUnreadCount(login: User['login'], count: number): void;
  reset(): void;
};

// constants

export type LoginErrorKey = 'empty' | 'invalidChars' | 'tooShort' | 'sameAsPassword' | 'tooLong';

export type LoginErrors = Record<LoginErrorKey, string>;

export type PasswordErrorKey =
  | 'empty'
  | 'tooShort'
  | 'noUpper'
  | 'noLower'
  | 'noDigit'
  | 'noSpecial'
  | 'invalidChars'
  | 'sameAsLogin';

export type PasswordErrors = Record<PasswordErrorKey, string>;

export type ServerErrorKey = 'loginFailed' | 'logoutFailed' | 'serverError';

export type ServerErrors = Record<ServerErrorKey, string>;

export type ValidationRule = {
  test: (value: string, login?: string) => boolean;
  error: string;
};

export type ValidationRules = {
  login: ValidationRule[];
  password: ValidationRule[];
};

// controller

export type UnreadRequestsMap = Map<RequestId, UserLoginRequest>;

type RequestId = string;

type UserLoginRequest = string;

export type MessageController = {
  sendMessage: (to: string, text: string) => void;
  handleMessage: (message: Response<'MSG_SEND'>) => void;

  getMessagesFromUser: (login: string) => void;
  handleMessagesFromUser: (message: Response<'MSG_FROM_USER'>) => void;

  markDelivered: (messageId: string) => void;
  markRead: (messageId: string) => void;
  markAllRead: (login: string) => void;
  sendReadStatus: (messageId: string) => void;

  getUnreadCount: (login: string) => void;
  handleUnreadCount: (message: Response<'MSG_COUNT_NOT_READED_FROM_USER'>) => void;

  deleteMessage: (messageId: string) => void;
  handleDelete: (message: Response<'MSG_DELETE'>) => void;

  editMessage: (messageId: string, newText: string) => void;
  handleEdit: (message: Response<'MSG_EDIT'>) => void;
};
