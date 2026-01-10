import { API_URL } from '../api';

import type { Car } from '../../types/types';

export async function getCar(id: number): Promise<Car | undefined> {
  try {
    const response = await fetch(`${API_URL}/garage/${id}`);

    if (!response.ok) {
      console.error(`Failed to get the car ${id}: ${response.status} ${response.statusText}`);
      return undefined;
    }

    const car: Car = await response.json();
    return car;
  } catch (error) {
    console.error(`Error while getting the car ${id}:`, error);
    return undefined;
  }
}
