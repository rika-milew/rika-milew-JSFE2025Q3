import type { View, Car } from '../types/types';

export type EventMap = {
  'view:changed': View;
  'garage:page:changed': number;
  'winners:page:changed': number;
  'garage:refresh': undefined;
  'garage:pagination:update': { currentPage: number; totalCount: number };
  'garage:race': undefined;
  'garage:reset': undefined;
  'garage:generate': number;
  'car:create': { name: string; color: string };
  'car:update': { id: number; name: string; color: string };
  'car:delete': { id: number };
  'car:deleted': number;
  'car:selected': Car;
  'updateform:fill': { id: number; name: string; color: string };
  'updateform:color': { id: number; color: string };
  'updateform:reset': undefined;
  'ui:error': string;
};
