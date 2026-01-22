import { fetchData } from '@/api/fetch-data';
import { API_URL } from '@/data/constants';

import type { Winner, WinnersResponse } from '@/types/types';

export async function getWinners(): Promise<WinnersResponse | undefined> {
  const url = `${API_URL}/winners`;

  const winners: Winner[] | undefined = await fetchData<Winner[]>(url);

  if (!winners) {
    return undefined;
  }

  const totalWinners = winners.length;

  return { winners, totalWinners };
}
