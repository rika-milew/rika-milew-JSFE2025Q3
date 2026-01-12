import type { View, Car, Winner } from '../types/types';

export const appState: {
  view: View;
  garagePage: number;
  winnersPage: number;
  perPage: number;
  garage: Car[];
  winners: Winner[];

  createForm: {
    name: string;
    color: string;
  };

  updateForm: {
    id: number | undefined;
    name: string;
    color: string;
    isDisabled: boolean;
  };
} = {
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
