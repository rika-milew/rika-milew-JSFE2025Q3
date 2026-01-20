import type { View, Winner } from '@/types/types';

export type EventMap = {
  'view:changed': View;
  'garage:refresh': undefined;
  'garage:pagination:update': { currentPage: number; totalCount: number };
  'garage:race': undefined;
  'garage:reset': undefined;
  'garage:generate': number;
  'car:create': { name: string; color: string };
  'car:update': { id: number; name: string; color: string };
  'car:delete': { id: number };
  'car:deleted': number;
  'updateform:fill': { id: number; name: string; color: string };
  'updateform:color': { id: number; color: string };
  'updateform:reset': undefined;
  'car:start': { id: number };
  'car:reset': { id: number };
  'winners:refresh': Winner;
  'winner:add': Winner;
  'winner:updated': Winner;
  'winner:delete': number;
  'winners:pagination:update': { currentPage: number; totalCount: number };
};
