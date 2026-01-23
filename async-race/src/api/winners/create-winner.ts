import { fetchData } from '@/api/fetch-data';
import { API_URL } from '@/data/constants';

import type { Winner } from '@/types/types';

export async function createWinner(
  id: number,
  wins: number,
  time: number,
): Promise<Winner | undefined> {
  const url = `${API_URL}/winners`;

  const winner = await fetchData<Winner>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, wins, time }),
  });

  return winner;
}
