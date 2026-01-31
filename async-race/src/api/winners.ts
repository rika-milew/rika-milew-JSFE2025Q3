import { API_URL } from '@/constants/constants';

import type { Winner, WinnersResponse } from '@/types/types';

export async function createWinner(
  id: number,
  wins: number,
  time: number,
): Promise<Winner | undefined> {
  const url = `${API_URL}/winners`;

  try {
    const response: Response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, wins, time }),
    });

    if (!response.ok) {
      console.error(`Failed to create the winner: ${response.status}`);
      return undefined;
    }

    const winner: Winner = await response.json();
    return winner;
  } catch (error) {
    console.error('Failed to create the winner', error);
    return undefined;
  }
}

export async function getWinners(): Promise<WinnersResponse | undefined> {
  const url = `${API_URL}/winners`;

  try {
    const response: Response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to get the winners: ${response.status}`);
      return undefined;
    }

    const winnersData = await response.json();
    const winners: Winner[] = Array.isArray(winnersData) ? winnersData : [];

    const totalWinners = winners.length;

    return { winners, totalWinners };
  } catch (error) {
    console.error('Failed to get the the winners', error);
    return undefined;
  }
}

export async function updateWinner(
  id: number,
  wins: number,
  time: number,
): Promise<Winner | undefined> {
  const url = `${API_URL}/winners/${id}`;

  try {
    const response: Response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wins, time }),
    });

    if (!response.ok) {
      console.error(`Failed to update winner: ${response.status}`);
      return undefined;
    }

    const winner: Winner = await response.json();
    return winner;
  } catch (error) {
    console.error('Failed to update the winner', error);
    return undefined;
  }
}

export async function deleteWinner(id: number): Promise<boolean> {
  const url = `${API_URL}/winners/${id}`;

  try {
    const response: Response = await fetch(url, { method: 'DELETE' });
    return response.ok;
  } catch (error) {
    console.warn('Failed to delete the winner', error);
    return false;
  }
}
