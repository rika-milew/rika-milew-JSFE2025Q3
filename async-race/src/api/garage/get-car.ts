import { API_URL } from '../api';

import type { Car } from '../../types/types';

export async function getCar(id: number): Promise<Car> {
  const ERROR_RESPONSE = 404;

  try {
    const response = await fetch(`${API_URL}/garage/${id}`);

    if (!response.ok) {
      if (response.status === ERROR_RESPONSE) {
        throw new Error(`Car with id ${id} not found`);
      }
      throw new Error(`Failed to get the car ${id}. Status: ${response.status}`);
    }

    const car: Car = await response.json();
    return car;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error while getting the car');
  }
}
