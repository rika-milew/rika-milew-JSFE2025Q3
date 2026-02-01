import { appState } from '@/state/app-state';

import type { Winner, WinnersSort } from '@/types/types';

export function sortTable(winners: Winner[]): Winner[] {
  const { sorting, order }: WinnersSort = appState.winnersSort;

  return [...winners].toSorted((a, b) => {
    const difference: number = a[sorting] - b[sorting];
    return order === 'ascending' ? difference : -difference;
  });
}
