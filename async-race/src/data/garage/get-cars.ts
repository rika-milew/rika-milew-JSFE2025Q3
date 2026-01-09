import { API_URL } from '../api';

import type { Car } from '../../types/types';

export async function getCars(
  page?: number,
  limit?: number,
): Promise<{ cars: Car[]; totalCount: number }> {
  const parameters = new URLSearchParams();

  if (page) {
    parameters.append('_page', page.toString());
  }

  if (limit) {
    parameters.append('_limit', limit.toString());
  }

  const url = `${API_URL}/garage${parameters.toString() ? '?' + parameters.toString() : ''}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Failed to get the cars: ${response.status} ${response.statusText}`);
      return { cars: [], totalCount: 0 };
    }

    const cars: Car[] = await response.json();
    const totalCount = Number(response.headers.get('X-Total-Count') ?? cars.length);

    return { cars, totalCount };
  } catch (error) {
    console.error('Error while getting the cars:', error);
    return { cars: [], totalCount: 0 };
  }
}
