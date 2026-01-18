import { appState } from '@/state/app-state';

import type { Winner } from '@/types/types';

export function sortTable(winners: Winner[]): Winner[] {
  const { sorting, order } = appState.winnersSort;

  return [...winners].toSorted((a, b) => {
    const difference = a[sorting] - b[sorting];
    return order === 'ascending' ? difference : -difference;
  });
}
