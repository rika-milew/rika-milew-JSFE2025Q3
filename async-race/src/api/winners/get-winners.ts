import { API_URL } from '@data/constants';

import type { Winner } from '@/types/types';

export async function getWinners(): Promise<{
  winners: Winner[];
  totalWinners: number;
}> {
  const url = `${API_URL}/winners`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || `Failed to load winners. Status: ${response.status}`);
  }

  const winners: Winner[] = await response.json();
  const totalWinners = Number(response.headers.get('X-Total-Count')) || 0;

  return { winners, totalWinners };
}
