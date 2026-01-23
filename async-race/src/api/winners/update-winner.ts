import { fetchData } from '@/api/fetch-data';
import { API_URL } from '@/data/constants';

import type { Winner } from '@/types/types';

export async function updateWinner(
  id: number,
  wins: number,
  time: number,
): Promise<Winner | undefined> {
  const url = `${API_URL}/winners/${id}`;

  const winner = await fetchData<Winner>(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wins, time }),
  });

  return winner;
}
