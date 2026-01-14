import { API_URL, ERROR_RESPONSE } from '@data/constants';

import type { Car } from '@/types/types';

export async function getCar(id: number): Promise<Car> {
  const response = await fetch(`${API_URL}/garage/${id}`);

  if (!response.ok) {
    if (response.status === ERROR_RESPONSE) {
      throw new Error(`Car with id ${id} not found`);
    }
    throw new Error(`Failed to get the car ${id}. Status: ${response.status}`);
  }

  const car: Car = await response.json();
  return car;
}
