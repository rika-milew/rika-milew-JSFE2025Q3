import { API_URL } from '@data/constants';

import type { Car } from '@/types/types';

export async function getCars(): Promise<{ cars: Car[]; totalCount: number }> {
  const url = `${API_URL}/garage`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to get the cars. Status: ${response.status}`);
  }

  const cars: Car[] = await response.json();
  const totalCount = Number(response.headers.get('X-Total-Count') ?? cars.length);

  return { cars, totalCount };
}
