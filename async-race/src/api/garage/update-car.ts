import { fetchData } from '@/api/fetch-data';
import { API_URL } from '@/data/constants';

import type { Car } from '@/types/types';

export async function updateCar(id: number, name: string, color: string): Promise<Car | undefined> {
  const url = `${API_URL}/garage/${id}`;

  const updatedCar = await fetchData<Car>(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });

  return updatedCar;
}
