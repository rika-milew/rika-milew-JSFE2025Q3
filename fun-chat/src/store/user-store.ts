import { eventState } from './events/event-state';

type UserState = {
  login: string;
  password: string;
  isLoggedIn: boolean;
  errors: {
    login?: string;
    password?: string;
  };
};

export const userStore: {
  state: UserState;
  setLogin: (login: string) => void;
  setPassword: (password: string) => void;
  showError: (field: 'login' | 'password', message: string) => void;
  removeError: (field: 'login' | 'password') => void;
  loginUser: () => void;
  logoutUser: () => void;
  isAuthenticated: () => boolean;
} = {
  state: {
    login: '',
    password: '',
    isLoggedIn: false,
    errors: {},
  },

  setLogin(login: string) {
    this.state.login = login;
    eventState.emit('user-store:changed', this.state);
  },

  setPassword(password: string) {
    this.state.password = password;
    eventState.emit('user-store:changed', this.state);
  },

  showError(field, message) {
    this.state.errors[field] = message;
    eventState.emit('user-store:changed', this.state);
  },

  removeError(field) {
    this.state.errors = Object.fromEntries(
      Object.entries(this.state.errors).filter(([key]) => key !== field),
    );
    eventState.emit('user-store:changed', this.state);
  },

  loginUser() {
    this.state.isLoggedIn = true;
    eventState.emit('user-store:changed', this.state);
  },

  logoutUser() {
    this.state.isLoggedIn = false;
    this.state.login = '';
    this.state.password = '';
    this.state.errors = {};
    eventState.emit('user-store:changed', this.state);
  },

  isAuthenticated() {
    return this.state.isLoggedIn;
  },
};
