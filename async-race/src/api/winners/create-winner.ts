import { API_URL } from '@/data/constants';

import type { Winner } from '@/types/types';

export async function createWinner(id: number, wins: number, time: number): Promise<Winner> {
  const response: Response = await fetch(`${API_URL}/winners`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, wins, time }),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || `Failed to create winner. Status: ${response.status}`);
  }

  const winner: Winner = await response.json();
  return winner;
}
