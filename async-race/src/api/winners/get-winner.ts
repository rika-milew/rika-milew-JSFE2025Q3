import { API_URL, ERROR_RESPONSE } from '@data/constants';

import type { Winner } from '@/types/types';

export async function getWinner(id: number): Promise<Winner> {
  if (!id) {
    throw new Error('Winner id is required');
  }

  const response = await fetch(`${API_URL}/winners/${id}`);

  if (!response.ok) {
    if (response.status === ERROR_RESPONSE) {
      throw new Error(`Winner with id ${id} not found`);
    }
    const errorMessage = await response.text();
    throw new Error(errorMessage || `Failed to load winner ${id}. Status: ${response.status}`);
  }

  const winner: Winner = await response.json();
  return winner;
}
