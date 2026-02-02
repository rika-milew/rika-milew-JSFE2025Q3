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

export type WebsocketRequestMap = {
  LOGIN: LoginPayload;
  LOGOUT: LogoutPayload;
};

export type WebsocketRequest<T extends keyof WebsocketRequestMap = keyof WebsocketRequestMap> = {
  id: string;
  type: T;
  payload: WebsocketRequestMap[T];
};

export type WebsocketResponseMap = {
  LOGIN: LoginResponse;
  ERROR: ErrorResponse;
  LOGOUT: LogoutResponse;
  EXTERNAL_LOGIN: ExternalAuthResponse;
  EXTERNAL_LOGOUT: ExternalAuthResponse;
};

export type WebsocketResponse<T extends keyof WebsocketResponseMap = keyof WebsocketResponseMap> = {
  id: string | null;
  type: T;
  payload: WebsocketResponseMap[T];
};

// server requests and responses

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

export type ErrorResponse = {
  error: string;
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

// app

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

export type Route = 'login' | 'main' | 'about';

export type SoundTypes = 'notification' | 'button';

export type AudioPlayer = {
  stopSound: (id: SoundTypes) => void;
  stopAllSounds: () => void;
  toggleMute: () => void;
  isMuted: boolean;
  playOnce: (id: SoundTypes) => void;
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
