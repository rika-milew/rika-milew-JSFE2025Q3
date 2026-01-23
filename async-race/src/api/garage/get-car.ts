import { fetchData } from '@/api/fetch-data';
import { API_URL } from '@/data/constants';

import type { Car } from '@/types/types';

export async function getCar(id: number): Promise<Car | undefined> {
  const car = await fetchData<Car>(`${API_URL}/garage/${id}`);

  return car;
}
