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
  LOGIN: LoginPayload;
  LOGOUT: LogoutPayload;
};

export type Request<T extends keyof RequestMap = keyof RequestMap> = {
  id: string;
  type: T;
  payload: RequestMap[T];
};

export type ResponseMap = {
  LOGIN: LoginResponse;
  ERROR: ErrorResponse;
  LOGOUT: LogoutResponse;
  EXTERNAL_LOGIN: ExternalAuthResponse;
  EXTERNAL_LOGOUT: ExternalAuthResponse;
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
