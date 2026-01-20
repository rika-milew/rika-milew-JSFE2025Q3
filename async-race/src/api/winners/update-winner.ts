import { API_URL } from '@data/constants';

import type { Winner } from '@/types/types';

export async function updateWinner(id: number, wins: number, time: number): Promise<Winner> {
  const response = await fetch(`${API_URL}/winners/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wins, time }),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(
      errorMessage || `Failed to update the winner ${id}. Status: ${response.status}`,
    );
  }

  const winner: Winner = await response.json();
  return winner;
}
