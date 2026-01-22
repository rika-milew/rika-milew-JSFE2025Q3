import { fetchData } from '@/api/fetch-data';
import { API_URL } from '@/data/constants';

import type { Car } from '@/types/types';

export async function getCars(): Promise<{ cars: Car[]; totalCount: number } | undefined> {
  const url = `${API_URL}/garage`;

  const cars: Car[] | undefined = await fetchData<Car[]>(url);

  if (!cars) {
    return undefined;
  }

  const totalCountHeader = Number(await fetchData<number>(url, { method: 'HEAD' }));
  const totalCount = totalCountHeader > 0 ? totalCountHeader : cars.length;

  return { cars, totalCount };
}
