import { eventState } from './events/event-state';

import type { UserState } from '@/types/types';

export const userStore: {
  state: UserState;
  saveCredentials: (login: string, password: string) => void;
  setLogin: (login: string) => void;
  setPassword: (password: string) => void;
  showError: (field: 'login' | 'password', message: string) => void;
  removeError: (field: 'login' | 'password') => void;
  loginUser: () => void;
  logoutUser: () => void;
  isAuthenticated: () => boolean;
  setServerLogin: (value: boolean) => void;
} = {
  state: {
    login: '',
    password: '',
    isLoggedIn: false,
    isLoggedInOnServer: false,
    errors: {},
  },

  saveCredentials(login: string, password: string) {
    this.state.login = login;
    this.state.password = password;
    eventState.emit('user-store:changed', this.state);
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
    this.state.isLoggedInOnServer = true;
    this.state.errors = {};
    eventState.emit('user-store:changed', this.state);
  },

  logoutUser() {
    this.state.isLoggedIn = false;
    this.state.isLoggedInOnServer = false;
    this.state.login = '';
    this.state.password = '';
    this.state.errors = {};
    eventState.emit('user-store:changed', this.state);
  },

  isAuthenticated() {
    return this.state.isLoggedIn;
  },

  setServerLogin(value: boolean) {
    this.state.isLoggedInOnServer = value;
    eventState.emit('user-store:changed', this.state);
  },
};
