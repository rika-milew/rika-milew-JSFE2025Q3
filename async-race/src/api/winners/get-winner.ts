import { fetchData } from '@/api/fetch-data';
import { API_URL } from '@/data/constants';

import type { Winner } from '@/types/types';

export async function getWinner(id: number): Promise<Winner | undefined> {
  if (!id) {
    return undefined;
  }

  const winner = await fetchData<Winner>(`${API_URL}/winners/${id}`);

  return winner;
}
