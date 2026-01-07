import type { View } from '../types/types';

export type EventMap = {
  'car:update': string;
  'view:changed': View;
  'garage:page:changed': number;
  'winners:page:changed': number;
};
