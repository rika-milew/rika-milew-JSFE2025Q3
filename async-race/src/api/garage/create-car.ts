import { fetchData } from '@/api/fetch-data';
import { API_URL } from '@/data/constants';

import type { Car } from '@/types/types';

export async function createCar(name: string, color: string): Promise<Car | undefined> {
  const url = `${API_URL}/garage`;
  return fetchData<Car>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });
}
