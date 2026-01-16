import { API_URL } from '@data/constants';

import type { Winner } from '@/types/types';

type GetWinnersParams = {
  page?: number;
  limit?: number;
  sort?: 'id' | 'wins' | 'time';
  order?: 'ASC' | 'DESC';
};

export async function getWinners({ page, limit, sort, order }: GetWinnersParams = {}): Promise<{
  winners: Winner[];
  totalWinners: number;
}> {
  const params = new URLSearchParams();

  if (page !== undefined) {
    params.append('_page', String(page));
  }

  if (limit !== undefined) {
    params.append('_limit', String(limit));
  }

  if (sort !== undefined) {
    params.append('_sort', sort);
  }

  if (order !== undefined) {
    params.append('_order', order);
  }

  const url = `${API_URL}/winners${params.toString() ? `?${params}` : ''}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || `Failed to load winners. Status: ${response.status}`);
  }

  const winners: Winner[] = await response.json();
  const totalWinners = Number(response.headers.get('X-Total-Count')) || 0;

  return { winners, totalWinners };
}
