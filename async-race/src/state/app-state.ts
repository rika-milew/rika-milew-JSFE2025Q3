import type { AppState } from '../types/types';

export const appState: AppState = {
  view: 'garage',
  garagePage: 1,
  winnersPage: 1,
  perPage: 7,
  garage: [],
  winners: [],

  createForm: {
    name: '',
    color: '#000000',
  },

  updateForm: {
    id: undefined,
    name: '',
    color: '#000000',
    isDisabled: true,
  },
};
