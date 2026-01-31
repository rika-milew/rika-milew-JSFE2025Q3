import { fetchData } from '@/api/fetch-data';
import { API_URL } from '@/data/constants';

import type { Car, Cars } from '@/types/types';

export async function createCar(name: string, color: string): Promise<Car | undefined> {
  const url = `${API_URL}/garage`;

  return fetchData<Car>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });
}

export async function deleteCar(id: number): Promise<boolean> {
  const garageResponse = await fetchData(`${API_URL}/garage/${id}`, { method: 'DELETE' });

  if (!garageResponse) {
    return false;
  }

  await fetchData(`${API_URL}/winners/${id}`, { method: 'DELETE' });

  return true;
}

export async function getCars(): Promise<Cars | undefined> {
  const url = `${API_URL}/garage`;

  const cars: Car[] | undefined = await fetchData<Car[]>(url);

  if (!cars) {
    return undefined;
  }

  const totalCountHeader = Number(await fetchData<number>(url, { method: 'HEAD' }));
  const totalCount = totalCountHeader > 0 ? totalCountHeader : cars.length;

  return { cars, totalCount };
}

export async function updateCar(id: number, name: string, color: string): Promise<Car | undefined> {
  const url = `${API_URL}/garage/${id}`;

  const updatedCar = await fetchData<Car>(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });

  return updatedCar;
}
