import type { View, Car, Winner } from '../types/types';

export const appState: {
  view: View;
  garagePage: number;
  winnersPage: number;
  perPage: number;
  garage: Car[];
  winners: Winner[];
} = {
  view: 'garage',
  garagePage: 1,
  winnersPage: 1,
  perPage: 7,
  garage: [],
  winners: [],
};
