import { fetchData } from '@/api/fetch-data';
import { API_URL } from '@/data/constants';

import type { Winner, WinnersResponse } from '@/types/types';

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

export async function getWinner(id: number): Promise<Winner | undefined> {
  if (!id) {
    return undefined;
  }

  const winner = await fetchData<Winner>(`${API_URL}/winners/${id}`);

  return winner;
}

export async function getWinners(): Promise<WinnersResponse | undefined> {
  const url = `${API_URL}/winners`;

  const winners: Winner[] | undefined = await fetchData<Winner[]>(url);

  if (!winners) {
    return undefined;
  }

  const totalWinners = winners.length;

  return { winners, totalWinners };
}

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

export async function deleteWinner(id: number): Promise<boolean> {
  const result = await fetchData(`${API_URL}/winners/${id}`, { method: 'DELETE' });

  return !!result;
}
